#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const publicPaths = [
  "/",
  "/first-sale",
  "/preview",
  "/buyer-guide",
  "/checkout",
  "/checkout?checkout=cancelled&offer=founding-learner",
  "/learn?checkout=success&offer=founding-learner",
  "/practice-packs",
  "/practice-packs?checkout=cancelled&offer=practice-six-seat-pack",
  "/practice-packs?checkout=success&offer=practice-six-seat-pack",
  "/policies",
  "/curriculum",
  "/onboarding",
  "/skills-passport",
  "/career-toolkit",
  "/certificate-preview",
];

const requiredSecurityHeaders = [
  ["X-Content-Type-Options", "nosniff"],
  ["X-Frame-Options", "DENY"],
  ["Referrer-Policy", "strict-origin-when-cross-origin"],
  [
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(self)",
  ],
  ["Cross-Origin-Opener-Policy", "same-origin"],
];

const requiredRobotsTxtRules = [
  "Allow: /",
  "Disallow: /api/",
  "Disallow: /admin",
  "Disallow: /send",
  "Disallow: /practice-seat-admin",
  "Disallow: /launch-readiness",
];

function trimBaseUrl(baseUrl) {
  return baseUrl.trim().replace(/\/+$/, "");
}

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${url} returned HTTP ${response.status}.`);
  }

  return response.json();
}

function normalizeCommit(value) {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue.toLowerCase() : undefined;
}

function getReleaseResult({ health, expectedCommit }) {
  const normalizedExpectedCommit = normalizeCommit(expectedCommit);
  const normalizedActualCommit = normalizeCommit(health?.release?.commit);

  if (!normalizedExpectedCommit) {
    return {
      ...(health?.release ?? {}),
      status: "not-checked",
    };
  }

  const commitMatchesExpected = Boolean(
    normalizedActualCommit &&
      (normalizedExpectedCommit.startsWith(normalizedActualCommit) ||
        normalizedActualCommit.startsWith(normalizedExpectedCommit))
  );

  return {
    ...(health?.release ?? {}),
    expectedCommit: normalizedExpectedCommit,
    commitMatchesExpected,
    status: commitMatchesExpected ? "matched" : "mismatched",
  };
}

async function fetchPublicPage(baseUrl, pagePath) {
  const response = await fetch(`${baseUrl}${pagePath}`);

  return {
    path: pagePath,
    ok: response.ok,
    status: response.status,
  };
}

async function checkSecurityHeaders(baseUrl) {
  const response = await fetch(`${baseUrl}/`);

  return requiredSecurityHeaders.map(([header, expected]) => {
    const actual = response.headers.get(header);

    return {
      header,
      ok: actual === expected,
      actual,
      expected,
    };
  });
}

async function checkRobotsTxt(baseUrl) {
  const response = await fetch(`${baseUrl}/robots.txt`);
  const text = await response.text().catch(() => "");
  const requiredRules = requiredRobotsTxtRules.map(rule => ({
    rule,
    ok: text.includes(rule),
  }));

  return {
    ok: response.ok && requiredRules.every(rule => rule.ok),
    status: response.status,
    requiredRules,
  };
}

async function submitPracticeInquiry(baseUrl) {
  const response = await fetch(`${baseUrl}/api/practice-inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      practiceName: "OptiTech Smoke Test Practice",
      contactName: "Launch Smoke Test",
      contactEmail: "launch-smoke@example.com",
      estimatedLearnerCount: 16,
      targetTimeline: "Deployment smoke test",
      message:
        "Safe deployment smoke test inquiry. No patient information, card data, secrets, or private employee details.",
    }),
  });
  const payload = await response.json().catch(() => ({}));
  const inquiryId = payload?.inquiry?.inquiryId;

  return {
    tested: true,
    ok: response.ok && Boolean(inquiryId),
    status: response.status,
    ...(inquiryId ? { inquiryId } : {}),
    notificationSent: Boolean(payload?.notification?.sent),
  };
}

