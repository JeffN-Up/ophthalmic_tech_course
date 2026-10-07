import { describe, expect, it } from 'vitest';
import * as catalog from './spindelMedia';

describe('Spindel media availability', () => {
  it('keeps configured media available when another module is incomplete', () => {
    const build = (catalog as Record<string, unknown>).buildSpindelMediaResponse as (value: string) => { media: unknown[]; missingMedia: {day: number; types: string[]}[] };
    expect(build).toBeTypeOf('function');
    if (!build) return;
    const result = build(JSON.stringify([{driveFileId:'valid_drive_file_01',title:'Anatomy',description:'Anatomy overview',type:'video',moduleDays:[1],learningTier:'core',sourceLabel:'Bootcamp',learningObjective:'Identify ocular structures'}]));
    expect(result.media).toHaveLength(1);
    expect(result.missingMedia.find(m=>m.day===1)?.types).toEqual(['audio']);
    expect(result.missingMedia.find(m=>m.day===2)?.types).toEqual(['video','audio']);
  });
  it('does not relax validation of malformed or unapproved catalog entries', () => {
    const build = (catalog as Record<string, unknown>).buildSpindelMediaResponse as (value: string) => unknown;
    expect(build).toBeTypeOf('function');
    if (build) expect(()=>build('[{"driveFileId":"bad"}]')).toThrow();
  });
});
