const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

/**
 * Typed API error carrying the HTTP status code.
 * Throw this for all non-2xx responses so callers can branch on status.
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Returns the Bearer token to attach to every API request.
 * In dev mode (NEXT_PUBLIC_DEV_MODE=true) the server accepts any plain string
 * as an identity (e.g. "dev", "alice", "bob"). The active identity is stored
 * in localStorage and chosen on the login page.
 * In production, swap this for an MSAL acquireTokenSilent call.
 */
function getToken(): string {
  if (process.env.NEXT_PUBLIC_DEV_MODE === "true") {
    // Inline import avoids bundling devIdentity helpers in production
    if (typeof window !== "undefined") {
      return localStorage.getItem("birdie69_dev_identity") ?? "dev";
    }
    return "dev";
  }
  // TODO (B69-5): acquire token from MSAL instance
  return "dev";
}

/**
 * Thin fetch wrapper: prepends BASE_URL, adds auth header, throws ApiError
 * on non-2xx responses, and returns parsed JSON (or undefined for 204).
 */
export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const token = getToken();

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const body = (await response.json()) as { description?: string; message?: string };
      message = body.description ?? body.message ?? message;
    } catch {
      // ignore JSON parse error — use statusText
    }
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
