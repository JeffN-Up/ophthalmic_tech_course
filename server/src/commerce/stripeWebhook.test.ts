import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  createPurchaseEventFromStripeEvent,
  verifyStripeWebhookSignature,
} from "./stripeWebhook";

function signedHeader(payload: string, secret: string, timestamp = 1234567890) {
  const signature = createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");

  return `t=${timestamp},v1=${signature}`;
}

describe("verifyStripeWebhookSignature", () => {
  it("accepts a valid Stripe-style signature", () => {
    const payload = JSON.stringify({ id: "evt_test" });
    const secret = "whsec_test_secret";

    expect(
      verifyStripeWebhookSignature({
        payload,
        signatureHeader: signedHeader(payload, secret),
        secret,
        nowSeconds: 1234567890,
      })
    ).toBe(true);
  });

  it("rejects an invalid signature", () => {
    const payload = JSON.stringify({ id: "evt_test" });

    expect(
      verifyStripeWebhookSignature({
        payload,
        signatureHeader: "t=1234567890,v1=bad",
        secret: "whsec_test_secret",
        nowSeconds: 1234567890,
      })
    ).toBe(false);
  });
});

describe("createPurchaseEventFromStripeEvent", () => {
  it("creates a purchase event for completed checkout sessions", () => {
    expect(
      createPurchaseEventFromStripeEvent({
        id: "evt_123",
        type: "checkout.session.completed",
        data: {
          object: {
            id: "cs_test_123",
            customer_email: " Learner@Example.COM ",
            metadata: {
              offer_id: "founding-learner",
              access_months: "12",
            },
            amount_total: 29900,
            currency: "usd",
          },
        },
      })
    ).toEqual({
      stripeEventId: "evt_123",
      checkoutSessionId: "cs_test_123",
      offerId: "founding-learner",
      purchaserEmail: "learner@example.com",
      amountTotal: 29900,
      currency: "usd",
      accessMonths: 12,
    });
  });

  it("uses Stripe customer details email when top-level customer email is missing", () => {
    expect(
      createPurchaseEventFromStripeEvent({
        id: "evt_customer_details",
        type: "checkout.session.completed",
        data: {
          object: {
            id: "cs_test_customer_details",
            customer_email: null,
            customer_details: {
              email: "DetailsEmail@Example.COM",
            },
            metadata: {
              offer_id: "founding-learner",
              access_months: "12",
            },
            amount_total: 29900,
            currency: "usd",
          },
        },
      })
    ).toMatchObject({
      checkoutSessionId: "cs_test_customer_details",
      purchaserEmail: "detailsemail@example.com",
    });
  });

  it("rejects completed checkout sessions without a usable buyer email", () => {
    expect(
      createPurchaseEventFromStripeEvent({
        id: "evt_missing_email",
        type: "checkout.session.completed",
        data: {
          object: {
            id: "cs_test_missing_email",
            customer_email: null,
            customer_details: {
              email: "not-an-email",
            },
            metadata: {
              offer_id: "founding-learner",
              access_months: "12",
            },
            amount_total: 29900,
            currency: "usd",
          },
        },
      })
    ).toBeNull();
  });

  it("includes practice seat count metadata when present", () => {
    expect(
      createPurchaseEventFromStripeEvent({
        id: "evt_practice",
        type: "checkout.session.completed",
        data: {
          object: {
            id: "cs_test_practice",
            customer_email: "manager@example.com",
            metadata: {
              offer_id: "practice-six-seat-pack",
              access_months: "12",
              seat_count: "6",
            },
            amount_total: 99900,
            currency: "usd",
          },
        },
      })
    ).toMatchObject({
      checkoutSessionId: "cs_test_practice",
      offerId: "practice-six-seat-pack",
      purchaserEmail: "manager@example.com",
      seatCount: 6,
    });
  });

  it("rejects invalid practice seat count metadata", () => {
    expect(
      createPurchaseEventFromStripeEvent({
        id: "evt_bad_practice",
        type: "checkout.session.completed",
        data: {
          object: {
            id: "cs_test_practice",
            customer_email: "manager@example.com",
            metadata: {
              offer_id: "practice-six-seat-pack",
              access_months: "12",
              seat_count: "0",
            },
            amount_total: 99900,
            currency: "usd",
          },
        },
      })
    ).toBeNull();
  });

  it("ignores unrelated Stripe events", () => {
    expect(
      createPurchaseEventFromStripeEvent({
        id: "evt_123",
        type: "payment_intent.succeeded",
        data: { object: {} },
      })
    ).toBeNull();
  });
});
