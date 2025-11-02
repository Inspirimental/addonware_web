import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface AdvisorContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  advisorName: string;
  advisorEmail: string;
}

export const AdvisorContactForm = ({ isOpen, onClose, advisorName, advisorEmail }: AdvisorContactFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
    privacy: false,
    botTrap: ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.botTrap) {
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
      console.log("Advisor contact form submitted:", {
        name: formData.name,
        email: formData.email,
        organization: formData.organization,
        message: formData.message,
        recipient: advisorEmail,
        advisorName: advisorName
      });
      
      toast({
        title: "Nachricht gesendet!",
        description: `Ihre Nachricht wurde an ${advisorName} weitergeleitet.`,
      });

      setFormData({
        name: "",
        email: "",
        organization: "",
        message: "",
        privacy: false,
        botTrap: ""
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Fehler beim Senden",
        description: "Es gab ein Problem beim Versenden Ihrer Nachricht. Bitte versuchen Sie es erneut.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Ihre Nachricht an {advisorName}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="p-6">
          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail-Adresse *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Organisation (optional)</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => handleInputChange("organization", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Ihre Nachricht *</Label>
                  <Textarea
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder={`Beschreiben Sie kurz Ihr Anliegen an ${advisorName}...`}
                    required
                  />
                </div>

                <div style={{ display: "none" }}>
                  <Label htmlFor="botTrap">Bitte dieses Feld leer lassen</Label>
                  <Input
                    id="botTrap"
                    value={formData.botTrap}
                    onChange={(e) => handleInputChange("botTrap", e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="privacy"
                    checked={formData.privacy}
                    onCheckedChange={(checked) => handleInputChange("privacy", checked as boolean)}
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

                <Button type="submit" size="lg" className="w-full">
                  Nachricht an {advisorName} senden
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};