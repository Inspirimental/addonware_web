import eirikOtto from "@/assets/team/eirik-otto.jpg";
import falkoSmirat from "@/assets/team/falko-smirat.jpg";
import joergFluegge from "@/assets/team/joerg-fluegge.jpg";
import oliverMoeller from "@/assets/team/oliver-moeller.jpg";
import paulRosenbusch from "@/assets/team/paul-rosenbusch.jpg";
import reimundMeffert from "@/assets/team/reimund-meffert.jpg";
import uweStraubel from "@/assets/team/uwe-straubel.jpg";

// Map known team image filenames to their bundled asset URLs
export const teamImageMap: Record<string, string> = {
  "eirik-otto.jpg": eirikOtto,
  "falko-smirat.jpg": falkoSmirat,
  "joerg-fluegge.jpg": joergFluegge,
  "oliver-moeller.jpg": oliverMoeller,
  "paul-rosenbusch.jpg": paulRosenbusch,
  "reimund-meffert.jpg": reimundMeffert,
  "uwe-straubel.jpg": uweStraubel,
};

// Resolve DB-stored paths like "/src/assets/team/*.jpg" to the correct built URL
export function resolveTeamImage(url?: string | null): string | undefined {
  if (!url) return undefined;
  // Normalize leading "public/" which is incorrect for served assets
  if (url.startsWith('public/')) {
    url = url.replace(/^public\//, '/');
  }
  // Public uploads are served from / directly
  if (url.includes('lovable-uploads/')) {
    return url.replace(/^\/?.*lovable-uploads\//, '/lovable-uploads/');
  }
  const filename = url.split('/').pop() || '';
  return teamImageMap[filename] || url;
}
