import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeInput } from "@/lib/security";
import { Download } from "lucide-react";

interface CVDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeName: string;
  employeeId: string;
  employeeEmail: string;
}

export const CVDownloadModal = ({
  isOpen,
  onClose,
  employeeName,
  employeeId,
  employeeEmail
}: CVDownloadModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const sanitizedName = sanitizeInput(name);
      const sanitizedEmail = sanitizeInput(email);
      const sanitizedOrganization = sanitizeInput(organization);

      if (!sanitizedName || !sanitizedEmail) {
        toast({
          title: "Fehler",
          description: "Bitte füllen Sie alle Pflichtfelder aus",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitizedEmail)) {
        toast({
          title: "Fehler",
          description: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const { error: dbError } = await supabase
        .from('contact_requests')
        .insert({
          employee_id: employeeId,
          requester_name: sanitizedName,
          requester_email: sanitizedEmail,
          requester_organization: sanitizedOrganization,
          message: '',
          request_type: 'cv_download',
        });

      if (dbError) throw dbError;

      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-cv-email`;

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          requesterName: sanitizedName,
          requesterEmail: sanitizedEmail,
          requesterOrganization: sanitizedOrganization,
          employeeName,
          employeeEmail,
          employeeId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send email');
      }

      toast({
        title: "Erfolg",
        description: `Der Lebenslauf von ${employeeName} wurde an ${sanitizedEmail} gesendet.`,
      });

      setName("");
      setEmail("");
      setOrganization("");
      onClose();
    } catch (error) {
      console.error('Error requesting CV download:', error);
      toast({
        title: "Fehler",
        description: "Es gab ein Problem beim Versenden. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Lebenslauf anfordern
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Geben Sie Ihre Kontaktdaten ein, um den Lebenslauf von {employeeName} per E-Mail zu erhalten.
          </p>

          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ihr Name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-Mail *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ihre.email@beispiel.de"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization">Organisation</Label>
            <Input
              id="organization"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="Ihre Organisation (optional)"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Wird gesendet..." : "Lebenslauf anfordern"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
