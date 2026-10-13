import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { expect, it, vi } from 'vitest';
import { createSessionToken } from './auth';

it('enforces video API permissions, task ownership and revisions, and keeps a failed publication invisible', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'video-api-'));
  const probe = createServer();
  await new Promise<void>(resolve => probe.listen(0, '127.0.0.1', resolve));
  const port = (probe.address() as { port: number }).port;
  await new Promise<void>(resolve => probe.close(() => resolve()));
  const secret = 'video-api-integration-test-secret';
  vi.stubEnv('SESSION_SECRET', secret);
  const users = ['editor', 'manager', 'other'].map(id => ({ id, email: `${id}@example.com`, firstName: id, lastName: 'Test', passwordHash: 'unused', role: 'manager', seatLimit: 1, createdAt: '2026-01-01', progress: [] }));
  await writeFile(path.join(directory, 'data.json'), JSON.stringify({ users }));
  const catalog = ['video', 'video', 'audio'].map((type, index) => ({ driveFileId: `original_media_${index}`, title: 'Lesson overview', description: 'Training media', type, moduleDays: Array.from({ length: 10 }, (_, i) => i + 1), learningTier: 'core', sourceLabel: 'Course', learningObjective: 'Learn the lesson' }));
  const child = spawn(process.execPath, ['--import', 'tsx', 'server/index.ts'], {
    cwd: process.cwd(), stdio: 'ignore', windowsHide: true,
    env: { ...process.env, NODE_ENV: 'test', PORT: String(port), SESSION_SECRET: secret, DATA_FILE: path.join(directory, 'data.json'), COURSE_MEDIA_CATALOG_JSON: JSON.stringify(catalog), OPTITECH_EDITOR_EMAILS: 'editor@example.com,other@example.com', SPINDEL_EDITOR_EMAILS: '', GOOGLE_DRIVE_API_KEY: '', SPINDEL_MANAGER_EMAIL: '', SPINDEL_MANAGER_PASSWORD: '' },
  });
  const base = `http://127.0.0.1:${port}`;
  async function request(endpoint: string, user?: string, body?: unknown) {
    return fetch(`${base}${endpoint}`, { method: body ? 'POST' : 'GET', headers: { ...(user ? { Cookie: `optitech_session=${createSessionToken(user)}` } : {}), ...(body ? { 'Content-Type': 'application/json', Origin: base } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  }
  try {
    let ready = false;
    for (let i = 0; i < 80; i++) {
      try { if ((await fetch(`${base}/api/health`)).ok) { ready = true; break; } } catch {}
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    expect(ready).toBe(true);
    expect((await request('/api/admin/videos/optitech')).status).toBe(401);
    expect((await request('/api/admin/videos/optitech', 'manager')).status).toBe(403);
    expect((await request('/api/admin/videos/spindel', 'editor')).status).toBe(403);
    const list = await (await request('/api/admin/videos/optitech', 'editor')).json();
    const location = list.locations[0];
    const original = location.media.driveFileId;
    const body = { locationId: location.id, locationRevision: 0 };
    const start = await (await request('/api/admin/videos/optitech/start', 'editor', body)).json();
    const draft = { ...body, taskId: start.task.id, taskRevision: 0, replacement: 'finished_video_123' };
    expect((await request('/api/admin/videos/optitech/save', 'other', draft)).status).toBe(404);
    expect((await request('/api/admin/videos/optitech/save', 'editor', draft)).status).toBe(200);
    expect((await request('/api/admin/videos/optitech/save', 'editor', draft)).status).toBe(409);
    const publish = await request('/api/admin/videos/optitech/publish', 'editor', { ...draft, taskRevision: 1, playbackConfirmed: true });
    expect(publish.status).toBe(503);
    const learner = await (await request('/api/course/media', 'manager')).json();
    expect(learner.media.find((item: { placeholderId: string }) => item.placeholderId === location.id).driveFileId).toBe(original);
    const reload = await (await request('/api/admin/videos/optitech', 'editor')).json();
    expect(reload.tasks[0].replacementId).toBe('finished_video_123');
  } finally {
    child.kill();
    await new Promise<void>(resolve => { if (child.exitCode !== null) resolve(); else child.once('exit', () => resolve()); });
    vi.unstubAllEnvs();
    await rm(directory, { recursive: true, force: true });
  }
}, 15000);
