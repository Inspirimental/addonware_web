import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.55.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface UnlockRequest {
  email: string;
  name: string;
  organization?: string;
  caseStudyId: string;
  caseStudyTitle: string;
}

interface ResendEmailPayload {
  from: string;
  to: string[];
  subject: string;
  html: string;
}

function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const fromEmail = Deno.env.get('FROM_EMAIL') || 'Addonware GmbH <info@addonware.de>';
    const logoUrl = 'https://pouyacqshyiqbczmypvd.supabase.co/storage/v1/object/public/images/1762076728695-0m6xcq.png';
    const baseUrl = Deno.env.get('BASE_URL') || 'https://www.addonware.de';

    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const requestData: UnlockRequest = await req.json();

    if (!requestData.email || !requestData.name || !requestData.caseStudyId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(requestData.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: existingUnlock } = await supabase
      .from('case_study_unlocks')
      .select('id, unlocked_at')
      .eq('email', requestData.email)
      .eq('case_study_id', requestData.caseStudyId)
      .maybeSingle();

    let unlockToken: string;

    if (existingUnlock) {
      if (existingUnlock.unlocked_at) {
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Case study already unlocked',
            alreadyUnlocked: true
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const { data: tokenData } = await supabase
        .from('case_study_unlocks')
        .select('unlock_token')
        .eq('id', existingUnlock.id)
        .single();

      unlockToken = tokenData!.unlock_token;
    } else {
      unlockToken = generateToken();

      const { error: insertError } = await supabase
        .from('case_study_unlocks')
        .insert({
          email: requestData.email,
          case_study_id: requestData.caseStudyId,
          unlock_token: unlockToken,
        });

      if (insertError) {
        console.error('Error creating unlock record:', insertError);
        return new Response(
          JSON.stringify({ error: 'Failed to create unlock record' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    const { error: contactError } = await supabase
      .from('contact_requests')
      .insert({
        requester_name: requestData.name,
        requester_email: requestData.email,
        requester_organization: requestData.organization || '',
        message: `Freischaltungsanfrage für Case Study: ${requestData.caseStudyTitle}`,
        request_type: 'case_study_unlock',
      });

    if (contactError) {
      console.error('Error creating contact request:', contactError);
    }

    const unlockUrl = `${baseUrl}/case-studies/${requestData.caseStudyId}?unlock=${unlockToken}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .logo-container { text-align: center; padding: 30px 20px; background: white; }
            .logo { max-width: 200px; height: auto; }
            .header { background: rgb(46, 170, 220); color: white; padding: 20px; text-align: center; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .welcome { background: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid rgb(46, 170, 220); }
            .welcome h3 { margin-top: 0; color: rgb(46, 170, 220); }
            .button-container { text-align: center; margin: 30px 0; }
            .button {
              display: inline-block;
              background: rgb(46, 170, 220);
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
            }
            .footer { background: #f3f4f6; padding: 30px 20px; text-align: center; color: #6b7280; font-size: 13px; border-radius: 0 0 8px 8px; line-height: 1.8; }
            .footer-section { margin-bottom: 20px; }
            .footer-heading { font-weight: bold; color: #1f2937; margin-bottom: 10px; }
            .footer-divider { border-top: 1px solid #d1d5db; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo-container">
              <img src="${logoUrl}" alt="Addonware Logo" class="logo" />
            </div>
            <div class="header">
              <h2 style="margin: 0;">Ihre Case Study ist bereit!</h2>
            </div>
            <div class="content">
              <div class="welcome">
                <h3>Hallo ${requestData.name},</h3>
                <p>vielen Dank für Ihr Interesse an unserer Case Study <strong>${requestData.caseStudyTitle}</strong>.</p>
                <p>Wir haben Ihre Anfrage erhalten und freuen uns, Ihnen die vollständige Case Study zur Verfügung zu stellen.</p>
              </div>
              <div class="button-container">
                <a href="${unlockUrl}" class="button">Jetzt Case Study ansehen</a>
              </div>
              <p style="text-align: center; color: #6b7280; font-size: 13px;">
                Oder kopieren Sie diesen Link in Ihren Browser:<br>
                <a href="${unlockUrl}" style="color: rgb(46, 170, 220);">${unlockUrl}</a>
              </p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 30px; border: 1px solid #e5e7eb;">
                <h4 style="margin-top: 0; color: #1f2937;">Was Sie erwartet:</h4>
                <ul style="color: #4b5563;">
                  <li>Detaillierte Problemstellung und Herausforderungen</li>
                  <li>Unsere maßgeschneiderte Lösungsstrategie</li>
                  <li>Konkrete Ergebnisse und Mehrwert</li>
                  <li>Optional: Download als PDF</li>
                </ul>
              </div>
            </div>
            <div class="footer">
              <div class="footer-section">
                <div class="footer-heading">addonware GmbH & Co. KG</div>
                <div>Ihr Partner für digitale Transformation und Organisationsentwicklung</div>
              </div>
              <div class="footer-divider"></div>
              <div class="footer-section">
                <div>Kontakt: info@addonware.de | Telefon: +49 (0) 123 456789</div>
                <div>Anschrift: Musterstraße 123, 12345 Musterstadt</div>
              </div>
              <div class="footer-divider"></div>
              <div class="footer-section">
                <div style="font-size: 11px; color: #9ca3af;">
                  Diese E-Mail wurde automatisch generiert. Bei Fragen antworten Sie einfach auf diese E-Mail.
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const resendPayload: ResendEmailPayload = {
      from: fromEmail,
      to: [requestData.email],
      subject: `Ihre Case Study: ${requestData.caseStudyTitle} - Jetzt freischalten`,
      html: htmlContent,
    };

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify(resendPayload),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      console.error('Resend API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: errorData }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const resendData = await resendResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Unlock email sent successfully',
        emailId: resendData.id
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in unlock-case-study function:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});