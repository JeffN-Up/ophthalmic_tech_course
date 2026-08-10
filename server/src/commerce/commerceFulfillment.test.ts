import { describe, expect, it } from "vitest";
import { createInMemoryEnrollmentStore } from "./enrollmentStore";
import {
  createCommerceFulfillmentService,
  type CommerceFulfillmentStore,
} from "./commerceFulfillment";
import {
  createInMemoryPurchaseStore,
  type VerifiedPurchaseRecord,
} from "./purchaseStore";
import { createInMemoryPracticeSeatPackStore } from "./practiceSeatPackStore";
import type { PurchaseEvent } from "./stripeWebhook";

const purchaseEvent: PurchaseEvent = {
  stripeEventId: "evt_123",
  checkoutSessionId: "cs_test_123",
  offerId: "founding-learner",
  purchaserEmail: " learner@example.com ",
  amountTotal: 29900,
  currency: "usd",
  accessMonths: 12,
};

describe("createCommerceFulfillmentService", () => {
  it("records a verified purchase and provisions one matching enrollment", async () => {
    const purchaseStore = createInMemoryPurchaseStore();
    const enrollmentStore = createInMemoryEnrollmentStore();
    const service = createCommerceFulfillmentService({
      purchaseStore,
      enrollmentStore,
      now: () => "2026-06-26T14:00:00.000Z",
    });

    await expect(service.fulfillPurchaseEvent(purchaseEvent)).resolves.toEqual({
      purchaseRecorded: true,
      enrollmentProvisioned: true,
      practiceSeatPackProvisioned: false,
    });
    await expect(service.fulfillPurchaseEvent(purchaseEvent)).resolves.toEqual({
      purchaseRecorded: false,
      enrollmentProvisioned: false,
      practiceSeatPackProvisioned: false,
    });
    expect(await purchaseStore.listPurchases()).toHaveLength(1);
    expect(await enrollmentStore.listEnrollments()).toHaveLength(1);
    expect((await enrollmentStore.listEnrollments())[0]).toMatchObject({
      checkoutSessionId: "cs_test_123",
      learnerEmail: "learner@example.com",
      accessStartedAt: "2026-06-26T14:00:00.000Z",
      accessExpiresAt: "2027-06-26T14:00:00.000Z",
    });
  });

  it("can use one repository object so database storage can be swapped in later", async () => {
    const purchaseStore = createInMemoryPurchaseStore();
    const enrollmentStore = createInMemoryEnrollmentStore();
    const repository: CommerceFulfillmentStore = {
      recordPurchase: purchaseStore.recordPurchase,
      provisionEnrollment: enrollmentStore.provisionEnrollment,
    };
    const service = createCommerceFulfillmentService({
      store: repository,
      now: () => "2026-06-26T14:00:00.000Z",
    });

    await expect(service.fulfillPurchaseEvent(purchaseEvent)).resolves.toEqual({
      purchaseRecorded: true,
      enrollmentProvisioned: true,
      practiceSeatPackProvisioned: false,
    });
  });

  it("records a practice purchase as a seat pack instead of one learner enrollment", async () => {
    const purchaseStore = createInMemoryPurchaseStore();
    const enrollmentStore = createInMemoryEnrollmentStore();
    const practiceSeatPackStore = createInMemoryPracticeSeatPackStore();
    const service = createCommerceFulfillmentService({
      purchaseStore,
      enrollmentStore,
      practiceSeatPackStore,
      now: () => "2026-06-26T14:00:00.000Z",
    });

    await expect(
      service.fulfillPurchaseEvent({
        ...purchaseEvent,
        checkoutSessionId: "cs_test_practice",
        offerId: "practice-six-seat-pack",
        purchaserEmail: "manager@example.com",
        amountTotal: 99900,
        seatCount: 6,
      })
    ).resolves.toEqual({
      purchaseRecorded: true,
      enrollmentProvisioned: false,
      practiceSeatPackProvisioned: true,
    });
    expect(await enrollmentStore.listEnrollments()).toHaveLength(0);
    expect(await practiceSeatPackStore.listPracticeSeatPacks()).toHaveLength(1);
    expect(
      (await practiceSeatPackStore.listPracticeSeatPacks())[0]
    ).toMatchObject({
      checkoutSessionId: "cs_test_practice",
      purchaserEmail: "manager@example.com",
      totalSeats: 6,
      assignedSeats: 0,
    });
  });

  it("does not provision enrollment when recording the purchase fails", async () => {
    const service = createCommerceFulfillmentService({
      store: {
        recordPurchase: (purchase: VerifiedPurchaseRecord) => ({
          created: false,
          purchase,
        }),
        provisionEnrollment: () => {
          throw new Error("Enrollment should not be created.");
        },
      },
    });

    await expect(service.fulfillPurchaseEvent(purchaseEvent)).resolves.toEqual({
      purchaseRecorded: false,
      enrollmentProvisioned: false,
      practiceSeatPackProvisioned: false,
    });
  });
});
