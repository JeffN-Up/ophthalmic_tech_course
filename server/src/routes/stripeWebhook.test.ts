import { describe, expect, it, vi } from "vitest";
import type {
  PurchaseEvent,
  StripeCheckoutCompletedEvent,
} from "../commerce/stripeWebhook";
import {
  isUnfulfillableCheckoutCompletedEvent,
  sendFulfillmentWelcomeEmail,
  shouldSendPurchaseWelcomeEmail,
} from "./stripeWebhook";

const purchaseEvent: PurchaseEvent = {
  stripeEventId: "evt_123",
  checkoutSessionId: "cs_test_123",
  offerId: "founding-learner",
  purchaserEmail: "learner@example.com",
  amountTotal: 29900,
  currency: "usd",
  accessMonths: 12,
};

describe("isUnfulfillableCheckoutCompletedEvent", () => {
  it("flags completed checkout events that cannot provision access", () => {
    const stripeEvent: StripeCheckoutCompletedEvent = {
      id: "evt_missing_email",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_missing_email",
          customer_email: null,
          metadata: {
            offer_id: "founding-learner",
            access_months: "12",
          },
          amount_total: 29900,
          currency: "usd",
        },
      },
    };

    expect(isUnfulfillableCheckoutCompletedEvent(stripeEvent, null)).toBe(true);
  });

  it("does not flag valid completed checkout events", () => {
    const stripeEvent: StripeCheckoutCompletedEvent = {
      id: "evt_valid",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_valid",
          customer_email: "learner@example.com",
          metadata: {
            offer_id: "founding-learner",
            access_months: "12",
          },
          amount_total: 29900,
          currency: "usd",
        },
      },
    };

    expect(
      isUnfulfillableCheckoutCompletedEvent(stripeEvent, purchaseEvent)
    ).toBe(false);
  });

  it("does not flag unrelated Stripe events", () => {
    const stripeEvent: StripeCheckoutCompletedEvent = {
      id: "evt_payment_intent",
      type: "payment_intent.succeeded",
      data: { object: {} },
    };

    expect(isUnfulfillableCheckoutCompletedEvent(stripeEvent, null)).toBe(
      false
    );
  });
});

describe("shouldSendPurchaseWelcomeEmail", () => {
  it("sends only after a new purchase provisions access", () => {
    expect(
      shouldSendPurchaseWelcomeEmail({
        purchaseRecorded: true,
        enrollmentProvisioned: true,
        practiceSeatPackProvisioned: false,
      })
    ).toBe(true);
    expect(
      shouldSendPurchaseWelcomeEmail({
        purchaseRecorded: true,
        enrollmentProvisioned: false,
        practiceSeatPackProvisioned: true,
      })
    ).toBe(true);
    expect(
      shouldSendPurchaseWelcomeEmail({
        purchaseRecorded: false,
        enrollmentProvisioned: false,
        practiceSeatPackProvisioned: false,
      })
    ).toBe(false);
  });
});

describe("sendFulfillmentWelcomeEmail", () => {
  const configuredEmailEnv = {
    AUTH_SESSION_SECRET: "session-secret-value-with-at-least-32-chars",
    TRANSACTIONAL_EMAIL_API_URL: "https://api.resend.com/emails",
    TRANSACTIONAL_EMAIL_API_KEY: "re_test_key_123456",
    SIGN_IN_FROM_EMAIL: "OptiTech Academy <noreply@spindeleye.com>",
    PUBLIC_APP_URL: "https://academy.spindeleye.com",
  };

  it("uses the transactional email settings after access is provisioned", async () => {
    const sender = vi.fn().mockResolvedValue({
      sent: true,
      providerMessageId: "email_123",
    });

    await expect(
      sendFulfillmentWelcomeEmail({
        purchaseEvent,
        fulfillment: {
          purchaseRecorded: true,
          enrollmentProvisioned: true,
          practiceSeatPackProvisioned: false,
        },
        env: configuredEmailEnv,
        sender,
      })
    ).resolves.toEqual({
      attempted: true,
      sent: true,
      providerMessageId: "email_123",
    });
    expect(sender).toHaveBeenCalledWith({
      purchase: purchaseEvent,
      from: "OptiTech Academy <noreply@spindeleye.com>",
      publicAppUrl: "https://academy.spindeleye.com",
      apiUrl: "https://api.resend.com/emails",
      apiKey: "re_test_key_123456",
    });
  });

  it("skips welcome email when email setup is missing", async () => {
    const sender = vi.fn();

    await expect(
      sendFulfillmentWelcomeEmail({
        purchaseEvent,
        fulfillment: {
          purchaseRecorded: true,
          enrollmentProvisioned: true,
          practiceSeatPackProvisioned: false,
        },
        env: {},
        sender,
      })
    ).resolves.toEqual({
      attempted: false,
      sent: false,
      skippedReason: "Transactional email is not configured.",
    });
    expect(sender).not.toHaveBeenCalled();
  });

  it("does not let welcome email failures undo fulfillment", async () => {
    const sender = vi.fn().mockRejectedValue(new Error("provider down"));

    await expect(
      sendFulfillmentWelcomeEmail({
        purchaseEvent,
        fulfillment: {
          purchaseRecorded: true,
          enrollmentProvisioned: true,
          practiceSeatPackProvisioned: false,
        },
        env: configuredEmailEnv,
        sender,
      })
    ).resolves.toEqual({
      attempted: true,
      sent: false,
      error: "Welcome email could not be sent.",
    });
  });
});
