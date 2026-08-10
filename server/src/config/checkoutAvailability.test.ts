import { describe, expect, it } from "vitest";
import {
  getCheckoutAvailabilityReport,
  getManualPaymentLinks,
} from "./checkoutAvailability";
import type { PaidCheckoutGateStatus } from "./paidCheckoutGate";

const readyGate: PaidCheckoutGateStatus = {
  ready: true,
  warnings: [],
  missingVariables: [],
};

describe("getCheckoutAvailabilityReport", () => {
  it("tells buyers checkout is open when paid launch gates are ready", () => {
    expect(getCheckoutAvailabilityReport(readyGate)).toEqual({
      ready: true,
      title: "Enrollment is open",
      message:
        "Stripe checkout is available for individual learners and practice packs.",
      primaryAction: "continue-to-checkout",
      manualPaymentLinks: {},
    });
  });

  it("offers controlled manual Stripe payment links when automated checkout is paused", () => {
    expect(
      getCheckoutAvailabilityReport(
        {
          ready: false,
          warnings: [
            "Paid enrollment launch switch is disabled: ENABLE_PAID_ENROLLMENT must be true.",
          ],
          missingVariables: ["ENABLE_PAID_ENROLLMENT"],
        },
        {
          PUBLIC_STRIPE_PAYMENT_LINK_FOUNDING_LEARNER:
            "https://buy.stripe.com/test_founding",
          PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_6_SEATS:
            "https://buy.stripe.com/test_practice_6",
        }
      )
    ).toEqual({
      ready: false,
      title: "Manual Stripe payment links are available",
      message:
        "Automated checkout is still paused, but approved first buyers can use a Stripe Payment Link while access is fulfilled manually.",
      primaryAction: "use-manual-payment-link",
      manualPaymentLinks: {
        foundingLearner: "https://buy.stripe.com/test_founding",
        practiceSixSeatPack: "https://buy.stripe.com/test_practice_6",
      },
    });
  });

  it("gives buyers a safe interest-list path when checkout is not ready", () => {
    expect(
      getCheckoutAvailabilityReport({
        ready: false,
        warnings: [
          "Paid enrollment launch switch is disabled: ENABLE_PAID_ENROLLMENT must be true.",
          "Stripe webhook setup is missing: STRIPE_WEBHOOK_SECRET.",
        ],
        missingVariables: ["STRIPE_WEBHOOK_SECRET"],
      })
    ).toEqual({
      ready: false,
      title: "Enrollment is not open yet",
      message:
        "The course can collect interest, but payment is paused until the final launch checks are complete.",
      primaryAction: "join-interest-list",
      manualPaymentLinks: {},
    });
  });

  it("ignores invalid manual payment link values", () => {
    expect(
      getManualPaymentLinks({
        PUBLIC_STRIPE_PAYMENT_LINK_FOUNDING_LEARNER:
          "https://example.com/not-stripe",
        PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_6_SEATS: "not a url",
        PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_15_SEATS:
          "https://buy.stripe.com/practice_15",
      })
    ).toEqual({
      practiceFifteenSeatPack: "https://buy.stripe.com/practice_15",
    });
  });
});
