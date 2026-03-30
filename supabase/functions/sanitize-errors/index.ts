/**
 * Edge Function: sanitize-errors
 *
 * Proxies REST API requests to PostgREST and strips sensitive error details
 * (hint, details) from error responses before returning to the client.
 *
 * Addresses pentest finding #3: PostgREST PGRST205 errors leak table names
 * via hint fields (e.g., "Perhaps you meant 'public.user_profiles'").
 *
 * Usage: Deploy and configure as a reverse proxy in front of PostgREST,
 * or call directly for specific queries where error sanitization is needed.
 */

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://warforge.website",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, range, prefer",
};

function sanitizeError(body: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {
    code: body.code ?? "PGRST000",
    message: "The requested resource could not be found or accessed.",
  };
  return sanitized;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const url = new URL(req.url);
  const path = url.searchParams.get("path");
  if (!path) {
    return new Response(
      JSON.stringify({ error: "Missing 'path' query parameter" }),
      { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
    );
  }

  const targetUrl = `${SUPABASE_URL}/rest/v1/${path}`;
  const targetUrlWithParams = new URL(targetUrl);

  // Forward all query params except 'path'
  for (const [key, value] of url.searchParams.entries()) {
    if (key !== "path") {
      targetUrlWithParams.searchParams.set(key, value);
    }
  }

  // Forward request headers, replacing authorization if not present
  const headers = new Headers(req.headers);
  if (!headers.has("apikey")) {
    headers.set("apikey", SUPABASE_SERVICE_ROLE_KEY);
  }

  const response = await fetch(targetUrlWithParams.toString(), {
    method: req.method,
    headers,
    body: req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined,
  });

  const responseHeaders = new Headers(CORS_HEADERS);
  responseHeaders.set("Content-Type", response.headers.get("Content-Type") ?? "application/json");

  // If the response is an error (4xx/5xx), sanitize it
  if (response.status >= 400) {
    try {
      const errorBody = await response.json();
      const sanitized = sanitizeError(errorBody as Record<string, unknown>);
      return new Response(JSON.stringify(sanitized), {
        status: response.status,
        headers: responseHeaders,
      });
    } catch {
      return new Response(
        JSON.stringify({ code: "UNKNOWN", message: "An error occurred." }),
        { status: response.status, headers: responseHeaders },
      );
    }
  }

  // Success responses pass through unchanged
  const body = await response.text();
  // Copy relevant headers from upstream
  for (const header of ["content-range", "x-total-count"]) {
    const value = response.headers.get(header);
    if (value) responseHeaders.set(header, value);
  }

  return new Response(body, {
    status: response.status,
    headers: responseHeaders,
  });
});
