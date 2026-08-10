#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const allowedOfferIds = new Set([
  "founding-learner",
  "practice-six-seat-pack",
  "practice-fifteen-seat-pack",
]);
const recommendedReportPath =
  "launch-evidence/checkout-session-smoke-report.md";

function getArgValue(name, fallback = "") {
  const prefix = `--${name}=`;
  const match = process.argv.find(arg => arg.startsWith(prefix));
  return match ? match.slice(prefix.length).trim() : fallback;
}

function getPositionalUrl() {
  return process.argv.slice(2).find(arg => !arg.startsWith("--")) ?? "";
}

function normalizeBaseUrl(value) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    throw new Error(
      "Set LAUNCH_BASE_URL or PUBLIC_APP_URL to the deployed https site."
    );
  }

  let url;
  try {
    url = new URL(trimmedValue);
  } catch {
    throw new Error(
      "Use a full deployed URL like https://your-domain.example."
    );
  }

  const hostname = url.hostname.toLowerCase();
  const isLocalTestHost =
    hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

  if (url.protocol !== "https:" && !isLocalTestHost) {
    throw new Error(
      "Use an https deployed URL. Localhost is allowed only for command testing."
    );
  }

  url.pathname = url.pathname.replace(/\/+$/, "");
  url.search = "";
  url.hash = "";

  return url.toString().replace(/\/$/, "");
}

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

function parseCheckoutUrl(value) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return { returned: false, stripeHosted: false, host: "none" };
  }

  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();

    return {
      returned: true,
      stripeHosted:
        url.protocol === "https:" &&
        (host === "checkout.stripe.com" || host.endsWith(".stripe.com")),
      host,
    };
  } catch {
    return { returned: true, stripeHosted: false, host: "unparseable" };
  }
}

function renderReport({
  baseUrl,
  email,
  offerId,
  status,
  payload,
  ok,
  checkoutUrlStatus,
  generatedAt,
}) {
  return [
    "# OptiTech Academy Checkout Session Smoke Test",
    "",
    `Generated at: ${generatedAt}`,
    `Production URL: ${baseUrl}`,
    `Test email: ${email}`,
    `Offer id: ${offerId}`,
    "",
    "Simple translation: this asks the deployed app to open the Stripe cash-register door. It proves whether the app can create a Stripe Checkout session, but it does not save the private checkout URL.",
    "",
    "## Result",
    "",
    `- Request accepted: ${ok ? "yes" : "no"}`,
    `- HTTP status: ${status}`,
    `- Stripe checkout URL returned: ${checkoutUrlStatus.returned ? "yes" : "no"}`,
    `- Returned URL host: ${checkoutUrlStatus.host}`,
    `- Returned URL is Stripe-hosted: ${checkoutUrlStatus.stripeHosted ? "yes" : "no"}`,
    `- Public error: ${typeof payload?.error === "string" ? payload.error : "none"}`,
    "",
    "## Manual Checkout Checks",
    "",
    "- [ ] Do not share or save the raw Checkout URL from this smoke test.",
    "- [ ] If the app returned a Stripe URL, open a fresh checkout from the public page for the real test.",
    "- [ ] Confirm Stripe shows the expected offer and price.",
    "- [ ] Confirm success and cancel return URLs use the deployed production domain.",
    "- [ ] Keep paid links private until readiness is green and one internal live purchase passes.",
    "",
    "Do not paste checkout URLs, card numbers, Stripe secret keys, webhook secrets, raw sign-in links, tokens, cookies, database passwords, patient information, protected health information, or private learner details into this report.",
    "",
  ].join("\n");
}

async function main() {
  const rawBaseUrl =
    getArgValue("url") ||
    getPositionalUrl() ||
    process.env.LAUNCH_BASE_URL ||
    process.env.PUBLIC_APP_URL ||
    "";
  const email = normalizeEmail(
    getArgValue("email") || process.env.LAUNCH_TEST_EMAIL || ""
  );
  const offerId =
    getArgValue("offer") ||
    process.env.LAUNCH_CHECKOUT_OFFER_ID ||
    "founding-learner";

  if (!email || !email.includes("@")) {
    throw new Error(
      `Set LAUNCH_TEST_EMAIL or pass --email=internal.test@example.com. To save proof, set LAUNCH_CHECKOUT_SMOKE_REPORT_PATH=${recommendedReportPath}.`
    );
  }

  if (!allowedOfferIds.has(offerId)) {
    throw new Error(
      `Unknown offer id. Use one of: ${Array.from(allowedOfferIds).join(", ")}.`
    );
  }

  const baseUrl = normalizeBaseUrl(rawBaseUrl);
  const generatedAt = new Date().toISOString();
  const response = await fetch(`${baseUrl}/api/checkout/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: baseUrl,
    },
    body: JSON.stringify({ email, offerId, acceptedTerms: true }),
  });
  const payload = await response.json().catch(() => ({}));
  const checkoutUrlStatus = parseCheckoutUrl(payload?.url);
  const report = renderReport({
    baseUrl,
    email,
    offerId,
    status: response.status,
    payload,
    ok: response.ok && checkoutUrlStatus.stripeHosted,
    checkoutUrlStatus,
    generatedAt,
  });

  console.log(report);

  if (process.env.LAUNCH_CHECKOUT_SMOKE_REPORT_PATH) {
    const reportPath = path.resolve(
      process.env.LAUNCH_CHECKOUT_SMOKE_REPORT_PATH
    );
    await mkdir(path.dirname(reportPath), { recursive: true });
    await writeFile(reportPath, report, "utf8");
    console.log(`Report written: ${reportPath}`);
  }

  process.exitCode = response.ok && checkoutUrlStatus.stripeHosted ? 0 : 1;
}

main().catch(error => {
  console.error(
    error instanceof Error
      ? error.message
      : "Checkout session smoke test failed."
  );
  process.exitCode = 1;
});
