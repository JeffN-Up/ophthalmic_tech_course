import { afterEach, describe, expect, it, vi } from "vitest";
import {
  canEditVideo,
  extractVideoId,
  learnerMedia,
  publishTask,
  seedLocations,
  startTask,
  verifyFinishedVideo,
} from "./videoEditing";
import type { CourseDatabase } from "./store";
import type { ProtectedMediaItem } from "./security";

const media: ProtectedMediaItem = {
  driveFileId: "original_video_123",
  title: "Lesson",
  description: "Original description",
  type: "video",
  moduleDays: [1, 2],
  embedUrl: "",
  openUrl: "",
  aiGenerated: false,
  learningTier: "core",
  sourceLabel: "Course",
  learningObjective: "Original objective",
};
const database = (): CourseDatabase => ({
  users: [],
  invites: [],
  purchases: [],
  passwordResets: [],
  processedStripeEvents: [],
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
describe("video editing", () => {
  it("accepts Drive file links and rejects projects and lookalike hosts", () => {
    expect(
      extractVideoId(
        "https://drive.google.com/file/d/finished_video_123/view?usp=sharing"
      )
    ).toBe("finished_video_123");
    expect(
      extractVideoId("https://drive.google.com/open?id=finished_video_123")
    ).toBe("finished_video_123");
    for (const value of [
      "https://drive.google.com.evil.test/file/d/finished_video_123/view",
      "https://docs.google.com/videos/d/project_12345/edit",
      "bad",
      "https://drive.google.com:444/file/d/finished_video_123/view",
    ])
      expect(() => extractVideoId(value)).toThrow();
  });
  it("requires explicit authorization per workspace", () => {
    vi.stubEnv("OPTITECH_EDITOR_EMAILS", "owner@example.com");
    vi.stubEnv("SPINDEL_EDITOR_EMAILS", "");
    expect(canEditVideo("OWNER@example.com", "optitech")).toBe(true);
    expect(canEditVideo("owner@example.com", "spindel")).toBe(false);
    expect(canEditVideo("manager@example.com", "optitech")).toBe(false);
  });
  it("keeps drafts private, preserves position and separates shared locations and workspaces", () => {
    const db = database();
    const [first, second] = seedLocations(db, "optitech", [media]);
    seedLocations(db, "spindel", [media]);
    const task = startTask(db, first, "owner");
    task.replacementId = "finished_video_123";
    expect(learnerMedia(db, "optitech", [media])[0].driveFileId).toBe(
      media.driveFileId
    );
    publishTask(first, task, "owner");
    expect(first.media).toMatchObject({
      title: media.title,
      learningObjective: media.learningObjective,
      moduleDays: [1],
      learningTier: "core",
      driveFileId: "finished_video_123",
    });
    expect(first.position).toBe(0);
    expect(second.media.driveFileId).toBe(media.driveFileId);
    expect(learnerMedia(db, "spindel", [media])[0].driveFileId).toBe(
      media.driveFileId
    );
    expect(first.history[0].fileId).toBe(media.driveFileId);
    expect(seedLocations(db, "optitech", [media])).toHaveLength(2);
  });
  it("rejects stale concurrent publication", () => {
    const db = database();
    const [location] = seedLocations(db, "optitech", [media]);
    const first = startTask(db, location, "one");
    const second = startTask(db, location, "two");
    first.replacementId = "finished_video_111";
    second.replacementId = "finished_video_222";
    publishTask(location, first, "one");
    expect(() => publishTask(location, second, "two")).toThrow("changed");
    expect(location.media.driveFileId).toBe("finished_video_111");
  });
  it("fails closed without validation config or for projects and inaccessible files", async () => {
    vi.stubEnv("GOOGLE_DRIVE_API_KEY", "");
    await expect(verifyFinishedVideo("finished_video_123")).rejects.toThrow(
      "Configure"
    );
    vi.stubEnv("GOOGLE_DRIVE_API_KEY", "test");
    const fetchMock = vi.fn().mockResolvedValue({ ok: false });
    vi.stubGlobal("fetch", fetchMock);
    await expect(verifyFinishedVideo("finished_video_123")).rejects.toThrow(
      "verify"
    );
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ mimeType: "application/vnd.google-apps.vid" }),
    });
    await expect(verifyFinishedVideo("finished_video_123")).rejects.toThrow(
      "finished playable video"
    );
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ mimeType: "video/mp4", trashed: false }),
    });
    await expect(
      verifyFinishedVideo("finished_video_123")
    ).resolves.toBeUndefined();
  });
});
