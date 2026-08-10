import { describe, expect, it, vi } from "vitest";
import {
  createCheckoutSession,
  fetchCheckoutAvailability,
} from "./checkoutClient";

describe("createCheckoutSession", () => {
  it("returns the hosted checkout url on success", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        url: "https://checkout.stripe.com/c/pay/cs_test_123",
      }),
    });

    await expect(
      createCheckoutSession({
        email: " Learner@Example.COM ",
        acceptedTerms: true,
        fetcher,
      })
    ).resolves.toEqual({
      url: "https://checkout.stripe.com/c/pay/cs_test_123",
    });

    expect(fetcher).toHaveBeenCalledWith("/api/checkout/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "learner@example.com",
        acceptedTerms: true,
      }),
    });
  });

  it("sends an offer id when buying a practice pack", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        url: "https://checkout.stripe.com/c/pay/cs_test_practice",
      }),
    });

    await createCheckoutSession({
      email: "manager@example.com",
      offerId: "practice-six-seat-pack",
      acceptedTerms: true,
      fetcher,
    });

    expect(fetcher).toHaveBeenCalledWith("/api/checkout/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "manager@example.com",
        offerId: "practice-six-seat-pack",
        acceptedTerms: true,
      }),
    });
  });

  it("surfaces server errors", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Checkout unavailable" }),
    });

    await expect(
      createCheckoutSession({
        email: "learner@example.com",
        acceptedTerms: true,
        fetcher,
      })
    ).rejects.toThrow("Checkout unavailable");
  });

  it("requires a valid email before contacting checkout", async () => {
    const fetcher = vi.fn();

    await expect(
      createCheckoutSession({ email: "not-an-email", fetcher })
    ).rejects.toThrow(
      "Enter a valid email so we can send your receipt and course access."
    );
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("requires policy acceptance before contacting checkout", async () => {
    const fetcher = vi.fn();

    await expect(
      createCheckoutSession({
        email: "learner@example.com",
        acceptedTerms: false,
        fetcher,
      })
    ).rejects.toThrow(
      "Review and accept the course policies before continuing to Stripe."
    );
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("requires an email before contacting checkout", async () => {
    const fetcher = vi.fn();

    await expect(createCheckoutSession({ email: "", fetcher })).rejects.toThrow(
      "Enter a valid email so we can send your receipt and course access."
    );
    expect(fetcher).not.toHaveBeenCalled();
  });
});

describe("fetchCheckoutAvailability", () => {
  it("returns the public checkout availability report", async () => {
    const availability = {
      ready: false,
      title: "Enrollment is not open yet",
      message:
        "The course can collect interest, but payment is paused until the final launch checks are complete.",
      primaryAction: "join-interest-list",
      manualPaymentLinks: {},
    };
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => availability,
    });

    await expect(fetchCheckoutAvailability({ fetcher })).resolves.toEqual(
      availability
    );
    expect(fetcher).toHaveBeenCalledWith("/api/checkout/availability");
  });

  it("surfaces availability fetch failures", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Availability unavailable" }),
    });

    await expect(fetchCheckoutAvailability({ fetcher })).rejects.toThrow(
      "Availability unavailable"
    );
  });
});
