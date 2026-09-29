import { createHash, timingSafeEqual } from "node:crypto";

export function isSpindelStaffEmail(email: string): boolean {
  return /^[^@\s]+@spindeleye\.com$/i.test(email.trim());
}

export function verifySpindelStaffCode(provided: string, configured: string | undefined): boolean {
  if (!configured?.trim() || !provided) return false;
  const expected = createHash("sha256").update(configured.trim()).digest();
  const actual = createHash("sha256").update(provided).digest();
  return timingSafeEqual(actual, expected);
}

export function staffNameFromEmail(email: string): { firstName: string; lastName: string } {
  const parts = email.split("@")[0].split(/[._-]+/).filter(Boolean);
  const capitalize = (part: string) => part.charAt(0).toUpperCase() + part.slice(1);
  return {
    firstName: capitalize(parts[0] || "Staff"),
    lastName: parts.slice(1).map(capitalize).join(" "),
  };
}
