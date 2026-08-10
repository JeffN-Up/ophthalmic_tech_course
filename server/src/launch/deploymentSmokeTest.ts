import type { RuntimeLaunchReadinessReport } from "../config/runtimeReadiness";
import type { LaunchActionItem } from "../../../shared/launch/launchActionPlan";

export interface DeploymentSmokeTestReport {
  baseUrl: string;
  healthOk: boolean;
  release?: DeploymentSmokeReleaseResult;
  publicPagesOk: boolean;
  checkoutAvailabilityOk: boolean;
  securityHeadersOk: boolean;
  securityHeaders: DeploymentSmokeSecurityHeaderResult[];
  robotsTxtOk: boolean;
  robotsTxt: DeploymentSmokeRobotsTxtResult;
  publicPages: DeploymentSmokePublicPageResult[];
  practiceInquiry: DeploymentSmokePracticeInquiryResult;
  learnerInterest: DeploymentSmokeLearnerInterestResult;
  readyForPaidLaunch: boolean;
  generatedAt: string;
  blockers: string[];
  warnings: string[];
  launchActions: LaunchActionItem[];
}

export interface DeploymentSmokeTestInput {
  baseUrl: string;
  expectedCommit?: string;
  testPracticeInquiry?: boolean;
  testLearnerInterest?: boolean;
  fetcher?: typeof fetch;
  now?: () => string;
}

export interface DeploymentSmokePublicPageResult {
  path: string;
  ok: boolean;
  status: number;
}

export interface DeploymentSmokeReleaseResult {
  host?: string;
  branch?: string;
  commit?: string;
  serviceName?: string;
  url?: string;
  expectedCommit?: string;
  commitMatchesExpected?: boolean;
  status: "matched" | "mismatched" | "not-checked";
}

export interface DeploymentSmokeSecurityHeaderResult {
  header: string;
  ok: boolean;
  actual: string | null;
  expected: string;
}

export interface DeploymentSmokeRobotsTxtResult {
  ok: boolean;
  status: number;
  requiredRules: DeploymentSmokeRobotsTxtRuleResult[];
}

export interface DeploymentSmokeRobotsTxtRuleResult {
  rule: string;
  ok: boolean;
}

export interface DeploymentSmokePracticeInquiryResult {
  tested: boolean;
  ok: boolean;
  status?: number;
  inquiryId?: string;
  notificationSent?: boolean;
  skippedReason?: string;
}

export interface DeploymentSmokeLearnerInterestResult {
  tested: boolean;
  ok: boolean;
  status?: number;
  interestId?: string;
  notificationSent?: boolean;
  skippedReason?: string;
}

export interface DeploymentSmokeExitOptions {
  allowNotReady?: boolean;
}

interface HealthResponse {
  ok?: boolean;
  release?: {
    host?: string;
    branch?: string;
    commit?: string;
    serviceName?: string;
    url?: string;
  };
}

interface CheckoutAvailabilityResponse {
  ready?: unknown;
}

const requiredSecurityHeaders: Array<{ header: string; expected: string }> = [
  { header: "X-Content-Type-Options", expected: "nosniff" },
  { header: "X-Frame-Options", expected: "DENY" },
  { header: "Referrer-Policy", expected: "strict-origin-when-cross-origin" },
  {
    header: "Permissions-Policy",
    expected: "camera=(), microphone=(), geolocation=(), payment=(self)",
  },
  { header: "Cross-Origin-Opener-Policy", expected: "same-origin" },
];

const requiredRobotsTxtRules = [
  "Allow: /",
  "Disallow: /api/",
  "Disallow: /admin",
  "Disallow: /send",
  "Disallow: /practice-seat-admin",
  "Disallow: /launch-readiness",
] as const;

export const deploymentSmokePublicPaths = [
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
] as const;

function trimBaseUrl(baseUrl: string): string {
  return baseUrl.trim().replace(/\/+$/, "");
}

function normalizeCommit(value: string | undefined): string | undefined {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue.toLowerCase() : undefined;
}

