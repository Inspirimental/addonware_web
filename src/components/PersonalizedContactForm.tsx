
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";
import { sendContactEmail, type ContactFormData } from "@/services/emailService";
import { contactFormSchema, checkRateLimit } from "@/lib/validation";
import { auditLog } from "@/lib/security";
import { supabase } from "@/integrations/supabase/client";

interface PersonalizedContactFormProps {
  recipientName?: string;
  recipientEmail?: string;
  employeeId?: string;
  onSuccess?: () => void;
}

export const PersonalizedContactForm = ({ recipientName, recipientEmail, employeeId, onSuccess }: PersonalizedContactFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
    privacy: false,
    botTrap: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Bot detection
    if (formData.botTrap) {
      auditLog('BOT_DETECTED', undefined, { email: formData.email });
      return;
    }

    // Rate limiting
    if (!checkRateLimit(formData.email, 3, 15 * 60 * 1000)) {
      toast({
        title: "Zu viele Anfragen",
        description: "Bitte warten Sie 15 Minuten vor dem nächsten Versuch.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.privacy) {
      toast({
        title: "Datenschutz-Zustimmung erforderlich",
        description: "Bitte stimmen Sie der Datenverarbeitung zu.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Validate form data
      const validatedData = contactFormSchema.parse(formData);
      
      auditLog('PERSONALIZED_CONTACT_FORM_SUBMISSION', undefined, { 
        email: validatedData.email, 
        name: validatedData.name,
        recipient: recipientEmail
      });
      
      // Create personalized contact data with recipient information
      const contactData: ContactFormData & { recipientEmail?: string; recipientName?: string } = {
        ...validatedData,
        recipientEmail,
        recipientName
      };
      
      const success = await sendContactEmail(contactData as ContactFormData);

      if (success) {
        // Save contact request to database if employeeId is provided
        if (employeeId) {
          try {
            await supabase
              .from('contact_requests')
              .insert({
                employee_id: employeeId,
                requester_name: validatedData.name,
                requester_email: validatedData.email,
                requester_organization: validatedData.organization || '',
                message: validatedData.message,
                request_type: 'contact',
              });
          } catch (dbError) {
            console.error('Error saving contact request to database:', dbError);
          }
        }

        toast({
          title: "Nachricht gesendet!",
          description: `Ihre Nachricht wurde an ${recipientName || 'unser Team'} weitergeleitet. Wir melden uns bald bei Ihnen.`,
        });

        setFormData({
          name: "",
          email: "",
          organization: "",
          message: "",
          privacy: false,
          botTrap: ""
        });

        // Call onSuccess callback to close the dialog
        if (onSuccess) {
          setTimeout(() => onSuccess(), 1500);
        }
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      auditLog('PERSONALIZED_CONTACT_FORM_ERROR', undefined, {
        error: error instanceof Error ? error.message : 'Unknown error',
        email: formData.email,
        recipient: recipientEmail
      });

      // Parse Zod validation errors for better user feedback
      let errorMessage = "Es gab ein Problem beim Versenden. Bitte versuchen Sie es erneut.";

      if (error instanceof Error) {
        try {
          const errorData = JSON.parse(error.message);
          if (Array.isArray(errorData) && errorData.length > 0) {
            errorMessage = errorData[0].message || errorMessage;
          }
        } catch {
          if (error.message.includes('validation')) {
            errorMessage = "Bitte überprüfen Sie Ihre Eingaben.";
          } else if (error.message) {
            errorMessage = error.message;
          }
        }
      }

      toast({
        title: "Fehler beim Senden",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {recipientName ? `Ihre Nachricht an ${recipientName}` : "Schreiben Sie uns"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail-Adresse *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                maxLength={254}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization">Organisation (optional)</Label>
            <Input
              id="organization"
              value={formData.organization}
              onChange={(e) => handleChange("organization", e.target.value)}
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Ihre Nachricht *</Label>
            <Textarea
              id="message"
              rows={6}
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder={`Beschreiben Sie Ihr Anliegen${recipientName ? ` an ${recipientName}` : ''}...`}
              required
              maxLength={2000}
            />
          </div>

          {/* Bot trap field - hidden from users */}
          <div style={{ display: "none" }}>
            <Label htmlFor="botTrap">Bitte dieses Feld leer lassen</Label>
            <Input
              id="botTrap"
              value={formData.botTrap}
              onChange={(e) => handleChange("botTrap", e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="privacy"
              checked={formData.privacy}
              onCheckedChange={(checked) => handleChange("privacy", checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="privacy" className="text-sm font-normal cursor-pointer">
                Ich stimme zu, dass meine Angaben aus dem Kontaktformular zur 
                Bearbeitung meiner Anfrage erhoben und verarbeitet werden. 
                Die Daten werden nach abgeschlossener Bearbeitung gelöscht. 
                Hinweis: Sie können Ihre Einwilligung jederzeit für die Zukunft 
                per E-Mail widerrufen. *
              </Label>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Wird gesendet..." : "Nachricht senden"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
