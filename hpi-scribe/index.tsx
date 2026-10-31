import "./index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { marked } from "marked";
import DOMPurify from "dompurify";
const $ = <T extends HTMLElement = HTMLElement>(id: string) =>
  document.getElementById(id) as T;
const patient = $("patient"),
  summary = $("summary"),
  transcript = $<HTMLTextAreaElement>("transcript");
type Note = {
  id: string;
  patient: string;
  summary: string;
  transcript: string;
  date: string;
};
type Settings = {
  url: string;
  patient: string;
  hpi: string;
  transcript: string;
};
function read<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    notify(
      "Browser storage is unavailable or full. Export your note to keep a copy."
    );
  }
}
let notes = read<Note[]>("hpi-history", []).filter(
  n =>
    typeof n.summary === "string" &&
    typeof n.patient === "string" &&
    typeof n.transcript === "string"
);
let settings = read<Settings>("hpi-settings", {
  url: "",
  patient: "",
  hpi: "",
  transcript: "",
});
type Provider = "gemini" | "openai";
const providerSelect = $<HTMLSelectElement>("provider");
const savedProvider = read<string>("hpi-provider", "gemini");
let provider: Provider = savedProvider === "openai" ? "openai" : "gemini";
providerSelect.value = provider;
let providerHealth:
  | Record<Provider, { configured: boolean; model: string }>
  | undefined;
function updateHealth() {
  const info = providerHealth?.[provider];
  $("health").textContent = info
    ? `${provider === "openai" ? "OpenAI" : "Gemini"} · ${info.configured ? info.model : "API key required"}`
    : "Server unavailable";
  $("health").classList.toggle("warning", !info?.configured);
}
providerSelect.onchange = () => {
  provider = providerSelect.value === "openai" ? "openai" : "gemini";
  write("hpi-provider", provider);
  updateHealth();
  notify(
    `Using ${provider === "openai" ? "OpenAI" : "Gemini"} for the next request. Existing notes are unchanged.`
  );
};
let currentId: string = crypto.randomUUID(),
  busy = false,
  recording = false;
function notify(message: string) {
  $("status").textContent = message;
}
function count() {
  $("words").textContent =
    `${(summary.innerText.trim().match(/\S+/g) || []).length} words`;
}
function save() {
  count();
  if (!summary.innerText.trim()) return;
  const note: Note = {
    id: currentId,
    patient: patient.innerText.trim(),
    summary: summary.innerText.trim(),
    transcript: transcript.value,
    date: new Date().toISOString(),
  };
  notes = [note, ...notes.filter(n => n.id !== currentId)].slice(0, 100);
  write("hpi-history", notes);
}
let saveTimer: ReturnType<typeof setTimeout>;
for (const el of [summary, patient, transcript])
  el.addEventListener("input", () => {
    count();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(save, 500);
  });
