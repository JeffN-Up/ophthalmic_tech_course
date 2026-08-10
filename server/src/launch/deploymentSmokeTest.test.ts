import { describe, expect, it } from "vitest";
import {
  getDeploymentSmokeExitCode,
  renderDeploymentSmokeConsoleSummary,
  renderDeploymentSmokeReport,
  runDeploymentSmokeTest,
} from "./deploymentSmokeTest";

function createResponse(
  payload: unknown,
  options: { ok?: boolean; status?: number } = {}
) {
  return {
    ok: options.ok ?? true,
    status: options.status ?? 200,
    async json() {
      return payload;
    },
  } as Response;
}

function createTextResponse(options: { ok?: boolean; status?: number } = {}) {
  return {
    ok: options.ok ?? true,
    status: options.status ?? 200,
    headers: new Headers({
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy":
        "camera=(), microphone=(), geolocation=(), payment=(self)",
      "Cross-Origin-Opener-Policy": "same-origin",
    }),
    async text() {
      return "<!doctype html><title>OptiTech Academy</title>";
    },
  } as Response;
}

function createRobotsResponse(options: { ok?: boolean; status?: number } = {}) {
  return {
    ok: options.ok ?? true,
    status: options.status ?? 200,
    async text() {
      return [
        "User-agent: *",
        "Allow: /",
        "Disallow: /api/",
        "Disallow: /admin",
        "Disallow: /send",
        "Disallow: /practice-seat-admin",
        "Disallow: /launch-readiness",
      ].join("\n");
    },
  } as Response;
}

