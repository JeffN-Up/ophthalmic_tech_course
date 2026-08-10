import { describe, expect, it } from "vitest";
import { createInMemoryEnrollmentStore } from "./enrollmentStore";
import { fulfillManualPaymentLinkPurchase } from "./manualPaymentFulfillment";
import { createInMemoryPracticeSeatPackStore } from "./practiceSeatPackStore";
import { createInMemoryPurchaseStore } from "./purchaseStore";

describe("fulfillManualPaymentLinkPurchase", () => {
  it("creates one individual enrollment from a verified manual payment reference", async () => {
    const purchaseStore = createInMemoryPurchaseStore();
    const enrollmentStore = createInMemoryEnrollmentStore();
    const practiceSeatPackStore = createInMemoryPracticeSeatPackStore();

    await expect(
      fulfillManualPaymentLinkPurchase({
        buyerEmail: " Learner@Example.com ",
        offerId: "founding-learner",
        paymentReference: "plink_123 / paid",
        purchaseStore,
        enrollmentStore,
        practiceSeatPackStore,
        now: () => "2026-08-06T12:00:00.000Z",
      })
    ).resolves.toMatchObject({
      purchaseEvent: {
        stripeEventId: "manual_plink_123_paid",
        checkoutSessionId: "manual_plink_123_paid",
        purchaserEmail: "learner@example.com",
        offerId: "founding-learner",
        amountTotal: 29900,
      },
      fulfillment: {
        purchaseRecorded: true,
        enrollmentProvisioned: true,
        practiceSeatPackProvisioned: false,
      },
    });
    expect(await purchaseStore.listPurchases()).toHaveLength(1);
    expect(await enrollmentStore.listEnrollments()).toHaveLength(1);
    expect(await practiceSeatPackStore.listPracticeSeatPacks()).toHaveLength(0);
  });

  it("creates a practice seat pack from a verified manual practice payment", async () => {
    const purchaseStore = createInMemoryPurchaseStore();
    const enrollmentStore = createInMemoryEnrollmentStore();
    const practiceSeatPackStore = createInMemoryPracticeSeatPackStore();

    await expect(
      fulfillManualPaymentLinkPurchase({
        buyerEmail: "manager@example.com",
        offerId: "practice-six-seat-pack",
        paymentReference: "pi_manual_5",
        purchaseStore,
        enrollmentStore,
        practiceSeatPackStore,
        now: () => "2026-08-06T12:00:00.000Z",
      })
    ).resolves.toMatchObject({
      purchaseEvent: {
        checkoutSessionId: "manual_pi_manual_5",
        seatCount: 6,
      },
      fulfillment: {
        purchaseRecorded: true,
        enrollmentProvisioned: false,
        practiceSeatPackProvisioned: true,
      },
    });
    expect(await purchaseStore.listPurchases()).toHaveLength(1);
    expect(await enrollmentStore.listEnrollments()).toHaveLength(0);
    expect(await practiceSeatPackStore.listPracticeSeatPacks()).toHaveLength(1);
  });

  it("is idempotent for the same manual payment reference", async () => {
    const purchaseStore = createInMemoryPurchaseStore();
    const enrollmentStore = createInMemoryEnrollmentStore();
    const practiceSeatPackStore = createInMemoryPracticeSeatPackStore();
    const input = {
      buyerEmail: "learner@example.com",
      offerId: "founding-learner",
      paymentReference: "pi_same",
      purchaseStore,
      enrollmentStore,
      practiceSeatPackStore,
      now: () => "2026-08-06T12:00:00.000Z",
    };

    await fulfillManualPaymentLinkPurchase(input);
    await expect(
      fulfillManualPaymentLinkPurchase(input)
    ).resolves.toMatchObject({
      fulfillment: {
        purchaseRecorded: false,
        enrollmentProvisioned: false,
        practiceSeatPackProvisioned: false,
      },
    });
    expect(await purchaseStore.listPurchases()).toHaveLength(1);
    expect(await enrollmentStore.listEnrollments()).toHaveLength(1);
  });

  it("rejects unsupported manual payment inputs", async () => {
    const purchaseStore = createInMemoryPurchaseStore();
    const enrollmentStore = createInMemoryEnrollmentStore();

    await expect(
      fulfillManualPaymentLinkPurchase({
        buyerEmail: "",
        offerId: "founding-learner",
        paymentReference: "pi_missing_email",
        purchaseStore,
        enrollmentStore,
      })
    ).rejects.toThrow("Buyer email is required");
    await expect(
      fulfillManualPaymentLinkPurchase({
        buyerEmail: "learner@example.com",
        offerId: "unknown-offer",
        paymentReference: "pi_unknown",
        purchaseStore,
        enrollmentStore,
      })
    ).rejects.toThrow("supported manual payment offer");
    await expect(
      fulfillManualPaymentLinkPurchase({
        buyerEmail: "learner@example.com",
        offerId: "founding-learner",
        paymentReference: "",
        purchaseStore,
        enrollmentStore,
      })
    ).rejects.toThrow("reference is required");
  });
});
