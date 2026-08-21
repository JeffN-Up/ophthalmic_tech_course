import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  createOpaqueToken,
  hashOpaqueToken,
  securityHeaders,
  verifyStripeSignature,
} from "./security";

describe("security helpers", () => {
  it("creates unique opaque tokens and stable hashes", () => {
    const first = createOpaqueToken();
    const second = createOpaqueToken();
    expect(first).not.toBe(second);
    expect(first.length).toBeGreaterThan(30);
    expect(hashOpaqueToken(first)).toBe(hashOpaqueToken(first));
    expect(hashOpaqueToken(first)).not.toBe(hashOpaqueToken(second));
  });

  it("accepts a current valid Stripe signature", () => {
    const body = Buffer.from(JSON.stringify({ id: "evt_test", type: "checkout.session.completed" }));
    const secret = "whsec_test_secret";
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = createHmac("sha256", secret)
      .update(`${timestamp}.${body.toString("utf8")}`)
      .digest("hex");

    expect(verifyStripeSignature(body, `t=${timestamp},v1=${signature}`, secret)).toBe(true);
  });

  it("rejects tampered and expired Stripe signatures", () => {
    const body = Buffer.from("original");
    const secret = "whsec_test_secret";
    const oldTimestamp = Math.floor(Date.now() / 1000) - 1_000;
    const oldSignature = createHmac("sha256", secret)
      .update(`${oldTimestamp}.${body.toString("utf8")}`)
      .digest("hex");

    expect(verifyStripeSignature(body, `t=${oldTimestamp},v1=${oldSignature}`, secret)).toBe(false);
    expect(verifyStripeSignature(Buffer.from("tampered"), `t=${Math.floor(Date.now() / 1000)},v1=${oldSignature}`, secret)).toBe(false);
  });

  it("allows approved Google Drive media previews without allowing other frame sources", () => {
    const headers = new Map<string, string>();
    const response = {
      setHeader(name: string, value: string) {
        headers.set(name, value);
      },
    };
    let continued = false;

    securityHeaders(
      {} as Parameters<typeof securityHeaders>[0],
      response as unknown as Parameters<typeof securityHeaders>[1],
      (() => {
        continued = true;
      }) as Parameters<typeof securityHeaders>[2],
    );

    expect(continued).toBe(true);
    expect(headers.get("Content-Security-Policy")).toContain(
      "frame-src 'self' https://drive.google.com;",
    );
    expect(headers.get("Content-Security-Policy")).not.toContain("frame-src *");
  });

  it("keeps the protected media catalog server-side and limits access to Spindel accounts", async () => {
    const security = await import("./security") as Record<string, unknown>;
    const parseCatalog = security.parseProtectedMediaCatalog as
      | ((value: string) => Array<{ driveFileId: string; embedUrl: string; moduleDays: number[] }>)
      | undefined;
    const canAccess = security.canAccessSpindelMedia as
      | ((organizationName?: string) => boolean)
      | undefined;

    expect(typeof parseCatalog).toBe("function");
    expect(typeof canAccess).toBe("function");

    const media = parseCatalog?.(JSON.stringify([
      {
        driveFileId: "approved_test_file_01",
        title: "Approved training overview",
        description: "A safe test record.",
        type: "video",
        moduleDays: [1, 4],
      },
    ]));

    expect(media).toEqual([
      {
        driveFileId: "approved_test_file_01",
        title: "Approved training overview",
        description: "A safe test record.",
        type: "video",
        moduleDays: [1, 4],
        embedUrl: "https://drive.google.com/file/d/approved_test_file_01/preview",
        openUrl: "https://drive.google.com/file/d/approved_test_file_01/view",
      },
    ]);
    expect(canAccess?.("Spindel Eye Associates")).toBe(true);
    expect(canAccess?.("Another Practice")).toBe(false);
  });

  it("requires at least one video and one audio overview for every public course module", async () => {
    const security = await import("./security") as Record<string, unknown>;
    const assertCoverage = security.assertCompleteCourseMediaCoverage as
      | ((media: Array<{ type: "video" | "audio" | "image"; moduleDays: number[] }>) => void)
      | undefined;

    expect(typeof assertCoverage).toBe("function");
    if (!assertCoverage) return;

    const complete = Array.from({ length: 10 }, (_, index) => {
      const day = index + 1;
      return [
        { type: "video" as const, moduleDays: [day] },
        { type: "audio" as const, moduleDays: [day] },
      ];
    }).flat();

    expect(() => assertCoverage(complete)).not.toThrow();
    expect(() => assertCoverage(complete.slice(0, -1))).toThrow(
      "Course media is missing an audio overview for module 10.",
    );
  });
});
