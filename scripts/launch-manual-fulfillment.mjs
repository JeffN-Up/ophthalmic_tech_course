#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const recommendedReportPath = "launch-evidence/manual-fulfillment-packet.md";
const supportedOffers = new Set([
  "founding-learner",
  "practice-six-seat-pack",
  "practice-fifteen-seat-pack",
]);

function getArgValue(name, fallback = "") {
  const prefix = `--${name}=`;
  const match = process.argv.find(arg => arg.startsWith(prefix));
  return match ? match.slice(prefix.length).trim() : fallback;
}

function getPositionalUrl() {
  return process.argv.find(
    arg => !arg.startsWith("--") && /^https?:\/\//i.test(arg)
  );
}

function normalizeBaseUrl(value) {
  const trimmedValue = value?.trim() || "";

  if (!trimmedValue) return "https://your-real-domain.example";

  try {
    const url = new URL(trimmedValue);
    url.pathname = url.pathname.replace(/\/+$/, "");
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return trimmedValue.replace(/\/+$/, "");
  }
}

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

function normalizeOfferId(value) {
  return supportedOffers.has(value) ? value : "";
}

function getReportPath() {
  const value =
    getArgValue("report-path") ||
    process.env.LAUNCH_MANUAL_FULFILLMENT_REPORT_PATH ||
    "";

  return value ? path.resolve(value) : "";
}

function jsonBody({ buyerEmail, offerId, paymentReference }) {
  return JSON.stringify(
    {
      buyerEmail: buyerEmail || "buyer@example.com",
      offerId: offerId || "founding-learner",
      paymentReference: paymentReference || "pi_or_payment_link_reference",
    },
    null,
    2
  );
}

function renderOfferList() {
  return Array.from(supportedOffers).map(offerId => `- \`${offerId}\``);
}

