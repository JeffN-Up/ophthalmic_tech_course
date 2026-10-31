# Ophthalmology HPI Scribe

Standalone Express + TypeScript + Vite application. Records audio, transcribes with Gemini 2.5 Flash or OpenAI, and creates an editable single-paragraph ophthalmology HPI. Includes playback, frequency visualization, transcript editing, re-polishing, clipboard copying, text export, searchable browser history, themes, and Google Forms submission settings.

## Run locally

Requires Node.js 22.14 or later.

```sh
npm ci
# Configure either or both providers
export GEMINI_API_KEY='your-google-key'
export OPENAI_API_KEY='your-openai-key'
npm run dev
```

Open http://localhost:3000. The key remains on the server. `.env.example` documents variables; the server does not automatically load `.env`. Export variables in your shell or configure your hosting environment.

```sh
npm test
npm run build
npm start
```

Production serves `dist` on `0.0.0.0`, using `PORT` or 3000. The server uses `tsx` for portable TypeScript execution. `/api/health` reports server health separately from AI configuration. Vite is imported only during development.

## Render

Create a Node web service from this repository with root directory `hpi-scribe`, build command `npm ci && npm run build`, and start command `npm start`. Set `NODE_ENV=production` and either or both secrets `GEMINI_API_KEY` and `OPENAI_API_KEY`. A `render.yaml` blueprint is included; because this app lives inside an existing repository, select `hpi-scribe/render.yaml` as the blueprint path. Health check: `/api/health`.

Microphone access requires HTTPS or localhost. Recordings stop after 20 minutes or approximately 28 MB for Gemini or 23 MB for OpenAI. API audio limit is 30 MB for Gemini or 24 MB for OpenAI; JSON limit is 50 MB. Failed transcription leaves audio available for playback. You can always paste a transcript into the Diarized Transcript tab and generate an HPI.

## Google Forms

In Settings, enter the Form's `https://docs.google.com/forms/d/e/FORM_ID/formResponse` action URL and distinct `entry.NUMBER` IDs for patient, HPI, and transcript fields. Find entry IDs using the Form's prefilled-link feature. Send only to an approved Form accessible to the browser without interactive authentication. A no-cors response cannot establish successful receipt; the UI explicitly asks users to verify the Sheet.

## Data and deployment boundaries

Audio is held in browser memory and sent to the selected provider through the server. Completed notes, names, and transcripts are automatically retained in browser localStorage (maximum 100 encounters); audio is not persisted. Clear history on shared devices. Copy and export contain the reviewed HPI, not Markdown syntax. Model Markdown is sanitized before rendering.

Clinical review is required. The prompt includes only explicitly stated negatives and avoids invented findings. This scaffold is not an assertion of HIPAA compliance: use synthetic data until your organization approves your selected AI provider, hosting, browser storage, and Google Forms for patient information. Before exposing the service to a clinic, place it behind your organization's authenticated access gateway; this application does not implement user accounts. Per-IP rate limiting protects API endpoints but is not authentication. When deploying behind a proxy, configure Express trust proxy only for the known infrastructure if you need client-specific limits.

The application does not log patient content. Configure infrastructure logging and retention appropriately. External Google Fonts are optional; system sans-serif fonts are used when unavailable. Icons are bundled locally.

## Switching AI providers

Choose **Google Gemini** or **OpenAI** in the header. Your choice is saved in this browser and used for both transcription and HPI generation on subsequent requests. Existing notes are not regenerated when switching. The selected provider is locked during recording and processing so audio cannot silently change destinations. Health status shows whether that provider's server-side key is configured; there is no automatic fallback to another provider.

OpenAI uses the official `openai` SDK, `gpt-4o-transcribe-diarize` with automatic chunking and diarized JSON, and the Responses API with `gpt-4.1-mini` for HPI generation. Set `OPENAI_HPI_MODEL` to override the HPI model. Diarization uses neutral speaker labels because identities do not prove Technician/Patient roles; edit those labels in the transcript as needed. Responses requests use `store: false`; this does not override provider retention policies or constitute a data-retention agreement. API billing is separate from ChatGPT subscriptions.

Both API endpoints accept an optional `provider` value (`gemini` or `openai`); omission preserves the Gemini default. Unknown values return 400. Keys are never included in browser responses or saved in localStorage. OpenAI accepts WebM, MP4, MPEG, WAV, OGG, and FLAC in this app; raw AAC is unsupported. Live provider calls require valid credentials and network access to the selected provider.