async function submitLearnerInterest(baseUrl) {
  const response = await fetch(`${baseUrl}/api/learner-interests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      learnerName: "Launch Smoke Test Learner",
      email: "launch-smoke-learner@example.com",
      background: "career-changer",
      goal: "Safe deployment smoke test learner interest. No patient information, card data, secrets, private employer details, or private learner history.",
    }),
  });
  const payload = await response.json().catch(() => ({}));
  const interestId = payload?.interest?.interestId;

  return {
    tested: true,
    ok: response.ok && Boolean(interestId),
    status: response.status,
    ...(interestId ? { interestId } : {}),
    notificationSent: Boolean(payload?.notification?.sent),
  };
}

export async function runSmokeTest({
  baseUrl,
  expectedCommit,
  testPracticeInquiry,
  testLearnerInterest,
}) {
  const normalizedBaseUrl = trimBaseUrl(baseUrl);

  if (!normalizedBaseUrl) {
    throw new Error("A deployed base URL is required.");
  }

  const health = await fetchJson(`${normalizedBaseUrl}/api/health`);
  const readiness = await fetchJson(
    `${normalizedBaseUrl}/api/launch/readiness`
  );
  let checkoutAvailabilityOk = false;

  try {
    const checkoutAvailability = await fetchJson(
      `${normalizedBaseUrl}/api/checkout/availability`
    );
    checkoutAvailabilityOk = typeof checkoutAvailability.ready === "boolean";
  } catch {
    checkoutAvailabilityOk = false;
  }

  const publicPages = await Promise.all(
    publicPaths.map(pagePath => fetchPublicPage(normalizedBaseUrl, pagePath))
  );
  const securityHeaders = await checkSecurityHeaders(normalizedBaseUrl);
  const robotsTxt = await checkRobotsTxt(normalizedBaseUrl);
  const practiceInquiry = testPracticeInquiry
    ? await submitPracticeInquiry(normalizedBaseUrl)
    : {
        tested: false,
        ok: false,
        skippedReason:
          "Set LAUNCH_SMOKE_TEST_PRACTICE_INQUIRY=true to submit a safe test inquiry.",
      };
  const learnerInterest = testLearnerInterest
    ? await submitLearnerInterest(normalizedBaseUrl)
    : {
        tested: false,
        ok: false,
        skippedReason:
          "Set LAUNCH_SMOKE_TEST_LEARNER_INTEREST=true to submit a safe test learner interest.",
      };

  return {
    baseUrl: normalizedBaseUrl,
    healthOk: health.ok === true,
    release: getReleaseResult({ health, expectedCommit }),
    publicPagesOk: publicPages.every(page => page.ok),
    checkoutAvailabilityOk,
    securityHeadersOk: securityHeaders.every(header => header.ok),
    securityHeaders,
    robotsTxtOk: robotsTxt.ok,
    robotsTxt,
    publicPages,
    practiceInquiry,
    learnerInterest,
    readyForPaidLaunch: readiness.readyForPaidLaunch === true,
    generatedAt: new Date().toISOString(),
    blockers: readiness?.staticSummary?.blockers ?? [],
    warnings: readiness?.warnings ?? [],
    launchActions: readiness?.launchActions ?? [],
  };
}

export function getExitCode(report, { allowNotReady }) {
  if (
    !report.healthOk ||
    report.release?.status === "mismatched" ||
    !report.publicPagesOk ||
    !report.checkoutAvailabilityOk ||
    !report.securityHeadersOk ||
    !report.robotsTxtOk
  ) {
    return 1;
  }
  if (report.practiceInquiry.tested && !report.practiceInquiry.ok) return 1;
  if (report.learnerInterest.tested && !report.learnerInterest.ok) return 1;
  if (!allowNotReady && !report.readyForPaidLaunch) return 1;

  return 0;
}

function renderList(items, emptyText) {
  if (!items || items.length === 0) return [`- ${emptyText}`];
  return items.map(item => `- ${item}`);
}

export function renderReport(report) {
  return [
    "# OptiTech Academy Deployment Smoke Test",
    "",
    `Generated at: ${report.generatedAt}`,
    "",
    `Deployment URL: ${report.baseUrl}`,
    "",
    "## Result",
    "",
    `- Health endpoint: ${report.healthOk ? "ok" : "failed"}`,
    `- Deployed commit: ${
      report.release?.commit ? report.release.commit : "not reported by host"
    }`,
    `- Expected commit check: ${
      report.release?.status === "matched"
        ? "ok"
        : report.release?.status === "mismatched"
          ? "failed"
          : "not checked"
    }`,
    `- Public buyer pages: ${report.publicPagesOk ? "ok" : "failed"}`,
    `- Checkout availability endpoint: ${
      report.checkoutAvailabilityOk ? "ok" : "failed"
    }`,
    `- Security headers: ${report.securityHeadersOk ? "ok" : "failed"}`,
    `- Robots.txt rules: ${report.robotsTxtOk ? "ok" : "failed"}`,
    `- Practice inquiry capture: ${
      report.practiceInquiry.tested
        ? report.practiceInquiry.ok
          ? "ok"
          : "failed"
        : "not tested"
    }`,
    `- Learner interest capture: ${
      report.learnerInterest.tested
        ? report.learnerInterest.ok
          ? "ok"
          : "failed"
        : "not tested"
    }`,
    `- Paid launch readiness: ${
      report.readyForPaidLaunch ? "ready" : "not ready"
    }`,
    "",
    "## Release Fingerprint",
    "",
    `- Host: ${report.release?.host ?? "not reported"}`,
    `- Branch: ${report.release?.branch ?? "not reported"}`,
    `- Commit: ${report.release?.commit ?? "not reported"}`,
    `- Expected commit: ${report.release?.expectedCommit ?? "not checked"}`,
    `- Commit matches expected: ${
      report.release?.commitMatchesExpected === undefined
        ? "not checked"
        : report.release.commitMatchesExpected
          ? "yes"
          : "no"
    }`,
    `- Service name: ${report.release?.serviceName ?? "not reported"}`,
    `- Host URL: ${report.release?.url ?? "not reported"}`,
    "",
    "## Public Page Checks",
    "",
    ...report.publicPages.map(
      page =>
        `- ${page.path}: ${page.ok ? "ok" : "failed"} (HTTP ${page.status})`
    ),
    "",
    "## Security Header Checks",
    "",
    ...report.securityHeaders.map(
      header =>
        `- ${header.header}: ${
          header.ok
            ? "ok"
            : `failed (expected ${header.expected}, got ${header.actual ?? "missing"})`
        }`
    ),
    "",
    "## Robots.txt Checks",
    "",
    `- /robots.txt: ${report.robotsTxt.ok ? "ok" : "failed"} (HTTP ${report.robotsTxt.status})`,
    ...report.robotsTxt.requiredRules.map(
      rule => `- ${rule.rule}: ${rule.ok ? "ok" : "missing"}`
    ),
    "",
    "## Practice Inquiry Check",
    "",
    report.practiceInquiry.tested
      ? `- Test inquiry: ${
          report.practiceInquiry.ok ? "ok" : "failed"
        } (HTTP ${report.practiceInquiry.status ?? "unknown"})`
      : `- Test inquiry: not tested. ${report.practiceInquiry.skippedReason}`,
    ...(report.practiceInquiry.inquiryId
      ? [`- Inquiry ID: ${report.practiceInquiry.inquiryId}`]
      : []),
    `- Notification email: ${
      report.practiceInquiry.notificationSent ? "sent" : "not confirmed"
    }`,
    "",
    "## Learner Interest Check",
    "",
    report.learnerInterest.tested
      ? `- Test learner interest: ${
          report.learnerInterest.ok ? "ok" : "failed"
        } (HTTP ${report.learnerInterest.status ?? "unknown"})`
      : `- Test learner interest: not tested. ${report.learnerInterest.skippedReason}`,
    ...(report.learnerInterest.interestId
      ? [`- Interest ID: ${report.learnerInterest.interestId}`]
      : []),
    `- Notification email: ${
      report.learnerInterest.notificationSent ? "sent" : "not confirmed"
    }`,
    "",
    "## Blockers",
    "",
    ...renderList(report.blockers, "No launch blockers reported."),
    "",
    "## Warnings",
    "",
    ...renderList(report.warnings, "No runtime warnings reported."),
    "",
    "## Next Launch Actions",
    "",
    ...renderList(
      report.launchActions.map(
        action =>
          `${action.title}: ${action.action} Evidence needed: ${action.evidenceNeeded}`
      ),
      "No remaining launch actions reported."
    ),
    "",
    "Do not paste secrets, tokens, cookies, card numbers, or database passwords into this report.",
    "",
  ].join("\n");
}

export function renderConsoleSummary({ report, allowNotReady }) {
  const lines = [
    `Deployment smoke test for ${report.baseUrl}`,
    `- Health: ${report.healthOk ? "ok" : "failed"}`,
    `- Deployed commit: ${report.release?.commit ?? "not reported"}`,
    `- Expected commit check: ${
      report.release?.status === "matched"
        ? "ok"
        : report.release?.status === "mismatched"
          ? "failed"
          : "not checked"
    }`,
    `- Public buyer pages: ${report.publicPagesOk ? "ok" : "failed"}`,
    `- Checkout availability: ${
      report.checkoutAvailabilityOk ? "ok" : "failed"
    }`,
    ...report.publicPages.map(
      page =>
        `  - ${page.path}: ${page.ok ? "ok" : "failed"} (HTTP ${page.status})`
    ),
    `- Security headers: ${report.securityHeadersOk ? "ok" : "failed"}`,
    ...report.securityHeaders.map(
      header =>
        `  - ${header.header}: ${
          header.ok
            ? "ok"
            : `failed (expected ${header.expected}, got ${header.actual ?? "missing"})`
        }`
    ),
    `- Robots.txt rules: ${report.robotsTxtOk ? "ok" : "failed"} (HTTP ${report.robotsTxt.status})`,
    ...report.robotsTxt.requiredRules.map(
      rule => `  - ${rule.rule}: ${rule.ok ? "ok" : "missing"}`
    ),
    `- Paid launch readiness: ${
      report.readyForPaidLaunch ? "ready" : "not ready"
    }`,
    `- Practice inquiry capture: ${
      report.practiceInquiry.tested
        ? report.practiceInquiry.ok
          ? "ok"
          : "failed"
        : "not tested"
    }`,
    `- Learner interest capture: ${
      report.learnerInterest.tested
        ? report.learnerInterest.ok
          ? "ok"
          : "failed"
        : "not tested"
    }`,
  ];

  if (report.practiceInquiry.inquiryId) {
    lines.push(`  - Inquiry ID: ${report.practiceInquiry.inquiryId}`);
  }

  if (report.learnerInterest.interestId) {
    lines.push(`  - Interest ID: ${report.learnerInterest.interestId}`);
  }

  if (allowNotReady && !report.readyForPaidLaunch) {
    lines.push(
      "- Not-ready launch status allowed for this pre-launch smoke run."
    );
  }

  if (report.blockers.length > 0) {
    lines.push(`- Blockers: ${report.blockers.join(", ")}`);
  }

  if (report.warnings.length > 0) {
    lines.push("- Warnings:");
    lines.push(...report.warnings.map(warning => `  - ${warning}`));
  }

  if (!report.readyForPaidLaunch && report.launchActions.length > 0) {
    lines.push("- Next launch actions:");
    lines.push(
      ...report.launchActions
        .slice(0, 3)
        .map(action => `  - ${action.title}: ${action.action}`)
    );
  }

  return lines.join("\n");
}

async function main() {
  const baseUrl =
    process.env.LAUNCH_BASE_URL || process.env.PUBLIC_APP_URL || "";
  const allowNotReady = process.env.LAUNCH_SMOKE_ALLOW_NOT_READY === "true";
  const expectedCommit = process.env.LAUNCH_EXPECTED_COMMIT || "";
  const testPracticeInquiry =
    process.env.LAUNCH_SMOKE_TEST_PRACTICE_INQUIRY === "true";
  const testLearnerInterest =
    process.env.LAUNCH_SMOKE_TEST_LEARNER_INTEREST === "true";
  const report = await runSmokeTest({
    baseUrl,
    expectedCommit,
    testPracticeInquiry,
    testLearnerInterest,
  });
  const renderedReport = renderReport(report);

  console.log(renderConsoleSummary({ report, allowNotReady }));

  if (process.env.LAUNCH_SMOKE_REPORT_PATH) {
    const reportPath = path.resolve(process.env.LAUNCH_SMOKE_REPORT_PATH);
    await mkdir(path.dirname(reportPath), { recursive: true });
    await writeFile(reportPath, renderedReport);
    console.log(`- Report written: ${reportPath}`);
  }

  process.exitCode = getExitCode(report, { allowNotReady });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    const message =
      error instanceof Error ? error.message : "Deployment smoke test failed.";
    console.error(message);
    process.exitCode = 1;
  });
}
