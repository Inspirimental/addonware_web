// Supabase Edge Function: confirm-user
// Confirms a user's email (admin-only)
// Endpoint: POST /confirm-user { email?: string, user_id?: string }

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

type RequestBody = {
  email?: string;
  user_id?: string;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const url = Deno.env.get("SUPABASE_URL");

    if (!anonKey || !serviceKey || !url) {
      return new Response(JSON.stringify({ error: "Missing Supabase environment configuration" }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const authHeader = req.headers.get("Authorization") ?? "";

    const supabase = createClient(url, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const supabaseAdmin = createClient(url, serviceKey);

    // Verify caller and admin role
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const { data: isAdmin, error: adminErr } = await supabase.rpc("is_admin");
    if (adminErr || !isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });
    }

    const body = (await req.json()) as RequestBody;
    let targetUserId = body.user_id;

    if (!targetUserId) {
      if (!body.email) {
        return new Response(JSON.stringify({ error: "Missing email or user_id" }), { status: 400, headers: corsHeaders });
      }
      // Find auth user id via public.profiles
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", body.email)
        .single();

      if (profileErr || !profile) {
        return new Response(JSON.stringify({ error: "Profile not found for given email" }), { status: 404, headers: corsHeaders });
      }
      targetUserId = profile.id as string;
    }

    // Confirm user's email via Admin API
    const { data: updateRes, error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(targetUserId!, {
      email_confirm: true,
    } as any);

    if (updateErr) {
      return new Response(JSON.stringify({ error: updateErr.message || "Failed to confirm email" }), { status: 400, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ success: true, user_id: targetUserId, data: updateRes }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Unexpected error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
