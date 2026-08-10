import { describe, expect, it } from "vitest";
import {
  createEnrollmentFromPracticeSeatAssignment,
  createEnrollmentFromPurchase,
  createInMemoryEnrollmentStore,
} from "./enrollmentStore";
import type { VerifiedPurchaseRecord } from "./purchaseStore";

const purchase: VerifiedPurchaseRecord = {
  stripeEventId: "evt_123",
  checkoutSessionId: "cs_test_123",
  offerId: "founding-learner",
  purchaserEmail: "learner@example.com",
  amountTotal: 29900,
  currency: "usd",
  accessMonths: 12,
  recordedAt: "2026-06-26T14:00:00.000Z",
};

describe("createEnrollmentFromPurchase", () => {
  it("creates a learner enrollment from a verified purchase", () => {
    expect(createEnrollmentFromPurchase(purchase)).toEqual({
      enrollmentId: "enrollment_cs_test_123",
      checkoutSessionId: "cs_test_123",
      offerId: "founding-learner",
      learnerEmail: "learner@example.com",
      status: "active",
      accessStartedAt: "2026-06-26T14:00:00.000Z",
      accessExpiresAt: "2027-06-26T14:00:00.000Z",
    });
  });
});

describe("createEnrollmentFromPracticeSeatAssignment", () => {
  it("creates a learner enrollment from an assigned practice seat", () => {
    expect(
      createEnrollmentFromPracticeSeatAssignment({
        assignmentId: "seat_seatpack_cs_test_practice_tech_example_com",
        seatPackId: "seatpack_cs_test_practice",
        checkoutSessionId: "cs_test_practice",
        offerId: "practice-six-seat-pack",
        learnerEmail: "tech@example.com",
        status: "active",
        assignedAt: "2026-06-27T14:00:00.000Z",
        accessStartedAt: "2026-06-26T14:00:00.000Z",
        accessExpiresAt: "2027-06-26T14:00:00.000Z",
      })
    ).toEqual({
      enrollmentId:
        "enrollment_seat_seatpack_cs_test_practice_tech_example_com",
      checkoutSessionId: "cs_test_practice",
      offerId: "practice-six-seat-pack",
      learnerEmail: "tech@example.com",
      status: "active",
      accessStartedAt: "2026-06-26T14:00:00.000Z",
      accessExpiresAt: "2027-06-26T14:00:00.000Z",
    });
  });
});

describe("createInMemoryEnrollmentStore", () => {
  it("provisions one enrollment per enrollment id", async () => {
    const store = createInMemoryEnrollmentStore();
    const enrollment = createEnrollmentFromPurchase(purchase);

    expect(store.provisionEnrollment(enrollment).created).toBe(true);
    expect(store.provisionEnrollment(enrollment).created).toBe(false);
    expect(await store.findEnrollmentsByEmail(" learner@example.com ")).toEqual(
      [enrollment]
    );
  });

  it("allows multiple learners from one practice checkout session", async () => {
    const store = createInMemoryEnrollmentStore();
    const firstEnrollment = createEnrollmentFromPracticeSeatAssignment({
      assignmentId: "seat_pack_first",
      seatPackId: "seatpack_cs_test_practice",
      checkoutSessionId: "cs_test_practice",
      offerId: "practice-six-seat-pack",
      learnerEmail: "first@example.com",
      status: "active",
      assignedAt: "2026-06-27T14:00:00.000Z",
      accessStartedAt: "2026-06-26T14:00:00.000Z",
      accessExpiresAt: "2027-06-26T14:00:00.000Z",
    });
    const secondEnrollment = createEnrollmentFromPracticeSeatAssignment({
      assignmentId: "seat_pack_second",
      seatPackId: "seatpack_cs_test_practice",
      checkoutSessionId: "cs_test_practice",
      offerId: "practice-six-seat-pack",
      learnerEmail: "second@example.com",
      status: "active",
      assignedAt: "2026-06-27T14:00:00.000Z",
      accessStartedAt: "2026-06-26T14:00:00.000Z",
      accessExpiresAt: "2027-06-26T14:00:00.000Z",
    });

    expect(store.provisionEnrollment(firstEnrollment).created).toBe(true);
    expect(store.provisionEnrollment(secondEnrollment).created).toBe(true);
    expect(await store.listEnrollments()).toHaveLength(2);
  });

  it("expires one enrollment for refund or support revocation", async () => {
    const store = createInMemoryEnrollmentStore();
    const enrollment = createEnrollmentFromPurchase(purchase);

    store.provisionEnrollment(enrollment);

    expect(store.expireEnrollment(enrollment.enrollmentId)).toMatchObject({
      expired: true,
      enrollment: {
        enrollmentId: "enrollment_cs_test_123",
        status: "expired",
      },
    });
    expect(store.expireEnrollment("enrollment_missing")).toEqual({
      expired: false,
    });
  });
});
