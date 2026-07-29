/**
 * Shared facts for the /vixwispr page. Kept in one place so the version, size,
 * and links can never drift apart between the hero, the install steps, and the
 * closing CTA.
 *
 * Note: VixWispr lives inside the `automation-and-app` hub repo (one growing
 * public repo for every give-away), not in a standalone repo, so the source link
 * points at its subfolder while the download points at the repo's releases.
 */

export const REPO_URL = "https://github.com/vicodernd/automation-and-app/tree/main/vixwispr";
export const RELEASE_URL = "https://github.com/vicodernd/automation-and-app/releases/latest";

export const VERSION = "0.1.0";
export const SIZE = "83 MB";

export const SPEC = [
  "Windows 10 / 11",
  `v${VERSION}`,
  SIZE,
  "MIT licence",
  "No account",
] as const;
