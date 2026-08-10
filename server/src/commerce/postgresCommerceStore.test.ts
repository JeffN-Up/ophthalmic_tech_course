import { describe, expect, it } from "vitest";
import {
  createPostgresEnrollmentStore,
  createPostgresPracticeSeatPackStore,
  createPostgresPurchaseStore,
} from "./postgresCommerceStore";
import type {
  QueryParameters,
  Queryable,
  TransactionClient,
  TransactionalQueryable,
} from "../db/postgres";

interface QueryCall {
  sql: string;
  params?: QueryParameters;
}

class FakePostgresClient implements TransactionClient, TransactionalQueryable {
  calls: QueryCall[] = [];

  async query(sql: string, params?: QueryParameters) {
    this.calls.push({ sql, params });

    if (sql.includes("INSERT INTO commerce_purchases")) {
      return {
        rows: [
          {
            id: "purchase_cs_test_123",
            stripe_event_id: "evt_123",
            checkout_session_id: "cs_test_123",
            offer_id: "founding-learner",
            purchaser_email: "learner@example.com",
            amount_total: 29900,
            currency: "usd",
            access_months: 12,
            seat_count: null,
            recorded_at: "2026-06-26T14:00:00.000Z",
          },
        ],
      };
    }

    if (sql.includes("INSERT INTO commerce_enrollments")) {
      return {
        rows: [
          {
            id: "enrollment_cs_test_123",
            checkout_session_id: "cs_test_123",
            offer_id: "founding-learner",
            learner_email: "learner@example.com",
            status: "active",
            access_started_at: "2026-06-26T14:00:00.000Z",
            access_expires_at: "2027-06-26T14:00:00.000Z",
          },
        ],
      };
    }

    if (sql.includes("INSERT INTO commerce_practice_seat_packs")) {
      return {
        rows: [
          {
            id: "seatpack_cs_test_practice",
            checkout_session_id: "cs_test_practice",
            offer_id: "practice-six-seat-pack",
            purchaser_email: "manager@example.com",
            total_seats: 5,
            assigned_seats: 0,
            status: "active",
            access_started_at: "2026-06-26T14:00:00.000Z",
            access_expires_at: "2027-06-26T14:00:00.000Z",
          },
        ],
      };
    }

    return { rows: [] };
  }

  async connect() {
    return this;
  }

  release() {}
}

describe("postgres commerce stores", () => {
  it("records purchases in durable commerce_purchases storage", async () => {
    const db = new FakePostgresClient();
    const store = createPostgresPurchaseStore(db);

    await expect(
      store.recordPurchase({
        stripeEventId: "evt_123",
        checkoutSessionId: "cs_test_123",
        offerId: "founding-learner",
        purchaserEmail: "learner@example.com",
        amountTotal: 29900,
        currency: "usd",
        accessMonths: 12,
        recordedAt: "2026-06-26T14:00:00.000Z",
      })
    ).resolves.toMatchObject({ created: true });
    expect(db.calls[0].sql).toContain("INSERT INTO commerce_purchases");
  });

  it("provisions enrollments in durable commerce_enrollments storage", async () => {
    const db: Queryable = new FakePostgresClient();
    const store = createPostgresEnrollmentStore(db);

    await expect(
      store.provisionEnrollment({
        enrollmentId: "enrollment_cs_test_123",
        checkoutSessionId: "cs_test_123",
        offerId: "founding-learner",
        learnerEmail: "learner@example.com",
        status: "active",
        accessStartedAt: "2026-06-26T14:00:00.000Z",
        accessExpiresAt: "2027-06-26T14:00:00.000Z",
      })
    ).resolves.toMatchObject({ created: true });
  });

  it("provisions practice packs in durable commerce_practice_seat_packs storage", async () => {
    const db = new FakePostgresClient();
    const store = createPostgresPracticeSeatPackStore(db);

    await expect(
      store.provisionPracticeSeatPack({
        seatPackId: "seatpack_cs_test_practice",
        checkoutSessionId: "cs_test_practice",
        offerId: "practice-six-seat-pack",
        purchaserEmail: "manager@example.com",
        totalSeats: 6,
        assignedSeats: 0,
        status: "active",
        accessStartedAt: "2026-06-26T14:00:00.000Z",
        accessExpiresAt: "2027-06-26T14:00:00.000Z",
      })
    ).resolves.toMatchObject({ created: true });
    expect(db.calls[0].sql).toContain(
      "INSERT INTO commerce_practice_seat_packs"
    );
  });
});
