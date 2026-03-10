import { Configuration, LogLevel } from "@azure/msal-browser";

/**
 * MSAL configuration for Azure AD B2C.
 * All values are read from environment variables.
 * In development, these are empty strings — no real B2C tenant is configured yet.
 * In production, values come from Azure Key Vault / CI secrets.
 */
export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_MSAL_CLIENT_ID ?? "",
    authority: process.env.NEXT_PUBLIC_MSAL_AUTHORITY ?? "",
    knownAuthorities: process.env.NEXT_PUBLIC_MSAL_AUTHORITY
      ? [new URL(process.env.NEXT_PUBLIC_MSAL_AUTHORITY).hostname]
      : [],
    redirectUri: process.env.NEXT_PUBLIC_MSAL_REDIRECT_URI ?? "/",
    postLogoutRedirectUri: "/",
  },
  cache: {
    cacheLocation: "localStorage",
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        if (process.env.NODE_ENV === "development") {
          console.log(`[MSAL ${LogLevel[level]}] ${message}`);
        }
      },
      logLevel: LogLevel.Warning,
    },
  },
};

export const loginRequest = {
  scopes: [
    `${process.env.NEXT_PUBLIC_MSAL_CLIENT_ID}/.default`,
    "openid",
    "profile",
    "offline_access",
  ].filter(Boolean),
};
