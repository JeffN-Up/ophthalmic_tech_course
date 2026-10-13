import { createHash, randomUUID } from "node:crypto";
import {
  parseProtectedMediaCatalog,
  type ProtectedMediaItem,
} from "./security";
import type { CourseDatabase } from "./store";

export type Workspace = "optitech" | "spindel";
export interface VideoLocation {
  id: string;
  workspace: Workspace;
  day: number;
  position: number;
  media: ProtectedMediaItem;
  revision: number;
  history: { fileId: string; editor: string; at: string }[];
}
export interface VideoTask {
  id: string;
  locationId: string;
  workspace: Workspace;
  originalFileId: string;
  originalRevision: number;
  editor: string;
  replacementId?: string;
  revision: number;
  status: "draft" | "published";
}
export class VideoError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}
export function canEditVideo(email: string, workspace: Workspace): boolean {
  const setting =
    workspace === "optitech"
      ? "OPTITECH_EDITOR_EMAILS"
      : "SPINDEL_EDITOR_EMAILS";
  return (process.env[setting] || "")
    .split(",")
    .map(value => value.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.toLowerCase());
}
export function extractVideoId(input: unknown): string {
  if (typeof input !== "string")
    throw new VideoError(400, "Enter a finished video Drive link or file ID.");
  let id = input.trim();
  if (id.startsWith("https://")) {
    let url: URL;
    try {
      url = new URL(id);
    } catch {
      throw new VideoError(400, "Invalid Drive link.");
    }
    if (
      url.hostname !== "drive.google.com" ||
      url.username ||
      url.password ||
      url.port
    )
      throw new VideoError(400, "Use a drive.google.com video link.");
    id =
      url.pathname.match(/^\/file\/d\/([A-Za-z0-9_-]+)(?:\/|$)/)?.[1] ||
      (["/open", "/uc"].includes(url.pathname)
        ? url.searchParams.get("id") || ""
        : "");
  }
  if (!/^[A-Za-z0-9_-]{10,100}$/.test(id))
    throw new VideoError(
      400,
      "Invalid Drive file ID. Export the Vids project as a finished video first."
    );
  return id;
}
export function withFile(
  media: ProtectedMediaItem,
  fileId: string
): ProtectedMediaItem {
  return {
    ...media,
    driveFileId: fileId,
    embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
    openUrl: `https://drive.google.com/file/d/${fileId}/view`,
  };
}
export function seedLocations(
  database: CourseDatabase,
  workspace: Workspace,
  catalog: ProtectedMediaItem[]
) {
  database.videoLocations ??= [];
  database.videoTasks ??= [];
  if (database.videoLocations.some(item => item.workspace === workspace)) {
    return database.videoLocations
      .filter(item => item.workspace === workspace)
      .sort((a, b) => a.day - b.day || a.position - b.position);
  }
  // Once imported, saved locations are authoritative and independent of file IDs.
  for (const day of Array.from({ length: 10 }, (_, i) => i + 1)) {
    catalog
      .filter(item => item.moduleDays.includes(day))
      .forEach((media, position) => {
        const id = `${workspace}-${createHash("sha256").update(`${day}:${media.driveFileId}`).digest("hex").slice(0, 24)}`;
        if (!database.videoLocations!.some(item => item.id === id)) {
          database.videoLocations!.push({
            id,
            workspace,
            day,
            position,
            media: { ...media, moduleDays: [day] },
            revision: 0,
            history: [],
          });
        }
      });
  }
  return database.videoLocations
    .filter(item => item.workspace === workspace)
    .sort((a, b) => a.day - b.day || a.position - b.position);
}
export function readWorkspaceCatalog(workspace: Workspace) {
  const raw =
    process.env[
      workspace === "optitech"
        ? "COURSE_MEDIA_CATALOG_JSON"
        : "SPINDEL_MEDIA_CATALOG_JSON"
    ];
  if (!raw) throw new VideoError(503, "Workspace media is not configured.");
  return parseProtectedMediaCatalog(raw);
}
export function learnerMedia(
  database: CourseDatabase,
  workspace: Workspace,
  fallback: ProtectedMediaItem[]
) {
  const locations = database.videoLocations?.filter(
    item => item.workspace === workspace
  );
  return locations?.length
    ? locations
        .sort((a, b) => a.day - b.day || a.position - b.position)
        .map(item => ({ ...item.media, placeholderId: item.id }))
    : fallback;
}
export function startTask(
  database: CourseDatabase,
  location: VideoLocation,
  editor: string
) {
  database.videoTasks ??= [];
  const existing = database.videoTasks.find(
    task =>
      task.locationId === location.id &&
      task.editor === editor &&
      task.status === "draft" &&
      task.originalRevision === location.revision
  );
  if (existing) return existing;
  const task: VideoTask = {
    id: randomUUID(),
    locationId: location.id,
    workspace: location.workspace,
    originalFileId: location.media.driveFileId,
    originalRevision: location.revision,
    editor,
    revision: 0,
    status: "draft",
  };
  database.videoTasks.push(task);
  return task;
}
export function publishTask(
  location: VideoLocation,
  task: VideoTask,
  editor: string
) {
  if (task.status !== "draft" || location.revision !== task.originalRevision)
    throw new VideoError(
      409,
      "This location changed. Reload and start a new edit task."
    );
  if (!task.replacementId)
    throw new VideoError(400, "Save a replacement first.");
  if (task.replacementId === location.media.driveFileId)
    throw new VideoError(
      400,
      "Export to a new Drive file so the previous video can be restored."
    );
  location.history.push({
    fileId: location.media.driveFileId,
    editor,
    at: new Date().toISOString(),
  });
  location.media = withFile(location.media, task.replacementId);
  location.revision++;
  task.status = "published";
  task.revision++;
}
export async function verifyFinishedVideo(fileId: string) {
  const key = process.env.GOOGLE_DRIVE_API_KEY?.trim();
  if (!key)
    throw new VideoError(
      503,
      "Configure GOOGLE_DRIVE_API_KEY for finished-video validation before publishing."
    );
  const url = new URL(`https://www.googleapis.com/drive/v3/files/${fileId}`);
  url.search = new URLSearchParams({
    key,
    fields: "id,mimeType,trashed,capabilities(canDownload)",
  }).toString();
  let response: Response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(10000) });
  } catch {
    throw new VideoError(
      503,
      "Drive validation is unavailable. The published video was not changed."
    );
  }
  if (!response.ok)
    throw new VideoError(
      400,
      "Drive could not verify this file without signing in. Confirm the finished video is shared for learner playback."
    );
  const file = (await response.json()) as {
    mimeType?: string;
    trashed?: boolean;
  };
  if (file.trashed || !file.mimeType?.startsWith("video/"))
    throw new VideoError(
      400,
      "The file must be a finished playable video, not a Google Vids project."
    );
}
