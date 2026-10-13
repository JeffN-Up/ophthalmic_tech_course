import { useEffect, useState } from "react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import type {
  VideoLocation,
  VideoTask,
  Workspace,
} from "../../../server/videoEditing";

const labels = { optitech: "OptiTech Academy", spindel: "Spindel onboarding" };
export default function VideoAdmin() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workspace, setWorkspace] = useState<Workspace>();
  const [locations, setLocations] = useState<VideoLocation[]>([]);
  const [tasks, setTasks] = useState<VideoTask[]>([]);
  const [selected, setSelected] = useState<string>();
  const [replacement, setReplacement] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [restore, setRestore] = useState(false);
  const location = locations.find(item => item.id === selected);
  const task = tasks.find(
    item =>
      item.locationId === selected &&
      item.originalRevision === location?.revision
  );
  const previewId = restore
    ? location?.history.at(-1)?.fileId
    : task?.replacementId;

  useEffect(() => {
    apiRequest<{ workspaces: Workspace[] }>("/api/admin/video-workspaces")
      .then(data => {
        setWorkspaces(data.workspaces);
        setWorkspace(data.workspaces[0]);
        if (!data.workspaces.length)
          setError("Your account has no owner-authorized content workspace.");
      })
      .catch(error => setError(error.message));
  }, []);
  useEffect(() => {
    setLocations([]);
    setTasks([]);
    setSelected(undefined);
    setError("");
    if (!workspace) return;
    let active = true;
    apiRequest<{ locations: VideoLocation[]; tasks: VideoTask[] }>(
      `/api/admin/videos/${workspace}`
    )
      .then(data => {
        if (active) {
          setLocations(data.locations);
          setTasks(data.tasks);
        }
      })
      .catch(error => {
        if (active) setError(error.message);
      });
    return () => {
      active = false;
    };
  }, [workspace]);
  useEffect(() => {
    setReplacement(task?.replacementId || "");
    setConfirmed(false);
    setRestore(false);
    setNotice("");
  }, [selected, task?.revision]);

  async function act(action: "start" | "save" | "publish" | "restore") {
    if (!location || !workspace) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const data = await apiRequest<{
        location: VideoLocation;
        task?: VideoTask;
      }>(`/api/admin/videos/${workspace}/${action}`, {
        method: "POST",
        body: JSON.stringify({
          locationId: location.id,
          locationRevision: location.revision,
          taskId: task?.id,
          taskRevision: task?.revision,
          replacement,
          playbackConfirmed: confirmed,
        }),
      });
      setLocations(items =>
        items.map(item => (item.id === data.location.id ? data.location : item))
      );
      if (data.task)
        setTasks(items => [
          ...items.filter(item => item.id !== data.task!.id),
          ...(data.task!.status === "draft" ? [data.task!] : []),
        ]);
      setConfirmed(false);
      setRestore(false);
      setNotice(
        action === "publish" || action === "restore"
          ? "Published to this location."
          : "Edit task saved."
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "The action failed.");
    } finally {
      setBusy(false);
    }
  }
  const shared = location
    ? locations.filter(
        item =>
          item.id !== location.id &&
          item.media.driveFileId === location.media.driveFileId
      )
    : [];
  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <Link href="/course" className="text-blue-700">
        Back to course
      </Link>
      <h1 className="text-3xl font-bold">Video editing</h1>
      <p>
        Select the original lesson, edit externally in Google Vids, and return
        the finished video here.
      </p>
      <label className="block">
        Workspace{" "}
        <select
          disabled={busy}
          className="ml-3 rounded border p-2"
          value={workspace || ""}
          onChange={event => setWorkspace(event.target.value as Workspace)}
        >
          {workspaces.map(item => (
            <option key={item} value={item}>
              {labels[item]}
            </option>
          ))}
        </select>
      </label>
      {error && (
        <p role="alert" className="rounded bg-red-50 p-4 text-red-800">
          {error}{" "}
          <button
            onClick={() => window.location.reload()}
            className="underline"
          >
            Reload
          </button>{" "}
          · <Link href="/login">Sign in</Link>
        </p>
      )}
      {notice && (
        <p role="status" className="rounded bg-green-50 p-4">
          {notice}
        </p>
      )}
      <label className="block">
        Find a video{" "}
        <input
          className="ml-3 rounded border p-2"
          placeholder="Title, module, or file ID"
          value={search}
          onChange={event => setSearch(event.target.value)}
        />
      </label>
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <nav aria-label="Video locations" className="space-y-2">
          {locations
            .filter(item =>
              `${item.day} ${item.media.title} ${item.media.driveFileId}`
                .toLowerCase()
                .includes(search.toLowerCase())
            )
            .map(item => (
              <button
                disabled={busy}
                key={item.id}
                onClick={() => setSelected(item.id)}
                className={`block w-full rounded border p-3 text-left ${selected === item.id ? "bg-blue-50 border-blue-600" : ""}`}
              >
                <strong>
                  Module {item.day} · Position {item.position + 1}
                </strong>
                <span className="block">{item.media.title}</span>
                <small>
                  {item.media.learningTier} · Revision {item.revision}
                  {tasks.some(
                    task =>
                      task.locationId === item.id &&
                      task.originalRevision === item.revision
                  )
                    ? " · Draft"
                    : ""}
                </small>
              </button>
            ))}
        </nav>
        {location && workspace ? (
          <section className="space-y-4 rounded border p-5">
            <h2 className="text-xl font-bold">
              {labels[workspace]} → Module {location.day} → Media → Position{" "}
              {location.position + 1}
            </h2>
            <p>{location.media.title}</p>
            <p className="break-all text-sm">Placeholder: {location.id}</p>
            <p>{location.media.learningObjective}</p>
            <a
              href={`/course/module/${location.day}#media-${location.id}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-700 underline"
            >
              View original position in course (requires learner access to this
              workspace)
            </a>
            <iframe
              title="Current published video"
              src={location.media.embedUrl}
              className="aspect-video w-full"
              allowFullScreen
            />
            <a
              href={location.media.openUrl}
              target="_blank"
              rel="noreferrer"
              className="mr-4 text-blue-700 underline"
            >
              Open source in Drive
            </a>
            <a
              href="https://vids.google.com/"
              target="_blank"
              rel="noreferrer"
              className="text-blue-700 underline"
            >
              Open Google Vids
            </a>
            <p className="text-sm">
              Edit in Google Vids and export a finished video to a new Drive
              file. Keep the project for future edits. The existing video stays
              live until you publish.
            </p>
            {!task ? (
              <Button disabled={busy} onClick={() => act("start")}>
                Start video edit task
              </Button>
            ) : (
              <div className="space-y-3">
                <label className="block">
                  Finished video Drive link or ID
                  <input
                    disabled={busy}
                    value={replacement}
                    onChange={event => {
                      setReplacement(event.target.value);
                      setConfirmed(false);
                    }}
                    className="mt-2 w-full rounded border p-2"
                  />
                </label>
                <Button
                  disabled={busy || !replacement.trim()}
                  onClick={() => act("save")}
                >
                  Save replacement draft
                </Button>
              </div>
            )}
            {shared.length > 0 && (
              <p className="rounded bg-amber-50 p-3">
                Also linked in{" "}
                {shared
                  .map(
                    item => `Module ${item.day}, position ${item.position + 1}`
                  )
                  .join("; ")}
                . Publishing here updates only this location. Workspaces are
                independent.
              </p>
            )}
            {location.history.length > 0 && (
              <Button
                variant="outline"
                disabled={busy}
                onClick={() => {
                  setRestore(value => !value);
                  setConfirmed(false);
                }}
              >
                Preview previous video for restoration
              </Button>
            )}
            {previewId && (
              <div className="space-y-3 rounded bg-slate-50 p-4">
                <h3 className="font-bold">
                  {restore ? "Restore previous video" : "Draft preview"} ·{" "}
                  {labels[workspace]} · Module {location.day} · Position{" "}
                  {location.position + 1}
                </h3>
                <p className="break-all text-sm">
                  Old: {location.media.driveFileId}
                  <br />
                  New: {previewId}
                </p>
                <iframe
                  title="Replacement video in selected media position"
                  src={`https://drive.google.com/file/d/${previewId}/preview`}
                  className="aspect-video w-full"
                  allowFullScreen
                />
                <a
                  href={`https://drive.google.com/file/d/${previewId}/view`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-700 underline"
                >
                  Open finished video to check playback
                </a>
                <label className="block">
                  <input
                    disabled={busy}
                    type="checkbox"
                    checked={confirmed}
                    onChange={event => setConfirmed(event.target.checked)}
                  />{" "}
                  I previewed this finished video and verified playback using an
                  intended learner account. The title, objective, tier and
                  position are correct.
                </label>
                <p className="text-sm">
                  The server also checks video type and access without signing
                  in. Restricted organization-only files require a separate
                  Google connection.
                </p>
                <Button
                  disabled={
                    busy ||
                    !confirmed ||
                    (!restore && replacement.trim() !== task?.replacementId)
                  }
                  onClick={() => act(restore ? "restore" : "publish")}
                >
                  {busy
                    ? "Working…"
                    : restore
                      ? "Restore previous video in this location"
                      : "Replace video in this location"}
                </Button>
              </div>
            )}
          </section>
        ) : (
          <p>Select a video location to begin.</p>
        )}
      </div>
    </main>
  );
}
