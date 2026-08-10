import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createLaunchEvidenceBundle } from "./launchEvidenceBundle";
import type { RuntimeLaunchReadinessReport } from "../config/runtimeReadiness";

function expectTextToContainWords(text: string, expected: string) {
  const normalize = (value: string) =>
    value.replace(/\s+/g, " ").trim().toLowerCase();

  expect(normalize(text)).toContain(normalize(expected));
}

const readinessReport: RuntimeLaunchReadinessReport = {
  generatedAt: "2026-07-13T12:00:00.000Z",
  readyForPaidLaunch: false,
  salesChannels: {
    individualLearner: {
      ready: false,
      blockers: ["Stripe checkout is not configured"],
    },
    practicePacks: {
      ready: false,
      blockers: [
        "Stripe checkout is not configured",
        "Practice seat administration is not protected",
      ],
    },
  },
  staticSummary: {
    ready: false,
    readyCount: 1,
    inProgressCount: 1,
    blockedCount: 1,
    blockers: ["Clinical content review"],
  },
  launchChecklist: [],
  commerce: {
    checkoutConfigured: false,
    paidEnrollmentEnabled: false,
    webhookConfigured: false,
    stripeSecretKeyMode: "missing",
    missingCheckoutVariables: ["STRIPE_SECRET_KEY"],
    missingWebhookVariables: ["STRIPE_WEBHOOK_SECRET"],
  },
  auth: {
    passwordlessConfigured: false,
    missingPasswordlessVariables: ["TRANSACTIONAL_EMAIL_API_KEY"],
  },
  practiceSeatAdmin: {
    practiceSeatAdminConfigured: false,
    missingPracticeSeatAdminVariables: ["PRACTICE_SEAT_ADMIN_TOKEN"],
  },
  alertAdmin: {
    alertAdminConfigured: false,
    missingAlertAdminVariables: ["ALERT_ADMIN_TOKEN"],
  },
  database: {
    databaseConfigured: false,
    missingDatabaseVariables: ["DATABASE_URL", "DATABASE_SSL"],
  },
  databaseReadiness: {
    schemaVerified: false,
    requiredTables: ["commerce_purchases"],
    checkedTableCount: 0,
    missingTables: ["commerce_purchases"],
    checkFailed: false,
  },
  clinicalReview: {
    moduleOneReviewConfigured: false,
    moduleOneReviewApproved: false,
    missingModuleOneReviewVariables: ["MODULE_ONE_CLINICAL_REVIEWER_NAME"],
    reviewerName: "",
    reviewerRole: "",
    reviewDate: "",
    approvedVersion: "",
  },
  warnings: ["Stripe checkout setup is missing: STRIPE_SECRET_KEY."],
  launchActions: [
    {
      id: "clinical-review-signoff",
      title: "Get clinical review signoff",
      status: "external",
      whyItMatters: "Paid clinical education needs review.",
      action: "Have a reviewer approve Module 1.",
      evidenceNeeded: "Reviewer signoff.",
    },
  ],
  clinicalReviewPacket: {
    moduleId: "entering-ophthalmic-care",
    moduleTitle: "Module 1: Entering Ophthalmic Care",
    purpose: "Support clinical review.",
    reviewerInstructions: [],
    signoffFields: [],
    lessons: [],
  },
};

