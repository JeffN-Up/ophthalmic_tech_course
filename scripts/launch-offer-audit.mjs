#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();

const expectedOffers = [
  {
    id: "founding-learner",
    name: "Founding Learner Access",
    stripeLookupKey: "optitech_founding_learner_299",
    price: "$299",
    priceCents: 29900,
    accessMonths: 12,
    seatCount: null,
  },
  {
    id: "practice-six-seat-pack",
    name: "Six-Seat Practice Onboarding Pack",
    stripeLookupKey: "optitech_practice_6_seats_999",
    price: "$999",
    priceCents: 99900,
    accessMonths: 12,
    seatCount: 6,
  },
  {
    id: "practice-fifteen-seat-pack",
    name: "Fifteen-Seat Practice Onboarding Pack",
    stripeLookupKey: "optitech_practice_15_seats_1799",
    price: "$1,799",
    priceCents: 179900,
    accessMonths: 12,
    seatCount: 15,
  },
];

const files = {
  offers: "shared/commerce/offers.ts",
  buyerGuide: "shared/commerce/buyerDecisionGuide.ts",
  stripeScript: "scripts/launch-stripe-products.mjs",
  stripeGuide: "docs/launch/stripe-setup-guide.md",
  firstCustomersPacket: "docs/launch/first-customers-sales-packet.md",
};

function formatPass(value) {
  return value ? "ok" : "failed";
}

function findOfferChunk(source, offerId) {
  const index = source.indexOf(`id: "${offerId}"`);
  if (index === -1) return "";

  return source.slice(index, index + 900);
}

function findStripeHelperOfferChunk(source, offerId) {
  const index = source.indexOf(`offerId: "${offerId}"`);
  if (index === -1) return "";

  return source.slice(index, index + 700);
}

function hasSnippet(source, snippet) {
  return source.includes(snippet);
}

function addCheck(checks, label, ok, detail = "") {
  checks.push({ label, ok, detail });
}

function renderCheck(check) {
  return `- ${check.label}: ${formatPass(check.ok)}${
    check.detail ? ` (${check.detail})` : ""
  }`;
}

async function readProjectFile(relativePath) {
  return readFile(path.join(projectRoot, relativePath), "utf8");
}

const source = {
  offers: await readProjectFile(files.offers),
  buyerGuide: await readProjectFile(files.buyerGuide),
  stripeScript: await readProjectFile(files.stripeScript),
  stripeGuide: await readProjectFile(files.stripeGuide),
  firstCustomersPacket: await readProjectFile(files.firstCustomersPacket),
};

const checks = [];

for (const offer of expectedOffers) {
  const offerChunk = findOfferChunk(source.offers, offer.id);
  const stripeScriptChunk = findStripeHelperOfferChunk(
    source.stripeScript,
    offer.id
  );

  addCheck(
    checks,
    `${offer.id} exists in shared offers`,
    offerChunk.length > 0,
    files.offers
  );
  addCheck(
    checks,
    `${offer.id} has expected name`,
    hasSnippet(offerChunk, `name: "${offer.name}"`)
  );
  addCheck(
    checks,
    `${offer.id} has expected Stripe lookup key`,
    hasSnippet(offerChunk, `stripeLookupKey: "${offer.stripeLookupKey}"`)
  );
  addCheck(
    checks,
    `${offer.id} has expected price cents`,
    hasSnippet(offerChunk, `priceCents: ${offer.priceCents}`)
  );
  addCheck(
    checks,
    `${offer.id} has expected access length`,
    hasSnippet(offerChunk, `accessMonths: ${offer.accessMonths}`)
  );

  if (offer.seatCount !== null) {
    addCheck(
      checks,
      `${offer.id} has expected seat count`,
      hasSnippet(offerChunk, `seatCount: ${offer.seatCount}`)
    );
  }

  addCheck(
    checks,
    `${offer.id} appears in Stripe setup helper`,
    stripeScriptChunk.length > 0,
    files.stripeScript
  );
  addCheck(
    checks,
    `${offer.id} helper price matches shared offer`,
    hasSnippet(stripeScriptChunk, `price: "${offer.price}"`) &&
      hasSnippet(stripeScriptChunk, `priceCents: ${offer.priceCents}`)
  );
  addCheck(
    checks,
    `${offer.id} helper lookup key matches shared offer`,
    hasSnippet(stripeScriptChunk, `stripeLookupKey: "${offer.stripeLookupKey}"`)
  );
  addCheck(
    checks,
    `${offer.id} appears in Stripe guide`,
    hasSnippet(source.stripeGuide, `\`${offer.id}\``) &&
      hasSnippet(source.stripeGuide, `\`${offer.price}\``),
    files.stripeGuide
  );
  addCheck(
    checks,
    `${offer.id} appears in first-customer packet`,
    hasSnippet(source.firstCustomersPacket, offer.name) &&
      hasSnippet(source.firstCustomersPacket, `\`${offer.price}\``),
    files.firstCustomersPacket
  );
}

addCheck(
  checks,
  "Individual buyer guide shows founding learner price",
  hasSnippet(
    source.buyerGuide,
    "Founding Learner Access is $299 for 12 months."
  ),
  files.buyerGuide
);
addCheck(
  checks,
  "Practice buyer guide shows both practice pack prices",
  hasSnippet(source.buyerGuide, "six seats for $999") &&
    hasSnippet(source.buyerGuide, "fifteen seats for $1,799"),
  files.buyerGuide
);
addCheck(
  checks,
  "Stripe guide explains app-owned price data",
  hasSnippet(source.stripeGuide, "Because the app sends price data directly"),
  files.stripeGuide
);

const failedChecks = checks.filter(check => !check.ok);

const lines = [
  "# OptiTech Academy Offer Audit",
  "",
  "Simple translation: this checks that the prices on the shelf match the prices at the cash register.",
  "",
  `Offers checked: ${expectedOffers.length}`,
  `Checks passed: ${checks.length - failedChecks.length}/${checks.length}`,
  "",
  "## Results",
  "",
  ...checks.map(renderCheck),
  "",
];

if (failedChecks.length > 0) {
  lines.push("## Fix Before Launch");
  lines.push("");
  lines.push(
    "One or more offer, price, lookup-key, access-period, or seat-count references do not match."
  );
  lines.push(
    "Fix the mismatch before creating Stripe products, sharing checkout links, or accepting live buyers."
  );
  lines.push("");
}

lines.push(
  "Do not paste Stripe keys, webhook secrets, card numbers, raw sign-in links, session cookies, database passwords, patient information, protected health information, or private employee details into this report."
);
lines.push("");

console.log(lines.join("\n"));
process.exitCode = failedChecks.length > 0 ? 1 : 0;
