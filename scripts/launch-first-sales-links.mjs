#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const fallbackBaseUrl = "https://your-real-domain.example";
const recommendedReportPath = "launch-evidence/first-sales-link-packet.md";

function getArgValue(name, fallback = "") {
  const prefix = `--${name}=`;
  const match = process.argv.find(arg => arg.startsWith(prefix));
  return match ? match.slice(prefix.length).trim() : fallback;
}

function getPositionalUrl() {
  return (
    process.argv.slice(2).find(arg => arg !== "--" && !arg.startsWith("--")) ??
    ""
  );
}

function normalizeBaseUrl(rawBaseUrl) {
  const candidate = rawBaseUrl?.trim() || fallbackBaseUrl;
  return candidate.replace(/\/+$/, "");
}

function buildMailtoHref({ email, subject, body }) {
  const params = new URLSearchParams({ subject });
  params.set("body", body);
  return `mailto:${email}?${params.toString()}`;
}

const baseUrl = normalizeBaseUrl(
  getArgValue("url") ||
    getPositionalUrl() ||
    process.env.PUBLIC_APP_URL ||
    process.env.LAUNCH_BASE_URL
);
const firstSaleUrl = `${baseUrl}/first-sale`;
const individualCheckoutUrl = `${baseUrl}/checkout`;
const practicePacksUrl = `${baseUrl}/practice-packs`;
const courseOverviewUrl = `${baseUrl}/`;
const freePreviewUrl = `${baseUrl}/preview`;
const buyerGuideUrl = `${baseUrl}/buyer-guide`;
const policiesUrl = `${baseUrl}/policies`;
const readinessUrl = `${baseUrl}/api/launch/readiness`;

const practiceInquiryMailto = buildMailtoHref({
  email: "jeff.chapin@spindeleye.com",
  subject: "OptiTech custom practice onboarding inquiry",
  body: [
    "Hi Jeff,",
    "",
    "I am interested in OptiTech Academy practice onboarding.",
    "",
    "Practice name:",
    "Primary contact:",
    "Approximate learner count:",
    "Target onboarding timeline:",
    "Interested in: six seats / fifteen seats / larger custom quote",
    "Main onboarding challenge:",
    "",
    "I understand this course supports foundational learning and does not replace local supervision, clinical policy, or hands-on competency signoff.",
  ].join("\n"),
});

function renderFirstSalesLinkPacket() {
  return [
    "# OptiTech Academy First Sales Link Packet",
    "",
    "Use this after the app is deployed and the launch gates are nearly ready.",
    "It is safe to run on a work computer because it does not print secret values.",
    "",
    `Base URL: ${baseUrl}`,
    `Recommended report path: ${recommendedReportPath}`,
    "",
    "## Links To Share",
    "",
    `- First buyer overview: ${firstSaleUrl}`,
    `- Individual learners: ${firstSaleUrl}`,
    `- Individual checkout or interest list: ${individualCheckoutUrl}`,
    `- Practice buyers: ${practicePacksUrl}`,
    `- Course overview: ${courseOverviewUrl}`,
    `- Free lesson preview: ${freePreviewUrl}`,
    `- Buyer decision guide: ${buyerGuideUrl}`,
    `- Policies: ${policiesUrl}`,
    `- Readiness check: ${readinessUrl}`,
    `- Custom practice inquiry email: ${practiceInquiryMailto}`,
    "",
    "## Current Offers",
    "",
    "- Founding Learner Access: $299 for 12 months.",
    "- Six-Seat Practice Onboarding Pack: $999 for 12 months.",
    "- Fifteen-Seat Practice Onboarding Pack: $1,799 for 12 months.",
    "- Larger practices: start with a custom onboarding conversation.",
    "",
    "## Send First",
    "",
    "Individual learner message:",
    "",
    "```text",
    "Hi [Name],",
    "",
    "I am getting ready to launch OptiTech Academy, a self-paced ophthalmic technician foundations course for career changers, medical assistants, and new eye-care team members.",
    "",
    "It focuses on plain-language ophthalmic vocabulary, clinic flow, patient communication, knowledge checks, and supervised practice preparation. It is not a certification program and it does not replace hands-on training, but it can help someone feel much less lost when starting in eye care.",
    "",
    `Free preview: ${freePreviewUrl}`,
    `Buyer guide: ${buyerGuideUrl}`,
    `Founding Learner Access is $299 for 12 months when enrollment opens: ${firstSaleUrl}`,
    "",
    "Would you be open to taking a look when enrollment opens?",
    "```",
    "",
    "Practice buyer message:",
    "",
    "```text",
    "Hi [Name],",
    "",
    "I am preparing to launch OptiTech Academy, a self-paced foundations course for new ophthalmic technicians and medical assistants moving into eye care.",
    "",
    "The practice packs are designed for onboarding: each learner gets their own access, and supervisors can pair the course with local hands-on observation and practice-specific protocols.",
    "",
    `Free preview: ${freePreviewUrl}`,
    `Buyer guide: ${buyerGuideUrl}`,
    `Practice pack details: ${practicePacksUrl}`,
    "",
    "Would it be useful for your team if I sent the course overview link when it is ready?",
    "```",
    "",
    "## Do Not Send Paid Links Broadly Until",
    "",
    "- `/api/launch/readiness` reports paid launch readiness is complete.",
    "- `pnpm launch:preflight` passes on a home PC or CI.",
    "- `pnpm launch:smoke` passes against the deployed site.",
    "- A Stripe test purchase creates durable course access.",
    "- Module 1 clinical review is approved.",
    "",
    "## Safe Claim Reminder",
    "",
    "Say: foundational learning, onboarding support, shared language, knowledge checks, and supervised practice preparation.",
    "Do not promise certification, employment, promotion, exam success, clinical competency, or replacement of hands-on supervision.",
    "",
    "Full sales packet: docs/launch/first-customers-sales-packet.md",
    "",
  ].join("\n");
}

async function main() {
  const packet = renderFirstSalesLinkPacket();

  console.log(packet);

  if (process.env.LAUNCH_FIRST_SALES_REPORT_PATH) {
    const reportPath = path.resolve(process.env.LAUNCH_FIRST_SALES_REPORT_PATH);
    await mkdir(path.dirname(reportPath), { recursive: true });
    await writeFile(reportPath, packet, "utf8");
    console.log(`Report written: ${reportPath}`);
  }
}

main().catch(error => {
  console.error(
    error instanceof Error
      ? error.message
      : "First sales link packet could not be created."
  );
  process.exitCode = 1;
});
