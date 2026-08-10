import { describe, expect, it } from "vitest";
import {
  createEnrollmentFromPracticeSeatAssignment,
  createEnrollmentFromPurchase,
  createInMemoryEnrollmentStore,
} from "./enrollmentStore";
import {
  createPracticeSeatPackFromPurchase,
  createInMemoryPracticeSeatPackStore,
} from "./practiceSeatPackStore";
import { createVerifiedPurchaseRecord } from "./purchaseStore";
import { revokeAccess } from "./accessRevocation";
import type { PurchaseEvent } from "./stripeWebhook";

const individualPurchase: PurchaseEvent = {
  stripeEventId: "evt_individual",
  checkoutSessionId: "cs_individual",
  offerId: "founding-learner",
  purchaserEmail: "learner@example.com",
  amountTotal: 29900,
  currency: "usd",
  accessMonths: 12,
};

const practicePurchase: PurchaseEvent = {
  stripeEventId: "evt_practice",
  checkoutSessionId: "cs_practice",
  offerId: "practice-six-seat-pack",
  purchaserEmail: "manager@example.com",
  amountTotal: 99900,
  currency: "usd",
  accessMonths: 12,
  seatCount: 6,
};

describe("revokeAccess", () => {
  it("expires an individual learner enrollment", async () => {
    const enrollmentStore = createInMemoryEnrollmentStore();
    const practiceSeatPackStore = createInMemoryPracticeSeatPackStore();
    const enrollment = createEnrollmentFromPurchase(
      createVerifiedPurchaseRecord(
        individualPurchase,
        "2026-07-13T12:00:00.000Z"
      )
    );

    enrollmentStore.provisionEnrollment(enrollment);

    await expect(
      revokeAccess({
        target: {
          type: "enrollment",
          enrollmentId: enrollment.enrollmentId,
        },
        stores: { enrollmentStore, practiceSeatPackStore },
      })
    ).resolves.toMatchObject({
      revoked: true,
      enrollment: {
        enrollmentId: "enrollment_cs_individual",
        status: "expired",
      },
      expiredEnrollments: [
        {
          enrollmentId: "enrollment_cs_individual",
          status: "expired",
        },
      ],
      revokedAssignments: [],
    });
  });

  it("revokes a practice seat assignment and expires matching learner access", async () => {
    const enrollmentStore = createInMemoryEnrollmentStore();
    const practiceSeatPackStore = createInMemoryPracticeSeatPackStore();
    const purchase = createVerifiedPurchaseRecord(
      practicePurchase,
      "2026-07-13T12:00:00.000Z"
    );
    const seatPack = createPracticeSeatPackFromPurchase(purchase);

    if (!seatPack) throw new Error("Expected a practice seat pack.");

    practiceSeatPackStore.provisionPracticeSeatPack(seatPack);
    const assignmentResult = await practiceSeatPackStore.assignPracticeSeat({
      seatPackId: seatPack.seatPackId,
      learnerEmail: "newtech@example.com",
    });

    if (!assignmentResult.assigned) throw new Error(assignmentResult.reason);

    enrollmentStore.provisionEnrollment(
      createEnrollmentFromPracticeSeatAssignment(assignmentResult.assignment)
    );

    await expect(
      revokeAccess({
        target: {
          type: "practice-seat-assignment",
          assignmentId: assignmentResult.assignment.assignmentId,
        },
        stores: { enrollmentStore, practiceSeatPackStore },
      })
    ).resolves.toMatchObject({
      revoked: true,
      assignment: {
        assignmentId: assignmentResult.assignment.assignmentId,
        status: "revoked",
      },
      seatPack: {
        assignedSeats: 0,
      },
      expiredEnrollments: [
        {
          learnerEmail: "newtech@example.com",
          status: "expired",
        },
      ],
    });
  });

  it("expires a practice pack and revokes all active assignments", async () => {
    const enrollmentStore = createInMemoryEnrollmentStore();
    const practiceSeatPackStore = createInMemoryPracticeSeatPackStore();
    const purchase = createVerifiedPurchaseRecord(
      practicePurchase,
      "2026-07-13T12:00:00.000Z"
    );
    const seatPack = createPracticeSeatPackFromPurchase(purchase);

    if (!seatPack) throw new Error("Expected a practice seat pack.");

    practiceSeatPackStore.provisionPracticeSeatPack(seatPack);

    for (const learnerEmail of ["one@example.com", "two@example.com"]) {
      const assignmentResult = await practiceSeatPackStore.assignPracticeSeat({
        seatPackId: seatPack.seatPackId,
        learnerEmail,
      });

      if (!assignmentResult.assigned) throw new Error(assignmentResult.reason);

      enrollmentStore.provisionEnrollment(
        createEnrollmentFromPracticeSeatAssignment(assignmentResult.assignment)
      );
    }

    await expect(
      revokeAccess({
        target: {
          type: "practice-seat-pack",
          seatPackId: seatPack.seatPackId,
        },
        stores: { enrollmentStore, practiceSeatPackStore },
      })
    ).resolves.toMatchObject({
      revoked: true,
      seatPack: {
        seatPackId: "seatpack_cs_practice",
        status: "expired",
      },
      expiredEnrollments: [
        { learnerEmail: "one@example.com", status: "expired" },
        { learnerEmail: "two@example.com", status: "expired" },
      ],
      revokedAssignments: [
        { learnerEmail: "one@example.com", status: "revoked" },
        { learnerEmail: "two@example.com", status: "revoked" },
      ],
    });
  });
});
