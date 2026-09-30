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
      | ((value: string) => Array<{ driveFileId: string; embedUrl: string; moduleDays: number[]; aiGenerated: boolean }>)
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
        aiGenerated: true,
        learningTier: "core",
        sourceLabel: "Bootcamp folder",
        learningObjective: "Explain the approved workup sequence.",
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
        aiGenerated: true,
        learningTier: "core",
        sourceLabel: "Bootcamp folder",
        learningObjective: "Explain the approved workup sequence.",
      },
    ]);
    expect(canAccess?.("Spindel Eye Associates")).toBe(true);
    expect(canAccess?.("Another Practice")).toBe(false);
  });

  it("requires at least two videos and one audio overview for every course module", async () => {
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
        { type: "video" as const, moduleDays: [day] },
        { type: "audio" as const, moduleDays: [day] },
      ];
    }).flat();

    expect(() => assertCoverage(complete)).not.toThrow();
    expect(() => assertCoverage(complete.slice(0, -1))).toThrow(
      "Course media is missing an audio overview for module 10.",
    );
    expect(() => assertCoverage(complete.filter((_, index) => index !== 28))).toThrow(
      "Course media is missing a second video overview for module 10.",
    );
  });

  it("accepts the full Bootcamp inventory and rejects unsafe catalog boundaries", async () => {
    const { parseProtectedMediaCatalog } = await import("./security");
    const catalog = Array.from({ length: 42 }, (_, index) => ({
      driveFileId: `bootcamp_media_${String(index + 1).padStart(3, "0")}`,
      title: `Training item ${index + 1}`,
      description: "Approved technician training media.",
      type: "video",
      moduleDays: [1, 2, 99],
      aiGenerated: index % 2 === 0,
      learningTier: index < 10 ? "core" : "extended",
      sourceLabel: "Bootcamp folder",
      learningObjective: "Connect the visual to the written lesson.",
    }));

    const parsed = parseProtectedMediaCatalog(JSON.stringify(catalog));
    expect(parsed).toHaveLength(42);
    expect(parsed[0]).toMatchObject({ moduleDays: [1, 2], learningTier: "core", sourceLabel: "Bootcamp folder" });

    const tooMany = Array.from({ length: 101 }, (_, index) => ({
      ...catalog[0],
      driveFileId: `overflow_media_${String(index + 1).padStart(3, "0")}`,
    }));
    expect(() => parseProtectedMediaCatalog(JSON.stringify(tooMany))).toThrow("at most 100 items");
    expect(() => parseProtectedMediaCatalog(JSON.stringify([{ ...catalog[0], learningTier: "featured" }]))).toThrow();
  });

  it("rejects internal onboarding media from the public paid course catalog", async () => {
    const { assertPublicCourseCatalogIsGeneric } = await import("./security");
    const genericItem = {
      driveFileId: "public_course_media_01",
      title: "Ocular Anatomy Overview",
      description: "A general anatomy review for technician students.",
      type: "video" as const,
      moduleDays: [1],
      embedUrl: "https://drive.google.com/file/d/public_course_media_01/preview",
      openUrl: "https://drive.google.com/file/d/public_course_media_01/view",
      aiGenerated: false,
      learningTier: "core" as const,
      sourceLabel: "OptiTech media library",
      learningObjective: "Identify the main ocular structures.",
    };

    expect(() => assertPublicCourseCatalogIsGeneric([genericItem])).not.toThrow();
    expect(() => assertPublicCourseCatalogIsGeneric([{
      ...genericItem,
      title: "Spindel precision workup",
    }])).toThrow("Public course media cannot include internal onboarding material");
  });
});
