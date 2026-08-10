#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.resolve(
  projectRoot,
  process.env.LAUNCH_STATIC_DIR || "launch-static"
);
const outputPath = path.join(outputDir, "first-sale.html");
const fallbackAppUrl = "https://your-real-domain.example";

function normalizeBaseUrl(rawValue) {
  const candidate = rawValue?.trim() || fallbackAppUrl;

  try {
    const url = new URL(candidate);
    return url.origin;
  } catch {
    return fallbackAppUrl;
  }
}

function readStripePaymentLink(value) {
  const trimmedValue = value?.trim();

  if (!trimmedValue) return "";

  try {
    const url = new URL(trimmedValue);

    if (url.protocol !== "https:" || url.hostname !== "buy.stripe.com") {
      return "";
    }

    return url.toString();
  } catch {
    return "";
  }
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderPaymentButton({ href, label, disabledLabel }) {
  if (!href) {
    return `<span class="button button-disabled">${escapeHtml(disabledLabel)}</span>`;
  }

  return `<a class="button" href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
}

function renderStaticFirstSalePage() {
  const appUrl = normalizeBaseUrl(process.env.PUBLIC_APP_URL);
  const previewUrl = `${appUrl}/preview`;
  const buyerGuideUrl = `${appUrl}/buyer-guide`;
  const policiesUrl = `${appUrl}/policies`;
  const practicePacksUrl = `${appUrl}/practice-packs`;
  const individualPaymentLink = readStripePaymentLink(
    process.env.PUBLIC_STRIPE_PAYMENT_LINK_FOUNDING_LEARNER
  );
  const practiceSixPaymentLink = readStripePaymentLink(
    process.env.PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_6_SEATS
  );
  const practiceFifteenPaymentLink = readStripePaymentLink(
    process.env.PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_15_SEATS
  );
  const generatedAt = new Date().toISOString();

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>OptiTech Academy First Buyer Page</title>
    <meta
      name="description"
      content="A controlled first-buyer page for OptiTech Academy ophthalmic technician foundations."
    />
    <style>
      :root {
        color-scheme: light;
        --ink: #172033;
        --muted: #5f6b7a;
        --line: #d9e2ec;
        --surface: #ffffff;
        --soft: #f4f7fb;
        --blue: #1f5f9f;
        --green: #20785b;
        --amber: #8a5a10;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        background: var(--soft);
        color: var(--ink);
        font-family:
          Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
          "Segoe UI", sans-serif;
        line-height: 1.55;
      }

      a {
        color: inherit;
      }

      .shell {
        max-width: 1080px;
        margin: 0 auto;
        padding: 32px 18px 48px;
      }

      .hero {
        display: grid;
        gap: 24px;
        grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.8fr);
        align-items: stretch;
        padding: 34px;
        border: 1px solid var(--line);
        background: var(--surface);
        border-radius: 8px;
        box-shadow: 0 18px 42px rgb(23 32 51 / 0.08);
      }

      .eyebrow {
        color: var(--blue);
        font-size: 0.82rem;
        font-weight: 800;
        letter-spacing: 0;
        text-transform: uppercase;
      }

      h1,
      h2,
      h3,
      p {
        margin-top: 0;
      }

      h1 {
        max-width: 760px;
        margin-bottom: 18px;
        font-size: clamp(2.2rem, 4vw, 4.2rem);
        line-height: 1;
        letter-spacing: 0;
      }

      h2 {
        margin-bottom: 12px;
        font-size: 1.55rem;
        letter-spacing: 0;
      }

      h3 {
        margin-bottom: 8px;
        font-size: 1.05rem;
        letter-spacing: 0;
      }

      .lead {
        max-width: 760px;
        color: var(--muted);
        font-size: 1.1rem;
      }

      .price-box,
      .card {
        border: 1px solid var(--line);
        background: var(--surface);
        border-radius: 8px;
      }

      .price-box {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 24px;
      }

      .price {
        display: block;
        margin: 8px 0 4px;
        font-size: 2.8rem;
        font-weight: 850;
      }

      .button {
        display: inline-flex;
        width: 100%;
        min-height: 46px;
        align-items: center;
        justify-content: center;
        padding: 10px 16px;
        border-radius: 6px;
        background: var(--blue);
        color: #ffffff;
        font-weight: 800;
        text-align: center;
        text-decoration: none;
      }

      .button-secondary {
        background: #eef4fb;
        color: var(--blue);
        border: 1px solid #bfd4ea;
      }

      .button-disabled {
        background: #e8edf3;
        color: #6b7280;
      }

      .stack {
        display: grid;
        gap: 12px;
      }

      .grid {
        display: grid;
        gap: 18px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        margin-top: 22px;
      }

      .card {
        padding: 22px;
      }

      .card p,
      li {
        color: var(--muted);
      }

      ul {
        margin: 10px 0 0;
        padding-left: 20px;
      }

      .band {
        margin-top: 22px;
        padding: 22px;
        border: 1px solid #efd7a3;
        background: #fff8e8;
        color: #3d2a07;
        border-radius: 8px;
      }

      .band p {
        color: #5c420f;
      }

      .footer {
        margin-top: 24px;
        color: var(--muted);
        font-size: 0.9rem;
      }

      @media (max-width: 820px) {
        .hero,
        .grid {
          grid-template-columns: 1fr;
        }

        .hero {
          padding: 24px;
        }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <section class="hero">
        <div>
          <p class="eyebrow">OptiTech Academy first buyer page</p>
          <h1>Start learning ophthalmic technician foundations.</h1>
          <p class="lead">
            A self-paced course for career changers, medical assistants, and
            new eye-care team members who want plain-language foundations before
            or during supervised clinic training.
          </p>
          <div class="grid">
            <section class="card">
              <h3>What it helps with</h3>
              <p>
                Eye-care vocabulary, clinic flow, patient communication,
                privacy, safety expectations, and knowledge checks.
              </p>
            </section>
            <section class="card">
              <h3>Who it is for</h3>
              <p>
                Individual learners starting a new career and practices
                onboarding new ophthalmic technicians or medical assistants.
              </p>
            </section>
            <section class="card">
              <h3>Clear limit</h3>
              <p>
                This is education, not certification, employment, exam success,
                or hands-on competency signoff.
              </p>
            </section>
          </div>
        </div>
        <aside class="price-box">
          <div>
            <p class="eyebrow">Founding learner access</p>
            <span class="price">$299</span>
            <p>12 months of access to published foundations content.</p>
          </div>
          <div class="stack">
            ${renderPaymentButton({
              href: individualPaymentLink,
              label: "Use approved Stripe payment link",
              disabledLabel: "Payment link not configured",
            })}
            <a class="button button-secondary" href="${escapeHtml(previewUrl)}">Open free preview</a>
            <a class="button button-secondary" href="${escapeHtml(buyerGuideUrl)}">Read buyer guide</a>
          </div>
        </aside>
      </section>

      <section class="grid">
        <article class="card">
          <h2>Individual learner</h2>
          <p>
            Good for people exploring eye care, building medical vocabulary, or
            preparing for a supervised entry-level ophthalmic role.
          </p>
          <ul>
            <li>Foundational lessons</li>
            <li>Knowledge checks</li>
            <li>Career-readiness language</li>
          </ul>
        </article>
        <article class="card">
          <h2>Six-seat practice pack</h2>
          <p>
            For a small hiring group or a few new team members who need the
            same starter language before local training.
          </p>
          <p><strong>$999 one-time</strong></p>
          ${renderPaymentButton({
            href: practiceSixPaymentLink,
            label: "Use 6-seat payment link",
            disabledLabel: "6-seat link not configured",
          })}
        </article>
        <article class="card">
          <h2>Fifteen-seat practice pack</h2>
          <p>
            For practices standardizing onboarding across a larger hiring class
            or multiple supervisors.
          </p>
          <p><strong>$1,799 one-time</strong></p>
          ${renderPaymentButton({
            href: practiceFifteenPaymentLink,
            label: "Use 15-seat payment link",
            disabledLabel: "15-seat link not configured",
          })}
        </article>
      </section>

      <section class="band">
        <h2>Before paying</h2>
        <p>
          Please review the preview, buyer guide, and policies first. Manual
          Stripe Payment Links are for approved first buyers while the full
          automated checkout and access flow is still being finalized.
        </p>
        <div class="grid">
          <a class="button button-secondary" href="${escapeHtml(previewUrl)}">Preview</a>
          <a class="button button-secondary" href="${escapeHtml(policiesUrl)}">Policies</a>
          <a class="button button-secondary" href="${escapeHtml(practicePacksUrl)}">Practice packs</a>
        </div>
      </section>

      <p class="footer">
        Generated ${escapeHtml(generatedAt)}. Do not add patient information,
        private employee details, passwords, card numbers, or raw sign-in links
        to this page.
      </p>
    </main>
  </body>
</html>
`;
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, renderStaticFirstSalePage(), "utf8");
  console.log(`Static first-sale page created at ${outputPath}`);
}

main().catch(error => {
  const message =
    error instanceof Error
      ? error.message
      : "Static first-sale page generation failed.";
  console.error(message);
  process.exitCode = 1;
});
