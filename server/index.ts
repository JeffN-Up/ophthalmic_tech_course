import { buildSpindelMediaResponse } from "./spindelMedia";
import { canEditVideo, extractVideoId, learnerMedia, publishTask, readWorkspaceCatalog, seedLocations, startTask, verifyFinishedVideo, VideoError, withFile, type Workspace } from './videoEditing';
import { parseOcularEducationCatalog } from "./ocularEducation";
import express from "express";
import { randomBytes, randomUUID } from "node:crypto";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import {
  assertAuthConfigured,
  clearSessionCookie,
  getSessionUserId,
  hashPassword,
  setSessionCookie,
  validatePassword,
  verifyPassword,
} from "./auth";
import {
  emailConfigured,
  sendActivationEmail,
  sendPasswordResetEmail,
  sendSaleNotification,
  sendSupportMessage,
} from "./email";
import {
  assertCompleteCourseMediaCoverage,
  assertPublicCourseCatalogIsGeneric,
  createOpaqueToken,
  canAccessSpindelMedia,
  hashOpaqueToken,
  parseProtectedMediaCatalog,
  rateLimit,
  requireSameOrigin,
  securityHeaders,
  verifyStripeSignature,
} from "./security";
import {
  mutateDatabase,
  readDatabase,
  type CoursePurchase,
  type CourseUser,
  type PracticeInvite,
} from "./store";
import { isSpindelStaffEmail, staffNameFromEmail, verifySpindelStaffCode } from "./spindelStaffAccess";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const COURSE_ID = "ophthalmic-technician-foundations";
const MODULE_COUNT = 10;
const PASSING_SCORE = 70;
const TERMS_VERSION = "2026-07-21";
const ACTIVATION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;
const PASSWORD_RESET_DURATION_MS = 60 * 60 * 1000;

class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

interface StripeCheckoutSession {
  id?: string;
  mode?: string;
  status?: string;
  payment_status?: string;
  customer_email?: string | null;
  customer_details?: { email?: string | null } | null;
  payment_intent?: string | { id?: string } | null;
  metadata?: Record<string, string> | null;
  error?: { message?: string };
  url?: string;
}

interface StripeEvent {
  id?: string;
  type?: string;
  data?: { object?: StripeCheckoutSession };
}

function readString(value: unknown, maxLength = 500): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function readInteger(value: unknown): number {
  if (typeof value === "number") return Math.trunc(value);
  return Number.parseInt(readString(value, 12), 10);
}

function getBaseUrl(req?: express.Request): string {
  const configuredUrl = process.env.PUBLIC_APP_URL?.trim();
  if (configuredUrl) return configuredUrl.replace(/\/$/, "");
  if (!req) return "http://localhost:3000";

  const forwardedProtocol = req.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProtocol || req.protocol;
  const host = req.get("host");
  if (!host) throw new Error("Unable to determine the public application URL.");
  return `${protocol}://${host}`;
}

function requireProductionConfiguration(): void {
  if (process.env.NODE_ENV !== "production") return;

  // Only fail startup for settings the server cannot operate safely without.
  // Commerce, email, and protected media routes already return a clear 503 when
  // their integrations are not configured, so they must not take the public
  // course site and health check offline during an initial deployment.
  const required = [
    "PUBLIC_APP_URL",
    "SESSION_SECRET",
    "DATA_FILE",
  ];
  const missing = required.filter((key) => !process.env[key]?.trim());
  if (missing.length > 0) {
    throw new Error(`Missing required production environment variables: ${missing.join(", ")}`);
  }

  const optional = [
    "STRIPE_SECRET_KEY",
    "STRIPE_STANDARD_PRICE_ID",
    "STRIPE_PRACTICE_PRICE_ID",
    "STRIPE_WEBHOOK_SECRET",
    "RESEND_API_KEY",
    "EMAIL_FROM",
    "SUPPORT_EMAIL",
    "BUSINESS_LEGAL_NAME",
    "BUSINESS_ADDRESS",
    "SPINDEL_MEDIA_CATALOG_JSON",
    "COURSE_MEDIA_CATALOG_JSON",
  ];
  const unavailable = optional.filter((key) => !process.env[key]?.trim());
  if (unavailable.length > 0) {
    console.warn(
      `Optional production features are disabled until configured: ${unavailable.join(", ")}`,
    );
  }
}

function createInviteCode(): string {
  return randomBytes(6).toString("hex").toUpperCase();
}

function publicUser(user: CourseUser) {
  const completedModules = user.progress.filter((item) => item.passed).length;
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    organizationName: user.organizationName,
    managerId: user.managerId,
    seatLimit: user.seatLimit,
    createdAt: user.createdAt,
    progress: user.progress,
    completedModules,
    certificateEligible: completedModules >= MODULE_COUNT,
  };
}

async function requireUser(
  req: express.Request,
  res: express.Response,
): Promise<CourseUser | null> {
  const userId = getSessionUserId(req);
  if (!userId) {
    res.status(401).json({ error: "Please sign in to continue." });
    return null;
  }

  const database = await readDatabase();
  const user = database.users.find((candidate) => candidate.id === userId);
  if (!user || user.accessRevoked) {
    clearSessionCookie(res);
    res.status(401).json({ error: "Course access is unavailable for this account." });
    return null;
  }

  return user;
}

