#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

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

  url.pathname = url.pathname.replace(/\/+$/, "");
  url.search = "";
  url.hash = "";

  return url.toString().replace(/\/$/, "");
}

function getOutputDir() {
  return path.resolve(process.env.LAUNCH_EVIDENCE_DIR || "launch-evidence");
}

function boolLabel(value) {
  return value === true ? "yes" : "no";
}

function list(items, emptyText) {
  if (!Array.isArray(items) || items.length === 0) return [`- ${emptyText}`];
  return items.map(item => `- ${item}`);
}

function getBuyerCheckoutState(checkoutAvailability) {
  if (!checkoutAvailability) {
    return {
      title: "Checkout availability not captured",
      action: "rerun-snapshot",
      message:
        "The readiness snapshot could not include the buyer checkout endpoint.",
      manualPaymentLinks: {},
    };
  }

  return {
    title: checkoutAvailability.title ?? "Unknown checkout state",
    action: checkoutAvailability.primaryAction ?? "unknown",
    message: checkoutAvailability.message ?? "No checkout message returned.",
    manualPaymentLinks: checkoutAvailability.manualPaymentLinks ?? {},
  };
}

function getConfiguredManualPaymentLinkLabels(manualPaymentLinks) {
  return [
    manualPaymentLinks.foundingLearner ? "Founding learner" : "",
    manualPaymentLinks.practiceSixSeatPack ? "Practice 6-seat pack" : "",
    manualPaymentLinks.practiceFifteenSeatPack ? "Practice 15-seat pack" : "",
  ].filter(Boolean);
}

function getShareDecision({ snapshot, checkoutAvailability }) {
  const checkoutState = getBuyerCheckoutState(checkoutAvailability);
  const manualPaymentLinkLabels = getConfiguredManualPaymentLinkLabels(
    checkoutState.manualPaymentLinks
  );

  if (snapshot?.readyForPaidLaunch === true) {
    return {
      publicPreview: "share after smoke test passes",
      learnerInterest: "share",
      practiceInquiry: "share",
      paidCheckout: "hold until one internal live purchase passes",
      manualPaymentLinks:
        manualPaymentLinkLabels.length > 0
          ? `configured for ${manualPaymentLinkLabels.join(", ")}`
          : "not needed for automated checkout",
      nextCommands: [
        "LAUNCH_BASE_URL=<your-url> pnpm launch:smoke",
        "pnpm launch:live-purchase-test -- --email=internal.test@example.com <your-url>",
        "pnpm launch:first-week-sales",
      ],
    };
  }

  if (checkoutState.action === "use-manual-payment-link") {
    return {
      publicPreview: "share after smoke test passes",
      learnerInterest: "share carefully",
      practiceInquiry: "share carefully",
      paidCheckout: "do not share automated checkout",
      manualPaymentLinks:
        manualPaymentLinkLabels.length > 0
          ? `controlled first-buyer only: ${manualPaymentLinkLabels.join(", ")}`
          : "buyer endpoint reported manual links, but labels were not found",
      nextCommands: [
        "pnpm launch:manual-payment-links",
        "pnpm launch:fulfillment",
        "pnpm launch:sales-tracker",
      ],
    };
  }

  return {
    publicPreview: "share only after smoke test passes",
    learnerInterest: "share interest-list path only",
    practiceInquiry: "share inquiry path only",
    paidCheckout: "do not share",
    manualPaymentLinks: "not configured",
    nextCommands: [
      "LAUNCH_SMOKE_ALLOW_NOT_READY=true LAUNCH_BASE_URL=<your-url> pnpm launch:smoke",
      "pnpm launch:blockers",
      "pnpm launch:env-checklist",
    ],
  };
}

function getBlockers(snapshot) {
  const staticBlockers = snapshot?.staticSummary?.blockers;
  if (Array.isArray(staticBlockers) && staticBlockers.length > 0) {
    return staticBlockers;
  }

  const launchActions = snapshot?.launchActions;
  if (Array.isArray(launchActions)) {
    return launchActions
      .filter(action => action?.status !== "complete")
      .map(action => action?.title)
      .filter(Boolean);
  }

  return [];
}

