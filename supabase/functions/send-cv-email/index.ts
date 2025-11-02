import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CVEmailRequest {
  requesterName: string;
  requesterEmail: string;
  requesterOrganization?: string;
  employeeName: string;
  employeeEmail: string;
  employeeId: string;
}

interface ResendEmailPayload {
  from: string;
  to: string[];
  subject: string;
  html: string;
  reply_to?: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const fromEmail = Deno.env.get('FROM_EMAIL') || 'Addonware GmbH <info@addonware.de>';

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

    const requestData: CVEmailRequest = await req.json();

    if (!requestData.requesterName || !requestData.requesterEmail || !requestData.employeeName || !requestData.employeeEmail) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(requestData.requesterEmail)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const employeeDetailUrl = `https://addonware.de/team/${requestData.employeeId}`;

    const requesterEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .logo-container { text-align: center; padding: 30px 20px; background: white; }
            .header { background: rgb(46, 170, 220); color: white; padding: 20px; text-align: center; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .cta-button { display: inline-block; background: rgb(46, 170, 220); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
            .cta-button:hover { background: rgb(36, 150, 200); }
            .footer { background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; border-radius: 0 0 8px 8px; line-height: 1.8; }
            .footer a { color: #6b7280; text-decoration: underline; }
            .footer a:hover { color: rgb(46, 170, 220); }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo-container">
              <div style="font-size: 32px; font-weight: bold; color: rgb(46, 170, 220);">addonware</div>
            </div>
            <div class="header">
              <h2 style="margin: 0;">Lebenslauf von ${requestData.employeeName}</h2>
            </div>
            <div class="content">
              <p>Hallo ${requestData.requesterName},</p>
              <p>vielen Dank f\u00fcr Ihr Interesse am Lebenslauf von ${requestData.employeeName}.</p>
              <p>Sie k\u00f6nnen den vollst\u00e4ndigen Lebenslauf hier einsehen und als PDF herunterladen:</p>
              <div style="text-align: center;">
                <a href="${employeeDetailUrl}" class="cta-button">Lebenslauf ansehen</a>
              </div>
              <p style="margin-top: 30px;">Bei Fragen oder f\u00fcr weitere Informationen stehen wir Ihnen gerne zur Verf\u00fcgung.</p>
              <p>Mit freundlichen Gr\u00fc\u00dfen<br>Ihr addonware Team</p>
            </div>
            <div class="footer">
              <strong>addonware GmbH</strong><br>
              Ihr Partner f\u00fcr digitale Transformation<br><br>
              E-Mail: info@addonware.de | Telefon: +49 3671 5242790<br><br>
              <a href="https://addonware.de/impressum">Impressum</a> |
              <a href="https://addonware.de/datenschutz">Datenschutz</a> |
              <a href="https://addonware.de/agb">AGB</a><br><br>
              \u00a9 2025 addonware GmbH. Alle Rechte vorbehalten.
            </div>
          </div>
        </body>
      </html>
    `;

    const employeeNotificationHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .logo-container { text-align: center; padding: 30px 20px; background: white; }
            .header { background: rgb(46, 170, 220); color: white; padding: 20px; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #1f2937; }
            .value { color: #4b5563; }
            .footer { background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; border-radius: 0 0 8px 8px; line-height: 1.8; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo-container">
              <div style="font-size: 32px; font-weight: bold; color: rgb(46, 170, 220);">addonware</div>
            </div>
            <div class="header">
              <h2 style="margin: 0;">Lebenslauf-Anfrage</h2>
            </div>
            <div class="content">
              <p>Hallo ${requestData.employeeName},</p>
              <p>jemand hat Ihren Lebenslauf angefordert:</p>
              <div class="field">
                <span class="label">Name:</span> <span class="value">${requestData.requesterName}</span>
              </div>
              <div class="field">
                <span class="label">E-Mail:</span> <span class="value"><a href="mailto:${requestData.requesterEmail}">${requestData.requesterEmail}</a></span>
              </div>
              ${requestData.requesterOrganization ? `
              <div class="field">
                <span class="label">Organisation:</span> <span class="value">${requestData.requesterOrganization}</span>
              </div>
              ` : ''}
              <p style="margin-top: 20px;">Diese Anfrage wurde automatisch verarbeitet und der Lebenslauf-Link wurde an die angegebene E-Mail-Adresse gesendet.</p>
            </div>
            <div class="footer">
              <strong>addonware GmbH</strong><br>
              \u00a9 2025 addonware GmbH. Alle Rechte vorbehalten.
            </div>
          </div>
        </body>
      </html>
    `;

    const requesterEmailPayload: ResendEmailPayload = {
      from: fromEmail,
      to: [requestData.requesterEmail],
      subject: `Lebenslauf von ${requestData.employeeName} - addonware`,
      html: requesterEmailHtml,
    };

    const resendResponse1 = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify(requesterEmailPayload),
    });

    if (!resendResponse1.ok) {
      const errorData = await resendResponse1.text();
      console.error('Resend API error (requester email):', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to send email to requester', details: errorData }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const employeeEmailPayload: ResendEmailPayload = {
      from: fromEmail,
      to: [requestData.employeeEmail],
      subject: `Lebenslauf-Anfrage von ${requestData.requesterName}`,
      html: employeeNotificationHtml,
      reply_to: [requestData.requesterEmail],
    };

    const resendResponse2 = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify(employeeEmailPayload),
    });

    if (!resendResponse2.ok) {
      const errorData = await resendResponse2.text();
      console.error('Resend API error (employee notification):', errorData);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Emails sent successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in send-cv-email function:', error);
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