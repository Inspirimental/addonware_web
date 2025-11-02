import { auditLog } from '@/lib/security';
import { contactFormSchema, checkRateLimit } from '@/lib/validation';
import { supabase } from '@/integrations/supabase/client';

// Get Supabase function URL
const getSupabaseFunctionUrl = (functionName: string) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error('VITE_SUPABASE_URL not configured');
  }
  return `${supabaseUrl}/functions/v1/${functionName}`;
};

export interface ContactFormData {
  name: string;
  email: string;
  organization?: string;
  message: string;
  recipientEmail?: string;
  recipientName?: string;
}

export interface QuestionnaireData {
  name: string;
  email: string;
  organization: string;
  phone?: string;
  industry: string;
  teamSize: string;
  challenges: string[];
  goals: string[];
  timeframe: string;
  budget: string;
  message?: string;
}

export const sendContactEmail = async (formData: ContactFormData): Promise<boolean> => {
  try {
    // Rate limiting check
    const clientId = formData.email;
    if (!checkRateLimit(clientId, 3, 15 * 60 * 1000)) {
      auditLog('RATE_LIMIT_EXCEEDED', clientId, { action: 'sendContactEmail' });
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Validate input data
    const validatedData = contactFormSchema.parse(formData);

    // Audit log
    auditLog('CONTACT_EMAIL_SENT', validatedData.email, {
      name: validatedData.name,
      organization: validatedData.organization,
      recipientEmail: formData.recipientEmail,
      recipientName: formData.recipientName
    });

    // Call Supabase Edge Function
    const functionUrl = getSupabaseFunctionUrl('send-contact-email');

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        name: validatedData.name,
        email: validatedData.email,
        organization: validatedData.organization,
        message: validatedData.message,
        recipientEmail: formData.recipientEmail,
        recipientName: formData.recipientName,
        type: 'contact'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send email');
    }

    const result = await response.json();
    console.log('Contact email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Error sending contact email:', error);
    auditLog('CONTACT_EMAIL_ERROR', formData.email, {
      error: error instanceof Error ? error.message : 'Unknown error',
      recipientEmail: formData.recipientEmail
    });
    return false;
  }
};

