#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const recommendedReportPath = "launch-evidence/host-dashboard-proof.md";

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function getArgValue(name, fallback = "") {
  const prefix = `--${name}=`;
  const match = process.argv.find(arg => arg.startsWith(prefix));
  return match ? match.slice(prefix.length).trim() : fallback;
}

function getReportPath() {
  const value =
    getArgValue("report-path") ||
    process.env.LAUNCH_DASHBOARD_PROOF_REPORT_PATH ||
    "";

  return value ? path.resolve(value) : "";
}

function isBlank(value) {
  return !value || value.trim().length === 0;
}

function isPlaceholder(value) {
  const normalizedValue = value.trim().toLowerCase();
  return (
    normalizedValue.includes("replace_with") ||
    normalizedValue.includes("your-") ||
    normalizedValue.includes("your_") ||
    normalizedValue.includes("example.com") ||
    normalizedValue.includes(".example") ||
    normalizedValue.includes("_replace_")
  );
}

function valueFor(variableName) {
  return process.env[variableName]?.trim() || "";
}

function present(variableName) {
  const value = valueFor(variableName);
  return !isBlank(value) && !isPlaceholder(value);
}

function isHttpsUrl(value) {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    return (
      url.protocol === "https:" &&
      hostname !== "localhost" &&
      hostname !== "127.0.0.1" &&
      hostname !== "::1" &&
      !hostname.endsWith(".example") &&
      hostname !== "example.com"
    );
  } catch {
    return false;
  }
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isTrue(value) {
  return value.toLowerCase() === "true";
}

function isFalse(value) {
  return value.toLowerCase() === "false";
}

function addCheck(checks, label, variableName, ok, detail) {
  checks.push({ label, variableName, ok, detail });
}

function renderStatus(ok) {
  return ok ? "ok" : "failed";
}

function renderCheck(check) {
  return `- ${check.label}: ${renderStatus(check.ok)} (${check.variableName}; ${check.detail})`;
}

