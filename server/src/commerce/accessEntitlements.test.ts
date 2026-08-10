import { describe, expect, it } from "vitest";
import {
  getLearnerEntitlement,
  type LearnerEntitlementInput,
} from "./accessEntitlements";

const basePurchase = {
  stripeEventId: "evt_123",
  checkoutSessionId: "cs_test_123",
  offerId: "founding-learner",
  purchaserEmail: "learner@example.com",
  amountTotal: 29900,
  currency: "usd",
  accessMonths: 12,
  recordedAt: "2026-01-01T00:00:00.000Z",
};

describe("getLearnerEntitlement", () => {
  it("grants access when a verified purchase exists and has not expired", () => {
    const input: LearnerEntitlementInput = {
      email: " learner@example.com ",
      purchases: [basePurchase],
      now: "2026-06-01T00:00:00.000Z",
    };

    expect(getLearnerEntitlement(input)).toEqual({
      hasAccess: true,
      offerId: "founding-learner",
      accessStartedAt: "2026-01-01T00:00:00.000Z",
      accessExpiresAt: "2027-01-01T00:00:00.000Z",
    });
  });

  it("denies access when no verified purchase exists", () => {
    expect(
      getLearnerEntitlement({
        email: "learner@example.com",
        purchases: [],
        now: "2026-06-01T00:00:00.000Z",
      })
    ).toEqual({
      hasAccess: false,
      reason: "No verified purchase found.",
    });
  });

  it("denies access after the access period expires", () => {
    expect(
      getLearnerEntitlement({
        email: "learner@example.com",
        purchases: [basePurchase],
        now: "2027-02-01T00:00:00.000Z",
      })
    ).toEqual({
      hasAccess: false,
      reason: "Verified purchase access has expired.",
    });
  });
});