function getReleaseResult({
  health,
  expectedCommit,
}: {
  health: HealthResponse;
  expectedCommit?: string;
}): DeploymentSmokeReleaseResult {
  const normalizedExpectedCommit = normalizeCommit(expectedCommit);
  const normalizedActualCommit = normalizeCommit(health.release?.commit);

  if (!normalizedExpectedCommit) {
    return {
      ...health.release,
      status: "not-checked",
    };
  }

  const commitMatchesExpected = Boolean(
    normalizedActualCommit &&
      (normalizedExpectedCommit.startsWith(normalizedActualCommit) ||
        normalizedActualCommit.startsWith(normalizedExpectedCommit))
  );

  return {
    ...health.release,
    expectedCommit: normalizedExpectedCommit,
    commitMatchesExpected,
    status: commitMatchesExpected ? "matched" : "mismatched",
  };
}

async function fetchJson<T>({
  fetcher,
  url,
}: {
  fetcher: typeof fetch;
  url: string;
}): Promise<T> {
  const response = await fetcher(url);

  if (!response.ok) {
    throw new Error(`${url} returned HTTP ${response.status}.`);
  }

  return (await response.json()) as T;
}

async function fetchPublicPage({
  fetcher,
  baseUrl,
  path,
}: {
  fetcher: typeof fetch;
  baseUrl: string;
  path: string;
}): Promise<DeploymentSmokePublicPageResult> {
  const response = await fetcher(`${baseUrl}${path}`);

  return {
    path,
    ok: response.ok,
    status: response.status,
  };
}

async function checkSecurityHeaders({
  fetcher,
  baseUrl,
}: {
  fetcher: typeof fetch;
  baseUrl: string;
}): Promise<DeploymentSmokeSecurityHeaderResult[]> {
  const response = await fetcher(`${baseUrl}/`);

  return requiredSecurityHeaders.map(({ header, expected }) => {
    const actual = response.headers.get(header);

    return {
      header,
      ok: actual === expected,
      actual,
      expected,
    };
  });
}

