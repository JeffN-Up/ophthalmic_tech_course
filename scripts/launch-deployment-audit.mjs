#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();

const files = {
  packageJson: "package.json",
  render: "render.yaml",
  dockerfile: "Dockerfile",
  dockerignore: ".dockerignore",
  procfile: "Procfile",
  workflow: ".github/workflows/launch-ci.yml",
};

function addCheck(checks, label, ok, detail = "") {
  checks.push({ label, ok, detail });
}

function renderCheck(check) {
  return `- ${check.label}: ${check.ok ? "ok" : "failed"}${
    check.detail ? ` (${check.detail})` : ""
  }`;
}

async function readProjectFile(relativePath) {
  return readFile(path.join(projectRoot, relativePath), "utf8");
}

function containsNoLikelySecrets(text) {
  const stripeSecretPrefix = "sk_" + "(?:live|test)" + "_";
  const stripeRestrictedPrefix = "rk_" + "live" + "_";
  const webhookSecretPrefix = "wh" + "sec" + "_";
  const postgresUrlPrefix = "postgres" + ":\\/\\/";
  const likelySecretPattern = new RegExp(
    `${stripeSecretPrefix}|${stripeRestrictedPrefix}|${webhookSecretPrefix}|${postgresUrlPrefix}[^"\\s]+`
  );

  return !likelySecretPattern.test(text);
}

const source = {
  packageJson: await readProjectFile(files.packageJson),
  render: await readProjectFile(files.render),
  dockerfile: await readProjectFile(files.dockerfile),
  dockerignore: await readProjectFile(files.dockerignore),
  procfile: await readProjectFile(files.procfile),
  workflow: await readProjectFile(files.workflow),
};

const checks = [];