function buildChecks({ paidMode }) {
  const checks = [];
  const publicAppUrl = valueFor("PUBLIC_APP_URL");
  const paidEnrollment = valueFor("ENABLE_PAID_ENROLLMENT");
  const clinicalApproved = valueFor("MODULE_ONE_CLINICAL_REVIEW_APPROVED");
  const stripeSecretKey = valueFor("STRIPE_SECRET_KEY");
  const paymentLinkVariables = [
    "PUBLIC_STRIPE_PAYMENT_LINK_FOUNDING_LEARNER",
    "PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_6_SEATS",
    "PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_15_SEATS",
  ];

  addCheck(
    checks,
    "Production URL is a real https URL",
    "PUBLIC_APP_URL",
    present("PUBLIC_APP_URL") && isHttpsUrl(publicAppUrl),
    "must be your Render or custom https URL"
  );
  addCheck(
    checks,
    "Stripe server key is present and shaped like a Stripe secret key",
    "STRIPE_SECRET_KEY",
    present("STRIPE_SECRET_KEY") &&
      /^sk_(test|live)_/.test(stripeSecretKey) &&
      (!paidMode || stripeSecretKey.startsWith("sk_live_")),
    paidMode
      ? "paid mode requires a live-mode Stripe key"
      : "closed-store mode accepts a test-mode or live-mode Stripe key"
  );
  addCheck(
    checks,
    "Stripe webhook secret is present",
    "STRIPE_WEBHOOK_SECRET",
    present("STRIPE_WEBHOOK_SECRET") &&
      valueFor("STRIPE_WEBHOOK_SECRET").startsWith("whsec_"),
    "must start with whsec_"
  );
  addCheck(
    checks,
    "Database URL is present and PostgreSQL-shaped",
    "DATABASE_URL",
    present("DATABASE_URL") &&
      /^postgres(ql)?:\/\//.test(valueFor("DATABASE_URL")),
    "must be postgres:// or postgresql://"
  );
  addCheck(
    checks,
    "Database SSL is enabled",
    "DATABASE_SSL",
    ["true", "1", "require"].includes(valueFor("DATABASE_SSL").toLowerCase()),
    "managed production databases usually require SSL"
  );
  addCheck(
    checks,
    "Session secret is long enough",
    "AUTH_SESSION_SECRET",
    present("AUTH_SESSION_SECRET") &&
      valueFor("AUTH_SESSION_SECRET").length >= 32,
    "at least 32 characters"
  );
  addCheck(
    checks,
    "Transactional email API URL is https",
    "TRANSACTIONAL_EMAIL_API_URL",
    present("TRANSACTIONAL_EMAIL_API_URL") &&
      isHttpsUrl(valueFor("TRANSACTIONAL_EMAIL_API_URL")),
    "Resend uses https://api.resend.com/emails"
  );
  addCheck(
    checks,
    "Transactional email API key is present",
    "TRANSACTIONAL_EMAIL_API_KEY",
    present("TRANSACTIONAL_EMAIL_API_KEY") &&
      valueFor("TRANSACTIONAL_EMAIL_API_KEY").length >= 16,
    "server-only email provider key"
  );
  addCheck(
    checks,
    "Sign-in sender email is shaped like an email address",
    "SIGN_IN_FROM_EMAIL",
    present("SIGN_IN_FROM_EMAIL") && isEmail(valueFor("SIGN_IN_FROM_EMAIL")),
    "must be a verified sender at the email provider"
  );
  addCheck(
    checks,
    "Practice seat admin token is long enough",
    "PRACTICE_SEAT_ADMIN_TOKEN",
    present("PRACTICE_SEAT_ADMIN_TOKEN") &&
      valueFor("PRACTICE_SEAT_ADMIN_TOKEN").length >= 32,
    "at least 32 characters"
  );
  addCheck(
    checks,
    "Alert admin token is long enough",
    "ALERT_ADMIN_TOKEN",
    present("ALERT_ADMIN_TOKEN") && valueFor("ALERT_ADMIN_TOKEN").length >= 32,
    "at least 32 characters"
  );

  for (const variableName of [
    "MODULE_ONE_CLINICAL_REVIEWER_NAME",
    "MODULE_ONE_CLINICAL_REVIEWER_ROLE",
    "MODULE_ONE_CLINICAL_REVIEW_DATE",
    "MODULE_ONE_CLINICAL_APPROVED_VERSION",
  ]) {
    addCheck(
      checks,
      "Clinical review signoff field is present",
      variableName,
      paidMode ? present(variableName) : true,
      paidMode
        ? "required before paid launch"
        : "not required during first closed deploy"
    );
  }

  addCheck(
    checks,
    "Clinical review approval switch matches the selected mode",
    "MODULE_ONE_CLINICAL_REVIEW_APPROVED",
    paidMode ? isTrue(clinicalApproved) : isFalse(clinicalApproved),
    paidMode
      ? "must be true for paid launch"
      : "should stay false for first closed deploy"
  );
  addCheck(
    checks,
    "Paid enrollment switch matches the selected mode",
    "ENABLE_PAID_ENROLLMENT",
    paidMode ? isTrue(paidEnrollment) : isFalse(paidEnrollment),
    paidMode
      ? "must be true only after all gates pass"
      : "should stay false for first closed deploy"
  );

  for (const variableName of paymentLinkVariables) {
    const value = valueFor(variableName);
    addCheck(
      checks,
      "Optional Stripe Payment Link is blank or public-link shaped",
      variableName,
      isBlank(value) || /^https:\/\/buy\.stripe\.com\//.test(value),
      "leave blank or use https://buy.stripe.com/..."
    );
  }

  return checks;
}

function renderReport({ checks, paidMode }) {
  const failedChecks = checks.filter(check => !check.ok);

  return [
    "# OptiTech Academy Host Dashboard Proof",
    "",
    `Mode: ${paidMode ? "paid-launch" : "closed-store"}`,
    "",
    "Simple translation: this checks whether the online host has the right controls filled in, without printing the private values.",
    "",
    `Checks passed: ${checks.length - failedChecks.length}/${checks.length}`,
    "",
    "## Results",
    "",
    ...checks.map(renderCheck),
    "",
    "## Next Step",
    "",
    paidMode
      ? "If every check is ok, run the final production smoke test, live purchase rehearsal, and first-buyer proof before broad outreach."
      : "If every check is ok, deploy or redeploy the closed store, run smoke tests against the live URL, then keep paid enrollment closed until clinical review, Stripe live mode, email, database, and one internal live purchase are proven.",
    "",
    "Do not paste real Stripe keys, webhook secrets, database passwords, email API keys, admin tokens, raw sign-in links, session cookies, card numbers, patient information, protected health information, private learner details, or private employee details into this report.",
    "",
  ].join("\n");
}

const paidMode =
  hasFlag("paid") ||
  process.env.LAUNCH_DASHBOARD_PROOF_MODE?.toLowerCase() === "paid";
const checks = buildChecks({ paidMode });
const report = renderReport({ checks, paidMode });
const reportPath = getReportPath();

console.log(report);

if (reportPath) {
  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(reportPath, report, "utf8");
  console.log(`Report written: ${reportPath}`);
} else {
  console.log(`Recommended report path: ${recommendedReportPath}`);
}

process.exitCode = checks.some(check => !check.ok) ? 1 : 0;
