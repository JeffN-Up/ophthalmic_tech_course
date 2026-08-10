import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe(".env.example", () => {
  it("documents required and optional launch environment settings without real secrets", async () => {
    const envExample = await readFile(
      path.resolve(process.cwd(), ".env.example"),
      "utf8"
    );

    expect(envExample).toContain("STRIPE_SECRET_KEY=");
    expect(envExample).toContain("STRIPE_WEBHOOK_SECRET=");
    expect(envExample).toContain(
      "PUBLIC_STRIPE_PAYMENT_LINK_FOUNDING_LEARNER="
    );
    expect(envExample).toContain(
      "PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_6_SEATS="
    );
    expect(envExample).toContain(
      "PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_15_SEATS="
    );
    expect(envExample).toContain("PUBLIC_APP_URL=");
    expect(envExample).toContain("DATABASE_URL=");
    expect(envExample).toContain("AUTH_SESSION_SECRET=");
    expect(envExample).toContain(
      "TRANSACTIONAL_EMAIL_API_URL=https://api.resend.com/emails"
    );
    expect(envExample).toContain("PRACTICE_SEAT_ADMIN_TOKEN=");
    expect(envExample).toContain("ALERT_ADMIN_TOKEN=");
    expect(envExample).toContain("LAUNCH_SITEMAP_PATH=");
    expect(envExample).toContain("VITE_ANALYTICS_ENDPOINT=");
    expect(envExample).toContain("VITE_ANALYTICS_WEBSITE_ID=");
    expect(envExample).not.toContain("sk_live_");
    expect(envExample).not.toContain("whsec_live_");
  });
});
