// Supabase Edge Function: get-user-status
// Gets email confirmation status for users (admin-only)
// Endpoint: POST /get-user-status { emails: string[] }

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

type RequestBody = {
  emails: string[];
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
    
    if (!body.emails || !Array.isArray(body.emails)) {
      return new Response(JSON.stringify({ error: "Missing or invalid emails array" }), { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    const confirmedEmails: string[] = [];

    // Check confirmation status for each email
    for (const email of body.emails) {
      if (!email) continue;
      
      try {
        // Get user by email from profiles table to get the auth ID
        const { data: profile, error: profileErr } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", email)
          .single();

        if (profileErr || !profile) {
          console.log(`Profile not found for email: ${email}`);
          continue;
        }

        // Get auth user details
        const { data: authUser, error: authErr } = await supabaseAdmin.auth.admin.getUserById(profile.id);
        
        if (authErr || !authUser.user) {
          console.log(`Auth user not found for ID: ${profile.id}`);
          continue;
        }

        // Check if email is confirmed
        if (authUser.user.email_confirmed_at) {
          confirmedEmails.push(email);
        }
      } catch (e) {
        console.error(`Error checking status for email ${email}:`, e);
        // Continue with other emails
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      confirmedEmails 
    }), {
      status: 200,
      headers: corsHeaders,
    });

  } catch (e: any) {
    console.error("Unexpected error:", e);
    return new Response(JSON.stringify({ error: e?.message || "Unexpected error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});