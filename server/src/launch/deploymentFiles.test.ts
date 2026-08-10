import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("deployment files", () => {
  it("documents how a Node host starts the production web service", async () => {
    const procfile = await readFile(
      path.resolve(process.cwd(), "Procfile"),
      "utf8"
    );

    expect(procfile.trim()).toBe("web: node dist/index.js");
  });

  it("keeps the Docker image aligned with the same production entrypoint", async () => {
    const dockerfile = await readFile(
      path.resolve(process.cwd(), "Dockerfile"),
      "utf8"
    );

    expect(dockerfile).toContain('CMD ["node", "dist/index.js"]');
    expect(dockerfile).toContain("/api/health");
  });

  it("keeps local backups and evidence out of Docker build context", async () => {
    const dockerignore = await readFile(
      path.resolve(process.cwd(), ".dockerignore"),
      "utf8"
    );

    expect(dockerignore).toContain(".env");
    expect(dockerignore).toContain("launch-evidence");
    expect(dockerignore).toContain("*.zip");
    expect(dockerignore).toContain("*.bundle");
    expect(dockerignore).toContain("node_modules");
  });

  it("keeps portable home-PC backups out of Git status", async () => {
    const gitignore = await readFile(
      path.resolve(process.cwd(), ".gitignore"),
      "utf8"
    );

    expect(gitignore).toContain("optitech-academy-source-*.zip");
    expect(gitignore).toContain("optitech-academy-branch-*.bundle");
  });

  it("keeps the current backup manifest useful for home-PC restore", async () => {
    const manifest = await readFile(
      path.resolve(process.cwd(), "docs/launch/current-backup-manifest.md"),
      "utf8"
    );

    expect(manifest).toContain("Latest confirmed backup point");
    expect(manifest).toContain("codex/optitech-product-spec");
    expect(manifest).toContain(
      "https://drive.google.com/drive/folders/1pA_fNKEMLKnCmhn6tkM7VLrEj7fgX97T"
    );
    const backupCommit = manifest.match(/- Commit: `([0-9a-f]{7})`/)?.[1];
    expect(backupCommit).toBeTruthy();
    expect(manifest).toMatch(
      new RegExp(
        `optitech-academy-source-\\d{4}-\\d{2}-\\d{2}-${backupCommit}-tracked\\.zip`
      )
    );
    expect(manifest).toMatch(
      new RegExp(
        `optitech-academy-branch-\\d{4}-\\d{2}-\\d{2}-${backupCommit}\\.bundle`
      )
    );
    expect(manifest).toMatch(
      new RegExp(
        `optitech-academy-launch-evidence-\\d{4}-\\d{2}-\\d{2}-${backupCommit}\\.zip`
      )
    );
    expect(manifest).toMatch(
      new RegExp(
        `optitech-academy-static-first-sale-page-\\d{4}-\\d{2}-\\d{2}-${backupCommit}\\.zip`
      )
    );
    expect(manifest).not.toContain("sk_test_");
    expect(manifest).not.toContain("whsec_");
  });

  it("keeps the Render Blueprint aligned with the launch service", async () => {
    const renderBlueprint = await readFile(
      path.resolve(process.cwd(), "render.yaml"),
      "utf8"
    );

    expect(renderBlueprint).toContain("name: optitech-academy");
    expect(renderBlueprint).toContain("runtime: node");
    expect(renderBlueprint).toContain("pnpm build");
    expect(renderBlueprint).toContain("preDeployCommand: pnpm db:setup");
    expect(renderBlueprint).toContain("startCommand: node dist/index.js");
    expect(renderBlueprint).toContain("healthCheckPath: /api/health");
    expect(renderBlueprint).toContain("fromDatabase:");
    expect(renderBlueprint).toContain("sync: false");
    expect(renderBlueprint).toContain("generateValue: true");
    expect(renderBlueprint).toContain("ALERT_ADMIN_TOKEN");
    expect(renderBlueprint).toContain(
      "PUBLIC_STRIPE_PAYMENT_LINK_FOUNDING_LEARNER"
    );
    expect(renderBlueprint).toContain(
      "PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_5_SEATS"
    );
    expect(renderBlueprint).toContain(
      "PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_15_SEATS"
    );
    expect(renderBlueprint).not.toContain("sk_test_");
    expect(renderBlueprint).not.toContain("whsec_");
  });

  it("keeps the homepage aligned with live checkout availability", async () => {
    const homePage = await readFile(
      path.resolve(process.cwd(), "client/src/pages/Home.tsx"),
      "utf8"
    );

    expect(homePage).toContain("fetchCheckoutAvailability");
    expect(homePage).toContain("Checking enrollment status");
    expect(homePage).toContain("/checkout#learner-interest");
    expect(homePage).toContain("/practice-packs#practice-inquiry");
    expect(homePage).toContain("Join Interest List");
    expect(homePage).toContain("Start Practice Inquiry");
    expect(homePage).toContain("Go to the safest next step");
    expect(homePage).not.toContain("sk_test_");
    expect(homePage).not.toContain("whsec_");
  });

  it("keeps checkout return states action-oriented for paid buyers", async () => {
    const checkoutStatusClient = await readFile(
      path.resolve(process.cwd(), "client/src/lib/checkoutStatus.ts"),
      "utf8"
    );
    const checkoutPage = await readFile(
      path.resolve(process.cwd(), "client/src/pages/Checkout.tsx"),
      "utf8"
    );
    const practicePacksPage = await readFile(
      path.resolve(process.cwd(), "client/src/pages/PracticePacks.tsx"),
      "utf8"
    );
    const learnPage = await readFile(
      path.resolve(process.cwd(), "client/src/pages/Learn.tsx"),
      "utf8"
    );

    expect(checkoutStatusClient).toContain(
      "Request sign-in and start Module 1"
    );
    expect(checkoutStatusClient).toContain("Open seat setup tools");
    expect(checkoutStatusClient).toContain("Return to checkout");
    expect(checkoutStatusClient).toContain("Return to practice packs");
    expect(checkoutStatusClient).toContain("/practice-seat-admin");
    expect(checkoutPage).toContain("checkoutStatus.action.href");
    expect(checkoutPage).toContain("checkoutStatus.action.label");
    expect(practicePacksPage).toContain("checkoutStatus.action.href");
    expect(practicePacksPage).toContain("checkoutStatus.action.label");
    expect(learnPage).toContain("buyerSupportContact");
    expect(learnPage).toContain("Email support if access looks wrong");
    expect(learnPage).toContain("Email support if access is missing");
    expect(learnPage).toContain("supportHref");
    expect(checkoutStatusClient).not.toContain("sk_test_");
    expect(checkoutStatusClient).not.toContain("whsec_");
    expect(learnPage).not.toContain("sk_test_");
    expect(learnPage).not.toContain("whsec_");
  });

  it("keeps the Skills Passport connected to lesson start and Spindel onboarding", async () => {
    const skillsPassportPage = await readFile(
      path.resolve(process.cwd(), "client/src/pages/SkillsPassport.tsx"),
      "utf8"
    );

    expect(skillsPassportPage).toContain("Start Module 1");
    expect(skillsPassportPage).toContain('href="/learn"');
    expect(skillsPassportPage).toContain("Start as demo learner");
    expect(skillsPassportPage).toContain(
      "/api/dev/demo-learner/start?email=jeff.demo%40example.com"
    );
    expect(skillsPassportPage).toContain("spindelOnboardingLanes");
    expect(skillsPassportPage).toContain("Spindel Eye onboarding layer");
    expect(skillsPassportPage).toContain("Onboarding assessment");
    expect(skillsPassportPage).not.toContain("sk_test_");
    expect(skillsPassportPage).not.toContain("whsec_");
  });

  it("runs the launch secret scan and local course smoke check in GitHub launch CI", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const workflow = await readFile(
      path.resolve(process.cwd(), ".github/workflows/launch-ci.yml"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:secret-scan": "node scripts/launch-secret-scan.mjs"'
    );
    expect(packageJson).toContain(
      '"launch:preflight": "pnpm check && pnpm test && pnpm launch:secret-scan && pnpm launch:offer-audit && pnpm launch:source-audit && pnpm launch:deployment-audit && pnpm build && pnpm launch:local-course-smoke && pnpm launch:bundle"'
    );
    expect(packageJson).toContain(
      '"launch:local-course-smoke": "node scripts/launch-local-course-smoke.mjs"'
    );
    expect(workflow).toContain("pnpm launch:preflight");
    expect(workflow).toContain("pnpm launch:secret-scan");
    expect(workflow).toContain("actions/upload-artifact@v4");
  });

  it("keeps production database setup runnable without tsx", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const dbSetupScript = await readFile(
      path.resolve(process.cwd(), "scripts/db-setup.mjs"),
      "utf8"
    );
    const renderBlueprint = await readFile(
      path.resolve(process.cwd(), "render.yaml"),
      "utf8"
    );

    expect(packageJson).toContain('"db:setup": "node scripts/db-setup.mjs"');
    expect(packageJson).not.toContain(
      '"db:setup": "tsx server/src/db/runSetup.ts"'
    );
    expect(renderBlueprint).toContain("preDeployCommand: pnpm db:setup");
    expect(dbSetupScript).toContain("DATABASE_URL is required");
    expect(dbSetupScript).toContain(
      "CREATE TABLE IF NOT EXISTS commerce_purchases"
    );
    expect(dbSetupScript).toContain("CREATE TABLE IF NOT EXISTS auth_sessions");
    expect(dbSetupScript).toContain(
      "CREATE TABLE IF NOT EXISTS learning_lesson_completions"
    );
    expect(dbSetupScript).toContain(
      "CREATE TABLE IF NOT EXISTS assessment_attempts"
    );
    expect(dbSetupScript).toContain("Launch database setup complete.");
    expect(dbSetupScript).not.toContain("execSync");
    expect(dbSetupScript).not.toContain("sk_test_");
    expect(dbSetupScript).not.toContain("whsec_");
  });

  it("keeps the deployment smoke test runnable without tsx", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const smokeScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-smoke.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:smoke": "node scripts/launch-smoke.mjs"'
    );
    expect(packageJson).not.toContain(
      '"launch:smoke": "tsx server/src/launch/runDeploymentSmokeTest.ts"'
    );
    expect(smokeScript).toContain("A deployed base URL is required.");
    expect(smokeScript).toContain("/api/health");
    expect(smokeScript).toContain("/api/launch/readiness");
    expect(smokeScript).toContain("/api/checkout/availability");
    expect(smokeScript).toContain("LAUNCH_SMOKE_ALLOW_NOT_READY");
    expect(smokeScript).toContain("LAUNCH_SMOKE_REPORT_PATH");
    expect(smokeScript).toContain("LAUNCH_SMOKE_TEST_PRACTICE_INQUIRY");
    expect(smokeScript).toContain("LAUNCH_SMOKE_TEST_LEARNER_INTEREST");
    expect(smokeScript).toContain("OptiTech Academy Deployment Smoke Test");
    expect(smokeScript).not.toContain("execSync");
    expect(smokeScript).not.toContain("sk_test_");
    expect(smokeScript).not.toContain("whsec_");
  });

  it("keeps the launch go/no-go report runnable without tsx", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const goNoGoScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-go-no-go.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:go-no-go": "node scripts/launch-go-no-go.mjs"'
    );
    expect(packageJson).not.toContain(
      '"launch:go-no-go": "tsx server/src/launch/runLaunchGoNoGo.ts"'
    );
    expect(goNoGoScript).toContain("Launch Go/No-Go Report");
    expect(goNoGoScript).toContain("runSmokeTest");
    expect(goNoGoScript).toContain("Paid checkout links");
    expect(goNoGoScript).toContain("Safe Outreach Rule");
    expect(goNoGoScript).not.toContain("execSync");
    expect(goNoGoScript).not.toContain("sk_test_");
    expect(goNoGoScript).not.toContain("whsec_");
  });

  it("keeps the backup handoff command runnable without tsx", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const backupScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-backup-handoff.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:backup": "node scripts/launch-backup-handoff.mjs"'
    );
    expect(packageJson).toContain(
      '"launch:work-safe-preflight": "pnpm check && pnpm launch:secret-scan && pnpm launch:offer-audit && pnpm launch:source-audit && pnpm launch:deployment-audit && pnpm launch:blockers"'
    );
    expect(packageJson).toContain(
      '"launch:workstation-handoff": "pnpm launch:work-safe-preflight && node scripts/launch-backup-handoff.mjs && node scripts/launch-post-0716-handoff.mjs && node scripts/launch-first-revenue-path.mjs"'
    );
    expect(backupScript).toContain('path.join(projectRoot, ".git", "HEAD")');
    expect(backupScript).toContain("formatBackupStatus");
    expect(backupScript).toContain("git clone ${restoreBundleName}");
    expect(backupScript).toContain("git remote set-url origin");
    expect(backupScript).toContain("pnpm install");
    expect(backupScript).toContain("pnpm launch:preflight");
    expect(backupScript).toContain("pnpm launch:deployment-audit");
    expect(backupScript).toContain("pnpm launch:first-sales");
    expect(backupScript).not.toContain("execSync");
  });

  it("keeps the Notebook and Drive course source audit runnable without secrets", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const readme = await readFile(
      path.resolve(process.cwd(), "README.md"),
      "utf8"
    );
    const sourceAuditScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-source-audit.mjs"),
      "utf8"
    );
    const goLiveScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-go-live-packet.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:source-audit": "node scripts/launch-source-audit.mjs"'
    );
    expect(packageJson).toContain("pnpm launch:source-audit");
    expect(readme).toContain("pnpm launch:source-audit");
    expect(goLiveScript).toContain("pnpm launch:source-audit");
    expect(sourceAuditScript).toContain("OptiTech Academy Course Source Audit");
    expect(sourceAuditScript).toContain("LAUNCH_SOURCE_AUDIT_REPORT_PATH");
    expect(sourceAuditScript).toContain(
      "https://notebook.google.com/notebook/a4bc6fed-4059-4597-a60f-a43aa78ff3e1"
    );
    expect(sourceAuditScript).toContain(
      "https://drive.google.com/drive/folders/1tEGzMv4hXrCjZQwMnXyD2eWXqp1JkT5q"
    );
    expect(sourceAuditScript).toContain(
      "NotebookLM and Google Drive are source workspaces"
    );
    expect(sourceAuditScript).not.toContain("execSync");
    expect(sourceAuditScript).not.toContain("sk_test_");
    expect(sourceAuditScript).not.toContain("whsec_");
  });

  it("keeps the first-revenue path tied to outside dashboard setup", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const firstRevenueScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-first-revenue-path.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:first-revenue": "node scripts/launch-first-revenue-path.mjs"'
    );
    expect(firstRevenueScript).toContain("pnpm launch:external-setup");
    expect(firstRevenueScript).toContain("dashboard and document links");
    expect(firstRevenueScript).toContain("Render, Stripe, Resend/email");
    expect(firstRevenueScript).toContain("pnpm launch:live-purchase-test");
    expect(firstRevenueScript).not.toContain("execSync");
    expect(firstRevenueScript).not.toContain("sk_test_");
    expect(firstRevenueScript).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe external setup worksheet command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const externalSetupScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-external-setup.mjs"),
      "utf8"
    );
    const externalSetupWorksheet = await readFile(
      path.resolve(process.cwd(), "docs/launch/external-setup-worksheet.md"),
      "utf8"
    );
    const readme = await readFile(
      path.resolve(process.cwd(), "README.md"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:external-setup": "node scripts/launch-external-setup.mjs"'
    );
    expect(packageJson).not.toContain(
      '"launch:external-setup": "tsx server/src/launch/runExternalSetupWorksheet.ts"'
    );
    expect(externalSetupScript).toContain("external-setup-worksheet.md");
    expect(externalSetupScript).toContain(
      "OptiTech Academy External Setup Session Packet"
    );
    expect(externalSetupScript).toContain("LAUNCH_EXTERNAL_SETUP_REPORT_PATH");
    expect(externalSetupScript).toContain(
      "launch-evidence/external-setup-session.md"
    );
    expect(externalSetupScript).toContain("pnpm launch:env-template");
    expect(externalSetupScript).toContain("pnpm launch:dashboard-proof");
    expect(externalSetupScript).toContain("pnpm launch:live-purchase-test");
    expect(externalSetupScript).toContain("ENABLE_PAID_ENROLLMENT");
    expect(externalSetupScript).toContain("checkout.session.completed");
    expect(externalSetupScript).not.toContain("execSync");
    expect(externalSetupScript).not.toContain("sk_test_");
    expect(externalSetupScript).not.toContain("whsec_");
    expect(readme).toContain("pnpm launch:external-setup");
    expect(readme).toContain("LAUNCH_EXTERNAL_SETUP_REPORT_PATH");
    expect(externalSetupWorksheet).toContain(
      "OptiTech Academy External Setup Worksheet"
    );
    expect(externalSetupWorksheet).toContain("Create the Render web service");
    expect(externalSetupWorksheet).toContain(
      "Connect Stripe checkout and webhook"
    );
    expect(externalSetupWorksheet).toContain(
      "Connect passwordless sign-in email"
    );
    expect(externalSetupWorksheet).toContain(
      "Record Module 1 clinical review signoff"
    );
    expect(externalSetupWorksheet).toContain(
      "Run one controlled live purchase"
    );
    expect(externalSetupWorksheet).toContain(
      "pnpm launch:clinical-review-request"
    );
    expect(externalSetupWorksheet).not.toContain("sk_test_");
    expect(externalSetupWorksheet).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe deployment audit command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const deploymentAuditScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-deployment-audit.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:deployment-audit": "node scripts/launch-deployment-audit.mjs"'
    );
    expect(deploymentAuditScript).toContain(
      "OptiTech Academy Deployment Audit"
    );
    expect(deploymentAuditScript).toContain("render.yaml");
    expect(deploymentAuditScript).toContain("Dockerfile");
    expect(deploymentAuditScript).toContain("Procfile");
    expect(deploymentAuditScript).toContain("ENABLE_PAID_ENROLLMENT");
    expect(deploymentAuditScript).toContain("ENABLE_LOCAL_COURSE_DEMO");
    expect(deploymentAuditScript).toContain(
      "Render does not enable local demo learner access"
    );
    expect(deploymentAuditScript).toContain(
      "MODULE_ONE_CLINICAL_REVIEW_APPROVED"
    );
    expect(deploymentAuditScript).toContain(
      "PUBLIC_STRIPE_PAYMENT_LINK_FOUNDING_LEARNER"
    );
    expect(deploymentAuditScript).toContain("autoDeployTrigger");
    expect(deploymentAuditScript).not.toContain("execSync");
    expect(deploymentAuditScript).not.toContain("sk_test_");
    expect(deploymentAuditScript).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe launch blocker summary available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const blockerScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-blockers-summary.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:blockers": "node scripts/launch-blockers-summary.mjs"'
    );
    expect(blockerScript).toContain("STRIPE_SECRET_KEY");
    expect(blockerScript).toContain("MODULE_ONE_CLINICAL_REVIEW_APPROVED");
    expect(blockerScript).toContain("docs/launch/go-live-checklist.md");
    expect(blockerScript).toContain("First-Sale Action Order");
    expect(blockerScript).toContain("pnpm launch:preflight");
    expect(blockerScript).toContain("pnpm launch:clinical-review");
    expect(blockerScript).toContain("pnpm launch:env-template");
    expect(blockerScript).toContain("pnpm launch:dashboard-proof");
    expect(blockerScript).toContain("pnpm db:setup");
    expect(blockerScript).toContain("LAUNCH_BASE_URL");
    expect(blockerScript).not.toContain("execSync");
  });

  it("keeps a work-computer-safe host dashboard proof command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const readme = await readFile(
      path.resolve(process.cwd(), "README.md"),
      "utf8"
    );
    const onlineStartGuide = await readFile(
      path.resolve(process.cwd(), "docs/launch/online-start-guide.md"),
      "utf8"
    );
    const productionEnvChecklist = await readFile(
      path.resolve(
        process.cwd(),
        "server/src/launch/productionEnvChecklist.ts"
      ),
      "utf8"
    );
    const productionEnvChecklistDoc = await readFile(
      path.resolve(process.cwd(), "docs/launch/production-env-checklist.md"),
      "utf8"
    );
    const dashboardProofScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-dashboard-proof.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:dashboard-proof": "node scripts/launch-dashboard-proof.mjs"'
    );
    expect(readme).toContain("pnpm launch:dashboard-proof");
    expect(onlineStartGuide).toContain("pnpm launch:dashboard-proof");
    expect(onlineStartGuide).toContain("pnpm launch:dashboard-proof -- --paid");
    expect(productionEnvChecklist).toContain("pnpm launch:dashboard-proof");
    expect(productionEnvChecklistDoc).toContain("pnpm launch:dashboard-proof");
    expect(dashboardProofScript).toContain(
      "OptiTech Academy Host Dashboard Proof"
    );
    expect(dashboardProofScript).toContain(
      "LAUNCH_DASHBOARD_PROOF_REPORT_PATH"
    );
    expect(dashboardProofScript).toContain("LAUNCH_DASHBOARD_PROOF_MODE");
    expect(dashboardProofScript).toContain("paid-launch");
    expect(dashboardProofScript).toContain("closed-store");
    expect(dashboardProofScript).toContain("sk_live_");
    expect(dashboardProofScript).toContain("whsec_");
    expect(dashboardProofScript).toContain("PUBLIC_APP_URL");
    expect(dashboardProofScript).toContain("ENABLE_PAID_ENROLLMENT");
    expect(dashboardProofScript).toContain(
      "without printing the private values"
    );
    expect(dashboardProofScript).not.toContain("execSync");
    expect(dashboardProofScript).not.toContain("console.log(process.env");
    expect(dashboardProofScript).not.toContain("sk_test_");
  });

  it("keeps a work-computer-safe deployed readiness snapshot command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const readme = await readFile(
      path.resolve(process.cwd(), "README.md"),
      "utf8"
    );
    const snapshotGuide = await readFile(
      path.resolve(
        process.cwd(),
        "docs/launch/runtime-readiness-snapshot-guide.md"
      ),
      "utf8"
    );
    const snapshotScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-readiness-snapshot.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:readiness-snapshot": "node scripts/launch-readiness-snapshot.mjs"'
    );
    expect(readme).toContain("pnpm launch:readiness-snapshot");
    expect(snapshotGuide).toContain("pnpm launch:readiness-snapshot");
    expect(snapshotGuide).toContain("checkout-availability.json");
    expect(snapshotGuide).toContain("Link-Sharing Traffic Light");
    expect(snapshotScript).toContain("/api/launch/readiness");
    expect(snapshotScript).toContain("/api/checkout/availability");
    expect(snapshotScript).toContain("runtime-readiness-snapshot.json");
    expect(snapshotScript).toContain("checkout-availability.json");
    expect(snapshotScript).toContain("runtime-readiness-summary.md");
    expect(snapshotScript).toContain("Link-Sharing Traffic Light");
    expect(snapshotScript).toContain("Manual Stripe payment links");
    expect(snapshotScript).not.toContain("sk_test_");
    expect(snapshotScript).not.toContain("whsec_");
    expect(snapshotScript).not.toContain("DATABASE_URL=");
  });

  it("keeps a work-computer-safe passwordless email smoke command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const readme = await readFile(
      path.resolve(process.cwd(), "README.md"),
      "utf8"
    );
    const emailGuide = await readFile(
      path.resolve(process.cwd(), "docs/launch/email-setup-guide.md"),
      "utf8"
    );
    const emailSmokeScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-email-smoke.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:email-smoke": "node scripts/launch-email-smoke.mjs"'
    );
    expect(readme).toContain("pnpm launch:email-smoke");
    expect(emailGuide).toContain("pnpm launch:email-smoke");
    expect(emailSmokeScript).toContain("/api/auth/passwordless/start");
    expect(emailSmokeScript).toContain("LAUNCH_TEST_EMAIL");
    expect(emailSmokeScript).toContain("LAUNCH_EMAIL_SMOKE_REPORT_PATH");
    expect(emailSmokeScript).toContain("passwordless-email-smoke-report.md");
    expect(emailSmokeScript).toContain("Raw sign-in link exposed");
    expect(emailSmokeScript).not.toContain("sk_test_");
    expect(emailSmokeScript).not.toContain("whsec_");
    expect(emailSmokeScript).not.toContain("DATABASE_URL=");
  });

  it("keeps a work-computer-safe Stripe checkout smoke command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const readme = await readFile(
      path.resolve(process.cwd(), "README.md"),
      "utf8"
    );
    const stripeGuide = await readFile(
      path.resolve(process.cwd(), "docs/launch/stripe-setup-guide.md"),
      "utf8"
    );
    const checkoutSmokeScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-checkout-smoke.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:checkout-smoke": "node scripts/launch-checkout-smoke.mjs"'
    );
    expect(readme).toContain("pnpm launch:checkout-smoke");
    expect(stripeGuide).toContain("pnpm launch:checkout-smoke");
    expect(checkoutSmokeScript).toContain("/api/checkout/sessions");
    expect(checkoutSmokeScript).toContain("acceptedTerms: true");
    expect(checkoutSmokeScript).toContain("LAUNCH_CHECKOUT_OFFER_ID");
    expect(checkoutSmokeScript).toContain("LAUNCH_CHECKOUT_SMOKE_REPORT_PATH");
    expect(checkoutSmokeScript).toContain("checkout-session-smoke-report.md");
    expect(checkoutSmokeScript).toContain(
      "Do not share or save the raw Checkout URL"
    );
    expect(checkoutSmokeScript).not.toContain("sk_test_");
    expect(checkoutSmokeScript).not.toContain("whsec_");
    expect(checkoutSmokeScript).not.toContain("DATABASE_URL=");
  });

  it("keeps the next-step command center runnable without tsx", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const nextScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-next.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:next": "node scripts/launch-next.mjs"'
    );
    expect(packageJson).not.toContain(
      '"launch:next": "tsx server/src/launch/runProductionSetupPlan.ts"'
    );
    expect(nextScript).toContain(
      "OptiTech Academy Launch Next-Step Command Center"
    );
    expect(nextScript).toContain("work-computer-safe");
    expect(nextScript).toContain("pnpm launch:clinical-review-request");
    expect(nextScript).toContain("pnpm launch:database-setup");
    expect(nextScript).toContain("pnpm launch:stripe-products");
    expect(nextScript).toContain("pnpm launch:email-setup");
    expect(nextScript).toContain("pnpm launch:admin-tokens");
    expect(nextScript).toContain("ENABLE_PAID_ENROLLMENT=false");
    expect(nextScript).not.toContain("execSync");
    expect(nextScript).not.toContain("sk_test_");
    expect(nextScript).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe launch control checklist command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const controlScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-control-checklist.mjs"),
      "utf8"
    );
    const controlChecklist = await readFile(
      path.resolve(process.cwd(), "docs/launch/launch-control-checklist.md"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:control": "node scripts/launch-control-checklist.mjs"'
    );
    expect(controlScript).toContain("launch-control-checklist.md");
    expect(controlScript).not.toContain("execSync");
    expect(controlChecklist).toContain(
      "OptiTech Academy Launch Control Checklist"
    );
    expect(controlChecklist).toContain("codex/optitech-product-spec");
    expect(controlChecklist).toContain("Money-Ready Gates");
    expect(controlChecklist).toContain("pnpm launch:preflight");
    expect(controlChecklist).toContain("pnpm launch:live-purchase-test");
    expect(controlChecklist).toContain("First Buyer Work");
    expect(controlChecklist).not.toContain("sk_test_");
    expect(controlChecklist).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe production env template command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const envTemplateScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-env-template.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:env-template": "node scripts/launch-env-template.mjs"'
    );
    expect(envTemplateScript).toContain("Host Dashboard Paste Template");
    expect(envTemplateScript).toContain("LAUNCH_ENV_TEMPLATE_REPORT_PATH");
    expect(envTemplateScript).toContain("--public-app-url");
    expect(envTemplateScript).toContain("Recommended report path");
    expect(envTemplateScript).toContain("ENABLE_PAID_ENROLLMENT=false");
    expect(envTemplateScript).toContain(
      "MODULE_ONE_CLINICAL_REVIEW_APPROVED=false"
    );
    expect(envTemplateScript).toContain("TRANSACTIONAL_EMAIL_API_URL");
    expect(envTemplateScript).toContain("STRIPE_SECRET_KEY=");
    expect(envTemplateScript).toContain("STRIPE_WEBHOOK_SECRET=");
    expect(envTemplateScript).not.toContain("execSync");
    expect(envTemplateScript).not.toContain("sk_test_");
    expect(envTemplateScript).not.toContain("whsec_");
  });

  it("keeps work-computer-safe launch secret, sitemap, and Spindel onboarding commands available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const secretsScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-secrets.mjs"),
      "utf8"
    );
    const sitemapScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-sitemap.mjs"),
      "utf8"
    );
    const spindelOnboardingScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-spindel-onboarding.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:secrets": "node scripts/launch-secrets.mjs"'
    );
    expect(packageJson).toContain(
      '"launch:spindel-onboarding": "node scripts/launch-spindel-onboarding.mjs"'
    );
    expect(packageJson).toContain(
      '"launch:sitemap": "node scripts/launch-sitemap.mjs"'
    );
    expect(secretsScript).toContain("OptiTech Academy Launch Secrets");
    expect(secretsScript).toContain("randomBytes");
    expect(sitemapScript).toContain(
      "Set PUBLIC_APP_URL to the real https production domain"
    );
    expect(sitemapScript).toContain("/practice-packs");
    expect(spindelOnboardingScript).toContain(
      "Spindel Eye Technician Onboarding"
    );
    expect(spindelOnboardingScript).toContain("Doctor-Specific Protocols");
    expect(secretsScript).not.toContain("tsx");
    expect(sitemapScript).not.toContain("tsx");
    expect(spindelOnboardingScript).not.toContain("tsx");
    expect(secretsScript).not.toContain("sk_test_");
    expect(sitemapScript).not.toContain("sk_test_");
    expect(spindelOnboardingScript).not.toContain("sk_test_");
  });

  it("keeps a work-computer-safe access revocation packet command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const accessRevocationScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-access-revocation.mjs"),
      "utf8"
    );
    const readme = await readFile(
      path.resolve(process.cwd(), "README.md"),
      "utf8"
    );
    const supportRunbook = await readFile(
      path.resolve(process.cwd(), "docs/launch/first-sale-support-runbook.md"),
      "utf8"
    );
    const emergencyStopGuide = await readFile(
      path.resolve(process.cwd(), "docs/launch/paid-launch-emergency-stop.md"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:access-revocation": "node scripts/launch-access-revocation.mjs"'
    );
    expect(accessRevocationScript).toContain(
      "OptiTech Academy Access Revocation Packet"
    );
    expect(accessRevocationScript).toContain(
      "LAUNCH_ACCESS_REVOCATION_REPORT_PATH"
    );
    expect(accessRevocationScript).toContain("/api/support/access-revocations");
    expect(accessRevocationScript).toContain("practice-seat-assignment");
    expect(accessRevocationScript).toContain("practice-seat-pack");
    expect(accessRevocationScript).toContain("Do not paste Stripe secret keys");
    expect(accessRevocationScript).not.toContain("fetch(");
    expect(accessRevocationScript).not.toContain("execSync");
    expect(accessRevocationScript).not.toContain("sk_test_");
    expect(accessRevocationScript).not.toContain("whsec_");
    expect(readme).toContain("pnpm launch:access-revocation");
    expect(supportRunbook).toContain("pnpm launch:access-revocation");
    expect(emergencyStopGuide).toContain("pnpm launch:access-revocation");
  });

  it("keeps controlled manual Payment Link fulfillment protected and documented", async () => {
    const authRoutes = await readFile(
      path.resolve(process.cwd(), "server/src/routes/auth.ts"),
      "utf8"
    );
    const manualFulfillmentService = await readFile(
      path.resolve(
        process.cwd(),
        "server/src/commerce/manualPaymentFulfillment.ts"
      ),
      "utf8"
    );
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const readme = await readFile(
      path.resolve(process.cwd(), "README.md"),
      "utf8"
    );
    const manualFulfillmentScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-manual-fulfillment.mjs"),
      "utf8"
    );
    const manualPaymentChecklist = await readFile(
      path.resolve(
        process.cwd(),
        "docs/launch/manual-payment-link-checklist.md"
      ),
      "utf8"
    );
    const fulfillmentChecklist = await readFile(
      path.resolve(
        process.cwd(),
        "docs/launch/first-buyer-fulfillment-checklist.md"
      ),
      "utf8"
    );
    const firstBuyerScript = await readFile(
      path.resolve(
        process.cwd(),
        "scripts/launch-first-buyer-command-center.mjs"
      ),
      "utf8"
    );
    const liveUrlScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-live-url-card.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:manual-fulfillment": "node scripts/launch-manual-fulfillment.mjs"'
    );
    expect(authRoutes).toContain("/support/manual-payment-fulfillments");
    expect(authRoutes).toContain("authorizePracticeSeatAdminRequest");
    expect(authRoutes).toContain("fulfillManualPaymentLinkPurchase");
    expect(authRoutes).toContain("It does not replace Stripe webhook proof.");
    expect(manualFulfillmentService).toContain("foundingLearnerOffer");
    expect(manualFulfillmentService).toContain("practicePackOffers");
    expect(manualFulfillmentService).toContain("normalizeCheckoutEmail");
    expect(manualFulfillmentService).toContain(
      "createCommerceFulfillmentService"
    );
    expect(manualFulfillmentService).toContain("manual_");
    expect(manualFulfillmentScript).toContain(
      "OptiTech Academy Manual Fulfillment Packet"
    );
    expect(manualFulfillmentScript).toContain(
      "LAUNCH_MANUAL_FULFILLMENT_REPORT_PATH"
    );
    expect(manualFulfillmentScript).toContain(
      "/api/support/manual-payment-fulfillments"
    );
    expect(manualFulfillmentScript).toContain("x-admin-token");
    expect(manualFulfillmentScript).toContain("practice-five-seat-pack");
    expect(manualFulfillmentScript).toContain(
      "does not call the endpoint by itself"
    );
    expect(manualPaymentChecklist).toContain(
      "/api/support/manual-payment-fulfillments"
    );
    expect(manualPaymentChecklist).toContain("x-admin-token");
    expect(manualPaymentChecklist).toContain("practice-five-seat-pack");
    expect(manualPaymentChecklist).toMatch(/does\s+not replace webhook proof/);
    expect(manualPaymentChecklist).toContain("pnpm launch:manual-fulfillment");
    expect(fulfillmentChecklist).toContain(
      "/api/support/manual-payment-fulfillments"
    );
    expect(readme).toContain("pnpm launch:manual-fulfillment");
    expect(firstBuyerScript).toContain("pnpm launch:manual-fulfillment");
    expect(liveUrlScript).toContain("pnpm launch:manual-fulfillment");
    expect(manualFulfillmentScript).not.toContain("fetch(");
    expect(manualFulfillmentScript).not.toContain("execSync");
    expect(manualFulfillmentScript).not.toContain("sk_test_");
    expect(manualFulfillmentScript).not.toContain("whsec_");
    expect(manualFulfillmentService).not.toContain("execSync");
    expect(authRoutes).not.toContain("sk_test_");
    expect(manualPaymentChecklist).not.toContain("sk_test_");
  });

  it("keeps a work-computer-safe local demo testing command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const readme = await readFile(
      path.resolve(process.cwd(), "README.md"),
      "utf8"
    );
    const localDemoScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-local-demo.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:local-demo": "node scripts/launch-local-demo.mjs"'
    );
    expect(readme).toContain("pnpm launch:local-demo");
    expect(localDemoScript).toContain("OptiTech Academy Local Demo Tester");
    expect(localDemoScript).toContain("ENABLE_LOCAL_COURSE_DEMO");
    expect(localDemoScript).toContain("/api/dev/demo-learner/start");
    expect(localDemoScript).toContain("/learn");
    expect(localDemoScript).not.toContain("sk_test_");
    expect(localDemoScript).not.toContain("whsec_");
    expect(localDemoScript).not.toContain("DATABASE_URL=");
  });

  it("keeps a work-computer-safe clinical review checklist command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const clinicalReviewScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-clinical-review.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:clinical-review": "node scripts/launch-clinical-review.mjs"'
    );
    expect(packageJson).toContain(
      '"launch:clinical-review-request": "node scripts/launch-clinical-review-request.mjs"'
    );
    expect(clinicalReviewScript).toContain(
      "OptiTech Academy Clinical Review Checklist"
    );
    expect(clinicalReviewScript).toContain(
      "pnpm launch:clinical-review-request"
    );
    expect(clinicalReviewScript).toContain(
      "MODULE_ONE_CLINICAL_REVIEW_APPROVED=false"
    );
    expect(clinicalReviewScript).toContain(
      "/api/launch/clinical-review-packet.md"
    );
    expect(clinicalReviewScript).not.toContain("execSync");
    expect(clinicalReviewScript).not.toContain("sk_test_");
    expect(clinicalReviewScript).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe clinical review request command available", async () => {
    const requestScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-clinical-review-request.mjs"),
      "utf8"
    );
    const requestTemplate = await readFile(
      path.resolve(
        process.cwd(),
        "docs/launch/clinical-review-request-template.md"
      ),
      "utf8"
    );
    const clinicalGuide = await readFile(
      path.resolve(process.cwd(), "docs/launch/clinical-review-guide.md"),
      "utf8"
    );

    expect(requestScript).toContain("clinical-review-request-template.md");
    expect(requestScript).not.toContain("execSync");
    expect(clinicalGuide).toContain("pnpm launch:clinical-review-request");
    expect(requestTemplate).toContain(
      "OptiTech Academy Clinical Review Request Template"
    );
    expect(requestTemplate).toContain("Approved as written");
    expect(requestTemplate).toContain("Not approved yet");
    expect(requestTemplate).toContain(
      "MODULE_ONE_CLINICAL_REVIEW_APPROVED=true"
    );
    expect(requestTemplate).not.toContain("sk_test_");
    expect(requestTemplate).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe clinical signoff packet command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const signoffScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-clinical-signoff.mjs"),
      "utf8"
    );
    const clinicalGuide = await readFile(
      path.resolve(process.cwd(), "docs/launch/clinical-review-guide.md"),
      "utf8"
    );
    const readme = await readFile(
      path.resolve(process.cwd(), "README.md"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:clinical-signoff": "node scripts/launch-clinical-signoff.mjs"'
    );
    expect(signoffScript).toContain(
      "OptiTech Academy Module 1 Clinical Signoff Packet"
    );
    expect(signoffScript).toContain("LAUNCH_CLINICAL_SIGNOFF_REPORT_PATH");
    expect(signoffScript).toContain("MODULE_ONE_CLINICAL_REVIEW_APPROVED=true");
    expect(signoffScript).toContain("protected health information");
    expect(signoffScript).not.toContain("execSync");
    expect(signoffScript).not.toContain("sk_test_");
    expect(signoffScript).not.toContain("whsec_");
    expect(clinicalGuide).toContain("pnpm launch:clinical-signoff");
    expect(readme).toContain("pnpm launch:clinical-signoff");
  });

  it("keeps a work-computer-safe first-sales link packet command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const firstSalesScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-first-sales-links.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:first-sales": "node scripts/launch-first-sales-links.mjs"'
    );
    expect(firstSalesScript).toContain(
      "OptiTech Academy First Sales Link Packet"
    );
    expect(firstSalesScript).toContain("LAUNCH_BASE_URL");
    expect(firstSalesScript).toContain("LAUNCH_FIRST_SALES_REPORT_PATH");
    expect(firstSalesScript).toContain("first-sales-link-packet.md");
    expect(firstSalesScript).toContain("/first-sale");
    expect(firstSalesScript).toContain("/checkout");
    expect(firstSalesScript).toContain("/practice-packs");
    expect(firstSalesScript).toContain(
      "docs/launch/first-customers-sales-packet.md"
    );
    expect(firstSalesScript).not.toContain("execSync");
    expect(firstSalesScript).not.toContain("sk_test_");
    expect(firstSalesScript).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe first lead qualification command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const leadQualifierScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-lead-qualifier.mjs"),
      "utf8"
    );
    const leadQualificationCard = await readFile(
      path.resolve(
        process.cwd(),
        "docs/launch/first-lead-qualification-card.md"
      ),
      "utf8"
    );
    const firstBuyerScript = await readFile(
      path.resolve(
        process.cwd(),
        "scripts/launch-first-buyer-command-center.mjs"
      ),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:lead-qualifier": "node scripts/launch-lead-qualifier.mjs"'
    );
    expect(packageJson).toContain(
      '"launch:first-buyer": "node scripts/launch-first-buyer-command-center.mjs"'
    );
    expect(leadQualifierScript).toContain("first-lead-qualification-card.md");
    expect(leadQualifierScript).not.toContain("execSync");
    expect(firstBuyerScript).toContain("LAUNCH_BASE_URL");
    expect(firstBuyerScript).toContain("LAUNCH_FIRST_BUYER_REPORT_PATH");
    expect(firstBuyerScript).toContain("first-buyer-command-center.md");
    expect(firstBuyerScript).toContain("pnpm launch:lead-qualifier");
    expect(firstBuyerScript).toContain(
      "/api/support/manual-payment-fulfillments"
    );
    expect(firstBuyerScript).not.toContain("execSync");
    expect(leadQualificationCard).toContain(
      "OptiTech Academy First Lead Qualification Card"
    );
    expect(leadQualificationCard).toContain("Quick Fit Score");
    expect(leadQualificationCard).toContain("Individual Learner Next Action");
    expect(leadQualificationCard).toContain("Practice Buyer Next Action");
    expect(leadQualificationCard).toContain("Only send the paid checkout path");
    expect(leadQualificationCard).not.toContain("sk_test_");
    expect(leadQualificationCard).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe first 10 customers launch command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const firstCustomersScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-first-10-customers.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:first-10-customers": "node scripts/launch-first-10-customers.mjs"'
    );
    expect(firstCustomersScript).toContain(
      "OptiTech Academy First 10 Customers Plan"
    );
    expect(firstCustomersScript).toContain(
      "LAUNCH_FIRST_10_CUSTOMERS_REPORT_PATH"
    );
    expect(firstCustomersScript).toContain("first-10-customers-plan.md");
    expect(firstCustomersScript).toContain("Individual learners");
    expect(firstCustomersScript).toContain("Practice buyers");
    expect(firstCustomersScript).toContain("Do not send paid checkout links");
    expect(firstCustomersScript).toContain(
      "docs/launch/first-customers-sales-packet.md"
    );
    expect(firstCustomersScript).not.toContain("execSync");
    expect(firstCustomersScript).not.toContain("sk_test_");
    expect(firstCustomersScript).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe first week sales plan command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const firstWeekScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-first-week-sales.mjs"),
      "utf8"
    );
    const firstWeekPlan = await readFile(
      path.resolve(process.cwd(), "docs/launch/first-week-sales-plan.md"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:first-week-sales": "node scripts/launch-first-week-sales.mjs"'
    );
    expect(firstWeekScript).toContain("first-week-sales-plan.md");
    expect(firstWeekScript).toContain("LAUNCH_FIRST_WEEK_SALES_REPORT_PATH");
    expect(firstWeekScript).not.toContain("execSync");
    expect(firstWeekPlan).toContain("OptiTech Academy First Week Sales Plan");
    expect(firstWeekPlan).toContain("Day 1: Prepare the warm list");
    expect(firstWeekPlan).toContain("Day 7: Choose next week's focus");
    expect(firstWeekPlan).toContain("pnpm launch:lead-qualifier");
    expect(firstWeekPlan).toContain("One internal live purchase");
    expect(firstWeekPlan).not.toContain("sk_test_");
    expect(firstWeekPlan).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe sales tracker export command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const salesTrackerScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-sales-tracker.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:sales-tracker": "node scripts/launch-sales-tracker.mjs"'
    );
    expect(salesTrackerScript).toContain("lead-tracker.csv");
    expect(salesTrackerScript).toContain("purchase-tracker.csv");
    expect(salesTrackerScript).toContain("LAUNCH_SALES_TRACKER_OUTPUT_DIR");
    expect(salesTrackerScript).toContain("--output-dir=");
    expect(salesTrackerScript).toContain("sales-tracker-templates");
    expect(salesTrackerScript).toContain("first-24-hour-sale-review.csv");
    expect(salesTrackerScript).toContain(
      "first-buyer-fulfillment-checklist.csv"
    );
    expect(salesTrackerScript).toContain("first-buyer-feedback-tracker.csv");
    expect(salesTrackerScript).toContain("weekly-business-review.csv");
    expect(salesTrackerScript).toContain("Do not paste secrets");
    expect(salesTrackerScript).not.toContain("execSync");
    expect(salesTrackerScript).not.toContain("sk_test_");
    expect(salesTrackerScript).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe first buyer feedback packet command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const feedbackScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-first-buyer-feedback.mjs"),
      "utf8"
    );
    const firstCustomersPacket = await readFile(
      path.resolve(
        process.cwd(),
        "docs/launch/first-customers-sales-packet.md"
      ),
      "utf8"
    );
    const salesTrackerTemplate = await readFile(
      path.resolve(
        process.cwd(),
        "docs/launch/revenue-and-sales-tracker-template.md"
      ),
      "utf8"
    );
    const readme = await readFile(
      path.resolve(process.cwd(), "README.md"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:first-buyer-feedback": "node scripts/launch-first-buyer-feedback.mjs"'
    );
    expect(feedbackScript).toContain(
      "OptiTech Academy First Buyer Feedback Packet"
    );
    expect(feedbackScript).toContain("LAUNCH_FIRST_BUYER_FEEDBACK_REPORT_PATH");
    expect(feedbackScript).toContain("Testimonial Consent Rules");
    expect(feedbackScript).toContain("Continue Or Pause Decision");
    expect(feedbackScript).toContain("patient information");
    expect(feedbackScript).toContain("protected health information");
    expect(feedbackScript).toContain("certification");
    expect(feedbackScript).toContain("employment");
    expect(feedbackScript).toContain("practice manager");
    expect(firstCustomersPacket).toContain("pnpm launch:first-buyer-feedback");
    expect(salesTrackerTemplate).toContain("First Buyer Feedback Tracker");
    expect(salesTrackerTemplate).toContain("first-buyer-feedback-tracker.csv");
    expect(readme).toContain("pnpm launch:first-buyer-feedback");
    expect(feedbackScript).not.toContain("execSync");
    expect(feedbackScript).not.toContain("sk_test_");
    expect(feedbackScript).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe Stripe product setup command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const stripeProductsScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-stripe-products.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:stripe-products": "node scripts/launch-stripe-products.mjs"'
    );
    expect(stripeProductsScript).toContain(
      "OptiTech Academy Stripe Product Setup"
    );
    expect(stripeProductsScript).toContain("optitech_founding_learner_199");
    expect(stripeProductsScript).toContain("optitech_practice_5_seats_799");
    expect(stripeProductsScript).toContain("optitech_practice_15_seats_1799");
    expect(stripeProductsScript).toContain("checkout.session.completed");
    expect(stripeProductsScript).not.toContain("execSync");
    expect(stripeProductsScript).not.toContain("sk_test_");
    expect(stripeProductsScript).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe email setup command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const emailSetupScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-email-setup.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:email-setup": "node scripts/launch-email-setup.mjs"'
    );
    expect(emailSetupScript).toContain("OptiTech Academy Email Setup");
    expect(emailSetupScript).toContain("TRANSACTIONAL_EMAIL_API_URL");
    expect(emailSetupScript).toContain("https://api.resend.com/emails");
    expect(emailSetupScript).toContain("SIGN_IN_FROM_EMAIL");
    expect(emailSetupScript).toContain("Your OptiTech Academy sign-in link");
    expect(emailSetupScript).not.toContain("execSync");
    expect(emailSetupScript).not.toContain("sk_test_");
    expect(emailSetupScript).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe database setup command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const databaseSetupScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-database-setup.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:database-setup": "node scripts/launch-database-setup.mjs"'
    );
    expect(databaseSetupScript).toContain("OptiTech Academy Database Setup");
    expect(databaseSetupScript).toContain("DATABASE_URL=");
    expect(databaseSetupScript).toContain("DATABASE_SSL=true");
    expect(databaseSetupScript).toContain("commerce_purchases");
    expect(databaseSetupScript).toContain("auth_magic_links");
    expect(databaseSetupScript).toContain("assessment_attempts");
    expect(databaseSetupScript).not.toContain("execSync");
    expect(databaseSetupScript).not.toContain("postgres://");
    expect(databaseSetupScript).not.toContain("sk_test_");
    expect(databaseSetupScript).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe admin token setup command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const adminTokensScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-admin-tokens.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:admin-tokens": "node scripts/launch-admin-tokens.mjs"'
    );
    expect(adminTokensScript).toContain("OptiTech Academy Admin Token Setup");
    expect(adminTokensScript).toContain("PRACTICE_SEAT_ADMIN_TOKEN");
    expect(adminTokensScript).toContain("ALERT_ADMIN_TOKEN");
    expect(adminTokensScript).toContain("/practice-seat-admin");
    expect(adminTokensScript).toContain("/admin/alert-templates");
    expect(adminTokensScript).not.toContain("execSync");
    expect(adminTokensScript).not.toContain("sk_test_");
    expect(adminTokensScript).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe Render deployment setup command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const readme = await readFile(
      path.resolve(process.cwd(), "README.md"),
      "utf8"
    );
    const onlineStartGuide = await readFile(
      path.resolve(process.cwd(), "docs/launch/online-start-guide.md"),
      "utf8"
    );
    const renderSetupScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-render-setup.mjs"),
      "utf8"
    );
    const firstRenderDeployScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-first-render-deploy.mjs"),
      "utf8"
    );
    const firstRevenueScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-first-revenue-path.mjs"),
      "utf8"
    );
    const firstRenderDeployEvidence = await readFile(
      path.resolve(
        process.cwd(),
        "docs/launch/first-render-deploy-evidence.md"
      ),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:render-setup": "node scripts/launch-render-setup.mjs"'
    );
    expect(packageJson).toContain(
      '"launch:first-render-deploy": "node scripts/launch-first-render-deploy.mjs"'
    );
    expect(readme).toContain("pnpm launch:first-render-deploy");
    expect(onlineStartGuide).toContain("pnpm launch:first-render-deploy");
    expect(firstRevenueScript).toContain("pnpm launch:first-render-deploy");
    expect(firstRenderDeployScript).toContain(
      "first-render-deploy-evidence.md"
    );
    expect(firstRenderDeployScript).toContain(
      "LAUNCH_FIRST_RENDER_REPORT_PATH"
    );
    expect(firstRenderDeployScript).toContain("Commit to deploy");
    expect(firstRenderDeployScript).toContain("pnpm launch:live-url");
    expect(firstRenderDeployScript).not.toContain("execSync");
    expect(firstRenderDeployEvidence).toContain(
      "OptiTech Academy First Render Deploy Evidence"
    );
    expect(firstRenderDeployEvidence).toContain(
      "pnpm launch:first-render-deploy"
    );
    expect(firstRenderDeployEvidence).toContain("pnpm launch:preflight");
    expect(firstRenderDeployEvidence).toContain("LAUNCH_SMOKE_REPORT_PATH");
    expect(firstRenderDeployEvidence).toContain(
      "launch-evidence/first-render-smoke-report.md"
    );
    expect(firstRenderDeployEvidence).not.toContain("sk_test_");
    expect(firstRenderDeployEvidence).not.toContain("whsec_");
    expect(renderSetupScript).toContain(
      "OptiTech Academy Render Deployment Setup"
    );
    expect(renderSetupScript).toContain("render.yaml");
    expect(renderSetupScript).toContain("optitech-academy");
    expect(renderSetupScript).toContain("https://render.com/deploy?repo=");
    expect(renderSetupScript).toContain("codex%2Foptitech-product-spec");
    expect(renderSetupScript).toContain("pnpm build");
    expect(renderSetupScript).toContain("pnpm db:setup");
    expect(renderSetupScript).toContain("node dist/index.js");
    expect(renderSetupScript).toContain("/api/health");
    expect(renderSetupScript).toContain("/api/launch/readiness");
    expect(renderSetupScript).toContain("pnpm launch:env-template");
    expect(renderSetupScript).toContain("LAUNCH_ENV_TEMPLATE_REPORT_PATH");
    expect(renderSetupScript).toContain("LAUNCH_SMOKE_ALLOW_NOT_READY");
    expect(renderSetupScript).not.toContain("execSync");
    expect(renderSetupScript).not.toContain("sk_test_");
    expect(renderSetupScript).not.toContain("whsec_");
  });

  it("keeps deploy guides aligned with the first-sale buyer front door", async () => {
    const onlineStartGuide = await readFile(
      path.resolve(process.cwd(), "docs/launch/online-start-guide.md"),
      "utf8"
    );
    const renderDeploymentGuide = await readFile(
      path.resolve(process.cwd(), "docs/launch/render-deployment-guide.md"),
      "utf8"
    );

    expect(onlineStartGuide).toContain(
      "https://your-real-domain.example/first-sale"
    );
    expect(onlineStartGuide).toContain("https://render.com/deploy?repo=");
    expect(onlineStartGuide).toContain("codex%2Foptitech-product-spec");
    expect(renderDeploymentGuide).toContain("https://render.com/deploy?repo=");
    expect(renderDeploymentGuide).toContain("codex%2Foptitech-product-spec");
    expect(renderDeploymentGuide).toContain(
      "https://your-render-or-custom-domain.example/first-sale"
    );
    expect(renderDeploymentGuide).toContain("main buyer front door");
    expect(renderDeploymentGuide).toContain(
      "learners or practices reach checkout"
    );
    expect(onlineStartGuide).not.toContain("sk_test_");
    expect(renderDeploymentGuide).not.toContain("sk_test_");
    expect(onlineStartGuide).not.toContain("whsec_");
    expect(renderDeploymentGuide).not.toContain("whsec_");
  });

  it("keeps the owner go/no-go report aligned with the first-buyer front door", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const ownerGoNoGoScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-owner-go-no-go.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:owner-go-no-go": "node scripts/launch-owner-go-no-go.mjs"'
    );
    expect(ownerGoNoGoScript).toContain("/first-sale");
    expect(ownerGoNoGoScript).toContain("First buyer overview");
    expect(ownerGoNoGoScript).toContain("/api/launch/readiness");
    expect(ownerGoNoGoScript).toContain("ENABLE_PAID_ENROLLMENT=false");
    expect(ownerGoNoGoScript).toContain("LAUNCH_OWNER_REPORT_PATH");
    expect(ownerGoNoGoScript).toContain("owner-go-no-go-report.md");
    expect(ownerGoNoGoScript).not.toContain("execSync");
    expect(ownerGoNoGoScript).not.toContain("sk_test_");
    expect(ownerGoNoGoScript).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe live URL command card available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const liveUrlScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-live-url-card.mjs"),
      "utf8"
    );
    const readme = await readFile(
      path.resolve(process.cwd(), "README.md"),
      "utf8"
    );
    const domainGuide = await readFile(
      path.resolve(process.cwd(), "docs/launch/domain-and-sharing-guide.md"),
      "utf8"
    );
    const renderGuide = await readFile(
      path.resolve(process.cwd(), "docs/launch/render-deployment-guide.md"),
      "utf8"
    );
    const onlineStartGuide = await readFile(
      path.resolve(process.cwd(), "docs/launch/online-start-guide.md"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:live-url": "node scripts/launch-live-url-card.mjs"'
    );
    expect(readme).toContain("pnpm launch:live-url");
    expect(domainGuide).toContain("pnpm launch:live-url");
    expect(renderGuide).toContain("pnpm launch:live-url");
    expect(onlineStartGuide).toContain("LAUNCH_LIVE_URL_REPORT_PATH");
    expect(onlineStartGuide).toContain("pnpm launch:source-audit");
    expect(liveUrlScript).toContain("OptiTech Academy Live URL Command Card");
    expect(liveUrlScript).toContain("LAUNCH_LIVE_URL_REPORT_PATH");
    expect(liveUrlScript).toContain("live-url-command-card.md");
    expect(liveUrlScript).toContain("LAUNCH_SMOKE_ALLOW_NOT_READY");
    expect(liveUrlScript).toContain("pnpm launch:sitemap");
    expect(liveUrlScript).toContain("pnpm launch:source-audit");
    expect(liveUrlScript).toContain("pnpm launch:owner-go-no-go");
    expect(liveUrlScript).toContain("pnpm launch:checkout-smoke");
    expect(liveUrlScript).toContain("pnpm launch:email-smoke");
    expect(liveUrlScript).toContain("pnpm launch:lead-pipeline-smoke");
    expect(liveUrlScript).toContain("LAUNCH_CHECKOUT_SMOKE_REPORT_PATH");
    expect(liveUrlScript).toContain("LAUNCH_LEAD_PIPELINE_SMOKE_REPORT_PATH");
    expect(liveUrlScript).toContain("LAUNCH_GO_LIVE_REPORT_PATH");
    expect(liveUrlScript).toContain("LAUNCH_FIRST_SALES_REPORT_PATH");
    expect(liveUrlScript).toContain("LAUNCH_FIRST_10_CUSTOMERS_REPORT_PATH");
    expect(liveUrlScript).toContain("LAUNCH_FIRST_WEEK_SALES_REPORT_PATH");
    expect(liveUrlScript).toContain("LAUNCH_SALES_TRACKER_OUTPUT_DIR");
    expect(liveUrlScript).toContain("LAUNCH_FIRST_BUYER_REPORT_PATH");
    expect(liveUrlScript).toContain("LAUNCH_FULFILLMENT_REPORT_PATH");
    expect(liveUrlScript).toContain("LAUNCH_FIRST_BUYER_PROOF_REPORT_PATH");
    expect(liveUrlScript).toContain("LAUNCH_FIRST_BUYER_FEEDBACK_REPORT_PATH");
    expect(liveUrlScript).toContain("LAUNCH_LIVE_PURCHASE_REPORT_PATH");
    expect(liveUrlScript).toContain("pnpm launch:first-sales");
    expect(liveUrlScript).toContain("pnpm launch:go-live");
    expect(liveUrlScript).toContain("pnpm launch:sales-tracker");
    expect(liveUrlScript).toContain("pnpm launch:first-buyer-proof");
    expect(liveUrlScript).toContain("pnpm launch:first-buyer-feedback");
    expect(liveUrlScript).toContain("pnpm launch:emergency-stop");
    expect(liveUrlScript).toContain("Do not use localhost");
    expect(liveUrlScript).toContain("Replace the example URL");
    expect(liveUrlScript).not.toContain("execSync");
    expect(liveUrlScript).not.toContain("sk_test_");
    expect(liveUrlScript).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe final go-live packet command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const goLiveScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-go-live-packet.mjs"),
      "utf8"
    );
    const readme = await readFile(
      path.resolve(process.cwd(), "README.md"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:go-live": "node scripts/launch-go-live-packet.mjs"'
    );
    expect(goLiveScript).toContain("OptiTech Academy Final Go-Live Packet");
    expect(goLiveScript).toContain("LAUNCH_GO_LIVE_REPORT_PATH");
    expect(goLiveScript).toContain("go-live-checklist.md");
    expect(goLiveScript).toContain("ENABLE_PAID_ENROLLMENT=true");
    expect(goLiveScript).toContain("pnpm launch:readiness-snapshot");
    expect(goLiveScript).toContain("pnpm launch:first-buyer-proof");
    expect(goLiveScript).toContain("pnpm launch:first-buyer-feedback");
    expect(goLiveScript).toContain("pnpm launch:emergency-stop");
    expect(goLiveScript).toContain("/api/checkout/availability");
    expect(goLiveScript).toContain("Do not paste Stripe secret keys");
    expect(goLiveScript).not.toContain("execSync");
    expect(goLiveScript).not.toContain("sk_test_");
    expect(goLiveScript).not.toContain("whsec_");
    expect(readme).toContain("pnpm launch:go-live");
  });

  it("keeps a work-computer-safe live purchase rehearsal command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const livePurchaseScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-live-purchase-test.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:live-purchase-test": "node scripts/launch-live-purchase-test.mjs"'
    );
    expect(livePurchaseScript).toContain(
      "OptiTech Academy Live Purchase Rehearsal"
    );
    expect(livePurchaseScript).toContain("Founding Learner Access");
    expect(livePurchaseScript).toContain("ENABLE_PAID_ENROLLMENT=true");
    expect(livePurchaseScript).toContain("LAUNCH_LIVE_PURCHASE_REPORT_PATH");
    expect(livePurchaseScript).toContain("live-purchase-rehearsal-report.md");
    expect(livePurchaseScript).toContain("Stripe event ID");
    expect(livePurchaseScript).toContain("App access result");
    expect(livePurchaseScript).toContain("/api/launch/readiness");
    expect(livePurchaseScript).toContain("/api/checkout/availability");
    expect(livePurchaseScript).toContain("checkout.session.completed");
    expect(livePurchaseScript).toContain("turn paid enrollment back off");
    expect(livePurchaseScript).toContain("pnpm launch:emergency-stop");
    expect(livePurchaseScript).toContain("Do not paste Stripe secret keys");
    expect(livePurchaseScript).not.toContain("execSync");
    expect(livePurchaseScript).not.toContain("sk_test_");
    expect(livePurchaseScript).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe paid launch proof sequence command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const paidProofScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-paid-proof-sequence.mjs"),
      "utf8"
    );
    const readme = await readFile(
      path.resolve(process.cwd(), "README.md"),
      "utf8"
    );
    const liveUrlScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-live-url-card.mjs"),
      "utf8"
    );
    const goLiveScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-go-live-packet.mjs"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:paid-proof": "node scripts/launch-paid-proof-sequence.mjs"'
    );
    expect(paidProofScript).toContain(
      "OptiTech Academy Paid Launch Proof Sequence"
    );
    expect(paidProofScript).toContain("LAUNCH_PAID_PROOF_REPORT_PATH");
    expect(paidProofScript).toContain("LAUNCH_EXPECTED_COMMIT");
    expect(paidProofScript).toContain("pnpm launch:checkout-smoke");
    expect(paidProofScript).toContain("pnpm launch:email-smoke");
    expect(paidProofScript).toContain("pnpm launch:live-purchase-test");
    expect(paidProofScript).toContain("pnpm launch:first-buyer-proof");
    expect(paidProofScript).toContain("pnpm launch:first-buyer-feedback");
    expect(paidProofScript).toContain("pnpm launch:emergency-stop");
    expect(paidProofScript).toContain("Do not paste Stripe secret keys");
    expect(paidProofScript).not.toContain("execSync");
    expect(paidProofScript).not.toContain("sk_test_");
    expect(paidProofScript).not.toContain("whsec_");
    expect(readme).toContain("pnpm launch:paid-proof");
    expect(liveUrlScript).toContain("pnpm launch:paid-proof");
    expect(goLiveScript).toContain("pnpm launch:paid-proof");
  });

  it("keeps a work-computer-safe first buyer proof command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const firstBuyerProofScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-first-buyer-proof.mjs"),
      "utf8"
    );
    const readme = await readFile(
      path.resolve(process.cwd(), "README.md"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:first-buyer-proof": "node scripts/launch-first-buyer-proof.mjs"'
    );
    expect(firstBuyerProofScript).toContain(
      "OptiTech Academy First Buyer Proof Packet"
    );
    expect(firstBuyerProofScript).toContain(
      "LAUNCH_FIRST_BUYER_PROOF_REPORT_PATH"
    );
    expect(firstBuyerProofScript).toContain("LAUNCH_BUYER_EMAIL");
    expect(firstBuyerProofScript).toContain("PRACTICE_SEAT_ADMIN_TOKEN");
    expect(firstBuyerProofScript).toContain("/api/support/buyer-lookup");
    expect(firstBuyerProofScript).toContain("checkout.session.completed");
    expect(firstBuyerProofScript).toContain("pnpm launch:fulfillment");
    expect(firstBuyerProofScript).toContain("pnpm launch:sales-tracker");
    expect(firstBuyerProofScript).toContain("pnpm launch:emergency-stop");
    expect(firstBuyerProofScript).toContain("Do not paste card numbers");
    expect(firstBuyerProofScript).not.toContain("execSync");
    expect(firstBuyerProofScript).not.toContain("sk_test_");
    expect(firstBuyerProofScript).not.toContain("whsec_");
    expect(readme).toContain("pnpm launch:first-buyer-proof");
  });

  it("keeps a work-computer-safe deployed lead pipeline smoke command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const leadPipelineSmokeScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-lead-pipeline-smoke.mjs"),
      "utf8"
    );
    const readme = await readFile(
      path.resolve(process.cwd(), "README.md"),
      "utf8"
    );
    const goLiveChecklist = await readFile(
      path.resolve(process.cwd(), "docs/launch/go-live-checklist.md"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:lead-pipeline-smoke": "node scripts/launch-lead-pipeline-smoke.mjs"'
    );
    expect(leadPipelineSmokeScript).toContain("LAUNCH_ADMIN_TOKEN");
    expect(leadPipelineSmokeScript).toContain("/api/practice-inquiries");
    expect(leadPipelineSmokeScript).toContain("/api/learner-interests");
    expect(leadPipelineSmokeScript).toContain(
      "/api/support/practice-inquiries"
    );
    expect(leadPipelineSmokeScript).toContain("/api/support/learner-interests");
    expect(leadPipelineSmokeScript).toContain("/status");
    expect(leadPipelineSmokeScript).toContain("contacted");
    expect(leadPipelineSmokeScript).not.toContain("execSync");
    expect(leadPipelineSmokeScript).not.toContain("sk_test_");
    expect(leadPipelineSmokeScript).not.toContain("whsec_");
    expect(readme).toContain("pnpm launch:lead-pipeline-smoke");
    expect(goLiveChecklist).toContain("pnpm launch:lead-pipeline-smoke");
  });

  it("keeps a work-computer-safe paid launch emergency stop command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const emergencyStopScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-emergency-stop.mjs"),
      "utf8"
    );
    const emergencyStopGuide = await readFile(
      path.resolve(process.cwd(), "docs/launch/paid-launch-emergency-stop.md"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:emergency-stop": "node scripts/launch-emergency-stop.mjs"'
    );
    expect(emergencyStopScript).toContain("paid-launch-emergency-stop.md");
    expect(emergencyStopScript).not.toContain("execSync");
    expect(emergencyStopGuide).toContain(
      "OptiTech Academy Paid Launch Emergency Stop"
    );
    expect(emergencyStopGuide).toContain("ENABLE_PAID_ENROLLMENT=false");
    expect(emergencyStopGuide).toContain("/api/checkout/availability");
    expect(emergencyStopGuide).toContain("Pause or deactivate");
    expect(emergencyStopGuide).toContain("protected buyer lookup");
    expect(emergencyStopGuide).toContain("pnpm launch:live-purchase-test");
    expect(emergencyStopGuide).not.toContain("sk_test_");
    expect(emergencyStopGuide).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe manual payment-link checklist command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const manualPaymentScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-manual-payment-links.mjs"),
      "utf8"
    );
    const manualPaymentChecklist = await readFile(
      path.resolve(
        process.cwd(),
        "docs/launch/manual-payment-link-checklist.md"
      ),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:manual-payment-links": "node scripts/launch-manual-payment-links.mjs"'
    );
    expect(manualPaymentScript).toContain("manual-payment-link-checklist.md");
    expect(manualPaymentScript).not.toContain("execSync");
    expect(manualPaymentChecklist).toContain(
      "OptiTech Academy Manual Payment Link Checklist"
    );
    expect(manualPaymentChecklist).toContain("https://buy.stripe.com/");
    expect(manualPaymentChecklist).toContain(
      "PUBLIC_STRIPE_PAYMENT_LINK_FOUNDING_LEARNER"
    );
    expect(manualPaymentChecklist).toContain("ENABLE_PAID_ENROLLMENT=false");
    expect(manualPaymentChecklist).toContain(
      "/api/support/manual-payment-fulfillments"
    );
    expect(manualPaymentChecklist).toContain("pnpm launch:manual-fulfillment");
    expect(manualPaymentChecklist).toContain("pnpm launch:fulfillment");
    expect(manualPaymentChecklist).not.toContain("sk_test_");
    expect(manualPaymentChecklist).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe first buyer fulfillment checklist command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const fulfillmentScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-first-buyer-fulfillment.mjs"),
      "utf8"
    );
    const fulfillmentChecklist = await readFile(
      path.resolve(
        process.cwd(),
        "docs/launch/first-buyer-fulfillment-checklist.md"
      ),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:fulfillment": "node scripts/launch-first-buyer-fulfillment.mjs"'
    );
    expect(fulfillmentScript).toContain("LAUNCH_FULFILLMENT_REPORT_PATH");
    expect(fulfillmentScript).toContain("first-buyer-fulfillment-checklist.md");
    expect(fulfillmentScript).not.toContain("execSync");
    expect(fulfillmentChecklist).toContain(
      "OptiTech Academy First Buyer Fulfillment Checklist"
    );
    expect(fulfillmentChecklist).toContain("Confirm Stripe payment status");
    expect(fulfillmentChecklist).toContain("Confirm learner access exists");
    expect(fulfillmentChecklist).toContain("Do not save card details");
    expect(fulfillmentChecklist).not.toContain("sk_test_");
    expect(fulfillmentChecklist).not.toContain("whsec_");
  });

  it("keeps a work-computer-safe static first-sale page command available", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const staticPageScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-static-first-sale-page.mjs"),
      "utf8"
    );
    const staticPageGuide = await readFile(
      path.resolve(
        process.cwd(),
        "docs/launch/static-first-sale-page-guide.md"
      ),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:static-first-sale-page": "node scripts/launch-static-first-sale-page.mjs"'
    );
    expect(staticPageScript).toContain("launch-static");
    expect(staticPageScript).toContain("first-sale.html");
    expect(staticPageScript).toContain('url.protocol !== "https:"');
    expect(staticPageScript).toContain('url.hostname !== "buy.stripe.com"');
    expect(staticPageScript).not.toContain("execSync");
    expect(staticPageScript).not.toContain("sk_test_");
    expect(staticPageScript).not.toContain("whsec_");
    expect(staticPageGuide).toContain(
      "OptiTech Academy Static First-Sale Page Guide"
    );
    expect(staticPageGuide).toContain("pnpm launch:manual-payment-links");
    expect(staticPageGuide).toContain("pnpm launch:fulfillment");
    expect(staticPageGuide).not.toContain("sk_test_");
    expect(staticPageGuide).not.toContain("whsec_");
  });

  it("keeps the jeffmini home-PC resume guide printable", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const resumeScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-jeffmini-resume.mjs"),
      "utf8"
    );
    const resumeGuide = await readFile(
      path.resolve(process.cwd(), "docs/launch/jeffmini-resume-guide.md"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:jeffmini": "node scripts/launch-jeffmini-resume.mjs"'
    );
    expect(resumeScript).toContain("jeffmini-resume-guide.md");
    expect(resumeScript).not.toContain("execSync");
    expect(resumeGuide).toContain("codex/optitech-product-spec");
    expect(resumeGuide).toContain("First Hour On Jeffmini");
    expect(resumeGuide).toContain("pnpm launch:online-start");
    expect(resumeGuide).toContain("docs/launch/current-backup-manifest.md");
    expect(resumeGuide).toContain(
      "use the newest matching ZIP and bundle pair"
    );
    expect(resumeGuide).toContain(
      "optitech-academy-source-YYYY-MM-DD-COMMIT.zip"
    );
    expect(resumeGuide).toContain(
      "optitech-academy-branch-YYYY-MM-DD-COMMIT.bundle"
    );
    expect(resumeGuide).toContain("ENABLE_PAID_ENROLLMENT=false");
    expect(resumeGuide).toContain("pnpm launch:doctor");
    expect(resumeGuide).not.toContain("sk_test_");
    expect(resumeGuide).not.toContain("whsec_");
  });

  it("keeps a standalone first-sale support runbook in launch docs", async () => {
    const supportRunbook = await readFile(
      path.resolve(process.cwd(), "docs/launch/first-sale-support-runbook.md"),
      "utf8"
    );

    expect(supportRunbook).toContain(
      "OptiTech Academy First Sale Support Runbook"
    );
    expect(supportRunbook).toContain("Payment Succeeded But Access Is Missing");
    expect(supportRunbook).toContain("recommended next support actions");
    expect(supportRunbook).toContain("Practice Seat Manager");
    expect(supportRunbook).toContain("Access revocation");
    expect(supportRunbook).toContain("GET /api/support/buyer-lookup");
    expect(supportRunbook).not.toContain("sk_test_");
    expect(supportRunbook).not.toContain("whsec_");
  });

  it("keeps a standalone Bootcamp content migration checklist in launch docs", async () => {
    const checklist = await readFile(
      path.resolve(
        process.cwd(),
        "docs/launch/bootcamp-content-migration-checklist.md"
      ),
      "utf8"
    );

    expect(checklist).toContain(
      "OptiTech Academy Bootcamp Content Migration Checklist"
    );
    expect(checklist).toContain("Bootcamp days mapped: 10");
    expect(checklist).toContain("Source assets mapped: 37");
    expect(checklist).toContain("Advanced Ocular Diagnostic Masterclass");
    expect(checklist).toContain("Manual Lensometry Standards and Procedures");
    expect(checklist).toContain("doctor-specific protocols");
    expect(checklist).toContain("Spindel Eye Technician onboarding version");
    expect(checklist).toContain("NotebookLM source workspace");
    expect(checklist).toContain(
      "Day 1: Foundations and the First Patient Encounter"
    );
    expect(checklist).toContain(
      "Day 10: Simulation Capstone and Certification Roadmap"
    );
    expect(checklist).toContain(
      "Do not sell unpublished modules as complete content"
    );
    expect(checklist).not.toContain("sk_test_");
    expect(checklist).not.toContain("whsec_");
  });

  it("keeps a standalone Module 1 clinical review packet in launch docs", async () => {
    const packet = await readFile(
      path.resolve(
        process.cwd(),
        "docs/launch/module-1-clinical-review-packet.md"
      ),
      "utf8"
    );

    expect(packet).toContain(
      "Module 1: Entering Ophthalmic Care Clinical Review Packet"
    );
    expect(packet).toContain("Clinical reviewer name: [blank]");
    expect(packet).toContain("Lesson ID: m1-l1-what-techs-do");
    expect(packet).toContain("What Ophthalmic Technicians Do");
    expect(packet).toContain("The Eye Clinic Patient Journey");
    expect(packet).toContain(
      "Professional Boundaries, Privacy, and Escalation"
    );
    expect(packet).toContain(
      "Does the lesson avoid diagnosis, treatment advice, or independent clinical"
    );
    expect(packet).toContain("authority?");
    expect(packet).toContain("Reviewer signature: [blank]");
    expect(packet).not.toContain("sk_test_");
    expect(packet).not.toContain("whsec_");
  });

  it("keeps a standalone production environment checklist in launch docs", async () => {
    const packageJson = await readFile(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const readme = await readFile(
      path.resolve(process.cwd(), "README.md"),
      "utf8"
    );
    const checklistScript = await readFile(
      path.resolve(process.cwd(), "scripts/launch-env-checklist.mjs"),
      "utf8"
    );
    const checklist = await readFile(
      path.resolve(process.cwd(), "docs/launch/production-env-checklist.md"),
      "utf8"
    );

    expect(packageJson).toContain(
      '"launch:env-checklist": "node scripts/launch-env-checklist.mjs"'
    );
    expect(readme).toContain("pnpm launch:env-checklist");
    expect(checklistScript).toContain("production-env-checklist.md");
    expect(checklistScript).not.toContain("execSync");
    expect(checklist).toContain(
      "OptiTech Academy Production Environment Checklist"
    );
    expect(checklist).toContain("Host Dashboard Paste Template");
    expect(checklist).toContain("Render Blueprint Auto-Filled Values");
    expect(checklist).toContain(
      "`DATABASE_URL`: connected from the managed Render PostgreSQL database"
    );
    expect(checklist).toContain("blank value from the paste template");
    expect(checklist).toContain("PUBLIC_APP_URL=https://your-domain.example");
    expect(checklist).toContain("ENABLE_PAID_ENROLLMENT=false");
    expect(checklist).toContain("MODULE_ONE_CLINICAL_REVIEW_APPROVED=false");
    expect(checklist).toContain(
      "TRANSACTIONAL_EMAIL_API_URL=https://api.resend.com/emails"
    );
    expect(checklist).toContain("pnpm launch:doctor");
    expect(checklist).not.toContain("sk_test_");
    expect(checklist).not.toContain("whsec_123");
    expect(checklist).not.toContain("replace_with");
  });

  it("keeps a standalone manual launch QA evidence template in launch docs", async () => {
    const template = await readFile(
      path.resolve(process.cwd(), "docs/launch/manual-launch-qa-evidence.md"),
      "utf8"
    );

    expect(template).toContain("OptiTech Academy Manual Launch QA Evidence");
    expect(template).toContain("Deployment URL:");
    expect(template).toContain("Commit SHA:");
    expect(template).toContain("Stripe checkout session ID:");
    expect(template).toContain("Individual checkout success return URL:");
    expect(template).toContain("Passwordless Email Delivery");
    expect(template).toContain("Practice checkout success return URL:");
    expect(template).toContain("Custom Practice Inquiry Test");
    expect(template).toContain("Sitemap URL or generated sitemap path:");
    expect(template).toContain("ENABLE_PAID_ENROLLMENT stayed false");
    expect(template).not.toContain("sk_test_");
    expect(template).not.toContain("whsec_");
  });

  it("keeps a standalone runtime readiness snapshot guide in launch docs", async () => {
    const guide = await readFile(
      path.resolve(
        process.cwd(),
        "docs/launch/runtime-readiness-snapshot-guide.md"
      ),
      "utf8"
    );

    expect(guide).toContain(
      "OptiTech Academy Runtime Readiness Snapshot Guide"
    );
    expect(guide).toContain("/api/launch/readiness");
    expect(guide).toContain("readyForPaidLaunch");
    expect(guide).toContain("individualLearner");
    expect(guide).toContain("practicePacks");
    expect(guide).toContain("databaseReadiness");
    expect(guide).toContain("MODULE_ONE_CLINICAL_REVIEW_APPROVED");
    expect(guide).toContain("ENABLE_PAID_ENROLLMENT");
    expect(guide).not.toContain("sk_test_");
    expect(guide).not.toContain("whsec_");
  });
});
