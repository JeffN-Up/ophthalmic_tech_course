import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { verifyPassword } from "./auth";

const originalEnvironment = { ...process.env };
const temporaryDirectories: string[] = [];

afterEach(async () => {
  process.env = { ...originalEnvironment };
  vi.resetModules();
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      rm(directory, { recursive: true, force: true }),
    ),
  );
});

describe("Spindel manager bootstrap", () => {
  it('preserves video drafts and published revisions across reloads without losing learner data', async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), 'video-store-test-'));
    temporaryDirectories.push(directory);
    process.env.DATA_FILE = path.join(directory, 'course-data.json');
    delete process.env.SPINDEL_MANAGER_EMAIL;
    delete process.env.SPINDEL_MANAGER_PASSWORD;
    vi.resetModules();
    const store = await import('./store');
    const { seedLocations, startTask, publishTask } = await import('./videoEditing');
    await store.mutateDatabase(db => {
      db.users.push({ id: 'learner', email: 'learner@example.com', firstName: 'Test', lastName: 'Learner', passwordHash: 'unused', role: 'student', seatLimit: 1, createdAt: '2026-01-01', progress: [{ day: 1, score: 100, passed: true, updatedAt: '2026-01-01' }] });
      const [location] = seedLocations(db, 'optitech', [{ driveFileId: 'original_video_123', title: 'Lesson', description: 'Description', type: 'video', moduleDays: [1], embedUrl: '', openUrl: '', aiGenerated: false, learningTier: 'core', sourceLabel: 'Course', learningObjective: 'Objective' }]);
      const task = startTask(db, location, 'editor');
      task.replacementId = 'finished_video_123';
      publishTask(location, task, 'editor');
      startTask(db, location, 'editor').replacementId = 'draft_video_456';
    });
    vi.resetModules();
    const reloaded = await (await import('./store')).readDatabase();
    expect(reloaded.users[0].progress[0].score).toBe(100);
    expect(reloaded.videoLocations?.[0].media.driveFileId).toBe('finished_video_123');
    expect(reloaded.videoLocations?.[0].history[0].fileId).toBe('original_video_123');
    expect(reloaded.videoTasks?.find(task => task.status === 'draft')?.replacementId).toBe('draft_video_456');
  });
  it("uses the current Render manager password for an existing account", async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "optitech-store-test-"));
    temporaryDirectories.push(directory);
    process.env.DATA_FILE = path.join(directory, "course-data.json");
    process.env.SESSION_SECRET = "test-session-secret";
    process.env.SPINDEL_MANAGER_EMAIL = "manager@example.com";
    process.env.SPINDEL_MANAGER_PASSWORD = "initial-password";

    vi.resetModules();
    const initialStore = await import("./store");
    await initialStore.mutateDatabase(() => undefined);

    process.env.SPINDEL_MANAGER_PASSWORD = "replacement-password";
    vi.resetModules();
    const updatedStore = await import("./store");
    const database = await updatedStore.readDatabase();
    const manager = database.users.find((user) => user.email === "manager@example.com");

    expect(manager).toBeDefined();
    expect(verifyPassword("replacement-password", manager?.passwordHash ?? "")).toBe(true);
    expect(verifyPassword("initial-password", manager?.passwordHash ?? "")).toBe(false);
  });
});
