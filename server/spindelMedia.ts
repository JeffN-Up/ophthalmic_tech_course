import { parseProtectedMediaCatalog } from './security';

// Coverage is reported per lesson; an incomplete lesson must not hide other assets.
export function buildSpindelMediaResponse(value: string) {
  const media = parseProtectedMediaCatalog(value);
  const missingMedia = Array.from({length: 10}, (_,index) => {
    const day = index + 1;
    const types = (['video','audio'] as const).filter(type =>
      !media.some(item => item.type === type && item.moduleDays.includes(day)));
    return { day, types };
  }).filter(item => item.types.length > 0);
  return { media, missingMedia };
}