describe("createLaunchEvidenceBundle", () => {
  it("writes the safe launch handoff files", async () => {
    const projectRoot = process.cwd();
    const outputParent = await mkdtemp(
      path.join(tmpdir(), "optitech-launch-evidence-")
    );

    const result = await createLaunchEvidenceBundle({
      projectRoot,
      outputDir: outputParent,
      generatedAt: "2026-07-13T12:00:00.000Z",
      readinessReport,
    });

    expect(result.files).toEqual([
      "README.md",
      "production-launch-package.md",
      "deployment-guide.md",
      "render-deployment-guide.md",
      "first-render-deploy-evidence.md",
      "external-setup-worksheet.md",
      "online-start-guide.md",
      "jeffmini-resume-guide.md",
      "deployment-cutover-checklist.md",
      "domain-and-sharing-guide.md",
      "github-and-source-backup-guide.md",
      "home-pc-runbook.md",
      "home-pc-command-cheatsheet.md",
      "first-customers-sales-packet.md",
      "first-lead-qualification-card.md",
      "first-week-sales-plan.md",
      "individual-learner-decision-one-pager.md",
      "practice-manager-approval-one-pager.md",
      "manual-payment-link-checklist.md",
      "static-first-sale-page-guide.md",
      "first-buyer-fulfillment-checklist.md",
      "revenue-and-sales-tracker-template.md",
      "stripe-setup-guide.md",
      "email-setup-guide.md",
      "database-setup-guide.md",
      "clinical-review-guide.md",
      "clinical-review-request-template.md",
      "go-live-checklist.md",
      "production-env-checklist.md",
      "launch-doctor-report.md",
      "manual-launch-qa-evidence.md",
      "runtime-readiness-snapshot-guide.md",
      "first-sale-support-runbook.md",
      "paid-launch-emergency-stop.md",
      "bootcamp-content-migration-checklist.md",
      "module-1-clinical-review-packet.md",
      "runtime-readiness-snapshot.json",
    ]);

    const readme = await readFile(
      path.join(result.outputDir, "README.md"),
      "utf8"
    );
    const readinessSnapshot = await readFile(
      path.join(result.outputDir, "runtime-readiness-snapshot.json"),
      "utf8"
    );
    const productionEnvChecklist = await readFile(
      path.join(result.outputDir, "production-env-checklist.md"),
      "utf8"
    );
    const deploymentGuide = await readFile(
      path.join(result.outputDir, "deployment-guide.md"),
      "utf8"
    );
    const renderDeploymentGuide = await readFile(
      path.join(result.outputDir, "render-deployment-guide.md"),
      "utf8"
    );
    const firstRenderDeployEvidence = await readFile(
      path.join(result.outputDir, "first-render-deploy-evidence.md"),
      "utf8"
    );
    const externalSetupWorksheet = await readFile(
      path.join(result.outputDir, "external-setup-worksheet.md"),
      "utf8"
    );
    const onlineStartGuide = await readFile(
      path.join(result.outputDir, "online-start-guide.md"),
      "utf8"
    );
    const jeffminiResumeGuide = await readFile(
      path.join(result.outputDir, "jeffmini-resume-guide.md"),
      "utf8"
    );
    const deploymentCutoverChecklist = await readFile(
      path.join(result.outputDir, "deployment-cutover-checklist.md"),
      "utf8"
    );
    const domainAndSharingGuide = await readFile(
      path.join(result.outputDir, "domain-and-sharing-guide.md"),
      "utf8"
    );
    const githubAndSourceBackupGuide = await readFile(
      path.join(result.outputDir, "github-and-source-backup-guide.md"),
      "utf8"
    );
    const homePcRunbook = await readFile(
      path.join(result.outputDir, "home-pc-runbook.md"),
      "utf8"
    );
    const homePcCommandCheatsheet = await readFile(
      path.join(result.outputDir, "home-pc-command-cheatsheet.md"),
      "utf8"
    );
    const firstCustomersSalesPacket = await readFile(
      path.join(result.outputDir, "first-customers-sales-packet.md"),
      "utf8"
    );
    const firstLeadQualificationCard = await readFile(
      path.join(result.outputDir, "first-lead-qualification-card.md"),
      "utf8"
    );
    const firstWeekSalesPlan = await readFile(
      path.join(result.outputDir, "first-week-sales-plan.md"),
      "utf8"
    );
    const individualLearnerDecisionOnePager = await readFile(
      path.join(result.outputDir, "individual-learner-decision-one-pager.md"),
      "utf8"
    );
    const practiceManagerApprovalOnePager = await readFile(
      path.join(result.outputDir, "practice-manager-approval-one-pager.md"),
      "utf8"
    );
    const manualPaymentLinkChecklist = await readFile(
      path.join(result.outputDir, "manual-payment-link-checklist.md"),
      "utf8"
    );
    const staticFirstSalePageGuide = await readFile(
      path.join(result.outputDir, "static-first-sale-page-guide.md"),
      "utf8"
    );
    const firstBuyerFulfillmentChecklist = await readFile(
      path.join(result.outputDir, "first-buyer-fulfillment-checklist.md"),
      "utf8"
    );
    const revenueAndSalesTrackerTemplate = await readFile(
      path.join(result.outputDir, "revenue-and-sales-tracker-template.md"),
      "utf8"
    );
    const stripeSetupGuide = await readFile(
      path.join(result.outputDir, "stripe-setup-guide.md"),
      "utf8"
    );
    const emailSetupGuide = await readFile(
      path.join(result.outputDir, "email-setup-guide.md"),
      "utf8"
    );
    const databaseSetupGuide = await readFile(
      path.join(result.outputDir, "database-setup-guide.md"),
      "utf8"
    );
    const clinicalReviewGuide = await readFile(
      path.join(result.outputDir, "clinical-review-guide.md"),
      "utf8"
    );
    const clinicalReviewRequestTemplate = await readFile(
      path.join(result.outputDir, "clinical-review-request-template.md"),
      "utf8"
    );
    const goLiveChecklist = await readFile(
      path.join(result.outputDir, "go-live-checklist.md"),
      "utf8"
    );
    const launchDoctorReport = await readFile(
      path.join(result.outputDir, "launch-doctor-report.md"),
      "utf8"
    );
    const manualQaEvidence = await readFile(
      path.join(result.outputDir, "manual-launch-qa-evidence.md"),
      "utf8"
    );
    const supportRunbook = await readFile(
      path.join(result.outputDir, "first-sale-support-runbook.md"),
      "utf8"
    );
    const emergencyStopGuide = await readFile(
      path.join(result.outputDir, "paid-launch-emergency-stop.md"),
      "utf8"
    );
    const bootcampContentMigrationChecklist = await readFile(
      path.join(result.outputDir, "bootcamp-content-migration-checklist.md"),
      "utf8"
    );

    expect(readme).toContain("safe to save to Google Drive");
    expect(readme).toContain("first-buyer feedback");
    expect(readme).toContain("Ready for paid launch: no");
    expect(readme).toContain("Individual learner sales: blocked");
    expect(readme).toContain("Practice pack sales: blocked");
    expect(productionEnvChecklist).toContain(
      "OptiTech Academy Production Environment Checklist"
    );
    expect(deploymentGuide).toContain("OptiTech Academy Deployment Guide");
    expect(deploymentGuide).toContain("ENABLE_PAID_ENROLLMENT=false");
    expect(deploymentGuide).toContain("/api/checkout/availability");
    expect(renderDeploymentGuide).toContain(
      "OptiTech Academy Render Deployment Guide"
    );
    expect(renderDeploymentGuide).toContain("render.yaml");
    expect(renderDeploymentGuide).toContain("pre-deploy database setup");
    expect(renderDeploymentGuide).toContain("pnpm db:setup");
    expect(renderDeploymentGuide).toContain("/api/checkout/availability");
    expect(renderDeploymentGuide).not.toContain("sk_test_");
    expect(renderDeploymentGuide).not.toContain("whsec_");
    expect(firstRenderDeployEvidence).toContain(
      "OptiTech Academy First Render Deploy Evidence"
    );
    expect(firstRenderDeployEvidence).toContain(
      "pnpm launch:first-render-deploy"
    );
    expect(firstRenderDeployEvidence).toContain("pnpm launch:preflight");
    expect(firstRenderDeployEvidence).toContain("Branch: [fill branch]");
    expect(firstRenderDeployEvidence).toContain(
      "Commit checked: [fill commit]"
    );
    expect(firstRenderDeployEvidence).toContain(
      "Test suite: [passed / not passed yet]"
    );
    expect(firstRenderDeployEvidence).toContain("ENABLE_PAID_ENROLLMENT=false");
    expect(firstRenderDeployEvidence).toContain("LAUNCH_SMOKE_ALLOW_NOT_READY");
    expect(firstRenderDeployEvidence).toContain("LAUNCH_SMOKE_REPORT_PATH");
    expect(firstRenderDeployEvidence).toContain(
      "launch-evidence/first-render-smoke-report.md"
    );
    expect(firstRenderDeployEvidence).not.toContain("sk_test_");
    expect(firstRenderDeployEvidence).not.toContain("whsec_");
    expect(externalSetupWorksheet).toContain(
      "OptiTech Academy External Setup Worksheet"
    );
    expect(externalSetupWorksheet).toContain(
      "Connect Stripe checkout and webhook"
    );
    expect(externalSetupWorksheet).toContain(
      "pnpm launch:clinical-review-request"
    );
    expect(externalSetupWorksheet).not.toContain("sk_test_");
    expect(externalSetupWorksheet).not.toContain("whsec_");
    expect(onlineStartGuide).toContain("OptiTech Academy Online Start Guide");
    expect(onlineStartGuide).toContain("pnpm launch:first-buyer");
    expect(onlineStartGuide).toContain("pnpm launch:fulfillment");
    expect(jeffminiResumeGuide).toContain(
      "OptiTech Academy Jeffmini Resume Guide"
    );
    expect(jeffminiResumeGuide).toContain("pnpm launch:online-start");
    expect(jeffminiResumeGuide).toContain("First Buyer Proof Commands");
    expect(deploymentCutoverChecklist).toContain(
      "OptiTech Academy Deployment Cutover Checklist"
    );
    expect(deploymentCutoverChecklist).toContain(
      "Keep `ENABLE_PAID_ENROLLMENT=false`"
    );
    expect(deploymentCutoverChecklist).toContain(
      "LAUNCH_SMOKE_ALLOW_NOT_READY=true"
    );
    expect(deploymentCutoverChecklist).toContain(
      "Set `ENABLE_PAID_ENROLLMENT=false` again"
    );
    expect(deploymentCutoverChecklist).not.toContain("sk_test_");
    expect(deploymentCutoverChecklist).not.toContain("whsec_");
    expect(domainAndSharingGuide).toContain(
      "OptiTech Academy Domain And Sharing Guide"
    );
    expect(domainAndSharingGuide).toContain("PUBLIC_APP_URL");
    expect(domainAndSharingGuide).toContain("pnpm launch:sitemap");
    expect(githubAndSourceBackupGuide).toContain(
      "OptiTech Academy GitHub And Source Backup Guide"
    );
    expect(githubAndSourceBackupGuide).toContain(
      "https://github.com/Down2pound/ophthalmic_tech_course.git"
    );
    expect(githubAndSourceBackupGuide).toContain(
      "git push -u origin codex/optitech-product-spec"
    );
    expect(githubAndSourceBackupGuide).toContain(
      "Bootcamp Drive folder: https://drive.google.com/drive/folders/1tEGzMv4hXrCjZQwMnXyD2eWXqp1JkT5q"
    );
    expect(githubAndSourceBackupGuide).toContain(
      "NotebookLM workspace: https://notebook.google.com/notebook/a4bc6fed-4059-4597-a60f-a43aa78ff3e1"
    );
    expect(githubAndSourceBackupGuide).toContain(
      "git clone optitech-academy-branch"
    );
    expect(githubAndSourceBackupGuide).toContain(
      "pnpm launch:workstation-handoff"
    );
    expect(githubAndSourceBackupGuide).toContain("pnpm launch:blockers");
    expect(githubAndSourceBackupGuide).not.toContain("sk_test_");
    expect(githubAndSourceBackupGuide).not.toContain("whsec_");
    expect(homePcRunbook).toContain("OptiTech Academy Home PC Runbook");
    expect(homePcRunbook).toContain("spawn EPERM");
    expect(homePcRunbook).toContain("pnpm launch:preflight");
    expect(homePcRunbook).toContain("pnpm launch:secret-scan");
    expect(homePcRunbook).toContain("git clone optitech-academy-branch");
    expect(homePcRunbook).toContain("--branch codex/optitech-product-spec");
    expect(homePcRunbook).toContain("pnpm launch:workstation-handoff");
    expect(homePcRunbook).toContain("pnpm launch:blockers");
    expect(homePcCommandCheatsheet).toContain(
      "OptiTech Academy Home PC Command Cheat Sheet"
    );
    expect(homePcCommandCheatsheet).toContain(
      "LAUNCH_SMOKE_ALLOW_NOT_READY=true"
    );
    expect(homePcCommandCheatsheet).toContain("pnpm db:setup");
    expect(homePcCommandCheatsheet).toContain("pnpm launch:secret-scan");
    expect(homePcCommandCheatsheet).toContain("pnpm launch:blockers");
    expect(homePcCommandCheatsheet).toContain("pnpm launch:clinical-review");
    expect(homePcCommandCheatsheet).toContain("pnpm launch:env-template");
    expect(homePcCommandCheatsheet).toContain(
      "git clone optitech-academy-branch"
    );
    expect(homePcCommandCheatsheet).not.toContain("sk_test_");
    expect(homePcCommandCheatsheet).not.toContain("whsec_");
    expect(firstCustomersSalesPacket).toContain(
      "OptiTech Academy First Customers Sales Packet"
    );
    expect(firstCustomersSalesPacket).toContain("pnpm launch:lead-qualifier");
    expect(firstCustomersSalesPacket).toContain(
      "pnpm launch:first-buyer-feedback"
    );
    expect(firstLeadQualificationCard).toContain(
      "OptiTech Academy First Lead Qualification Card"
    );
    expect(firstLeadQualificationCard).toContain("Quick Fit Score");
    expect(firstLeadQualificationCard).toContain(
      "Only send the paid checkout path"
    );
    expect(firstWeekSalesPlan).toContain(
      "OptiTech Academy First Week Sales Plan"
    );
    expect(firstWeekSalesPlan).toContain("Day 1: Prepare the warm list");
    expect(firstWeekSalesPlan).toContain("pnpm launch:lead-qualifier");
    expect(firstCustomersSalesPacket).toContain(
      "Links To Send When The Site Is Live"
    );
    expect(firstCustomersSalesPacket).toContain(
      "Individual learners: https://your-real-domain.example/first-sale"
    );
    expect(firstCustomersSalesPacket).toContain(
      "Individual checkout or interest list: https://your-real-domain.example/checkout"
    );
    expect(firstCustomersSalesPacket).toContain(
      "Practice buyers: https://your-real-domain.example/practice-packs"
    );
    expect(firstCustomersSalesPacket).toContain(
      "LAUNCH_SMOKE_ALLOW_NOT_READY=true"
    );
    expect(firstCustomersSalesPacket).toContain("Six seats for $999");
    expect(firstCustomersSalesPacket).toContain("Do not promise certification");
    expect(firstCustomersSalesPacket).toContain("Common Buyer Objections");
    expect(firstCustomersSalesPacket).toContain(
      "I need to talk to my manager first"
    );
    expect(firstCustomersSalesPacket).toContain(
      "Can you send me the practice pack link and the policies page?"
    );
    expect(firstCustomersSalesPacket).toContain(
      "Do not pressure the buyer or offer medical, legal, hiring, billing, or"
    );
    expect(firstCustomersSalesPacket).toContain("certification advice.");
    expect(firstLeadQualificationCard).not.toContain("sk_test_");
    expect(firstLeadQualificationCard).not.toContain("whsec_");
    expect(firstWeekSalesPlan).not.toContain("sk_test_");
    expect(firstWeekSalesPlan).not.toContain("whsec_");
    expect(individualLearnerDecisionOnePager).toContain(
      "OptiTech Academy Individual Learner Decision One-Pager"
    );
    expect(individualLearnerDecisionOnePager).toContain("Good Fit If You Are");
    expect(individualLearnerDecisionOnePager).toContain(
      "Founding Learner Access is $299"
    );
    expect(individualLearnerDecisionOnePager).toContain(
      "This is education, not certification"
    );
    expectTextToContainWords(
      individualLearnerDecisionOnePager,
      "Do not add patient names, private employer details, passwords, raw sign-in links, secrets, or payment card information."
    );
    expect(practiceManagerApprovalOnePager).toContain(
      "OptiTech Academy Practice Manager Approval One-Pager"
    );
    expect(practiceManagerApprovalOnePager).toContain(
      "Why This May Help The Practice"
    );
    expect(practiceManagerApprovalOnePager).toContain(
      "This is not a certification program"
    );
    expect(practiceManagerApprovalOnePager).toContain("Six-seat practice pack");
    expectTextToContainWords(
      practiceManagerApprovalOnePager,
      "Do not add patient names, chart details, private employee performance notes, secrets, or payment card information."
    );
    expect(manualPaymentLinkChecklist).toContain(
      "OptiTech Academy Manual Payment Link Checklist"
    );
    expect(manualPaymentLinkChecklist).toContain(
      "PUBLIC_STRIPE_PAYMENT_LINK_FOUNDING_LEARNER"
    );
    expect(manualPaymentLinkChecklist).toContain("pnpm launch:fulfillment");
    expect(manualPaymentLinkChecklist).toContain(
      "Do not use manual payment links for broad public launch"
    );
    expect(manualPaymentLinkChecklist).not.toContain("sk_test_");
    expect(manualPaymentLinkChecklist).not.toContain("whsec_");
    expect(staticFirstSalePageGuide).toContain(
      "OptiTech Academy Static First-Sale Page Guide"
    );
    expect(staticFirstSalePageGuide).toContain(
      "pnpm launch:static-first-sale-page"
    );
    expect(staticFirstSalePageGuide).toContain("launch-static/first-sale.html");
    expect(staticFirstSalePageGuide).toContain("pnpm launch:fulfillment");
    expect(staticFirstSalePageGuide).not.toContain("sk_test_");
    expect(staticFirstSalePageGuide).not.toContain("whsec_");
    expect(firstBuyerFulfillmentChecklist).toContain(
      "OptiTech Academy First Buyer Fulfillment Checklist"
    );
    expect(firstBuyerFulfillmentChecklist).toContain(
      "Individual Learner Fulfillment"
    );
    expect(firstBuyerFulfillmentChecklist).toContain(
      "Practice Pack Fulfillment"
    );
    expect(firstBuyerFulfillmentChecklist).toContain(
      "First 24 Hours After A Real Purchase"
    );
    expect(firstBuyerFulfillmentChecklist).toContain(
      "Decide whether to continue outreach, pause outreach, or fix one issue"
    );
    expect(revenueAndSalesTrackerTemplate).toContain(
      "OptiTech Academy Revenue And Sales Tracker Template"
    );
    expect(revenueAndSalesTrackerTemplate).toContain(
      "First 24-Hour Sale Review"
    );
    expect(revenueAndSalesTrackerTemplate).toContain(
      "Continue / Pause / Fix first"
    );
    expect(revenueAndSalesTrackerTemplate).toContain("Weekly Business Review");
    expect(revenueAndSalesTrackerTemplate).toContain(
      "First Buyer Feedback Tracker"
    );
    expect(revenueAndSalesTrackerTemplate).toContain(
      "Do not paste secrets, private medical details, or raw access links"
    );
    expect(revenueAndSalesTrackerTemplate).not.toContain("sk_test_");
    expect(revenueAndSalesTrackerTemplate).not.toContain("whsec_");
    expect(stripeSetupGuide).toContain("OptiTech Academy Stripe Setup Guide");
    expect(stripeSetupGuide).toContain("checkout.session.completed");
    expect(emailSetupGuide).toContain("OptiTech Academy Email Setup Guide");
    expect(emailSetupGuide).toContain("TRANSACTIONAL_EMAIL_API_URL");
    expect(emailSetupGuide).toContain("https://api.resend.com/emails");
    expect(databaseSetupGuide).toContain(
      "OptiTech Academy Database Setup Guide"
    );
    expect(databaseSetupGuide).toContain("pnpm db:setup");
    expect(clinicalReviewGuide).toContain(
      "OptiTech Academy Clinical Review Guide"
    );
    expect(clinicalReviewGuide).toContain(
      "MODULE_ONE_CLINICAL_REVIEW_APPROVED=true"
    );
    expect(clinicalReviewRequestTemplate).toContain(
      "OptiTech Academy Clinical Review Request Template"
    );
    expect(clinicalReviewRequestTemplate).toContain("Approved as written");
    expect(clinicalReviewRequestTemplate).toContain("Not approved yet");
    expect(clinicalReviewRequestTemplate).not.toContain("sk_test_");
    expect(clinicalReviewRequestTemplate).not.toContain("whsec_");
    expect(goLiveChecklist).toContain("OptiTech Academy Go-Live Checklist");
    expect(goLiveChecklist).toContain("ENABLE_PAID_ENROLLMENT=true");
    expect(goLiveChecklist).toContain("/api/checkout/availability");
    expect(goLiveChecklist).toContain("pnpm launch:secret-scan");
    expect(productionEnvChecklist).toContain("`STRIPE_SECRET_KEY`");
    expect(launchDoctorReport).toContain("OptiTech Academy Launch Doctor");
    expect(launchDoctorReport).toContain("Paid launch ready: no");
    expect(launchDoctorReport).toContain("Alert admin");
    expect(manualQaEvidence).toContain(
      "OptiTech Academy Manual Launch QA Evidence"
    );
    expectTextToContainWords(
      manualQaEvidence,
      "Test the paid learner flow end to end"
    );
    expect(manualQaEvidence).toContain(
      "Individual checkout success return URL:"
    );
    expect(manualQaEvidence).toContain("Production Build Proof");
    expect(manualQaEvidence).toContain(
      "Production build passed with `pnpm build`"
    );
    expect(manualQaEvidence).toContain("Build environment:");
    expect(manualQaEvidence).toContain("Practice checkout success return URL:");
    expect(supportRunbook).toContain(
      "OptiTech Academy First Sale Support Runbook"
    );
    expect(supportRunbook).toContain("Payment Succeeded But Access Is Missing");
    expect(supportRunbook).toContain("recommended next support actions");
    expect(emergencyStopGuide).toContain(
      "OptiTech Academy Paid Launch Emergency Stop"
    );
    expect(emergencyStopGuide).toContain("ENABLE_PAID_ENROLLMENT=false");
    expect(emergencyStopGuide).toContain("/api/checkout/availability");
    expect(emergencyStopGuide).toContain("Pause or deactivate");
    expect(bootcampContentMigrationChecklist).toContain(
      "OptiTech Academy Bootcamp Content Migration Checklist"
    );
    expect(bootcampContentMigrationChecklist).toContain(
      "Bootcamp days mapped: 10"
    );
    expect(bootcampContentMigrationChecklist).toContain(
      "NotebookLM source workspace"
    );
    expect(supportRunbook).not.toContain("sk_test_");
    expect(supportRunbook).not.toContain("whsec_");
    expect(emergencyStopGuide).not.toContain("sk_test_");
    expect(emergencyStopGuide).not.toContain("whsec_");
    expect(bootcampContentMigrationChecklist).not.toContain("sk_test_");
    expect(bootcampContentMigrationChecklist).not.toContain("whsec_");
    expect(readinessSnapshot).toContain("STRIPE_SECRET_KEY");
    expect(readinessSnapshot).not.toContain("sk_test_");
    expect(readinessSnapshot).not.toContain("whsec_");
  });
});
