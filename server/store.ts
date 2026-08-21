import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { hashPassword, verifyPassword } from "./auth";

export interface CourseProgress {
  day: number;
  score: number;
  passed: boolean;
  updatedAt: string;
  completedAt?: string;
}

export interface CourseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  role: "student" | "manager";
  organizationName?: string;
  managerId?: string;
  seatLimit: number;
  checkoutSessionId?: string;
  paymentIntentId?: string;
  accessRevoked?: boolean;
  createdAt: string;
  progress: CourseProgress[];
}

export interface PracticeInvite {
  code: string;
  managerId: string;
  createdAt: string;
  usedAt?: string;
  usedBy?: string;
}

export interface CoursePurchase {
  checkoutSessionId: string;
  paymentIntentId?: string;
  email: string;
  firstName: string;
  lastName: string;
  enrollmentType: "individual" | "practice";
  organizationName?: string;
  seats: number;
  activationTokenHash: string;
  activationExpiresAt: string;
  createdAt: string;
  emailSentAt?: string;
  activatedAt?: string;
  activatedUserId?: string;
}

export interface PasswordReset {
  tokenHash: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  usedAt?: string;
}

export interface ProcessedStripeEvent {
  id: string;
  processedAt: string;
}

export interface CourseDatabase {
  users: CourseUser[];
  invites: PracticeInvite[];
  purchases: CoursePurchase[];
  passwordResets: PasswordReset[];
  processedStripeEvents: ProcessedStripeEvent[];
}

const dataFile = process.env.DATA_FILE?.trim() || path.resolve(process.cwd(), "data", "course-data.json");
const emptyDatabase: CourseDatabase = {
  users: [],
  invites: [],
  purchases: [],
  passwordResets: [],
  processedStripeEvents: [],
};
let mutationQueue: Promise<unknown> = Promise.resolve();

function deterministicSpindelId(email: string): string {
  return `spindel-${createHash("sha256").update(email).digest("hex").slice(0, 24)}`;
}

function deterministicInviteCode(managerId: string, index: number): string {
  const secret = process.env.SESSION_SECRET?.trim() || "spindel-onboarding";
  const digest = createHash("sha256")
    .update(`${secret}:${managerId}:${index}`)
    .digest("hex")
    .slice(0, 12)
    .toUpperCase();
  return `SEA-${digest}`;
}

function applySpindelBootstrap(database: CourseDatabase): CourseDatabase {
  const email = process.env.SPINDEL_MANAGER_EMAIL?.trim().toLowerCase();
  const password = process.env.SPINDEL_MANAGER_PASSWORD?.trim();
  if (!email || !password) return database;

  const managerId = deterministicSpindelId(email);
  const seatLimit = Math.min(
    Math.max(Number.parseInt(process.env.SPINDEL_SEAT_LIMIT?.trim() || "100", 10) || 100, 2),
    500,
  );
  let manager = database.users.find(
    (user) => user.id === managerId || user.email.toLowerCase() === email,
  );

  if (!manager) {
    manager = {
      id: managerId,
      email,
      firstName: process.env.SPINDEL_MANAGER_FIRST_NAME?.trim() || "Spindel",
      lastName: process.env.SPINDEL_MANAGER_LAST_NAME?.trim() || "Administrator",
      passwordHash: hashPassword(password),
      role: "manager",
      organizationName: "Spindel Eye Associates",
      seatLimit,
      createdAt: new Date().toISOString(),
      progress: [],
    };
    database.users.push(manager);
  } else {
    if (!verifyPassword(password, manager.passwordHash)) {
      manager.passwordHash = hashPassword(password);
    }
    manager.role = "manager";
    manager.organizationName = "Spindel Eye Associates";
    manager.seatLimit = Math.max(manager.seatLimit || 1, seatLimit);
  }

  const currentInviteCount = database.invites.filter(
    (invite) => invite.managerId === manager!.id,
  ).length;
  for (let index = currentInviteCount + 1; index < manager.seatLimit; index += 1) {
    database.invites.push({
      code: deterministicInviteCode(manager.id, index),
      managerId: manager.id,
      createdAt: manager.createdAt,
    });
  }

  return database;
}

function normalizeDatabase(value: unknown): CourseDatabase {
  if (!value || typeof value !== "object") return applySpindelBootstrap(structuredClone(emptyDatabase));
  const candidate = value as Partial<CourseDatabase>;
  return applySpindelBootstrap({
    users: Array.isArray(candidate.users) ? candidate.users : [],
    invites: Array.isArray(candidate.invites) ? candidate.invites : [],
    purchases: Array.isArray(candidate.purchases) ? candidate.purchases : [],
    passwordResets: Array.isArray(candidate.passwordResets) ? candidate.passwordResets : [],
    processedStripeEvents: Array.isArray(candidate.processedStripeEvents)
      ? candidate.processedStripeEvents
      : [],
  });
}

export async function readDatabase(): Promise<CourseDatabase> {
  try {
    const raw = await readFile(dataFile, "utf8");
    return normalizeDatabase(JSON.parse(raw));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return applySpindelBootstrap(structuredClone(emptyDatabase));
    }
    throw error;
  }
}

async function writeDatabase(database: CourseDatabase): Promise<void> {
  await mkdir(path.dirname(dataFile), { recursive: true });
  const temporaryFile = `${dataFile}.${process.pid}.tmp`;
  await writeFile(temporaryFile, `${JSON.stringify(database, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
  await rename(temporaryFile, dataFile);
}

export function mutateDatabase<T>(
  mutator: (database: CourseDatabase) => T | Promise<T>,
): Promise<T> {
  const operation = mutationQueue.then(async () => {
    const database = await readDatabase();
    const result = await mutator(database);
    await writeDatabase(database);
    return result;
  });

  mutationQueue = operation.then(
    () => undefined,
    () => undefined,
  );

  return operation;
}