function renderSummary({
  baseUrl,
  snapshot,
  checkoutAvailability,
  generatedAt,
}) {
  const blockers = getBlockers(snapshot);
  const warnings = Array.isArray(snapshot?.warnings) ? snapshot.warnings : [];
  const checkoutState = getBuyerCheckoutState(checkoutAvailability);
  const shareDecision = getShareDecision({ snapshot, checkoutAvailability });
  const nextSetupSteps = Array.isArray(snapshot?.nextSetupSteps)
    ? snapshot.nextSetupSteps.map(
        step =>
          `${step.title}: ${step.detail}${step.command ? ` Command: ${step.command}` : ""}`
      )
    : [];

  return [
    "# OptiTech Academy Runtime Readiness Snapshot",
    "",
    `Generated at: ${generatedAt}`,
    `Production URL: ${baseUrl}`,
    "",
    "Simple translation: this is the launch scoreboard saved from the deployed app. If paid launch says no, keep paid checkout closed.",
    "",
    "## Decision",
    "",
    `- Ready for paid launch: ${boolLabel(snapshot?.readyForPaidLaunch)}`,
    `- Individual learner sales ready: ${boolLabel(snapshot?.salesChannels?.individualLearner?.ready)}`,
    `- Practice pack sales ready: ${boolLabel(snapshot?.salesChannels?.practicePacks?.ready)}`,
    `- Buyer checkout state: ${checkoutState.title}`,
    `- Buyer checkout action: ${checkoutState.action}`,
    "",
    "## Link-Sharing Traffic Light",
    "",
    `- Public preview links: ${shareDecision.publicPreview}`,
    `- Individual learner interest path: ${shareDecision.learnerInterest}`,
    `- Practice inquiry path: ${shareDecision.practiceInquiry}`,
    `- Paid checkout links: ${shareDecision.paidCheckout}`,
    `- Manual Stripe payment links: ${shareDecision.manualPaymentLinks}`,
    "",
    checkoutState.message,
    "",
    "## Next Commands",
    "",
    ...shareDecision.nextCommands.map(command => `- \`${command}\``),
    "",
    "## Setup Status",
    "",
    `- Stripe checkout configured: ${boolLabel(snapshot?.commerce?.checkoutConfigured)}`,
    `- Stripe webhook configured: ${boolLabel(snapshot?.commerce?.webhookConfigured)}`,
    `- Stripe key mode: ${snapshot?.commerce?.stripeSecretKeyMode ?? "unknown"}`,
    `- Paid enrollment enabled: ${boolLabel(snapshot?.commerce?.paidEnrollmentEnabled)}`,
    `- Passwordless email configured: ${boolLabel(snapshot?.auth?.passwordlessConfigured)}`,
    `- Database configured: ${boolLabel(snapshot?.database?.databaseConfigured)}`,
    `- Database schema verified: ${boolLabel(snapshot?.databaseReadiness?.schemaVerified)}`,
    `- Clinical review approved: ${boolLabel(snapshot?.clinicalReview?.moduleOneReviewApproved)}`,
    `- Practice-seat admin protected: ${boolLabel(snapshot?.practiceSeatAdmin?.practiceSeatAdminConfigured)}`,
    `- Alert admin protected: ${boolLabel(snapshot?.alertAdmin?.alertAdminConfigured)}`,
    "",
    "## Blockers",
    "",
    ...list(blockers, "No blockers reported."),
    "",
    "## Warnings",
    "",
    ...list(warnings, "No warnings reported."),
    "",
    "## Next Setup Steps",
    "",
    ...list(nextSetupSteps, "No next setup steps reported."),
    "",
    "Do not paste secrets, tokens, cookies, card numbers, raw sign-in links, patient information, protected health information, or private employee details into this report.",
    "",
  ].join("\n");
}

async function fetchJson(url, label) {
  const response = await fetch(url);
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`${label} returned HTTP ${response.status}.`);
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${label} did not return valid JSON.`);
  }
}

async function fetchReadiness(baseUrl) {
  return fetchJson(
    `${baseUrl}/api/launch/readiness`,
    `${baseUrl}/api/launch/readiness`
  );
}

async function fetchCheckoutAvailability(baseUrl) {
  return fetchJson(
    `${baseUrl}/api/checkout/availability`,
    `${baseUrl}/api/checkout/availability`
  );
}

async function main() {
  const rawBaseUrl =
    process.argv[2] ||
    process.env.LAUNCH_BASE_URL ||
    process.env.PUBLIC_APP_URL ||
    "";
  const baseUrl = normalizeBaseUrl(rawBaseUrl);
  const outputDir = getOutputDir();
  const generatedAt = new Date().toISOString();
  const snapshot = await fetchReadiness(baseUrl);
  const checkoutAvailability = await fetchCheckoutAvailability(baseUrl);
  const jsonPath = path.join(outputDir, "runtime-readiness-snapshot.json");
  const checkoutPath = path.join(outputDir, "checkout-availability.json");
  const summaryPath = path.join(outputDir, "runtime-readiness-summary.md");

  await mkdir(outputDir, { recursive: true });
  await writeFile(jsonPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  await writeFile(
    checkoutPath,
    `${JSON.stringify(checkoutAvailability, null, 2)}\n`,
    "utf8"
  );
  await writeFile(
    summaryPath,
    renderSummary({ baseUrl, snapshot, checkoutAvailability, generatedAt }),
    "utf8"
  );

  console.log("# OptiTech Academy Readiness Snapshot");
  console.log("");
  console.log(`Production URL: ${baseUrl}`);
  console.log(`JSON saved: ${jsonPath}`);
  console.log(`Checkout availability saved: ${checkoutPath}`);
  console.log(`Summary saved: ${summaryPath}`);
  console.log(
    `Ready for paid launch: ${snapshot.readyForPaidLaunch === true ? "yes" : "no"}`
  );
  console.log(`Buyer checkout state: ${checkoutAvailability.title}`);
  console.log("");
  console.log(
    "Do not sell until readiness is green and one internal live purchase passes."
  );
}

main().catch(error => {
  console.error(
    error instanceof Error
      ? error.message
      : "Runtime readiness snapshot failed."
  );
  process.exitCode = 1;
});