function tab(isSummary: boolean) {
  $("summary-panel").hidden = !isSummary;
  $("transcript-panel").hidden = isSummary;
  for (const [id, selected] of [
    ["summary-tab", isSummary],
    ["transcript-tab", !isSummary],
  ] as const) {
    $(id).classList.toggle("active", selected);
    $(id).setAttribute("aria-selected", String(selected));
  }
}
$("summary-tab").onclick = () => tab(true);
$("transcript-tab").onclick = () => tab(false);
async function api(endpoint: string, body: unknown) {
  const response = await fetch(`/api/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...(body as Record<string, unknown>), provider }),
    signal: AbortSignal.timeout(125000),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed.");
  return data.text as string;
}
function setBusy(value: boolean) {
  busy = value;
  providerSelect.disabled = value || recording;
  for (const id of ["generate", "polish", "new", "submit"])
    $<HTMLButtonElement>(id).disabled = value;
  $<HTMLButtonElement>("record").disabled = value;
  $("history").toggleAttribute("disabled", value);
}
async function polish(customInstructions = "") {
  if (!transcript.value.trim()) {
    tab(false);
    notify("Add or record a transcript first.");
    return;
  }
  setBusy(true);
  notify("Creating your HPI…");
  try {
    const text = await api("polish", {
      rawTranscription: transcript.value,
      patientName: patient.innerText.trim(),
      customInstructions,
    });
    summary.innerHTML = DOMPurify.sanitize(await marked.parse(text));
    tab(true);
    save();
    notify("HPI ready. Review clinical accuracy before copying or submitting.");
  } catch (e) {
    notify(e instanceof Error ? e.message : "Unable to generate HPI.");
  } finally {
    setBusy(false);
  }
}
$("generate").onclick = () => void polish();
$("polish").onclick = () => {
  if (!transcript.value.trim()) {
    tab(false);
    notify("Add or record a transcript first.");
  } else $<HTMLDialogElement>("polish-modal").showModal();
};
$("polish-form").onsubmit = e => {
  e.preventDefault();
  $<HTMLDialogElement>("polish-modal").close();
  void polish($<HTMLTextAreaElement>("instructions").value);
};
$("copy").onclick = async () => {
  if (!summary.innerText.trim()) return notify("Generate an HPI first.");
  try {
    await navigator.clipboard.writeText(summary.innerText.trim());
    notify("HPI copied to clipboard.");
  } catch {
    notify(
      "Clipboard access unavailable. Select the note and copy it manually."
    );
  }
};
$("export").onclick = () => {
  if (!summary.innerText.trim()) return notify("Generate an HPI first.");
  const blob = new Blob(
    [
      `${patient.innerText.trim() || "Patient"}\nHistory of Present Illness\n\n${summary.innerText.trim()}\n`,
    ],
    { type: "text/plain;charset=utf-8" }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(patient.innerText.trim() || "Patient").replace(/[^a-z0-9_-]/gi, "_")}_HPI.txt`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
$("new").onclick = () => {
  if (recording || busy) return;
  save();
  if (
    (transcript.value || summary.innerText) &&
    !confirm("Start a new encounter? Completed notes remain in saved history.")
  )
    return;
  clearTimeout(saveTimer);
  currentId = crypto.randomUUID();
  patient.textContent = "";
  summary.textContent = "";
  transcript.value = "";
  clearAudio();
  $("timer").textContent = "00:00.00";
  count();
  notify("New encounter ready.");
};
function renderHistory() {
  const list = $("history-list");
  list.replaceChildren();
  const query = $<HTMLInputElement>("search").value.toLowerCase();
  for (const note of notes.filter(n =>
    `${n.patient} ${n.summary}`.toLowerCase().includes(query)
  )) {
    const button = document.createElement("button");
    button.className = "history-item";
    const title = document.createElement("strong");
    title.textContent = note.patient || "Unnamed patient";
    const date = document.createElement("small");
    date.textContent = new Date(note.date).toLocaleString();
    const preview = document.createElement("p");
    preview.textContent = note.summary.slice(0, 140);
    button.append(title, date, preview);
    button.onclick = () => {
      save();
      clearTimeout(saveTimer);
      currentId = note.id;
      patient.textContent = note.patient;
      summary.textContent = note.summary;
      transcript.value = note.transcript;
      clearAudio();
      count();
      tab(true);
      $<HTMLDialogElement>("history-modal").close();
    };
    list.append(button);
  }
  if (!list.children.length) list.textContent = "No saved encounters found.";
}
$("history").onclick = () => {
  if (recording || busy) return;
  save();
  renderHistory();
  $<HTMLDialogElement>("history-modal").showModal();
};
$("search").oninput = renderHistory;
$("clear").onclick = () => {
  if (confirm("Permanently delete all saved encounters from this browser?")) {
    notes = [];
    write("hpi-history", notes);
    renderHistory();
  }
};
for (const button of document.querySelectorAll<HTMLElement>("[data-close]"))
  button.onclick = () => button.closest("dialog")?.close();
$("settings").onclick = () => {
  $<HTMLInputElement>("form-url").value = settings.url;
  for (const key of ["patient", "hpi", "transcript"] as const)
    $<HTMLInputElement>(`entry-${key}`).value = settings[key];
  $<HTMLDialogElement>("settings-modal").showModal();
};
function validSettings(s: Settings) {
  try {
    const url = new URL(s.url);
    return (
      url.protocol === "https:" &&
      url.hostname === "docs.google.com" &&
      /^\/forms\/(?:d\/e\/|d\/)[\w-]+\/formResponse$/.test(url.pathname) &&
      [s.patient, s.hpi, s.transcript].every(v => /^entry\.\d+$/.test(v)) &&
      new Set([s.patient, s.hpi, s.transcript]).size === 3
    );
  } catch {
    return false;
  }
}
$("settings-form").onsubmit = e => {
  e.preventDefault();
  const next = {
    url: $<HTMLInputElement>("form-url").value.trim(),
    patient: $<HTMLInputElement>("entry-patient").value.trim(),
    hpi: $<HTMLInputElement>("entry-hpi").value.trim(),
    transcript: $<HTMLInputElement>("entry-transcript").value.trim(),
  };
  if (!validSettings(next))
    return notify(
      "Use a Google Forms formResponse URL and three distinct entry.NUMBER IDs."
    );
  settings = next;
  write("hpi-settings", settings);
  $<HTMLDialogElement>("settings-modal").close();
  notify("Workflow settings saved.");
};
$("submit").onclick = async () => {
  if (!summary.innerText.trim())
    return notify("Generate and review an HPI first.");
  if (!validSettings(settings)) {
    $("settings").click();
    return notify("Configure your clinic Google Form first.");
  }
  if (
    !confirm(
      "Send this patient name, HPI, and transcript to your configured Google Form?"
    )
  )
    return;
  const form = new FormData();
  form.set(settings.patient, patient.innerText.trim());
  form.set(settings.hpi, summary.innerText.trim());
  form.set(settings.transcript, transcript.value);
  setBusy(true);
  try {
    await fetch(settings.url, {
      method: "POST",
      mode: "no-cors",
      body: form,
      credentials: "omit",
      signal: AbortSignal.timeout(20000),
    });
    notify(
      "Submission sent; delivery cannot be confirmed. Check the destination Sheet before retrying."
    );
  } catch {
    notify(
      "Submission could not be confirmed. Check the Sheet before retrying."
    );
  } finally {
    setBusy(false);
  }
};
function applyTheme(theme: string) {
  document.documentElement.dataset.theme = theme;
}
applyTheme(
  read<string>(
    "hpi-theme",
    matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  )
);
$("theme").onclick = () => {
  const theme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(theme);
  write("hpi-theme", theme);
};
let recorder: MediaRecorder | undefined,
  context: AudioContext | undefined,
  stream: MediaStream | undefined,
  frame = 0,
  audioUrl = "",
  started = 0,
  timer: ReturnType<typeof setInterval> | undefined;
const playback = $<HTMLAudioElement>("playback");
function clearAudio() {
  playback.pause();
  playback.removeAttribute("src");
  playback.hidden = true;
  if (audioUrl) URL.revokeObjectURL(audioUrl);
  audioUrl = "";
}
function cleanup() {
  stream?.getTracks().forEach(t => t.stop());
  stream = undefined;
  void context?.close();
  context = undefined;
  cancelAnimationFrame(frame);
  clearInterval(timer);
  recording = false;
  providerSelect.disabled = busy;
  document.body.classList.remove("recording");
  $("record").innerHTML = '<i class="fa-solid fa-microphone"></i>';
  $("record").setAttribute("aria-label", "Start recording");
  $("record-label").textContent = "Ready when you are";
}
function visualize(analyser: AnalyserNode) {
  const canvas = $<HTMLCanvasElement>("visualizer"),
    ctx = canvas.getContext("2d")!;
  const bins = new Uint8Array(analyser.frequencyBinCount);
  const draw = () => {
    analyser.getByteFrequencyData(bins);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#38988c";
    for (let i = 0; i < 50; i++) {
      const height = Math.max(3, (bins[i * 2] / 255) * 65);
      ctx.fillRect(i * 12 + 2, (70 - height) / 2, 5, height);
    }
    frame = requestAnimationFrame(draw);
  };
  draw();
}
$("record").onclick = async () => {
  if (recording) {
    if (recorder?.state === "recording") recorder.stop();
    return;
  }
  if (
    !navigator.mediaDevices?.getUserMedia ||
    typeof MediaRecorder === "undefined"
  )
    return notify(
      "Recording requires a supported browser on HTTPS or localhost. You can paste a transcript instead."
    );
  if (busy) return;
  if (
    (transcript.value.trim() || summary.innerText.trim()) &&
    !confirm(
      "Replace the current encounter recording and transcript? The current HPI will remain until a new one is generated."
    )
  )
    return;
  $<HTMLButtonElement>("record").disabled = true;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimeType = [
      "audio/webm;codecs=opus",
      "audio/mp4",
      "audio/webm",
      "audio/ogg;codecs=opus",
    ].find(t => MediaRecorder.isTypeSupported(t));
    recorder = mimeType
      ? new MediaRecorder(stream, { mimeType })
      : new MediaRecorder(stream);
    const chunks: Blob[] = [];
    let size = 0;
    recorder.ondataavailable = e => {
      if (e.data.size) {
        chunks.push(e.data);
        size += e.data.size;
        if (
          size > (provider === "openai" ? 23 : 28) * 1024 * 1024 &&
          recorder?.state === "recording"
        )
          recorder.stop();
      }
    };
    recorder.onerror = () => {
      cleanup();
      notify("Recording failed. Please try again.");
    };
    recorder.onstop = async () => {
      const type = recorder?.mimeType || mimeType || "audio/webm";
      cleanup();
      const blob = new Blob(chunks, { type });
      clearAudio();
      audioUrl = URL.createObjectURL(blob);
      playback.src = audioUrl;
      playback.hidden = false;
      if (
        !blob.size ||
        blob.size > (provider === "openai" ? 24 : 30) * 1024 * 1024
      )
        return notify(
          "Recording is empty or too large. Record a shorter encounter."
        );
      setBusy(true);
      notify("Transcribing the conversation…");
      try {
        const data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve((reader.result as string).split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        transcript.value = await api("transcribe", {
          base64Audio: data,
          mimeType: type,
        });
        tab(false);
        setBusy(false);
        await polish();
      } catch (e) {
        notify(
          e instanceof Error
            ? e.message
            : "Transcription failed. Your audio remains available for playback."
        );
      } finally {
        setBusy(false);
      }
    };
    context = new AudioContext();
    await context.resume();
    const analyser = context.createAnalyser();
    analyser.fftSize = 256;
    context.createMediaStreamSource(stream).connect(analyser);
    visualize(analyser);
    recorder.start(1000);
    recording = true;
    providerSelect.disabled = true;
    started = performance.now();
    document.body.classList.add("recording");
    $("record").innerHTML = '<i class="fa-solid fa-stop"></i>';
    $("record").setAttribute("aria-label", "Stop recording");
    $("record-label").textContent = "Listening to your encounter";
    notify("Recording. Click the microphone to finish.");
    timer = setInterval(() => {
      const ms = performance.now() - started;
      $("timer").textContent =
        `${String(Math.floor(ms / 60000)).padStart(2, "0")}:${String(Math.floor(ms / 1000) % 60).padStart(2, "0")}.${String(Math.floor(ms / 10) % 100).padStart(2, "0")}`;
      if (ms >= 20 * 60000 && recorder?.state === "recording") recorder.stop();
    }, 50);
  } catch {
    cleanup();
    notify(
      "Microphone unavailable. Check browser permissions or paste a transcript."
    );
  } finally {
    $<HTMLButtonElement>("record").disabled = false;
  }
};
window.addEventListener("beforeunload", e => {
  if (recording || busy) {
    e.preventDefault();
  }
  save();
});
fetch("/api/health")
  .then(r => r.json())
  .then(data => {
    providerHealth = data.providers;
    updateHealth();
  })
  .catch(() => {
    $("health").textContent = "Server unavailable";
  });
count();