function renderPacket({ baseUrl, buyerEmail, offerId, paymentReference }) {
  const endpoint = `${baseUrl}/api/support/manual-payment-fulfillments`;
  const lookupUrl = `${baseUrl}/api/support/buyer-lookup?email=${encodeURIComponent(
    buyerEmail || "buyer@example.com"
  )}`;
  const body = jsonBody({ buyerEmail, offerId, paymentReference });

  return [
    "# OptiTech Academy Manual Fulfillment Packet",
    "",
    "Use this only after a controlled Stripe Payment Link buyer is marked paid in Stripe.",
    "",
    "Simple translation: this is the careful access button for a first buyer who paid through a manual Stripe Payment Link while automated checkout is still paused.",
    "",
    "This packet does not call the endpoint by itself. It gives you the exact protected request to run from a trusted shell or API client.",
    "",
    "Do not paste Stripe secret keys, webhook secrets, admin tokens, card numbers, raw sign-in links, session cookies, database passwords, patient information, protected health information, private learner details, or private employee details into this packet.",
    "",
    "## Case Labels",
    "",
    `- Production URL: ${baseUrl}`,
    `- Buyer email: ${buyerEmail || "[fill buyer email]"}`,
    `- Offer ID: ${offerId || "[fill offer id]"}`,
    `- Stripe payment reference: ${paymentReference || "[fill Stripe payment or Payment Link reference]"}`,
    "",
    "Supported offer IDs:",
    "",
    ...renderOfferList(),
    "",
    "## Before Running",
    "",
    "- [ ] Stripe shows the payment as paid.",
    "- [ ] The buyer email matches the email you will grant access to.",
    "- [ ] The amount and offer match the public offer.",
    "- [ ] This is a small approved manual Payment Link sale, not broad public launch.",
    "- [ ] `ENABLE_PAID_ENROLLMENT=false` may remain closed for this controlled path.",
    "- [ ] You have the private practice-seat admin token available only in the trusted shell or API client.",
    "",
    "## Protected Endpoint",
    "",
    "```text",
    `POST ${endpoint}`,
    "Header: x-admin-token: [paste only in the request tool, never in this file]",
    "```",
    "",
    "## Request Body",
    "",
    "```json",
    body,
    "```",
    "",
    "## PowerShell Request Shape",
    "",
    "```powershell",
    `$env:LAUNCH_BASE_URL="${baseUrl}"`,
    '$env:PRACTICE_SEAT_ADMIN_TOKEN="[paste only in this trusted shell]"',
    "",
    "Invoke-RestMethod `",
    "  -Method Post `",
    `  -Uri "${endpoint}" \``,
    '  -Headers @{ "x-admin-token" = $env:PRACTICE_SEAT_ADMIN_TOKEN } `',
    '  -ContentType "application/json" `',
    `  -Body '${body.replace(/\r?\n/g, "")}'`,
    "```",
    "",
    "## Bash Request Shape",
    "",
    "```bash",
    'export PRACTICE_SEAT_ADMIN_TOKEN="[paste only in this trusted shell]"',
    `curl -sS -X POST "${endpoint}" \\`,
    '  -H "content-type: application/json" \\',
    '  -H "x-admin-token: $PRACTICE_SEAT_ADMIN_TOKEN" \\',
    `  --data '${body.replace(/\r?\n/g, "")}'`,
    "```",
    "",
    "## After Running",
    "",
    "- [ ] Save the endpoint status: created or already existed.",
    "- [ ] Run protected buyer lookup and confirm the purchase plus access or seat pack.",
    "- [ ] Run `pnpm launch:fulfillment` and complete the first-buyer checklist.",
    "- [ ] Ask the buyer to request a passwordless sign-in link using the same email.",
    "- [ ] Confirm Module 1 opens for an individual learner or the practice seat pack appears for a practice buyer.",
    "",
    "Protected buyer lookup:",
    "",
    "```text",
    `GET ${lookupUrl}`,
    "Header: x-admin-token: [paste only in the request tool, never in this file]",
    "```",
    "",
    "## Stop Rules",
    "",
    "- Stop if Stripe does not show paid.",
    "- Stop if the buyer email or amount does not match.",
    "- Stop if the offer ID is not supported.",
    "- Stop if buyer lookup does not show the expected access after fulfillment.",
    "- Stop if more than one buyer needs this manual path before automated checkout is fixed.",
    "",
    "Related commands:",
    "",
    "```bash",
    `LAUNCH_BUYER_EMAIL=${buyerEmail || "buyer@example.com"} LAUNCH_FIRST_BUYER_PROOF_REPORT_PATH=launch-evidence/first-buyer-proof.md pnpm launch:first-buyer-proof ${baseUrl}`,
    "pnpm launch:fulfillment",
    "pnpm launch:sales-tracker",
    "pnpm launch:emergency-stop",
    "```",
    "",
  ].join("\n");
}

async function main() {
  const baseUrl = normalizeBaseUrl(
    getArgValue("base-url") ||
      getPositionalUrl() ||
      process.env.LAUNCH_BASE_URL ||
      process.env.PUBLIC_APP_URL ||
      ""
  );
  const buyerEmail = normalizeEmail(
    getArgValue("email") || process.env.LAUNCH_BUYER_EMAIL || ""
  );
  const offerId = normalizeOfferId(
    getArgValue("offer") || process.env.LAUNCH_MANUAL_FULFILLMENT_OFFER || ""
  );
  const paymentReference =
    getArgValue("payment-reference") ||
    process.env.LAUNCH_MANUAL_FULFILLMENT_PAYMENT_REFERENCE ||
    "";
  const reportPath = getReportPath();
  const packet = renderPacket({
    baseUrl,
    buyerEmail,
    offerId,
    paymentReference,
  });

  console.log(packet);

  if (reportPath) {
    await mkdir(path.dirname(reportPath), { recursive: true });
    await writeFile(reportPath, packet, "utf8");
    console.log(`Report written: ${reportPath}`);
  } else {
    console.log(`Recommended report path: ${recommendedReportPath}`);
  }

  if (!buyerEmail || !offerId || !paymentReference) {
    process.exitCode = 1;
  }
}

main().catch(error => {
  console.error(
    error instanceof Error
      ? error.message
      : "Manual fulfillment packet could not be created."
  );
  process.exitCode = 1;
});
