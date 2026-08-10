import { describe, expect, it } from "vitest";
import {
  createEnrollmentFromPracticeSeatAssignment,
  createInMemoryEnrollmentStore,
} from "./enrollmentStore";
import {
  createPracticeSeatPackFromPurchase,
  createInMemoryPracticeSeatPackStore,
} from "./practiceSeatPackStore";
import {
  createInMemoryPurchaseStore,
  createVerifiedPurchaseRecord,
} from "./purchaseStore";
import { lookupBuyerSupportProfile } from "./buyerSupportLookup";
import type { PurchaseEvent } from "./stripeWebhook";

const individualPurchaseEvent: PurchaseEvent = {
  stripeEventId: "evt_individual",
  checkoutSessionId: "cs_individual",
  offerId: "founding-learner",
  purchaserEmail: "learner@example.com",
  amountTotal: 29900,
  currency: "usd",
  accessMonths: 12,
};

const practicePurchaseEvent: PurchaseEvent = {
  stripeEventId: "evt_practice",
  checkoutSessionId: "cs_practice",
  offerId: "practice-six-seat-pack",
  purchaserEmail: "manager@example.com",
  amountTotal: 99900,
  currency: "usd",
  accessMonths: 12,
  seatCount: 6,
};

describe("lookupBuyerSupportProfile", () => {
  it("summarizes an individual buyer purchase and active enrollment", async () => {
    const purchaseStore = createInMemoryPurchaseStore();
    const enrollmentStore = createInMemoryEnrollmentStore();
    const practiceSeatPackStore = createInMemoryPracticeSeatPackStore();
    const purchase = createVerifiedPurchaseRecord(
      individualPurchaseEvent,
      "2026-07-13T12:00:00.000Z"
    );

    await purchaseStore.recordPurchase(purchase);
    await enrollmentStore.provisionEnrollment({
      enrollmentId: "enrollment_cs_individual",
      checkoutSessionId: "cs_individual",
      offerId: "founding-learner",
      learnerEmail: "learner@example.com",
      status: "active",
      accessStartedAt: "2026-07-13T12:00:00.000Z",
      accessExpiresAt: "2099-07-13T12:00:00.000Z",
    });

    await expect(
      lookupBuyerSupportProfile({
        email: " Learner@Example.COM ",
        stores: { purchaseStore, enrollmentStore, practiceSeatPackStore },
      })
    ).resolves.toMatchObject({
      email: "learner@example.com",
      purchases: [{ checkoutSessionId: "cs_individual" }],
      enrollments: [{ enrollmentId: "enrollment_cs_individual" }],
      practiceSeatPacks: [],
      practiceSeatAssignments: [],
      summary: {
        hasPurchase: true,
        hasActiveEnrollment: true,
        hasPracticeSeatPack: false,
        hasPracticeSeatAssignment: false,
        remainingPracticeSeats: 0,
      },
      recommendedActions: [
        "Active enrollment exists. Ask the learner to request a fresh passwordless sign-in link with this same email.",
      ],
      supportNote: {
        issueCategories: ["sign-in-help"],
        nextStep:
          "Active enrollment exists. Ask the learner to request a fresh passwordless sign-in link with this same email.",
      },
    });
  });

  it("summarizes a practice buyer seat pack and assigned learner access", async () => {
    const purchaseStore = createInMemoryPurchaseStore();
    const enrollmentStore = createInMemoryEnrollmentStore();
    const practiceSeatPackStore = createInMemoryPracticeSeatPackStore();
    const purchase = createVerifiedPurchaseRecord(
      practicePurchaseEvent,
      "2026-07-13T12:00:00.000Z"
    );
    const seatPack = createPracticeSeatPackFromPurchase(purchase);

    if (!seatPack) throw new Error("Expected a practice seat pack.");

    await purchaseStore.recordPurchase(purchase);
    await practiceSeatPackStore.provisionPracticeSeatPack(seatPack);
    const assignment = await practiceSeatPackStore.assignPracticeSeat({
      seatPackId: seatPack.seatPackId,
      learnerEmail: "newtech@example.com",
      assignedAt: "2026-07-13T13:00:00.000Z",
    });

    if (!assignment.assigned) throw new Error(assignment.reason);

    await enrollmentStore.provisionEnrollment(
      createEnrollmentFromPracticeSeatAssignment(assignment.assignment)
    );

    await expect(
      lookupBuyerSupportProfile({
        email: "manager@example.com",
        stores: { purchaseStore, enrollmentStore, practiceSeatPackStore },
      })
    ).resolves.toMatchObject({
      email: "manager@example.com",
      purchases: [{ checkoutSessionId: "cs_practice" }],
      enrollments: [],
      practiceSeatPacks: [
        {
          seatPackId: "seatpack_cs_practice",
          totalSeats: 6,
          assignedSeats: 1,
        },
      ],
      practiceSeatAssignments: [],
      summary: {
        hasPurchase: true,
        hasActiveEnrollment: false,
        hasPracticeSeatPack: true,
        hasPracticeSeatAssignment: false,
        remainingPracticeSeats: 5,
      },
      recommendedActions: [
        "Practice seat pack has remaining seats. Collect learner emails and assign seats through the protected practice-seat admin workflow.",
      ],
    });

    await expect(
      lookupBuyerSupportProfile({
        email: "newtech@example.com",
        stores: { purchaseStore, enrollmentStore, practiceSeatPackStore },
      })
    ).resolves.toMatchObject({
      email: "newtech@example.com",
      purchases: [],
      enrollments: [{ learnerEmail: "newtech@example.com" }],
      practiceSeatPacks: [],
      practiceSeatAssignments: [{ seatPackId: "seatpack_cs_practice" }],
      summary: {
        hasPurchase: false,
        hasActiveEnrollment: true,
        hasPracticeSeatPack: false,
        hasPracticeSeatAssignment: true,
        remainingPracticeSeats: 0,
      },
      recommendedActions: [
        "Active enrollment exists. Ask the learner to request a fresh passwordless sign-in link with this same email.",
      ],
    });
  });

  it("recommends webhook triage when purchase access was not provisioned", async () => {
    const purchaseStore = createInMemoryPurchaseStore();
    const enrollmentStore = createInMemoryEnrollmentStore();
    const practiceSeatPackStore = createInMemoryPracticeSeatPackStore();
    const purchase = createVerifiedPurchaseRecord(
      individualPurchaseEvent,
      "2026-07-13T12:00:00.000Z"
    );

    await purchaseStore.recordPurchase(purchase);

    await expect(
      lookupBuyerSupportProfile({
        email: "learner@example.com",
        stores: { purchaseStore, enrollmentStore, practiceSeatPackStore },
      })
    ).resolves.toMatchObject({
      summary: {
        hasPurchase: true,
        hasActiveEnrollment: false,
      },
      recommendedActions: [
        "A purchase exists, but no enrollment or practice seat pack was found. Check Stripe webhook delivery and fulfillment logs before retrying.",
      ],
      supportNote: {
        issueCategories: ["payment-succeeded-access-missing"],
        safeSummary: expect.stringContaining("Purchases: 1."),
      },
    });
  });

  it("rejects invalid support lookup emails", async () => {
    await expect(
      lookupBuyerSupportProfile({
        email: "not-an-email",
        stores: {
          purchaseStore: createInMemoryPurchaseStore(),
          enrollmentStore: createInMemoryEnrollmentStore(),
          practiceSeatPackStore: createInMemoryPracticeSeatPackStore(),
        },
      })
    ).rejects.toThrow("A valid buyer or learner email is required.");
  });
});
