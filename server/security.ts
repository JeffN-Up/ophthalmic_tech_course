import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

export interface ProtectedMediaItem {
  driveFileId: string;
  title: string;
  description: string;
  type: "video" | "audio" | "image";
  moduleDays: number[];
  embedUrl: string;
  openUrl: string;
}

const DRIVE_FILE_ID_PATTERN = /^[A-Za-z0-9_-]{10,100}$/;
const PROTECTED_MEDIA_TYPES = new Set<ProtectedMediaItem["type"]>([
  "video",
  "audio",
  "image",
]);

export function canAccessSpindelMedia(organizationName?: string): boolean {
  return organizationName?.trim().toLowerCase().includes("spindel eye") ?? false;
}

export function parseProtectedMediaCatalog(value: string): ProtectedMediaItem[] {
  const parsed = JSON.parse(value) as unknown;
  if (!Array.isArray(parsed) || parsed.length > 20) {
    throw new Error("SPINDEL_MEDIA_CATALOG_JSON must be an array with at most 20 items.");
  }

  const seen = new Set<string>();
  return parsed.map((rawItem, index) => {
    if (!rawItem || typeof rawItem !== "object") {
      throw new Error(`Protected media item ${index + 1} is invalid.`);
    }

    const item = rawItem as Record<string, unknown>;
    const driveFileId = typeof item.driveFileId === "string" ? item.driveFileId.trim() : "";
    const title = typeof item.title === "string" ? item.title.trim().slice(0, 160) : "";
    const description = typeof item.description === "string"
      ? item.description.trim().slice(0, 500)
      : "";
    const type = item.type;
    const moduleDays = Array.isArray(item.moduleDays)
      ? [...new Set(item.moduleDays.filter(
        (day): day is number => Number.isInteger(day) && Number(day) >= 1 && Number(day) <= 10,
      ))]
      : [];

    if (
      !DRIVE_FILE_ID_PATTERN.test(driveFileId) ||
      !title ||
      !description ||
      !PROTECTED_MEDIA_TYPES.has(type as ProtectedMediaItem["type"]) ||
      moduleDays.length === 0 ||
      seen.has(driveFileId)
    ) {
      throw new Error(`Protected media item ${index + 1} is incomplete or duplicated.`);
    }

    seen.add(driveFileId);
    return {
      driveFileId,
      title,
      description,
      type: type as ProtectedMediaItem["type"],
      moduleDays,
      embedUrl: `https://drive.google.com/file/d/${driveFileId}/preview`,
      openUrl: `https://drive.google.com/file/d/${driveFileId}/view`,
    };
  });
}

export function createOpaqueToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashOpaqueToken(token: string): string {
  return createHash("sha256").update(token).digest("base64url");
}

export function verifyStripeSignature(
  rawBody: Buffer,
  signatureHeader: string | undefined,
  webhookSecret: string,
  toleranceSeconds = 300,
): boolean {
  if (!signatureHeader) return false;

  const parts = signatureHeader.split(",").map((part) => part.trim());
  const timestampPart = parts.find((part) => part.startsWith("t="));
  const signatures = parts
    .filter((part) => part.startsWith("v1="))
    .map((part) => part.slice(3));
  const timestamp = Number(timestampPart?.slice(2));

  if (!Number.isFinite(timestamp) || signatures.length === 0) return false;
  if (Math.abs(Math.floor(Date.now() / 1000) - timestamp) > toleranceSeconds) return false;

  const expected = createHmac("sha256", webhookSecret)
    .update(`${timestamp}.${rawBody.toString("utf8")}`)
    .digest("hex");
  const expectedBuffer = Buffer.from(expected);

  return signatures.some((signature) => {
    const provided = Buffer.from(signature);
    return provided.length === expectedBuffer.length && timingSafeEqual(provided, expectedBuffer);
  });
}

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export function rateLimit(options: RateLimitOptions) {
  const entries = new Map<string, RateLimitEntry>();

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const current = entries.get(key);
    const entry = !current || current.resetAt <= now
      ? { count: 0, resetAt: now + options.windowMs }
      : current;

    entry.count += 1;
    entries.set(key, entry);

    res.setHeader("X-RateLimit-Limit", String(options.max));
    res.setHeader("X-RateLimit-Remaining", String(Math.max(options.max - entry.count, 0)));
    res.setHeader("X-RateLimit-Reset", String(Math.ceil(entry.resetAt / 1000)));

    if (entry.count > options.max) {
      res.setHeader("Retry-After", String(Math.max(Math.ceil((entry.resetAt - now) / 1000), 1)));
      res.status(429).json({ error: options.message ?? "Too many requests. Please try again later." });
      return;
    }

    if (entries.size > 5_000) {
      for (const [storedKey, storedEntry] of entries) {
        if (storedEntry.resetAt <= now) entries.delete(storedKey);
      }
    }

    next();
  };
}

export function securityHeaders(req: Request, res: Response, next: NextFunction): void {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(self)");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; frame-src 'self' https://drive.google.com; form-action 'self' https://checkout.stripe.com; img-src 'self' data:; font-src 'self' data: https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self'; connect-src 'self';",
  );
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
}

export function requireSameOrigin(req: Request, res: Response, next: NextFunction): void {
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    next();
    return;
  }

  const origin = req.get("origin");
  if (!origin) {
    next();
    return;
  }

  try {
    const originHost = new URL(origin).host;
    const requestHost = req.get("host");
    const configuredHost = process.env.PUBLIC_APP_URL
      ? new URL(process.env.PUBLIC_APP_URL).host
      : requestHost;

    if (originHost !== requestHost && originHost !== configuredHost) {
      res.status(403).json({ error: "Cross-site request rejected." });
      return;
    }
  } catch {
    res.status(403).json({ error: "Invalid request origin." });
    return;
  }

  next();
}
