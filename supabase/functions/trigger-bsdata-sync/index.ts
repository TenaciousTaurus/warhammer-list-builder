/**
 * Edge Function: trigger-bsdata-sync
 *
 * Dispatches the update-bsdata GitHub Actions workflow on demand.
 * Only callable by the site owner (jeff.bukowski92@gmail.com).
 *
 * Secrets required:
 *   GITHUB_DISPATCH_TOKEN — fine-grained PAT with actions:write on this repo
 *
 * Set in Supabase dashboard → Edge Functions → Secrets, or via:
 *   npx supabase secrets set GITHUB_DISPATCH_TOKEN=ghp_...
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GITHUB_DISPATCH_TOKEN = Deno.env.get("GITHUB_DISPATCH_TOKEN")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const GITHUB_REPO = "TenaciousTaurus/warhammer-list-builder";
const WORKFLOW_FILE = "update-bsdata.yml";
const ADMIN_EMAIL = "jeff.bukowski92@gmail.com";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "https://warforge.website",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  // Verify auth
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return jsonResponse({ error: "Missing authorization header" }, 401);
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error: authError } = await supabase.auth.getUser(token);

    if (authError || !data.user) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    if (data.user.email !== ADMIN_EMAIL) {
      return jsonResponse({ error: "Forbidden" }, 403);
    }
  } catch {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  if (!GITHUB_DISPATCH_TOKEN) {
    console.error("GITHUB_DISPATCH_TOKEN secret is not set");
    return jsonResponse({ error: "Server configuration error" }, 500);
  }

  // Dispatch the workflow
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/${WORKFLOW_FILE}/dispatches`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GITHUB_DISPATCH_TOKEN}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
          "User-Agent": "warforge-app",
        },
        body: JSON.stringify({ ref: "develop" }),
      },
    );

    // GitHub returns 204 No Content on success
    if (res.status === 204) {
      return jsonResponse({ success: true }, 200);
    }

    const errText = await res.text();
    console.error("GitHub API error:", res.status, errText);
    return jsonResponse({ error: "Failed to trigger workflow" }, 502);
  } catch (err) {
    console.error("GitHub API request failed:", err);
    return jsonResponse({ error: "Failed to trigger workflow" }, 502);
  }
});