function validatePaidSession(session: StripeCheckoutSession): void {
  if (
    !session.id ||
    session.mode !== "payment" ||
    session.status !== "complete" ||
    session.payment_status !== "paid" ||
    session.metadata?.courseId !== COURSE_ID
  ) {
    throw new HttpError(400, "Payment has not been verified for this course.");
  }
}

async function getStripeCheckoutSession(sessionId: string): Promise<StripeCheckoutSession> {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!stripeSecretKey) throw new HttpError(503, "Stripe is not configured.");

  const response = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
    { headers: { Authorization: `Bearer ${stripeSecretKey}` } },
  );
  const session = (await response.json()) as StripeCheckoutSession;
  if (!response.ok) {
    throw new HttpError(400, session.error?.message ?? "Unable to verify payment.");
  }
  return session;
}

function purchaseDetails(session: StripeCheckoutSession) {
  validatePaidSession(session);
  const metadata = session.metadata ?? {};
  const email = (session.customer_details?.email || session.customer_email || "")
    .trim()
    .toLowerCase();
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  if (!email) throw new HttpError(400, "Stripe did not return a customer email address.");

  return {
    checkoutSessionId: session.id as string,
    paymentIntentId,
    email,
    firstName: readString(metadata.firstName, 80) || "Course",
    lastName: readString(metadata.lastName, 80) || "Student",
    enrollmentType: metadata.enrollmentType === "practice" ? "practice" as const : "individual" as const,
    organizationName: readString(metadata.organizationName, 160) || undefined,
    seats: Math.min(Math.max(readInteger(metadata.seats) || 1, 1), 50),
  };
}

async function ensurePurchase(session: StripeCheckoutSession): Promise<CoursePurchase> {
  const details = purchaseDetails(session);
  const newActivationToken = createOpaqueToken();
  let tokenToEmail: string | null = null;

  const purchase = await mutateDatabase((database) => {
    const existing = database.purchases.find(
      (candidate) => candidate.checkoutSessionId === details.checkoutSessionId,
    );

    if (existing) {
      if (!existing.activatedAt && !existing.emailSentAt) {
        existing.activationTokenHash = hashOpaqueToken(newActivationToken);
        existing.activationExpiresAt = new Date(Date.now() + ACTIVATION_DURATION_MS).toISOString();
        tokenToEmail = newActivationToken;
      }
      return existing;
    }

    const created: CoursePurchase = {
      ...details,
      activationTokenHash: hashOpaqueToken(newActivationToken),
      activationExpiresAt: new Date(Date.now() + ACTIVATION_DURATION_MS).toISOString(),
      createdAt: new Date().toISOString(),
    };
    database.purchases.push(created);
    tokenToEmail = newActivationToken;
    return created;
  });

  if (tokenToEmail) {
    const sent = await sendActivationEmail({
      email: purchase.email,
      firstName: purchase.firstName,
      token: tokenToEmail,
      checkoutSessionId: purchase.checkoutSessionId,
    });
    await sendSaleNotification({
      email: purchase.email,
      enrollmentType: purchase.enrollmentType,
      seats: purchase.seats,
      checkoutSessionId: purchase.checkoutSessionId,
    });

    if (sent) {
      await mutateDatabase((database) => {
        const stored = database.purchases.find(
          (candidate) => candidate.checkoutSessionId === purchase.checkoutSessionId,
        );
        if (stored) stored.emailSentAt = new Date().toISOString();
      });
    }
  }

  return purchase;
}

async function activatePurchase(
  purchaseSelector: (purchase: CoursePurchase) => boolean,
  password: string,
): Promise<CourseUser> {
  const passwordError = validatePassword(password);
  if (passwordError) throw new HttpError(400, passwordError);

  return mutateDatabase((database) => {
    const purchase = database.purchases.find(purchaseSelector);
    if (!purchase) throw new HttpError(400, "This activation link is invalid or unavailable.");
    if (purchase.activatedAt || purchase.activatedUserId) {
      throw new HttpError(409, "This purchase has already been activated. Please sign in.");
    }
    if (new Date(purchase.activationExpiresAt).getTime() < Date.now()) {
      throw new HttpError(400, "This activation link has expired. Request a new link.");
    }
    if (database.users.some((user) => user.email === purchase.email)) {
      throw new HttpError(409, "An account already exists for this email. Please sign in.");
    }

    const user: CourseUser = {
      id: randomUUID(),
      email: purchase.email,
      firstName: purchase.firstName,
      lastName: purchase.lastName,
      passwordHash: hashPassword(password),
      role: purchase.enrollmentType === "practice" ? "manager" : "student",
      organizationName: purchase.organizationName,
      seatLimit: purchase.seats,
      checkoutSessionId: purchase.checkoutSessionId,
      paymentIntentId: purchase.paymentIntentId,
      createdAt: new Date().toISOString(),
      progress: [],
    };
    database.users.push(user);

    if (user.role === "manager") {
      for (let index = 1; index < purchase.seats; index += 1) {
        const invite: PracticeInvite = {
          code: createInviteCode(),
          managerId: user.id,
          createdAt: new Date().toISOString(),
        };
        database.invites.push(invite);
      }
    }

    purchase.activatedAt = new Date().toISOString();
    purchase.activatedUserId = user.id;
    return user;
  });
}

