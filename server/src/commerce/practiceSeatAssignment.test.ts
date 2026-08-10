import { describe, expect, it } from "vitest";
import { createInMemoryEnrollmentStore } from "./enrollmentStore";
import { assignPracticeSeatToLearner } from "./practiceSeatAssignment";
import {
  createInMemoryPracticeSeatPackStore,
  createPracticeSeatPackFromPurchase,
} from "./practiceSeatPackStore";
import type { VerifiedPurchaseRecord } from "./purchaseStore";

const practicePurchase: VerifiedPurchaseRecord = {
  stripeEventId: "evt_practice",
  checkoutSessionId: "cs_test_practice",
  offerId: "practice-six-seat-pack",
  purchaserEmail: "manager@example.com",
  amountTotal: 99900,
  currency: "usd",
  accessMonths: 12,
  seatCount: 1,
  recordedAt: "2026-06-26T14:00:00.000Z",
};

function createStoresWithSeatPack() {
  const practiceSeatPackStore = createInMemoryPracticeSeatPackStore();
  const enrollmentStore = createInMemoryEnrollmentStore();
  const seatPack = createPracticeSeatPackFromPurchase(practicePurchase);

  if (!seatPack) {
    throw new Error("Expected test practice purchase to create a seat pack.");
  }

  practiceSeatPackStore.provisionPracticeSeatPack(seatPack);

  return { practiceSeatPackStore, enrollmentStore, seatPack };
}

describe("assignPracticeSeatToLearner", () => {
  it("assigns one learner seat and provisions a matching enrollment", async () => {
    const { practiceSeatPackStore, enrollmentStore, seatPack } =
      createStoresWithSeatPack();

    expect(
      await assignPracticeSeatToLearner({
        seatPackId: seatPack.seatPackId,
        learnerEmail: " Tech@Example.com ",
        practiceSeatPackStore,
        enrollmentStore,
        assignedAt: "2026-06-27T14:00:00.000Z",
      })
    ).toMatchObject({
      assigned: true,
      assignment: {
        learnerEmail: "tech@example.com",
        status: "active",
      },
      enrollment: {
        learnerEmail: "tech@example.com",
        offerId: "practice-six-seat-pack",
        status: "active",
      },
      enrollmentProvisioned: true,
      seatPack: {
        assignedSeats: 1,
        totalSeats: 1,
      },
    });
    expect(
      await enrollmentStore.findEnrollmentsByEmail("tech@example.com")
    ).toHaveLength(1);
  });

  it("does not burn another seat when the same learner is assigned twice", async () => {
    const { practiceSeatPackStore, enrollmentStore, seatPack } =
      createStoresWithSeatPack();

    await assignPracticeSeatToLearner({
      seatPackId: seatPack.seatPackId,
      learnerEmail: "tech@example.com",
      practiceSeatPackStore,
      enrollmentStore,
    });
    const secondResult = await assignPracticeSeatToLearner({
      seatPackId: seatPack.seatPackId,
      learnerEmail: " TECH@example.com ",
      practiceSeatPackStore,
      enrollmentStore,
    });

    expect(secondResult).toMatchObject({
      assigned: true,
      enrollmentProvisioned: false,
      seatPack: {
        assignedSeats: 1,
      },
    });
    expect(
      await practiceSeatPackStore.listPracticeSeatAssignments()
    ).toHaveLength(1);
    expect(await enrollmentStore.listEnrollments()).toHaveLength(1);
  });

  it("blocks assignment when no seats remain", async () => {
    const { practiceSeatPackStore, enrollmentStore, seatPack } =
      createStoresWithSeatPack();

    await assignPracticeSeatToLearner({
      seatPackId: seatPack.seatPackId,
      learnerEmail: "first@example.com",
      practiceSeatPackStore,
      enrollmentStore,
    });

    expect(
      await assignPracticeSeatToLearner({
        seatPackId: seatPack.seatPackId,
        learnerEmail: "second@example.com",
        practiceSeatPackStore,
        enrollmentStore,
      })
    ).toEqual({
      assigned: false,
      reason: "Practice seat pack has no seats remaining.",
    });
  });

  it("rejects invalid learner emails", async () => {
    const { practiceSeatPackStore, enrollmentStore, seatPack } =
      createStoresWithSeatPack();

    expect(
      await assignPracticeSeatToLearner({
        seatPackId: seatPack.seatPackId,
        learnerEmail: "not-an-email",
        practiceSeatPackStore,
        enrollmentStore,
      })
    ).toEqual({
      assigned: false,
      reason: "Learner email is required.",
    });
  });
});
