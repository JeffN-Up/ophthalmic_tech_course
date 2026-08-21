import { describe, expect, it } from "vitest";

describe("approved Spindel media", () => {
  it("filters server-provided media without embedding private file identifiers in the client", async () => {
    const mediaModule = await import("./spindelMedia") as Record<string, unknown>;
    const filterForDay = mediaModule.getSpindelMediaForDay as
      | ((media: Array<{
        driveFileId: string;
        moduleDays: number[];
      }>, day: number) => Array<{ driveFileId: string }>)
      | undefined;
    const media = [
      {
        driveFileId: "server_supplied_media_01",
        title: "Workup overview",
        description: "Server-provided test media.",
        type: "video",
        moduleDays: [4],
        embedUrl: "https://drive.google.com/file/d/server_supplied_media_01/preview",
        openUrl: "https://drive.google.com/file/d/server_supplied_media_01/view",
      },
      {
        driveFileId: "server_supplied_media_02",
        title: "Safety overview",
        description: "Server-provided test media.",
        type: "video",
        moduleDays: [5],
        embedUrl: "https://drive.google.com/file/d/server_supplied_media_02/preview",
        openUrl: "https://drive.google.com/file/d/server_supplied_media_02/view",
      },
    ] as Array<{
      driveFileId: string;
      moduleDays: number[];
    }>;

    expect(mediaModule.spindelApprovedMedia).toBeUndefined();
    expect(typeof filterForDay).toBe("function");
    expect(filterForDay?.(media, 4).map((item) => item.driveFileId)).toEqual([
      "server_supplied_media_01",
    ]);
  });

  it("routes public learners to course media and Spindel learners to onboarding media", async () => {
    const mediaModule = await import("./spindelMedia") as Record<string, unknown>;
    const getEndpoint = mediaModule.getApprovedMediaEndpoint as
      | ((organizationName?: string) => string)
      | undefined;

    expect(typeof getEndpoint).toBe("function");
    if (!getEndpoint) return;

    expect(getEndpoint("Independent Learner")).toBe("/api/course/media");
    expect(getEndpoint("Spindel Eye Associates")).toBe("/api/course/spindel-media");
  });
});
