import { describe, expect, it } from "vitest";
import {
  createInMemoryPurchaseStore,
  type VerifiedPurchaseRecord,
} from "./purchaseStore";

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

describe("createInMemoryPurchaseStore", () => {
  it("records a verified purchase once by Stripe event id", () => {
    const store = createInMemoryPurchaseStore();

    expect(store.recordPurchase(purchase).created).toBe(true);
    expect(store.recordPurchase(purchase).created).toBe(false);
    expect(store.listPurchases()).toHaveLength(1);
  });

  it("can find a purchase by purchaser email", () => {
    const store = createInMemoryPurchaseStore();

    store.recordPurchase(purchase);

    expect(store.findPurchasesByEmail(" learner@example.com ")).toEqual([
      purchase,
    ]);
  });
});
