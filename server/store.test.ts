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
