import { createHash } from "node:crypto";
import type { EnrollmentRecord } from "../commerce/enrollmentStore";

const SPINDEL_ONBOARDING_PASSWORD_HASH =
  "1db98ed2a50a75f9e5302f83a3f85aef2a27192f08e201b125e6a56af3ec4053";

export const SPINDEL_ONBOARDING_OFFER_ID = "spindel-eye-onboarding";

export interface SpindelOnboardingAccountInput {
  employeeName: string;
  email: string;
  now?: string;
}

function addYears(date: Date, years: number): Date {
  const nextDate = new Date(date);
  nextDate.setUTCFullYear(nextDate.getUTCFullYear() + years);
  return nextDate;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function safeId(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function isSpindelOnboardingPasswordValid(password: string): boolean {
  const submittedHash = createHash("sha256")
    .update(password.trim())
    .digest("hex");

  return submittedHash === SPINDEL_ONBOARDING_PASSWORD_HASH;
}

export function createSpindelOnboardingEnrollment({
  employeeName,
  email,
  now = new Date().toISOString(),
}: SpindelOnboardingAccountInput): EnrollmentRecord {
  const normalizedEmail = normalizeEmail(email);
  const startedAt = new Date(now);
  const employeeId = safeId(employeeName || normalizedEmail);

  return {
    enrollmentId: `spindel_onboarding_${employeeId}_${safeId(normalizedEmail)}`,
    checkoutSessionId: `spindel_onboarding_${safeId(normalizedEmail)}`,
    offerId: SPINDEL_ONBOARDING_OFFER_ID,
    learnerEmail: normalizedEmail,
    status: "active",
    accessStartedAt: startedAt.toISOString(),
    accessExpiresAt: addYears(startedAt, 3).toISOString(),
  };
}

export function validateSpindelOnboardingAccountInput({
  employeeName,
  email,
}: {
  employeeName: string;
  email: string;
}): string | null {
  if (!employeeName.trim()) {
    return "Enter the employee name.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return "Enter a valid employee email address.";
  }

  return null;
}