export const sendQuestionnaireEmail = async (
  formData: QuestionnaireData,
  recipientEmail?: string
): Promise<boolean> => {
  try {
    // Rate limiting check
    const clientId = formData.email;
    if (!checkRateLimit(clientId, 2, 15 * 60 * 1000)) {
      auditLog('RATE_LIMIT_EXCEEDED', clientId, { action: 'sendQuestionnaireEmail' });
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Audit log
    auditLog('QUESTIONNAIRE_EMAIL_SENT', formData.email, {
      name: formData.name,
      organization: formData.organization,
      industry: formData.industry
    });

    // Call Supabase Edge Function
    const functionUrl = getSupabaseFunctionUrl('send-contact-email');

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        organization: formData.organization || '',
        message: formData.message || `
Bedarfsanalyse:
- Telefon: ${formData.phone || 'Nicht angegeben'}
- Branche: ${formData.industry}
- Teamgröße: ${formData.teamSize}
- Herausforderungen: ${formData.challenges.join(', ')}
- Ziele: ${formData.goals.join(', ')}
- Zeitrahmen: ${formData.timeframe}
- Budget: ${formData.budget}
        `,
        recipientEmail: recipientEmail || 'info@addonware.de',
        type: 'questionnaire',
        questionnaireData: {
          phone: formData.phone,
          industry: formData.industry,
          teamSize: formData.teamSize,
          challenges: formData.challenges,
          goals: formData.goals,
          timeframe: formData.timeframe,
          budget: formData.budget
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send email');
    }

    const result = await response.json();
    console.log('Questionnaire email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Error sending questionnaire email:', error);
    auditLog('QUESTIONNAIRE_EMAIL_ERROR', formData.email, {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return false;
  }
};

export interface QuestionnaireResponse {
  questionnaireId: string;
  email: string;
  answers: { questionId: string; optionId: string }[];
}

export const submitQuestionnaireResponse = async (
  questionnaireSlug: string,
  name: string,
  email: string,
  company: string,
  answers: { questionId: string; questionType: string; value: string }[]
): Promise<boolean> => {
  try {
    // Rate limiting check
    if (!checkRateLimit(email, 2, 15 * 60 * 1000)) {
      auditLog('RATE_LIMIT_EXCEEDED', email, { action: 'submitQuestionnaireResponse' });
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Get questionnaire
    const { data: questionnaire, error: questionnaireError } = await supabase
      .from('questionnaires')
      .select('id, notification_email, title')
      .eq('slug', questionnaireSlug)
      .single();

    if (questionnaireError || !questionnaire) {
      throw new Error('Questionnaire not found');
    }

    // Create response record
    const { data: response, error: responseError } = await supabase
      .from('questionnaire_responses')
      .insert({
        questionnaire_id: questionnaire.id,
        name: name,
        email: email,
        company: company || '',
      })
      .select()
      .single();

    if (responseError || !response) {
      throw new Error('Failed to create response');
    }

    // Insert answers based on question type
    const answerInserts = answers.map(answer => {
      const baseAnswer = {
        response_id: response.id,
        question_id: answer.questionId,
      };

      if (answer.questionType === 'multiple_choice') {
        return {
          ...baseAnswer,
          option_id: answer.value, // value is optionId
          answer_text: null,
          answer_number: null,
        };
      } else if (answer.questionType === 'rating') {
        return {
          ...baseAnswer,
          option_id: null,
          answer_text: null,
          answer_number: parseInt(answer.value),
        };
      } else { // text
        return {
          ...baseAnswer,
          option_id: null,
          answer_text: answer.value,
          answer_number: null,
        };
      }
    });

    const { error: answersError } = await supabase
      .from('questionnaire_answers')
      .insert(answerInserts);

    if (answersError) {
      throw new Error('Failed to save answers');
    }

    // Get full response data for email
    const { data: fullAnswers, error: fullAnswersError } = await supabase
      .from('questionnaire_answers')
      .select(`
        question_id,
        option_id,
        answer_text,
        answer_number,
        questionnaire_questions!inner(question_text, question_type)
      `)
      .eq('response_id', response.id);

    if (fullAnswersError) {
      console.error('Error loading full answers for email:', fullAnswersError);
    }

    // Format answers for email with numbering
    const formattedAnswers = await Promise.all((fullAnswers || []).map(async (a, index) => {
      const question = (a.questionnaire_questions as any);
      let answerText = '';

      if (question.question_type === 'multiple_choice' && a.option_id) {
        // Get option text for multiple choice
        const { data: option } = await supabase
          .from('questionnaire_options')
          .select('option_text')
          .eq('id', a.option_id)
          .single();
        answerText = option?.option_text || 'Keine Angabe';
      } else if (question.question_type === 'rating') {
        answerText = String(a.answer_number || 'Keine Angabe');
      } else if (question.question_type === 'text') {
        answerText = a.answer_text || 'Keine Angabe';
      }

      return {
        number: index + 1,
        question: question.question_text,
        answer: answerText,
      };
    }));

    const functionUrl = getSupabaseFunctionUrl('send-contact-email');

    // Send email notification to admin
    if (questionnaire.notification_email) {
      try {
        const adminEmailResponse = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            name: name,
            email: email,
            organization: company || '',
            message: `Neue Umfrage-Antwort für "${questionnaire.title}"\n\nKontaktdaten:\nName: ${name}\nE-Mail: ${email}\nOrganisation: ${company || 'Keine Angabe'}\n\nAntworten:\n${formattedAnswers.map(a => `\n${a.number}. ${a.question}\nAntwort: ${a.answer}`).join('\n---\n')}`,
            recipientEmail: questionnaire.notification_email,
            replyTo: email,
            type: 'questionnaire',
            questionnaireTitle: questionnaire.title,
            questionnaireData: formattedAnswers,
          })
        });

        if (!adminEmailResponse.ok) {
          const errorData = await adminEmailResponse.json();
          console.error('Failed to send admin notification email:', errorData);
          throw new Error(errorData.error || 'Failed to send admin notification');
        }

        const adminResult = await adminEmailResponse.json();
        console.log('Admin notification email sent successfully:', adminResult);
      } catch (error) {
        console.error('Error sending admin notification email:', error);
        auditLog('ADMIN_EMAIL_ERROR', email, {
          error: error instanceof Error ? error.message : 'Unknown error',
          recipientEmail: questionnaire.notification_email,
        });
      }
    }

    // Send confirmation email to respondent
    try {
      const confirmationResponse = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          name: name,
          email: email,
          organization: company || '',
          message: `Ihre Antworten:\n\n${formattedAnswers.map(a => `${a.number}. ${a.question}\nAntwort: ${a.answer}`).join('\n\n')}`,
          recipientEmail: email,
          type: 'questionnaire_confirmation',
          questionnaireTitle: questionnaire.title,
          questionnaireData: formattedAnswers,
        })
      });

      if (!confirmationResponse.ok) {
        const errorData = await confirmationResponse.json();
        console.error('Failed to send confirmation email:', errorData);
      } else {
        const confirmResult = await confirmationResponse.json();
        console.log('Confirmation email sent successfully:', confirmResult);
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      auditLog('CONFIRMATION_EMAIL_ERROR', email, {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    auditLog('QUESTIONNAIRE_RESPONSE_SUBMITTED', email, {
      questionnaireId: questionnaire.id,
      responseId: response.id,
      answerCount: answers.length,
    });

    return true;
  } catch (error) {
    console.error('Error submitting questionnaire response:', error);
    auditLog('QUESTIONNAIRE_RESPONSE_ERROR', email, {
      error: error instanceof Error ? error.message : 'Unknown error',
      questionnaireSlug,
    });
    return false;
  }
};

// Email service initialization (no longer needed with Edge Functions)
export const initializeEmailService = () => {
  console.log('Email service ready - using Supabase Edge Functions with Resend');
};
