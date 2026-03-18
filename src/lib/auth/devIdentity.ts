/**
 * Dev-mode identity helpers.
 *
 * Stores the chosen bearer token (e.g. "dev", "alice", "bob") in localStorage
 * so the API client can read it on every request without repeating a real MSAL flow.
 * Only used when NEXT_PUBLIC_DEV_MODE=true — tree-shaken in production builds.
 */

const KEY = "birdie69_dev_identity";

export const DEV_IDENTITIES = ["dev", "alice", "bob"] as const;
export type DevIdentity = (typeof DEV_IDENTITIES)[number];

export function getDevIdentity(): DevIdentity {
  if (typeof window === "undefined") return "dev";
  const stored = localStorage.getItem(KEY);
  if (stored && DEV_IDENTITIES.includes(stored as DevIdentity)) {
    return stored as DevIdentity;
  }
  return "dev";
}

export function setDevIdentity(identity: DevIdentity): void {
  localStorage.setItem(KEY, identity);
}

/** Returns true when the user has explicitly chosen an identity on the login page. */
export function hasDevIdentity(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY) !== null;
}
