import { expect, it } from 'vitest';
import * as library from './ocularEducation';

const item = { driveFileId: 'ocular_video_001', thumbnailFileId: 'ocular_thumb_001', title: 'Inside the eye', category: 'Anatomy & vision', creator: '@example', sourceUrl: 'https://www.instagram.com/reel/abc123/' };
const parse = () => {
  const fn = (library as Record<string, unknown>).parseOcularEducationCatalog as (value: string, existing?: string[]) => Array<Record<string, string>>;
  expect(fn).toBeTypeOf('function');
  return fn;
};

it('provides preview links for optional videos without assigning onboarding modules', () => {
  const result = parse()(JSON.stringify([item]));
  expect(result[0].embedUrl).toBe('https://drive.google.com/file/d/ocular_video_001/preview');
  expect(result[0].category).toBe('Anatomy & vision');
  expect(result[0]).not.toHaveProperty('moduleDays');
});

it('rejects repeated videos and reuse of required course videos', () => {
  const fn = parse();
  expect(() => fn(JSON.stringify([item, item]))).toThrow();
  expect(() => fn(JSON.stringify([item]), [item.driveFileId])).toThrow();
});

it('rejects unsafe source URLs, invalid categories, and malformed identifiers', () => {
  const fn = parse();
  for (const change of [{ sourceUrl: 'javascript:alert(1)' }, { sourceUrl: 'https://evil.example/reel/abc/' }, { category: 'Other' }, { thumbnailFileId: 'bad' }, { driveFileId: 'bad' }]) {
    expect(() => fn(JSON.stringify([{ ...item, ...change }]))).toThrow();
  }
  expect(() => fn('{}')).toThrow();
});
