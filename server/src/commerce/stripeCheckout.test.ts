import { describe, expect, it } from "vitest";
import {
  foundingLearnerOffer,
  practicePackOffers,
} from "../../../shared/commerce/offers";
import {
  buildCheckoutReturnUrls,
  buildStripeCheckoutParams,
  getCheckoutBaseUrl,
} from "./stripeCheckout";

describe("buildCheckoutReturnUrls", () => {
  it("sends individual learners to the lesson area after payment", () => {
    expect(
      buildCheckoutReturnUrls({
        baseUrl: "https://example.com/",
        offer: foundingLearnerOffer,
      })
    ).toEqual({
      successUrl:
        "https://example.com/learn?checkout=success&offer=founding-learner",
      cancelUrl:
        "https://example.com/checkout?checkout=cancelled&offer=founding-learner",
    });
  });

  it("sends practice buyers back to seat-pack setup context", () => {
    expect(
      buildCheckoutReturnUrls({
        baseUrl: "https://example.com/",
        offer: practicePackOffers[0],
      })
    ).toEqual({
      successUrl:
        "https://example.com/practice-packs?checkout=success&offer=practice-six-seat-pack",
      cancelUrl:
        "https://example.com/practice-packs?checkout=cancelled&offer=practice-six-seat-pack",
    });
  });
});

describe("buildStripeCheckoutParams", () => {
  it("uses the canonical founding learner offer", () => {
    const params = buildStripeCheckoutParams(
      {
        successUrl: "https://example.com/checkout/success",
        cancelUrl: "https://example.com/checkout",
      },
      "learner@example.com"
    );

    expect(params.get("mode")).toBe("payment");
    expect(params.get("client_reference_id")).toBe(foundingLearnerOffer.id);
    expect(params.get("metadata[offer_id]")).toBe(foundingLearnerOffer.id);
    expect(params.get("metadata[access_months]")).toBe("12");
    expect(params.get("line_items[0][quantity]")).toBe("1");
    expect(params.get("line_items[0][price_data][currency]")).toBe("usd");
    expect(params.get("line_items[0][price_data][unit_amount]")).toBe("29900");
    expect(params.get("line_items[0][price_data][product_data][name]")).toBe(
      foundingLearnerOffer.name
    );
  });

  it("adds the required customer email for fulfillment", () => {
    const params = buildStripeCheckoutParams(
      {
        successUrl: "https://example.com/checkout/success",
        cancelUrl: "https://example.com/checkout",
      },
      "learner@example.com"
    );

    expect(params.get("customer_email")).toBe("learner@example.com");
  });

  it("can build checkout params for a practice pack offer", () => {
    const practiceOffer = practicePackOffers[0];
    const params = buildStripeCheckoutParams(
      {
        successUrl: "https://example.com/checkout/success",
        cancelUrl: "https://example.com/practice-packs",
      },
      "manager@example.com",
      practiceOffer.id
    );

    expect(params.get("client_reference_id")).toBe(practiceOffer.id);
    expect(params.get("metadata[offer_id]")).toBe(practiceOffer.id);
    expect(params.get("metadata[access_months]")).toBe("12");
    expect(params.get("metadata[seat_count]")).toBe("6");
    expect(params.get("line_items[0][quantity]")).toBe("1");
    expect(params.get("line_items[0][price_data][unit_amount]")).toBe("99900");
    expect(params.get("line_items[0][price_data][product_data][name]")).toBe(
      practiceOffer.name
    );
  });

  it("rejects unknown checkout offers", () => {
    expect(() =>
      buildStripeCheckoutParams(
        {
          successUrl: "https://example.com/checkout/success",
          cancelUrl: "https://example.com/checkout",
        },
        "learner@example.com",
        "not-a-real-offer"
      )
    ).toThrow("Unknown checkout offer.");
  });
});

describe("getCheckoutBaseUrl", () => {
  it("removes a trailing slash from the configured origin", () => {
    expect(getCheckoutBaseUrl("https://example.com/")).toBe(
      "https://example.com"
    );
  });
});
