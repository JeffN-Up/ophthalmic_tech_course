#!/usr/bin/env node

const offers = [
  {
    name: "Founding Learner Access",
    offerId: "founding-learner",
    stripeLookupKey: "optitech_founding_learner_299",
    price: "$299",
    priceCents: 29900,
    accessMonths: 12,
    seatCount: null,
    buyerPath: "Individual learner",
  },
  {
    name: "Six-Seat Practice Onboarding Pack",
    offerId: "practice-six-seat-pack",
    stripeLookupKey: "optitech_practice_6_seats_999",
    price: "$999",
    priceCents: 99900,
    accessMonths: 12,
    seatCount: 6,
    buyerPath: "Practice buyer",
  },
  {
    name: "Fifteen-Seat Practice Onboarding Pack",
    offerId: "practice-fifteen-seat-pack",
    stripeLookupKey: "optitech_practice_15_seats_1799",
    price: "$1,799",
    priceCents: 179900,
    accessMonths: 12,
    seatCount: 15,
    buyerPath: "Practice buyer",
  },
];

const lines = [
  "# OptiTech Academy Stripe Product Setup",
  "",
  "Use this in Stripe test mode first, then repeat in live mode only after every launch gate is ready.",
  "The app currently sends price data directly to Stripe Checkout, so dashboard products are optional for checkout but useful for reporting and keeping the business organized.",
  "",
  "Do not paste Stripe secret keys, webhook signing secrets, card numbers, raw sign-in links, session cookies, database passwords, patient information, or protected health information into this checklist.",
  "",
  "## Products And Prices To Mirror In Stripe",
  "",
];

offers.forEach(offer => {
  lines.push(`### ${offer.name}`);
  lines.push("");
  lines.push(`- Buyer path: ${offer.buyerPath}`);
  lines.push(`- App offer id: \`${offer.offerId}\``);
  lines.push(`- Stripe lookup key: \`${offer.stripeLookupKey}\``);
  lines.push(`- One-time price: ${offer.price} USD`);
  lines.push(`- Price in cents: ${offer.priceCents}`);
  lines.push(`- Access period: ${offer.accessMonths} months`);
  lines.push(
    `- Seat count metadata: ${offer.seatCount === null ? "not applicable" : offer.seatCount}`
  );
  lines.push("");
});

lines.push("## Stripe Dashboard Checklist");
lines.push("");
lines.push("1. Start in Stripe test mode.");
lines.push("2. Create or confirm one product for each offer above.");
lines.push(
  "3. Create a one-time USD price for each product with the exact amount above."
);
lines.push(
  "4. If using dashboard lookup keys for reporting, set each price lookup key exactly as listed."
);
lines.push("5. Create the webhook endpoint:");
lines.push("");
lines.push("```text");
lines.push("https://your-domain.example/api/stripe/webhook");
lines.push("```");
lines.push("");
lines.push("6. Subscribe the webhook endpoint to:");
lines.push("");
lines.push("```text");
lines.push("checkout.session.completed");
lines.push("```");
lines.push("");
lines.push(
  "7. Save only the webhook signing secret in the production host dashboard as `STRIPE_WEBHOOK_SECRET`."
);
lines.push(
  "8. Save the Stripe secret key in the production host dashboard as `STRIPE_SECRET_KEY`."
);
lines.push(
  "9. Keep `ENABLE_PAID_ENROLLMENT=false` until clinical review, database setup, email setup, webhook testing, smoke testing, and one internal live purchase are complete."
);
lines.push("");

lines.push("## Test Purchase Proof");
lines.push("");
lines.push("Run one test checkout for each app offer id:");
lines.push("");
offers.forEach(offer => {
  lines.push(
    `- \`${offer.offerId}\` should create ${offer.seatCount === null ? "one learner enrollment" : `one ${offer.seatCount}-seat practice pack`}.`
  );
});
lines.push("");
lines.push(
  "For each test, save only safe evidence: Checkout session ID, Stripe event ID, buyer email, offer id, webhook delivery status, and whether app access appeared."
);
lines.push("");
lines.push("Detailed guide: docs/launch/stripe-setup-guide.md");
lines.push("");

console.log(lines.join("\n"));