addCheck(
  checks,
  "Procfile starts the production server",
  source.procfile.trim() === "web: node dist/index.js",
  files.procfile
);
addCheck(
  checks,
  "Dockerfile uses the production entrypoint",
  source.dockerfile.includes('CMD ["node", "dist/index.js"]'),
  files.dockerfile
);
addCheck(
  checks,
  "Dockerfile includes a health check",
  source.dockerfile.includes("/api/health"),
  files.dockerfile
);
addCheck(
  checks,
  "Docker build runs TypeScript check",
  source.dockerfile.includes("RUN pnpm check"),
  files.dockerfile
);
addCheck(
  checks,
  "Docker build runs production build",
  source.dockerfile.includes("RUN pnpm build"),
  files.dockerfile
);
addCheck(
  checks,
  "Docker context excludes unsafe local files",
  [".env", "launch-evidence", "*.zip", "*.bundle", "node_modules"].every(item =>
    source.dockerignore.includes(item)
  ),
  files.dockerignore
);
addCheck(
  checks,
  "Render Blueprint defines the web service",
  source.render.includes("name: optitech-academy") &&
    source.render.includes("runtime: node"),
  files.render
);
addCheck(
  checks,
  "Render build installs and builds the app",
  source.render.includes("pnpm install --frozen-lockfile") &&
    source.render.includes("pnpm build"),
  files.render
);
addCheck(
  checks,
  "Render runs database setup before deploy",
  source.render.includes("preDeployCommand: pnpm db:setup"),
  files.render
);
addCheck(
  checks,
  "Render starts the production server",
  source.render.includes("startCommand: node dist/index.js"),
  files.render
);
addCheck(
  checks,
  "Render health check points to app health endpoint",
  source.render.includes("healthCheckPath: /api/health"),
  files.render
);
addCheck(
  checks,
  "Render paid enrollment starts closed",
  source.render.includes("key: ENABLE_PAID_ENROLLMENT") &&
    source.render.includes('value: "false"'),
  files.render
);
addCheck(
  checks,
  "Render does not enable local demo learner access",
  !source.render.includes("ENABLE_LOCAL_COURSE_DEMO"),
  files.render
);
addCheck(
  checks,
  "Render clinical approval starts closed",
  source.render.includes("key: MODULE_ONE_CLINICAL_REVIEW_APPROVED") &&
    source.render.includes('value: "false"'),
  files.render
);
addCheck(
  checks,
  "Render database uses managed database connection",
  source.render.includes("fromDatabase:") &&
    source.render.includes("name: optitech-academy-db") &&
    source.render.includes("property: connectionString"),
  files.render
);
addCheck(
  checks,
  "Render database SSL is enabled",
  source.render.includes("key: DATABASE_SSL") &&
    source.render.includes('value: "true"'),
  files.render
);
addCheck(
  checks,
  "Render keeps required secrets out of Git",
  [
    "PUBLIC_APP_URL",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "TRANSACTIONAL_EMAIL_API_KEY",
    "SIGN_IN_FROM_EMAIL",
    "MODULE_ONE_CLINICAL_REVIEWER_NAME",
  ].every(key => source.render.includes(`key: ${key}`)) &&
    source.render.includes("sync: false"),
  files.render
);
addCheck(
  checks,
  "Render exposes optional manual Stripe Payment Link settings",
  [
    "PUBLIC_STRIPE_PAYMENT_LINK_FOUNDING_LEARNER",
    "PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_6_SEATS",
    "PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_15_SEATS",
  ].every(key => source.render.includes(`key: ${key}`)),
  files.render
);
addCheck(
  checks,
  "Render generates private admin/session values",
  [
    "AUTH_SESSION_SECRET",
    "PRACTICE_SEAT_ADMIN_TOKEN",
    "ALERT_ADMIN_TOKEN",
  ].every(key => source.render.includes(`key: ${key}`)) &&
    source.render.includes("generateValue: true"),
  files.render
);
addCheck(
  checks,
  "Render auto deploy is off for controlled launch",
  source.render.includes('autoDeployTrigger: "off"'),
  files.render
);
addCheck(
  checks,
  "Launch preflight includes offer, source, deployment, and local course audits",
  source.packageJson.includes(
    "pnpm check && pnpm test && pnpm launch:secret-scan && pnpm launch:offer-audit && pnpm launch:source-audit && pnpm launch:deployment-audit && pnpm build && pnpm launch:local-course-smoke && pnpm launch:bundle"
  ),
  files.packageJson
);
addCheck(
  checks,
  "Work-safe preflight includes source and deployment audits",
  source.packageJson.includes(
    "pnpm check && pnpm launch:secret-scan && pnpm launch:offer-audit && pnpm launch:source-audit && pnpm launch:deployment-audit && pnpm launch:blockers"
  ),
  files.packageJson
);
addCheck(
  checks,
  "GitHub launch CI runs preflight",
  source.workflow.includes("pnpm launch:preflight"),
  files.workflow
);
addCheck(
  checks,
  "Deployment files contain no likely secrets",
  [
    source.render,
    source.dockerfile,
    source.dockerignore,
    source.procfile,
    source.workflow,
  ].every(containsNoLikelySecrets)
);

const failedChecks = checks.filter(check => !check.ok);

const lines = [
  "# OptiTech Academy Deployment Audit",
  "",
  "Simple translation: this checks that the online-store setup recipe is still safe before hosting.",
  "",
  `Checks passed: ${checks.length - failedChecks.length}/${checks.length}`,
  "",
  "## Results",
  "",
  ...checks.map(renderCheck),
  "",
];

if (failedChecks.length > 0) {
  lines.push("## Fix Before Deploy");
  lines.push("");
  lines.push(
    "One or more deployment files are missing a required launch safety setting."
  );
  lines.push(
    "Fix the failed item before deploying, accepting real payment, or sharing checkout links."
  );
  lines.push("");
}

lines.push(
  "Do not paste `.env`, Stripe keys, webhook secrets, email API keys, database passwords, raw sign-in links, session cookies, card numbers, patient information, protected health information, or private employee details into this report."
);
lines.push("");

console.log(lines.join("\n"));
process.exitCode = failedChecks.length > 0 ? 1 : 0;
