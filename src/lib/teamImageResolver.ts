const SUPABASE_STORAGE_URL = 'https://pouyacqshyiqbczmypvd.supabase.co/storage/v1/object/public/images';

// Map known team image filenames to their Supabase Storage URLs
export const teamImageMap: Record<string, string> = {
  "eirik-otto.jpg": `${SUPABASE_STORAGE_URL}/1761503790728-team-eirik-otto.jpg`,
  "falko-smirat.jpg": `${SUPABASE_STORAGE_URL}/1761503791391-team-falko-smirat.jpg`,
  "joerg-fluegge.jpg": `${SUPABASE_STORAGE_URL}/1761503792040-team-joerg-fluegge.jpg`,
  "oliver-moeller.jpg": `${SUPABASE_STORAGE_URL}/1761503792711-team-oliver-moeller.jpg`,
  "paul-rosenbusch.jpg": `${SUPABASE_STORAGE_URL}/1761503793362-team-paul-rosenbusch.jpg`,
  "reimund-meffert.jpg": `${SUPABASE_STORAGE_URL}/1761503794002-team-reimund-meffert.jpg`,
  "uwe-straubel.jpg": `${SUPABASE_STORAGE_URL}/1761503794660-team-uwe-straubel.jpg`,
};

// Resolve DB-stored paths to Supabase Storage URLs
export function resolveTeamImage(url?: string | null): string | undefined {
  if (!url) return undefined;

  // If already a full Supabase URL, return as-is
  if (url.startsWith('https://pouyacqshyiqbczmypvd.supabase.co/storage')) {
    return url;
  }

  // Extract filename and map to Supabase Storage URL
  const filename = url.split('/').pop() || '';
  return teamImageMap[filename] || url;
}
