/**
 * Edge Function: create-feedback
 *
 * Accepts feedback form submissions from authenticated users and creates
 * a task in ClickUp. Keeps the ClickUp API token server-side.
 *
 * Secrets required:
 *   CLICKUP_API_TOKEN — personal API token from ClickUp
 *   CLICKUP_LIST_ID   — target list ID for feedback tasks
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CLICKUP_API_TOKEN = Deno.env.get("CLICKUP_API_TOKEN")!;
const CLICKUP_LIST_ID = Deno.env.get("CLICKUP_LIST_ID")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const VALID_CATEGORIES = [
  "Bug Report",
  "Feature Request",
  "General Feedback",
  "UI/UX Issue",
] as const;

type Category = (typeof VALID_CATEGORIES)[number];

const CATEGORY_TAG_MAP: Record<Category, string> = {
  "Bug Report": "bug-report",
  "Feature Request": "feature-request",
  "General Feedback": "general-feedback",
  "UI/UX Issue": "ui-ux-issue",
};

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "https://warforge.website",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  // --- Auth check ---
  // supabase.functions.invoke sends the user's JWT in the Authorization header
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("No auth header found. Headers:", JSON.stringify(Object.fromEntries(req.headers.entries())));
    return jsonResponse({ error: "Missing authorization header" }, 401);
  }

  const token = authHeader.replace("Bearer ", "");
  let user: { email?: string } | null = null;

  try {
    // Use service role key to verify the user's JWT
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error: authError } = await supabase.auth.getUser(token);

    if (authError || !data.user) {
      console.error("Auth verification failed:", authError?.message ?? "no user");
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
    user = data.user;
  } catch (err) {
    console.error("Auth exception:", err);
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  // --- Parse & validate input ---
  let body: { title?: string; description?: string; category?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const title = (body.title ?? "").trim();
  const description = (body.description ?? "").trim();
  const category = (body.category ?? "").trim();

  if (!title || title.length > 200) {
    return jsonResponse(
      { error: "Title is required and must be 200 characters or fewer." },
      400,
    );
  }

  if (!description || description.length > 2000) {
    return jsonResponse(
      {
        error:
          "Description is required and must be 2000 characters or fewer.",
      },
      400,
    );
  }

  if (!VALID_CATEGORIES.includes(category as Category)) {
    return jsonResponse({ error: "Invalid category." }, 400);
  }

  // --- Create ClickUp task ---
  const tag = CATEGORY_TAG_MAP[category as Category];

  try {
    const clickupRes = await fetch(
      `https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`,
      {
        method: "POST",
        headers: {
          Authorization: CLICKUP_API_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `[${category}] ${title}`,
          description:
            `${description}\n\n---\nSubmitted by: ${user.email ?? "unknown"}`,
          tags: [tag],
        }),
      },
    );

    if (!clickupRes.ok) {
      const errText = await clickupRes.text();
      console.error("ClickUp API error:", clickupRes.status, errText);
      return jsonResponse(
        { error: "Failed to submit feedback. Please try again later." },
        502,
      );
    }

    return jsonResponse({ success: true }, 200);
  } catch (err) {
    console.error("ClickUp API request failed:", err);
    return jsonResponse(
      { error: "Failed to submit feedback. Please try again later." },
      502,
    );
  }
});