async function startServer() {
  assertAuthConfigured();
  requireProductionConfiguration();

  const app = express();
  const server = createServer(app);

  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(securityHeaders);

  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json", limit: "1mb" }),
    async (req, res) => {
      const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
      const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from("");
      if (!secret || !verifyStripeSignature(rawBody, req.get("stripe-signature"), secret)) {
        return res.status(400).send("Invalid Stripe signature");
      }

      let event: StripeEvent;
      try {
        event = JSON.parse(rawBody.toString("utf8")) as StripeEvent;
      } catch {
        return res.status(400).send("Invalid webhook payload");
      }

      if (!event.id) return res.status(400).send("Missing event ID");
      const database = await readDatabase();
      if (database.processedStripeEvents.some((stored) => stored.id === event.id)) {
        return res.json({ received: true, duplicate: true });
      }

      try {
        if (
          event.type === "checkout.session.completed" ||
          event.type === "checkout.session.async_payment_succeeded"
        ) {
          const session = event.data?.object;
          if (session?.payment_status === "paid" && session.metadata?.courseId === COURSE_ID) {
            await ensurePurchase(session);
          }
        }

        await mutateDatabase((storedDatabase) => {
          storedDatabase.processedStripeEvents.push({
            id: event.id as string,
            processedAt: new Date().toISOString(),
          });
          if (storedDatabase.processedStripeEvents.length > 2_000) {
            storedDatabase.processedStripeEvents.splice(
              0,
              storedDatabase.processedStripeEvents.length - 2_000,
            );
          }
        });
        return res.json({ received: true });
      } catch (error) {
        console.error("Stripe webhook fulfillment error", error);
        return res.status(500).json({ error: "Webhook fulfillment failed." });
      }
    },
  );

  app.use(express.json({ limit: "30kb" }));
  app.use("/api", requireSameOrigin);

  const checkoutLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 10 });
  const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 12 });
  const recoveryLimiter = rateLimit({ …6785 tokens truncated…
    const team = database.users
      .filter((user) => user.id === manager.id || user.managerId === manager.id)
      .map(publicUser);
    const invites = database.invites
      .filter((invite) => invite.managerId === manager.id)
      .map((invite) => ({
        code: invite.code,
        createdAt: invite.createdAt,
        usedAt: invite.usedAt,
        usedBy: invite.usedBy,
      }));

    return res.json({ team, invites, seatLimit: manager.seatLimit });
  });

  app.post("/api/practice/redeem", recoveryLimiter, async (req, res) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const code = readString(body.code, 40).toUpperCase();
    const firstName = readString(body.firstName, 80);
    const lastName = readString(body.lastName, 80);
    const email = readString(body.email, 254).toLowerCase();
    const password = readString(body.password, 200);
    const passwordError = validatePassword(password);

    if (!code || !firstName || !lastName || !/^\S+@\S+\.\S+$/.test(email) || passwordError) {
      return res.status(400).json({ error: passwordError ?? "Please complete all required account fields." });
    }

    try {
      const user = await mutateDatabase((database) => {
        const invite = database.invites.find((candidate) => candidate.code === code);
        if (!invite || invite.usedAt) throw new HttpError(400, "This invitation is invalid or has already been used.");
        if (database.users.some((candidate) => candidate.email === email)) {
          throw new HttpError(409, "An account already exists for this email.");
        }

        const manager = database.users.find(
          (candidate) => candidate.id === invite.managerId && candidate.role === "manager",
        );
        if (!manager || manager.accessRevoked) {
          throw new HttpError(400, "This practice enrollment is no longer available.");
        }

        const teamSize = database.users.filter(
          (candidate) => candidate.id === manager.id || candidate.managerId === manager.id,
        ).length;
        if (teamSize >= manager.seatLimit) {
          throw new HttpError(409, "All purchased practice seats have been assigned.");
        }

        const newUser: CourseUser = {
          id: randomUUID(),
          email,
          firstName,
          lastName,
          passwordHash: hashPassword(password),
          role: "student",
          organizationName: manager.organizationName,
          managerId: manager.id,
          seatLimit: 1,
          createdAt: new Date().toISOString(),
          progress: [],
        };
        database.users.push(newUser);
        invite.usedAt = new Date().toISOString();
        invite.usedBy = newUser.id;
        return newUser;
      });

      setSessionCookie(res, user.id);
      return res.status(201).json({ user: publicUser(user) });
    } catch (error) {
      if (error instanceof HttpError) return res.status(error.status).json({ error: error.message });
      console.error("Practice invitation error", error);
      return res.status(500).json({ error: "Unable to create the invited account." });
    }
  });

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath, { maxAge: process.env.NODE_ENV === "production" ? "1h" : 0 }));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = Number(process.env.PORT || 3000);
  server.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

