import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./msalConfig";

/**
 * Singleton MSAL instance.
 * Initialised once and reused across the app.
 * Only instantiated on the client side (guard required for SSR/static export).
 */
const msalInstance =
  typeof window !== "undefined"
    ? new PublicClientApplication(msalConfig)
    : null;

export { msalInstance };