async function checkRobotsTxt({
  fetcher,
  baseUrl,
}: {
  fetcher: typeof fetch;
  baseUrl: string;
}): Promise<DeploymentSmokeRobotsTxtResult> {
  const response = await fetcher(`${baseUrl}/robots.txt`);
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

async function submitPracticeInquirySmoke({
  fetcher,
  baseUrl,
}: {
  fetcher: typeof fetch;
  baseUrl: string;
}): Promise<DeploymentSmokePracticeInquiryResult> {
  const response = await fetcher(`${baseUrl}/api/practice-inquiries`, {
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
  const payload = (await response.json().catch(() => ({}))) as {
    inquiry?: {
      inquiryId?: string;
    };
    notification?: {
      sent?: boolean;
    };
  };

  return {
    tested: true,
    ok: response.ok && Boolean(payload.inquiry?.inquiryId),
    status: response.status,
    ...(payload.inquiry?.inquiryId
      ? { inquiryId: payload.inquiry.inquiryId }
      : {}),
    notificationSent: Boolean(payload.notification?.sent),
  };
}

async function submitLearnerInterestSmoke({
  fetcher,
  baseUrl,
}: {
  fetcher: typeof fetch;
  baseUrl: string;
}): Promise<DeploymentSmokeLearnerInterestResult> {
  const response = await fetcher(`${baseUrl}/api/learner-interests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      learnerName: "Launch Smoke Test Learner",
      email: "launch-smoke-learner@example.com",
      background: "career-changer",
      goal: "Safe deployment smoke test learner interest. No patient information, card data, secrets, private employer details, or private learner history.",
    }),
  });
  const payload = (await response.json().catch(() => ({}))) as {
    interest?: {
      interestId?: string;
    };
    notification?: {
      sent?: boolean;
    };
  };

  return {
    tested: true,
    ok: response.ok && Boolean(payload.interest?.interestId),
    status: response.status,
    ...(payload.interest?.interestId
      ? { interestId: payload.interest.interestId }
      : {}),
    notificationSent: Boolean(payload.notification?.sent),
  };
}

export async function runDeploymentSmokeTest({
  baseUrl,
  expectedCommit,
  testPracticeInquiry = false,
  testLearnerInterest = false,
  fetcher = fetch,
  now = () => new Date().toISOString(),
}: DeploymentSmokeTestInput): Promise<DeploymentSmokeTestReport> {
  const normalizedBaseUrl = trimBaseUrl(baseUrl);

  if (!normalizedBaseUrl) {
    throw new Error("A deployed base URL is required.");
  }

  const health = await fetchJson<HealthResponse>({
    fetcher,
    url: `${normalizedBaseUrl}/api/health`,
  });
  const readiness = await fetchJson<RuntimeLaunchReadinessReport>({
    fetcher,
    url: `${normalizedBaseUrl}/api/launch/readiness`,
  });
  let checkoutAvailabilityOk = false;

  try {
    const checkoutAvailability = await fetchJson<CheckoutAvailabilityResponse>({
      fetcher,
      url: `${normalizedBaseUrl}/api/checkout/availability`,
    });

    checkoutAvailabilityOk = typeof checkoutAvailability.ready === "boolean";
  } catch {
    checkoutAvailabilityOk = false;
  }

  const publicPages = await Promise.all(
    deploymentSmokePublicPaths.map(path =>
      fetchPublicPage({ fetcher, baseUrl: normalizedBaseUrl, path })
    )
  );
  const securityHeaders = await checkSecurityHeaders({
    fetcher,
    baseUrl: normalizedBaseUrl,
  });
  const robotsTxt = await checkRobotsTxt({
    fetcher,
    baseUrl: normalizedBaseUrl,
  });
  const practiceInquiry = testPracticeInquiry
    ? await submitPracticeInquirySmoke({
        fetcher,
        baseUrl: normalizedBaseUrl,
      })
    : {
        tested: false,
        ok: false,
        skippedReason:
          "Set LAUNCH_SMOKE_TEST_PRACTICE_INQUIRY=true to submit a safe test inquiry.",
      };
  const learnerInterest = testLearnerInterest
    ? await submitLearnerInterestSmoke({
        fetcher,
        baseUrl: normalizedBaseUrl,
      })
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
    readyForPaidLaunch: readiness.readyForPaidLaunch,
    generatedAt: now(),
    blockers: readiness.staticSummary.blockers,
    warnings: readiness.warnings,
    launchActions: readiness.launchActions,
  };
}

export function getDeploymentSmokeExitCode(
  report: DeploymentSmokeTestReport,
  { allowNotReady = false }: DeploymentSmokeExitOptions = {}
): number {
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

function renderList(items: string[], emptyText: string): string[] {
  if (items.length === 0) return [`- ${emptyText}`];
  return items.map(item => `- ${item}`);
}

export function renderDeploymentSmokeReport(
  report: DeploymentSmokeTestReport
): string {
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
    `- Paid launch readiness: ${report.readyForPaidLaunch ? "ready" : "not ready"}`,
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
        `- ${header.header}: ${header.ok ? "ok" : `failed (expected ${header.expected}, got ${header.actual ?? "missing"})`}`
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
      ? `- Test inquiry: ${report.practiceInquiry.ok ? "ok" : "failed"} (HTTP ${report.practiceInquiry.status ?? "unknown"})`
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
      ? `- Test learner interest: ${report.learnerInterest.ok ? "ok" : "failed"} (HTTP ${report.learnerInterest.status ?? "unknown"})`
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

export function renderDeploymentSmokeConsoleSummary({
  report,
  allowNotReady = false,
}: {
  report: DeploymentSmokeTestReport;
  allowNotReady?: boolean;
}): string {
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
        `  - ${header.header}: ${header.ok ? "ok" : `failed (expected ${header.expected}, got ${header.actual ?? "missing"})`}`
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
