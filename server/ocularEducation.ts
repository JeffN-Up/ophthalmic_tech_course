import { OCULAR_CATEGORIES, type OcularEducationVideo } from '../shared/ocularEducation';

export function parseOcularEducationCatalog(value: string, existingIds: string[] = []): OcularEducationVideo[] {
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed) || parsed.length > 100) throw new Error('Invalid ocular education catalog.');
  const seen = new Set(existingIds);
  const idPattern = /^[A-Za-z0-9_-]{10,100}$/;
  return parsed.map(raw => {
    if (!raw || typeof raw !== 'object') throw new Error('Invalid ocular video.');
    const item = raw as Record<string, unknown>;
    const text = (key: string) => typeof item[key] === 'string' ? (item[key] as string).trim() : '';
    const driveFileId = text('driveFileId');
    const thumbnailFileId = text('thumbnailFileId');
    const title = text('title').slice(0, 160);
    const category = text('category') as OcularEducationVideo['category'];
    const creator = text('creator').slice(0, 100);
    const sourceUrl = text('sourceUrl');
    if (!idPattern.test(driveFileId) || !idPattern.test(thumbnailFileId) || !title || !creator ||
        !OCULAR_CATEGORIES.includes(category) || !/^https:\/\/www\.instagram\.com\/reel\/[A-Za-z0-9_-]+\/$/.test(sourceUrl) || seen.has(driveFileId)) {
      throw new Error('Ocular video is incomplete, unsafe, or duplicated.');
    }
    seen.add(driveFileId);
    return { driveFileId, thumbnailFileId, title, category, creator, sourceUrl,
      embedUrl: `https://drive.google.com/file/d/${driveFileId}/preview`,
      openUrl: `https://drive.google.com/file/d/${driveFileId}/view`,
      thumbnailUrl: `https://drive.google.com/thumbnail?id=${thumbnailFileId}&sz=w640` };
  });
}