describe("runDeploymentSmokeTest", () => {
  it("checks deployed health, public pages, and paid launch readiness", async () => {
    const requestedUrls: string[] = [];
    const fetcher = async (url: string | URL | Request) => {
      const requestedUrl = String(url);
      requestedUrls.push(requestedUrl);

      if (requestedUrl.endsWith("/api/health")) {
        return createResponse({
          ok: true,
          release: {
            host: "render",
            branch: "codex/optitech-product-spec",
            commit: "7400815",
            serviceName: "optitech-academy",
            url: "https://example.com",
          },
        });
      }

      if (requestedUrl.endsWith("/api/launch/readiness")) {
        return createResponse({
          readyForPaidLaunch: false,
          staticSummary: {
            blockers: ["Clinical content review"],
          },
          warnings: ["Stripe webhook setup is missing: STRIPE_WEBHOOK_SECRET."],
          launchActions: [
            {
              id: "production-database",
              title: "Create and initialize hosted PostgreSQL",
              status: "app-command",
              whyItMatters: "Durable records are required.",
              action: "Run pnpm db:setup.",
              evidenceNeeded: "Database setup succeeds.",
            },
          ],
        });
      }

      if (requestedUrl.endsWith("/api/checkout/availability")) {
        return createResponse({
          ready: false,
          title: "Enrollment is not open yet",
          message:
            "The course can collect interest, but payment is paused until the final launch checks are complete.",
          primaryAction: "join-interest-list",
        });
      }

      if (requestedUrl.endsWith("/robots.txt")) {
        return createRobotsResponse();
      }

      return createTextResponse();
    };

    await expect(
      runDeploymentSmokeTest({
        baseUrl: " https://example.com/ ",
        expectedCommit: "7400815",
        fetcher: fetcher as typeof fetch,
        now: () => "2026-07-13T12:00:00.000Z",
      })
    ).resolves.toEqual({
      baseUrl: "https://example.com",
      healthOk: true,
      release: {
        host: "render",
        branch: "codex/optitech-product-spec",
        commit: "7400815",
        serviceName: "optitech-academy",
        url: "https://example.com",
        expectedCommit: "7400815",
        commitMatchesExpected: true,
        status: "matched",
      },
      publicPagesOk: true,
      checkoutAvailabilityOk: true,
      securityHeadersOk: true,
      securityHeaders: [
        {
          header: "X-Content-Type-Options",
          ok: true,
          actual: "nosniff",
          expected: "nosniff",
        },
        {
          header: "X-Frame-Options",
          ok: true,
          actual: "DENY",
          expected: "DENY",
        },
        {
          header: "Referrer-Policy",
          ok: true,
          actual: "strict-origin-when-cross-origin",
          expected: "strict-origin-when-cross-origin",
        },
        {
          header: "Permissions-Policy",
          ok: true,
          actual: "camera=(), microphone=(), geolocation=(), payment=(self)",
          expected: "camera=(), microphone=(), geolocation=(), payment=(self)",
        },
        {
          header: "Cross-Origin-Opener-Policy",
          ok: true,
          actual: "same-origin",
          expected: "same-origin",
        },
      ],
      robotsTxtOk: true,
      robotsTxt: {
        ok: true,
        status: 200,
        requiredRules: [
          { rule: "Allow: /", ok: true },
          { rule: "Disallow: /api/", ok: true },
          { rule: "Disallow: /admin", ok: true },
          { rule: "Disallow: /send", ok: true },
          { rule: "Disallow: /practice-seat-admin", ok: true },
          { rule: "Disallow: /launch-readiness", ok: true },
        ],
      },
      publicPages: [
        { path: "/", ok: true, status: 200 },
        { path: "/first-sale", ok: true, status: 200 },
        { path: "/preview", ok: true, status: 200 },
        { path: "/buyer-guide", ok: true, status: 200 },
        { path: "/checkout", ok: true, status: 200 },
        {
          path: "/checkout?checkout=cancelled&offer=founding-learner",
          ok: true,
          status: 200,
        },
        {
          path: "/learn?checkout=success&offer=founding-learner",
          ok: true,
          status: 200,
        },
        { path: "/practice-packs", ok: true, status: 200 },
        {
          path: "/practice-packs?checkout=cancelled&offer=practice-six-seat-pack",
          ok: true,
          status: 200,
        },
        {
          path: "/practice-packs?checkout=success&offer=practice-six-seat-pack",
          ok: true,
          status: 200,
        },
        { path: "/policies", ok: true, status: 200 },
        { path: "/curriculum", ok: true, status: 200 },
        { path: "/onboarding", ok: true, status: 200 },
        { path: "/skills-passport", ok: true, status: 200 },
        { path: "/career-toolkit", ok: true, status: 200 },
        { path: "/certificate-preview", ok: true, status: 200 },
      ],
      practiceInquiry: {
        tested: false,
        ok: false,
        skippedReason:
          "Set LAUNCH_SMOKE_TEST_PRACTICE_INQUIRY=true to submit a safe test inquiry.",
      },
      learnerInterest: {
        tested: false,
        ok: false,
        skippedReason:
          "Set LAUNCH_SMOKE_TEST_LEARNER_INTEREST=true to submit a safe test learner interest.",
      },
      readyForPaidLaunch: false,
      generatedAt: "2026-07-13T12:00:00.000Z",
      blockers: ["Clinical content review"],
      warnings: ["Stripe webhook setup is missing: STRIPE_WEBHOOK_SECRET."],
      launchActions: [
        {
          id: "production-database",
          title: "Create and initialize hosted PostgreSQL",
          status: "app-command",
          whyItMatters: "Durable records are required.",
          action: "Run pnpm db:setup.",
          evidenceNeeded: "Database setup succeeds.",
        },
      ],
    });
    expect(requestedUrls).toEqual([
      "https://example.com/api/health",
      "https://example.com/api/launch/readiness",
      "https://example.com/api/checkout/availability",
      "https://example.com/",
      "https://example.com/first-sale",
      "https://example.com/preview",
      "https://example.com/buyer-guide",
      "https://example.com/checkout",
      "https://example.com/checkout?checkout=cancelled&offer=founding-learner",
      "https://example.com/learn?checkout=success&offer=founding-learner",
      "https://example.com/practice-packs",
      "https://example.com/practice-packs?checkout=cancelled&offer=practice-six-seat-pack",
      "https://example.com/practice-packs?checkout=success&offer=practice-six-seat-pack",
      "https://example.com/policies",
      "https://example.com/curriculum",
      "https://example.com/onboarding",
      "https://example.com/skills-passport",
      "https://example.com/career-toolkit",
      "https://example.com/certificate-preview",
      "https://example.com/",
      "https://example.com/robots.txt",
    ]);
  });

  it("fails when the deployed commit does not match the expected commit", async () => {
    const fetcher = async (url: string | URL | Request) => {
      const requestedUrl = String(url);

      if (requestedUrl.endsWith("/api/health")) {
        return createResponse({
          ok: true,
          release: {
            host: "render",
            branch: "codex/optitech-product-spec",
            commit: "old1234",
            serviceName: "optitech-academy",
            url: "https://example.com",
          },
        });
      }

      if (requestedUrl.endsWith("/api/launch/readiness")) {
        return createResponse({
          readyForPaidLaunch: true,
          staticSummary: { blockers: [] },
          warnings: [],
          launchActions: [],
        });
      }

      if (requestedUrl.endsWith("/api/checkout/availability")) {
        return createResponse({
          ready: true,
          title: "Enrollment is open",
          message: "Stripe checkout is available.",
          primaryAction: "continue-to-checkout",
        });
      }

      if (requestedUrl.endsWith("/robots.txt")) {
        return createRobotsResponse();
      }

      return createTextResponse();
    };

    const report = await runDeploymentSmokeTest({
      baseUrl: "https://example.com",
      expectedCommit: "7400815",
      fetcher: fetcher as typeof fetch,
    });

    expect(report.release).toMatchObject({
      commit: "old1234",
      expectedCommit: "7400815",
      commitMatchesExpected: false,
      status: "mismatched",
    });
    expect(getDeploymentSmokeExitCode(report, { allowNotReady: true })).toBe(1);
  });

  it("can submit a safe practice inquiry smoke check when enabled", async () => {
    const requestedRequests: Array<{
      url: string;
      method?: string;
      body?: unknown;
    }> = [];
    const fetcher = async (url: string | URL | Request, init?: RequestInit) => {
      const requestedUrl = String(url);
      requestedRequests.push({
        url: requestedUrl,
        method: init?.method,
        body:
          typeof init?.body === "string" ? JSON.parse(init.body) : undefined,
      });

      if (requestedUrl.endsWith("/api/health")) {
        return createResponse({ ok: true });
      }

      if (requestedUrl.endsWith("/api/launch/readiness")) {
        return createResponse({
          readyForPaidLaunch: true,
          staticSummary: {
            blockers: [],
          },
          warnings: [],
          launchActions: [],
        });
      }

      if (requestedUrl.endsWith("/api/checkout/availability")) {
        return createResponse({
          ready: true,
          title: "Enrollment is open",
          message:
            "Stripe checkout is available for individual learners and practice packs.",
          primaryAction: "continue-to-checkout",
        });
      }

      if (requestedUrl.endsWith("/api/practice-inquiries")) {
        return createResponse(
          {
            inquiry: {
              inquiryId: "practice_inquiry_smoke",
            },
            notification: {
              sent: true,
            },
          },
          { status: 201 }
        );
      }

      if (requestedUrl.endsWith("/robots.txt")) {
        return createRobotsResponse();
      }

      return createTextResponse();
    };

    const report = await runDeploymentSmokeTest({
      baseUrl: "https://example.com",
      testPracticeInquiry: true,
      fetcher: fetcher as typeof fetch,
      now: () => "2026-07-13T12:00:00.000Z",
    });

    expect(report.practiceInquiry).toEqual({
      tested: true,
      ok: true,
      status: 201,
      inquiryId: "practice_inquiry_smoke",
      notificationSent: true,
    });
    expect(requestedRequests.at(-1)).toMatchObject({
      url: "https://example.com/api/practice-inquiries",
      method: "POST",
      body: {
        practiceName: "OptiTech Smoke Test Practice",
        contactEmail: "launch-smoke@example.com",
      },
    });
  });

  it("can submit a safe learner interest smoke check when enabled", async () => {
    const requestedRequests: Array<{
      url: string;
      method?: string;
      body?: unknown;
    }> = [];
    const fetcher = async (url: string | URL | Request, init?: RequestInit) => {
      const requestedUrl = String(url);
      requestedRequests.push({
        url: requestedUrl,
        method: init?.method,
        body:
          typeof init?.body === "string" ? JSON.parse(init.body) : undefined,
      });

      if (requestedUrl.endsWith("/api/health")) {
        return createResponse({ ok: true });
      }

      if (requestedUrl.endsWith("/api/launch/readiness")) {
        return createResponse({
          readyForPaidLaunch: true,
          staticSummary: {
            blockers: [],
          },
          warnings: [],
          launchActions: [],
        });
      }

      if (requestedUrl.endsWith("/api/checkout/availability")) {
        return createResponse({
          ready: true,
          title: "Enrollment is open",
          message:
            "Stripe checkout is available for individual learners and practice packs.",
          primaryAction: "continue-to-checkout",
        });
      }

      if (requestedUrl.endsWith("/api/learner-interests")) {
        return createResponse(
          {
            interest: {
              interestId: "learner_interest_smoke",
            },
            notification: {
              sent: true,
            },
          },
          { status: 201 }
        );
      }

      if (requestedUrl.endsWith("/robots.txt")) {
        return createRobotsResponse();
      }

      return createTextResponse();
    };

    const report = await runDeploymentSmokeTest({
      baseUrl: "https://example.com",
      testLearnerInterest: true,
      fetcher: fetcher as typeof fetch,
      now: () => "2026-07-13T12:00:00.000Z",
    });

    expect(report.learnerInterest).toEqual({
      tested: true,
      ok: true,
      status: 201,
      interestId: "learner_interest_smoke",
      notificationSent: true,
    });
    expect(requestedRequests.at(-1)).toMatchObject({
      url: "https://example.com/api/learner-interests",
      method: "POST",
      body: {
        learnerName: "Launch Smoke Test Learner",
        email: "launch-smoke-learner@example.com",
      },
    });
  });

  it("reports public buyer page failures", async () => {
    const fetcher = async (url: string | URL | Request) => {
      const requestedUrl = String(url);

      if (requestedUrl.endsWith("/api/health")) {
        return createResponse({ ok: true });
      }

      if (requestedUrl.endsWith("/api/launch/readiness")) {
        return createResponse({
          readyForPaidLaunch: false,
          staticSummary: {
            blockers: [],
          },
          warnings: [],
          launchActions: [],
        });
      }

      if (requestedUrl.endsWith("/api/checkout/availability")) {
        return createResponse({
          ready: false,
          title: "Enrollment is not open yet",
          message:
            "The course can collect interest, but payment is paused until the final launch checks are complete.",
          primaryAction: "join-interest-list",
        });
      }

      if (requestedUrl.endsWith("/checkout")) {
        return createTextResponse({ ok: false, status: 500 });
      }

      if (requestedUrl.endsWith("/robots.txt")) {
        return createRobotsResponse();
      }

      return createTextResponse();
    };

    const report = await runDeploymentSmokeTest({
      baseUrl: "https://example.com",
      fetcher: fetcher as typeof fetch,
    });

    expect(report.checkoutAvailabilityOk).toBe(true);
    expect(report.publicPagesOk).toBe(false);
    expect(report.publicPages).toContainEqual({
      path: "/checkout",
      ok: false,
      status: 500,
    });
    expect(getDeploymentSmokeExitCode(report, { allowNotReady: true })).toBe(1);
  });

  it("reports checkout availability endpoint failures", async () => {
    const fetcher = async (url: string | URL | Request) => {
      const requestedUrl = String(url);

      if (requestedUrl.endsWith("/api/health")) {
        return createResponse({ ok: true });
      }

      if (requestedUrl.endsWith("/api/launch/readiness")) {
        return createResponse({
          readyForPaidLaunch: false,
          staticSummary: {
            blockers: [],
          },
          warnings: [],
          launchActions: [],
        });
      }

      if (requestedUrl.endsWith("/api/checkout/availability")) {
        return createResponse(
          {
            error: "Checkout availability unavailable",
          },
          { ok: false, status: 503 }
        );
      }

      if (requestedUrl.endsWith("/robots.txt")) {
        return createRobotsResponse();
      }

      return createTextResponse();
    };

    const report = await runDeploymentSmokeTest({
      baseUrl: "https://example.com",
      fetcher: fetcher as typeof fetch,
    });

    expect(report.checkoutAvailabilityOk).toBe(false);
    expect(report.publicPagesOk).toBe(true);
    expect(getDeploymentSmokeExitCode(report, { allowNotReady: true })).toBe(1);
  });

  it("reports missing deployment security headers", async () => {
    const fetcher = async (url: string | URL | Request) => {
      const requestedUrl = String(url);

      if (requestedUrl.endsWith("/api/health")) {
        return createResponse({ ok: true });
      }

      if (requestedUrl.endsWith("/api/launch/readiness")) {
        return createResponse({
          readyForPaidLaunch: true,
          staticSummary: {
            blockers: [],
          },
          warnings: [],
          launchActions: [],
        });
      }

      if (requestedUrl.endsWith("/api/checkout/availability")) {
        return createResponse({
          ready: true,
          title: "Enrollment is open",
          message:
            "Stripe checkout is available for individual learners and practice packs.",
          primaryAction: "continue-to-checkout",
        });
      }

      if (requestedUrl.endsWith("/robots.txt")) {
        return createRobotsResponse();
      }

      if (requestedUrl === "https://example.com/") {
        return {
          ok: true,
          status: 200,
          headers: new Headers({
            "X-Content-Type-Options": "nosniff",
          }),
          async text() {
            return "<!doctype html>";
          },
        } as Response;
      }

      return createTextResponse();
    };

    const report = await runDeploymentSmokeTest({
      baseUrl: "https://example.com",
      fetcher: fetcher as typeof fetch,
    });

    expect(report.securityHeadersOk).toBe(false);
    expect(report.securityHeaders).toContainEqual({
      header: "X-Frame-Options",
      ok: false,
      actual: null,
      expected: "DENY",
    });
    expect(getDeploymentSmokeExitCode(report, { allowNotReady: true })).toBe(1);
  });

  it("reports missing robots.txt launch rules", async () => {
    const fetcher = async (url: string | URL | Request) => {
      const requestedUrl = String(url);

      if (requestedUrl.endsWith("/api/health")) {
        return createResponse({ ok: true });
      }

      if (requestedUrl.endsWith("/api/launch/readiness")) {
        return createResponse({
          readyForPaidLaunch: true,
          staticSummary: {
            blockers: [],
          },
          warnings: [],
          launchActions: [],
        });
      }

      if (requestedUrl.endsWith("/api/checkout/availability")) {
        return createResponse({
          ready: true,
          title: "Enrollment is open",
          message:
            "Stripe checkout is available for individual learners and practice packs.",
          primaryAction: "continue-to-checkout",
        });
      }

      if (requestedUrl.endsWith("/robots.txt")) {
        return {
          ok: true,
          status: 200,
          async text() {
            return ["User-agent: *", "Allow: /"].join("\n");
          },
        } as Response;
      }

      return createTextResponse();
    };

    const report = await runDeploymentSmokeTest({
      baseUrl: "https://example.com",
      fetcher: fetcher as typeof fetch,
    });

    expect(report.robotsTxtOk).toBe(false);
    expect(report.robotsTxt.requiredRules).toContainEqual({
      rule: "Disallow: /api/",
      ok: false,
    });
    expect(getDeploymentSmokeExitCode(report, { allowNotReady: true })).toBe(1);
  });

  it("renders a safe markdown smoke report", () => {
    const report = renderDeploymentSmokeReport({
      baseUrl: "https://academy.spindeleye.com",
      healthOk: true,
      publicPagesOk: true,
      checkoutAvailabilityOk: true,
      securityHeadersOk: true,
      securityHeaders: [
        {
          header: "X-Frame-Options",
          ok: true,
          actual: "DENY",
          expected: "DENY",
        },
      ],
      robotsTxtOk: true,
      robotsTxt: {
        ok: true,
        status: 200,
        requiredRules: [{ rule: "Disallow: /api/", ok: true }],
      },
      publicPages: [
        { path: "/", ok: true, status: 200 },
        { path: "/checkout", ok: true, status: 200 },
      ],
      practiceInquiry: {
        tested: true,
        ok: true,
        status: 201,
        inquiryId: "practice_inquiry_smoke",
        notificationSent: false,
      },
      learnerInterest: {
        tested: true,
        ok: true,
        status: 201,
        interestId: "learner_interest_smoke",
        notificationSent: false,
      },
      readyForPaidLaunch: false,
      release: {
        host: "render",
        branch: "codex/optitech-product-spec",
        commit: "7400815",
        expectedCommit: "7400815",
        commitMatchesExpected: true,
        status: "matched",
      },
      generatedAt: "2026-07-13T12:00:00.000Z",
      blockers: ["Clinical content review"],
      warnings: ["Stripe webhook setup is missing: STRIPE_WEBHOOK_SECRET."],
      launchActions: [
        {
          id: "production-database",
          title: "Create and initialize hosted PostgreSQL",
          status: "app-command",
          whyItMatters: "Durable records are required.",
          action: "Run pnpm db:setup.",
          evidenceNeeded: "Database setup succeeds.",
        },
      ],
    });

    expect(report).toContain("OptiTech Academy Deployment Smoke Test");
    expect(report).toContain("Deployment URL: https://academy.spindeleye.com");
    expect(report).toContain("- Health endpoint: ok");
    expect(report).toContain("- Deployed commit: 7400815");
    expect(report).toContain("- Expected commit check: ok");
    expect(report).toContain("Release Fingerprint");
    expect(report).toContain("Commit matches expected: yes");
    expect(report).toContain("- Public buyer pages: ok");
    expect(report).toContain("- Checkout availability endpoint: ok");
    expect(report).toContain("- Security headers: ok");
    expect(report).toContain("- Robots.txt rules: ok");
    expect(report).toContain("- Practice inquiry capture: ok");
    expect(report).toContain("- Learner interest capture: ok");
    expect(report).toContain("/checkout: ok (HTTP 200)");
    expect(report).toContain("X-Frame-Options: ok");
    expect(report).toContain("/robots.txt: ok (HTTP 200)");
    expect(report).toContain("Disallow: /api/: ok");
    expect(report).toContain("Inquiry ID: practice_inquiry_smoke");
    expect(report).toContain("Interest ID: learner_interest_smoke");
    expect(report).toContain("- Paid launch readiness: not ready");
    expect(report).toContain("Create and initialize hosted PostgreSQL");
    expect(report).not.toContain("sk_test_");
    expect(report).not.toContain("whsec_123");
  });

  it("renders a console summary with safety checks", () => {
    const summary = renderDeploymentSmokeConsoleSummary({
      allowNotReady: true,
      report: {
        baseUrl: "https://academy.spindeleye.com",
        healthOk: true,
        publicPagesOk: true,
        checkoutAvailabilityOk: true,
        securityHeadersOk: false,
        securityHeaders: [
          {
            header: "X-Content-Type-Options",
            ok: true,
            actual: "nosniff",
            expected: "nosniff",
          },
          {
            header: "X-Frame-Options",
            ok: false,
            actual: null,
            expected: "DENY",
          },
        ],
        robotsTxtOk: false,
        robotsTxt: {
          ok: false,
          status: 200,
          requiredRules: [
            { rule: "Allow: /", ok: true },
            { rule: "Disallow: /api/", ok: false },
          ],
        },
        publicPages: [
          { path: "/", ok: true, status: 200 },
          { path: "/checkout", ok: true, status: 200 },
        ],
        practiceInquiry: {
          tested: false,
          ok: false,
          skippedReason: "not requested",
        },
        learnerInterest: {
          tested: false,
          ok: false,
          skippedReason: "not requested",
        },
        readyForPaidLaunch: false,
        release: {
          commit: "7400815",
          expectedCommit: "7400815",
          commitMatchesExpected: true,
          status: "matched",
        },
        generatedAt: "2026-07-13T12:00:00.000Z",
        blockers: ["Clinical content review"],
        warnings: ["Stripe webhook setup is missing: STRIPE_WEBHOOK_SECRET."],
        launchActions: [
          {
            id: "production-database",
            title: "Create and initialize hosted PostgreSQL",
            status: "app-command",
            whyItMatters: "Durable records are required.",
            action: "Run pnpm db:setup.",
            evidenceNeeded: "Database setup succeeds.",
          },
        ],
      },
    });

    expect(summary).toContain("Deployment smoke test for");
    expect(summary).toContain("- Deployed commit: 7400815");
    expect(summary).toContain("- Expected commit check: ok");
    expect(summary).toContain("- Public buyer pages: ok");
    expect(summary).toContain("- Checkout availability: ok");
    expect(summary).toContain("- Security headers: failed");
    expect(summary).toContain(
      "X-Frame-Options: failed (expected DENY, got missing)"
    );
    expect(summary).toContain("- Robots.txt rules: failed (HTTP 200)");
    expect(summary).toContain("Disallow: /api/: missing");
    expect(summary).toContain(
      "- Not-ready launch status allowed for this pre-launch smoke run."
    );
    expect(summary).toContain("- Next launch actions:");
    expect(summary).not.toContain("sk_test_");
    expect(summary).not.toContain("whsec_123");
  });

  it("can allow not-ready launch status for pre-launch deployment checks", () => {
    const report = {
      baseUrl: "https://academy.spindeleye.com",
      healthOk: true,
      publicPagesOk: true,
      checkoutAvailabilityOk: true,
      securityHeadersOk: true,
      securityHeaders: [],
      robotsTxtOk: true,
      robotsTxt: {
        ok: true,
        status: 200,
        requiredRules: [],
      },
      publicPages: [],
      practiceInquiry: {
        tested: false,
        ok: false,
        skippedReason: "not requested",
      },
      learnerInterest: {
        tested: false,
        ok: false,
        skippedReason: "not requested",
      },
      readyForPaidLaunch: false,
      generatedAt: "2026-07-13T12:00:00.000Z",
      blockers: [],
      warnings: [],
      launchActions: [],
    };

    expect(getDeploymentSmokeExitCode(report)).toBe(1);
    expect(getDeploymentSmokeExitCode(report, { allowNotReady: true })).toBe(0);
  });

  it("still fails pre-launch deployment checks when public pages are broken", () => {
    expect(
      getDeploymentSmokeExitCode(
        {
          baseUrl: "https://academy.spindeleye.com",
          healthOk: true,
          publicPagesOk: false,
          checkoutAvailabilityOk: true,
          securityHeadersOk: true,
          securityHeaders: [],
          robotsTxtOk: true,
          robotsTxt: {
            ok: true,
            status: 200,
            requiredRules: [],
          },
          publicPages: [
            {
              path: "/checkout",
              ok: false,
              status: 500,
            },
          ],
          practiceInquiry: {
            tested: false,
            ok: false,
            skippedReason: "not requested",
          },
          learnerInterest: {
            tested: false,
            ok: false,
            skippedReason: "not requested",
          },
          readyForPaidLaunch: false,
          generatedAt: "2026-07-13T12:00:00.000Z",
          blockers: [],
          warnings: [],
          launchActions: [],
        },
        { allowNotReady: true }
      )
    ).toBe(1);
  });

  it("fails when the optional practice inquiry smoke check is requested and broken", () => {
    expect(
      getDeploymentSmokeExitCode(
        {
          baseUrl: "https://academy.spindeleye.com",
          healthOk: true,
          publicPagesOk: true,
          checkoutAvailabilityOk: true,
          securityHeadersOk: true,
          securityHeaders: [],
          robotsTxtOk: true,
          robotsTxt: {
            ok: true,
            status: 200,
            requiredRules: [],
          },
          publicPages: [],
          practiceInquiry: {
            tested: true,
            ok: false,
            status: 500,
          },
          learnerInterest: {
            tested: false,
            ok: false,
            skippedReason: "not requested",
          },
          readyForPaidLaunch: true,
          generatedAt: "2026-07-13T12:00:00.000Z",
          blockers: [],
          warnings: [],
          launchActions: [],
        },
        { allowNotReady: true }
      )
    ).toBe(1);
  });

  it("fails when the optional learner interest smoke check is requested and broken", () => {
    expect(
      getDeploymentSmokeExitCode(
        {
          baseUrl: "https://academy.spindeleye.com",
          healthOk: true,
          publicPagesOk: true,
          checkoutAvailabilityOk: true,
          securityHeadersOk: true,
          securityHeaders: [],
          robotsTxtOk: true,
          robotsTxt: {
            ok: true,
            status: 200,
            requiredRules: [],
          },
          publicPages: [],
          practiceInquiry: {
            tested: false,
            ok: false,
            skippedReason: "not requested",
          },
          learnerInterest: {
            tested: true,
            ok: false,
            status: 500,
          },
          readyForPaidLaunch: true,
          generatedAt: "2026-07-13T12:00:00.000Z",
          blockers: [],
          warnings: [],
          launchActions: [],
        },
        { allowNotReady: true }
      )
    ).toBe(1);
  });

  it("fails clearly when a deployed endpoint is unavailable", async () => {
    await expect(
      runDeploymentSmokeTest({
        baseUrl: "https://example.com",
        fetcher: (async () =>
          createResponse({}, { ok: false, status: 503 })) as typeof fetch,
      })
    ).rejects.toThrow("https://example.com/api/health returned HTTP 503.");
  });
});
