export interface UnlockedCaseStudies {
  [caseStudyId: string]: string;
}

const COOKIE_NAME = 'case_study_unlocks';
const COOKIE_DAYS = 365;

export function getCaseStudyUnlocks(): UnlockedCaseStudies {
  if (typeof document === 'undefined') return {};

  const cookies = document.cookie.split(';');
  const cookie = cookies.find(c => c.trim().startsWith(`${COOKIE_NAME}=`));

  if (!cookie) return {};

  try {
    const value = cookie.split('=')[1];
    return JSON.parse(decodeURIComponent(value));
  } catch {
    return {};
  }
}

export function isCaseStudyUnlocked(caseStudyId: string): boolean {
  const unlocks = getCaseStudyUnlocks();
  return !!unlocks[caseStudyId];
}

export function unlockCaseStudy(caseStudyId: string, token: string): void {
  const unlocks = getCaseStudyUnlocks();
  unlocks[caseStudyId] = token;

  const expires = new Date();
  expires.setDate(expires.getDate() + COOKIE_DAYS);

  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(unlocks))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

export function clearCaseStudyUnlocks(): void {
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
