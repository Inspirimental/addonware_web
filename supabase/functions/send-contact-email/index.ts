import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  organization?: string;
  message: string;
  recipientEmail?: string;
  recipientName?: string;
  replyTo?: string;
  type?: 'contact' | 'questionnaire' | 'questionnaire_confirmation';
  questionnaireData?: any;
  questionnaireTitle?: string;
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
    const logoUrl = 'https://pouyacqshyiqbczmypvd.supabase.co/storage/v1/object/public/images/1762076728695-0m6xcq.png';

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

    const requestData: ContactEmailRequest = await req.json();

    if (!requestData.name || !requestData.email || !requestData.message) {
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

    const recipientEmail = requestData.recipientEmail || 'info@addonware.de';
    const isPersonalized = !!requestData.recipientName;
    const isQuestionnaire = requestData.type === 'questionnaire';
    const isQuestionnaireConfirmation = requestData.type === 'questionnaire_confirmation';

    let subject: string;
    let htmlContent: string;

    if (isQuestionnaireConfirmation) {
      subject = `Vielen Dank f\u00fcr Ihre Anfrage - ${requestData.questionnaireTitle || 'Bedarfsanalyse'}`;

      const answersHtml = requestData.questionnaireData?.map((item: any) => `
        <div class="question-block">
          <div class="question-number">${item.number}.</div>
          <div class="question-content">
            <div class="question-text">${item.question}</div>
            <div class="answer-text">${item.answer}</div>
          </div>
        </div>
      `).join('') || '';

      htmlContent = `
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
              .thank-you { background: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid rgb(46, 170, 220); }
              .thank-you h3 { margin-top: 0; color: rgb(46, 170, 220); }
              .question-block { background: white; padding: 20px; margin-bottom: 15px; border-radius: 8px; border: 1px solid #e5e7eb; display: flex; gap: 15px; }
              .question-number { font-size: 20px; font-weight: bold; color: rgb(46, 170, 220); min-width: 30px; }
              .question-content { flex: 1; }
              .question-text { font-weight: bold; color: #1f2937; margin-bottom: 8px; }
              .answer-text { color: #4b5563; }
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
                <h2 style="margin: 0;">Vielen Dank f\u00fcr Ihre Anfrage!</h2>
              </div>
              <div class="content">
                <div class="thank-you">
                  <h3>Hi ${requestData.name}, vielen Dank f\u00fcr Deine Anfrage!</h3>
                  <p>Vielen Dank f\u00fcr Dein Interesse an addonware. Wir haben Deine Antworten erhalten und werden uns innerhalb von 24 Stunden f\u00fcr ein kostenloses 30-min\u00fctiges Orientierungsgespr\u00e4ch bei Dir melden.</p>
                  <p>Hier ist eine Zusammenfassung Deiner Antworten:</p>
                </div>
                ${answersHtml}
              </div>
              <div class="footer">
                <div class="footer-section">
                  <div class="footer-heading">addonware GmbH & Co. KG</div>
                  <div>Ihr Partner f\u00fcr digitale Transformation und Organisationsentwicklung</div>
                </div>
                <div class="footer-divider"></div>
                <div class="footer-section">
                  <div>Kontakt: info@addonware.de | Telefon: +49 (0) 123 456789</div>
                  <div>Anschrift: Musterstra\u00dfe 123, 12345 Musterstadt</div>
                </div>
                <div class="footer-divider"></div>
                <div class="footer-section">
                  <div style="font-size: 11px; color: #9ca3af;">
                    Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht direkt auf diese E-Mail.
                  </div>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;
    } else if (isQuestionnaire) {
      subject = `Neue Umfrage: ${requestData.questionnaireTitle || 'Bedarfsanalyse'} - ${requestData.name}${requestData.organization ? ` (${requestData.organization})` : ''}`;

      const answersHtml = requestData.questionnaireData?.map((item: any) => `
        <div class="question-block">
          <div class="question-number">${item.number}.</div>
          <div class="question-content">
            <div class="question-text">${item.question}</div>
            <div class="answer-text">${item.answer}</div>
          </div>
        </div>
      `).join('') || '';

      htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .logo-container { text-align: center; padding: 30px 20px; background: white; }
              .logo { max-width: 200px; height: auto; }
              .header { background: rgb(46, 170, 220); color: white; padding: 20px; }
              .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
              .field { margin-bottom: 20px; }
              .label { font-weight: bold; color: #1f2937; margin-bottom: 5px; }
              .value { background: white; padding: 10px; border-radius: 4px; border: 1px solid #e5e7eb; }
              .question-block { background: white; padding: 20px; margin-bottom: 15px; border-radius: 8px; border: 1px solid #e5e7eb; display: flex; gap: 15px; }
              .question-number { font-size: 20px; font-weight: bold; color: rgb(46, 170, 220); min-width: 30px; }
              .question-content { flex: 1; }
              .question-text { font-weight: bold; color: #1f2937; margin-bottom: 8px; }
              .answer-text { color: #4b5563; }
              .footer { background: #f3f4f6; padding: 15px; text-align: center; color: #6b7280; font-size: 12px; border-radius: 0 0 8px 8px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo-container">
                <img src="${logoUrl}" alt="Addonware Logo" class="logo" />
              </div>
              <div class="header">
                <h2 style="margin: 0;">Neue Umfrage: ${requestData.questionnaireTitle || 'Bedarfsanalyse'}</h2>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Von:</div>
                  <div class="value">${requestData.name} (${requestData.email})</div>
                </div>
                ${requestData.organization ? `
                <div class="field">
                  <div class="label">Organisation:</div>
                  <div class="value">${requestData.organization}</div>
                </div>
                ` : ''}
                <div style="margin-top: 30px;">
                  <h3 style="color: #1f2937; margin-bottom: 15px;">Antworten:</h3>
                  ${answersHtml}
                </div>
              </div>
              <div class="footer">
                Gesendet \u00fcber das Kontaktformular von addonware.de
              </div>
            </div>
          </body>
        </html>
      `;
    } else {
      subject = isPersonalized
        ? `Pers\u00f6nliche Nachricht f\u00fcr ${requestData.recipientName} von ${requestData.name}`
        : `Neue Kontaktanfrage von ${requestData.name}`;

      htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .logo-container { text-align: center; padding: 30px 20px; background: white; }
              .logo { max-width: 200px; height: auto; }
              .header { background: rgb(46, 170, 220); color: white; padding: 20px; }
              .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
              .field { margin-bottom: 20px; }
              .label { font-weight: bold; color: #1f2937; margin-bottom: 5px; }
              .value { background: white; padding: 10px; border-radius: 4px; border: 1px solid #e5e7eb; }
              .footer { background: #f3f4f6; padding: 15px; text-align: center; color: #6b7280; font-size: 12px; border-radius: 0 0 8px 8px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo-container">
                <img src="${logoUrl}" alt="Addonware Logo" class="logo" />
              </div>
              <div class="header">
                <h2 style="margin: 0;">${isPersonalized ? `Nachricht f\u00fcr ${requestData.recipientName}` : 'Neue Kontaktanfrage'}</h2>
              </div>
              <div class="content">
                ${isPersonalized ? `<p>Hallo ${requestData.recipientName},</p><p>Sie haben eine pers\u00f6nliche Nachricht erhalten:</p>` : ''}
                <div class="field">
                  <div class="label">Von:</div>
                  <div class="value">${requestData.name}</div>
                </div>
                <div class="field">
                  <div class="label">E-Mail:</div>
                  <div class="value"><a href="mailto:${requestData.email}">${requestData.email}</a></div>
                </div>
                ${requestData.organization ? `
                <div class="field">
                  <div class="label">Organisation:</div>
                  <div class="value">${requestData.organization}</div>
                </div>
                ` : ''}
                <div class="field">
                  <div class="label">Nachricht:</div>
                  <div class="value">${requestData.message.replace(/\n/g, '<br>')}</div>
                </div>
              </div>
              <div class="footer">
                Gesendet \u00fcber das Kontaktformular von addonware.de
              </div>
            </div>
          </body>
        </html>
      `;
    }

    const resendPayload: ResendEmailPayload = {
      from: fromEmail,
      to: [recipientEmail],
      subject: subject,
      html: htmlContent,
      ...(requestData.replyTo && { reply_to: [requestData.replyTo] }),
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
        message: 'Email sent successfully',
        emailId: resendData.id 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in send-contact-email function:', error);
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