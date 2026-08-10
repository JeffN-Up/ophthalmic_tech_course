import { describe, expect, it } from "vitest";
import {
  createInMemoryPracticeSeatPackStore,
  createPracticeSeatPackFromPurchase,
} from "./practiceSeatPackStore";
import type { VerifiedPurchaseRecord } from "./purchaseStore";

const practicePurchase: VerifiedPurchaseRecord = {
  stripeEventId: "evt_practice",
  checkoutSessionId: "cs_test_practice",
  offerId: "practice-six-seat-pack",
  purchaserEmail: " Manager@Example.com ",
  amountTotal: 99900,
  currency: "usd",
  accessMonths: 12,
  seatCount: 6,
  recordedAt: "2026-06-26T14:00:00.000Z",
};

describe("createPracticeSeatPackFromPurchase", () => {
  it("creates a practice seat pack from a verified practice purchase", () => {
    expect(createPracticeSeatPackFromPurchase(practicePurchase)).toEqual({
      seatPackId: "seatpack_cs_test_practice",
      checkoutSessionId: "cs_test_practice",
      offerId: "practice-six-seat-pack",
      purchaserEmail: "manager@example.com",
      totalSeats: 6,
      assignedSeats: 0,
      status: "active",
      accessStartedAt: "2026-06-26T14:00:00.000Z",
      accessExpiresAt: "2027-06-26T14:00:00.000Z",
    });
  });

  it("does not create a seat pack for an individual purchase", () => {
    expect(
      createPracticeSeatPackFromPurchase({
        ...practicePurchase,
        offerId: "founding-learner",
        seatCount: undefined,
      })
    ).toBeNull();
  });
});

describe("createInMemoryPracticeSeatPackStore", () => {
  it("provisions one seat pack per checkout session", async () => {
    const store = createInMemoryPracticeSeatPackStore();
    const seatPack = createPracticeSeatPackFromPurchase(practicePurchase);

    expect(seatPack).not.toBeNull();
    expect(store.provisionPracticeSeatPack(seatPack!).created).toBe(true);
    expect(store.provisionPracticeSeatPack(seatPack!).created).toBe(false);
    expect(
      await store.findPracticeSeatPacksByPurchaserEmail(" manager@example.com ")
    ).toEqual([seatPack]);
  });

  it("assigns learner emails without exceeding purchased capacity", async () => {
    const store = createInMemoryPracticeSeatPackStore();
    const seatPack = createPracticeSeatPackFromPurchase({
      ...practicePurchase,
      seatCount: 1,
    });

    expect(seatPack).not.toBeNull();
    store.provisionPracticeSeatPack(seatPack!);

    expect(
      await store.assignPracticeSeat({
        seatPackId: seatPack!.seatPackId,
        learnerEmail: " Tech@OnePractice.com ",
        assignedAt: "2026-06-27T14:00:00.000Z",
      })
    ).toMatchObject({
      assigned: true,
      assignment: {
        learnerEmail: "tech@onepractice.com",
        status: "active",
        assignedAt: "2026-06-27T14:00:00.000Z",
      },
      seatPack: {
        totalSeats: 1,
        assignedSeats: 1,
      },
    });

    expect(
      await store.assignPracticeSeat({
        seatPackId: seatPack!.seatPackId,
        learnerEmail: "second@example.com",
      })
    ).toEqual({
      assigned: false,
      reason: "Practice seat pack has no seats remaining.",
    });
  });

  it("returns the existing assignment when the same learner is assigned twice", async () => {
    const store = createInMemoryPracticeSeatPackStore();
    const seatPack = createPracticeSeatPackFromPurchase(practicePurchase);

    expect(seatPack).not.toBeNull();
    store.provisionPracticeSeatPack(seatPack!);

    const firstAssignment = await store.assignPracticeSeat({
      seatPackId: seatPack!.seatPackId,
      learnerEmail: "tech@example.com",
      assignedAt: "2026-06-27T14:00:00.000Z",
    });
    const secondAssignment = await store.assignPracticeSeat({
      seatPackId: seatPack!.seatPackId,
      learnerEmail: " TECH@example.com ",
      assignedAt: "2026-07-01T14:00:00.000Z",
    });

    expect(secondAssignment).toEqual(firstAssignment);
    expect(await store.listPracticeSeatAssignments()).toHaveLength(1);
    expect((await store.listPracticeSeatPacks())[0].assignedSeats).toBe(1);
  });

  it("rejects assignments for missing seat packs", async () => {
    const store = createInMemoryPracticeSeatPackStore();

    expect(
      await store.assignPracticeSeat({
        seatPackId: "seatpack_missing",
        learnerEmail: "tech@example.com",
      })
    ).toEqual({
      assigned: false,
      reason: "Practice seat pack was not found.",
    });
  });

  it("expires practice seat packs for refund or cancellation", async () => {
    const store = createInMemoryPracticeSeatPackStore();
    const seatPack = createPracticeSeatPackFromPurchase(practicePurchase);

    expect(seatPack).not.toBeNull();
    store.provisionPracticeSeatPack(seatPack!);

    expect(store.expirePracticeSeatPack(seatPack!.seatPackId)).toMatchObject({
      expired: true,
      seatPack: {
        seatPackId: "seatpack_cs_test_practice",
        status: "expired",
      },
    });
    expect(store.expirePracticeSeatPack("seatpack_missing")).toEqual({
      expired: false,
    });
  });

  it("revokes assigned practice seats and frees capacity", async () => {
    const store = createInMemoryPracticeSeatPackStore();
    const seatPack = createPracticeSeatPackFromPurchase({
      ...practicePurchase,
      seatCount: 1,
    });

    expect(seatPack).not.toBeNull();
    store.provisionPracticeSeatPack(seatPack!);
    const assignmentResult = await store.assignPracticeSeat({
      seatPackId: seatPack!.seatPackId,
      learnerEmail: "tech@example.com",
    });

    if (!assignmentResult.assigned) throw new Error(assignmentResult.reason);

    expect(
      store.revokePracticeSeatAssignment(
        assignmentResult.assignment.assignmentId
      )
    ).toMatchObject({
      revoked: true,
      assignment: {
        assignmentId: assignmentResult.assignment.assignmentId,
        status: "revoked",
      },
      seatPack: {
        assignedSeats: 0,
      },
    });
    expect(
      await store.assignPracticeSeat({
        seatPackId: seatPack!.seatPackId,
        learnerEmail: "second@example.com",
      })
    ).toMatchObject({
      assigned: true,
      assignment: {
        learnerEmail: "second@example.com",
      },
    });
  });
});
