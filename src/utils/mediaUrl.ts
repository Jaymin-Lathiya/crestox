import { strings } from '@/utils/strings';

const PLACEHOLDER_IMAGE = '/assets/artwork-1.jpg';

export function buildMediaUrl(filePath: string | null | undefined): string {
  if (!filePath) return PLACEHOLDER_IMAGE;
  if (filePath.startsWith('http')) return filePath;
  const base = strings.base_url?.replace(/\/api\/?$/, '') ?? '';
  return filePath.startsWith('/') ? `${base}${filePath}` : `${base}/${filePath}`;
}
