import { test } from "node:test";
import assert from "node:assert/strict";
import { createApp, generateText } from "../server.ts";
import type { AddressInfo } from "node:net";

test("API validates inputs, isolates tasks, and preserves provider failures", async () => {
  const requests: unknown[] = [];
  const providers: string[] = [];
  const app = createApp(async (contents, provider) => {
    requests.push(contents);
    providers.push(provider);
    return "Patient reports blurred vision in the Left Eye.";
  });
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>(resolve => server.once("listening", resolve));
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  const post = (route: string, body: unknown) =>
    fetch(`${base}/api/${route}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  try {
    assert.equal((await fetch(`${base}/api/health`)).status, 200);
    assert.equal((await post("polish", {})).status, 400);
    assert.equal(
      (await post("transcribe", { base64Audio: "invalid" })).status,
      400
    );
    assert.equal(
      (
        await post("transcribe", {
          base64Audio: "YXVkaW8=",
          mimeType: "text/html",
        })
      ).status,
      400
    );
    const polished = await post("polish", {
      rawTranscription: "Patient: My left eye is blurry.",
      patientName: "Jane",
    });
    assert.equal(polished.status, 200);
    assert.match((await polished.json()).text, /Left Eye/);
    const transcribed = await post("transcribe", {
      base64Audio: "YXVkaW8=",
      mimeType: "audio/webm",
    });
    assert.equal(transcribed.status, 200);
    assert.equal(requests.length, 2);
    assert.match(JSON.stringify(requests[1]), /inlineData/);
    assert.equal(
      (
        await post("polish", {
          rawTranscription: "Patient: Blurry vision.",
          provider: "openai",
        })
      ).status,
      200
    );
    assert.equal(
      (
        await post("transcribe", {
          base64Audio: "YXVkaW8=",
          provider: "openai",
        })
      ).status,
      200
    );
    assert.deepEqual(providers, ["gemini", "gemini", "openai", "openai"]);
    assert.equal(
      (
        await post("polish", {
          rawTranscription: "Patient: Blurry vision.",
          provider: "unknown",
        })
      ).status,
      400
    );
    assert.equal((await fetch(`${base}/api/unknown`)).status, 404);
  } finally {
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
});
test("missing AI configuration returns a useful JSON error", async () => {
  const original = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  const server = createApp().listen(0, "127.0.0.1");
  await new Promise<void>(resolve => server.once("listening", resolve));
  try {
    const response = await fetch(
      `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/polish`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawTranscription: "Patient: Blurry vision." }),
      }
    );
    assert.equal(response.status, 503);
    assert.match((await response.json()).error, /GEMINI_API_KEY/);
  } finally {
    if (original !== undefined) process.env.GEMINI_API_KEY = original;
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
});

test("OpenAI sends diarized audio and non-stored HPI requests through the SDK", async () => {
  const originalKey = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = "test-key";
  const originalFetch = globalThis.fetch;
  const calls: { url: string; body: unknown }[] = [];
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    if (url.startsWith("data:")) return originalFetch(input, init);
    calls.push({ url, body: init?.body });
    if (url.endsWith("/audio/transcriptions")) {
      const form = init?.body as FormData;
      assert.equal(form.get("response_format"), "diarized_json");
      assert.equal(form.get("chunking_strategy"), "auto");
      assert.equal(form.get("model"), "gpt-4o-transcribe-diarize");
      assert.equal((form.get("file") as File).name, "recording.webm");
      return Response.json({
        text: "Blurry vision.",
        segments: [{ speaker: "A", text: " Blurry vision. " }],
      });
    }
    const body = JSON.parse(init?.body as string);
    assert.equal(body.store, false);
    assert.match(body.instructions, /Never infer/);
    return Response.json({
      id: "resp_test",
      object: "response",
      output: [
        {
          type: "message",
          role: "assistant",
          content: [
            {
              type: "output_text",
              text: "The patient reports blurred vision.",
              annotations: [],
            },
          ],
        },
      ],
    });
  };
  try {
    const transcript = await generateText(
      [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: "YXVkaW8=",
                mimeType: "audio/webm;codecs=opus",
              },
            },
          ],
        },
      ],
      "openai"
    );
    assert.equal(transcript, "Speaker A: Blurry vision.");
    const note = await generateText(
      [{ role: "user", parts: [{ text: "Create HPI for blurry vision." }] }],
      "openai"
    );
    assert.equal(note, "The patient reports blurred vision.");
    assert.equal(calls.length, 2);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = originalKey;
  }
});
