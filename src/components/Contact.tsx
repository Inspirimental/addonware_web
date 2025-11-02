import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { sendContactEmail, type ContactFormData } from "@/services/emailService";
import { contactFormSchema, checkRateLimit } from "@/lib/validation";
import { auditLog } from "@/lib/security";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export const Contact = () => {
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

    try {
      setIsSubmitting(true);
      
      // Validate form data
      const validatedData = contactFormSchema.parse(formData);
      
      auditLog('CONTACT_FORM_SUBMISSION', undefined, { 
        email: validatedData.email, 
        name: validatedData.name 
      });
      
      const success = await sendContactEmail(validatedData as ContactFormData);
      
      if (success) {
        toast({
          title: "Nachricht gesendet!",
          description: "Vielen Dank für Ihre Nachricht. Wir melden uns bald bei Ihnen.",
        });
        
        setFormData({
          name: "",
          email: "",
          organization: "",
          message: "",
          privacy: false,
          botTrap: ""
        });
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      auditLog('CONTACT_FORM_ERROR', undefined, { 
        error: error instanceof Error ? error.message : 'Unknown error',
        email: formData.email 
      });
      
      toast({
        title: "Fehler beim Senden",
        description: error instanceof Error && error.message.includes('validation') 
          ? "Bitte überprüfen Sie Ihre Eingaben." 
          : "Es gab ein Problem beim Versenden. Bitte versuchen Sie es erneut.",
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
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Kontakt & Beratung
          </h2>
          <p className="text-lg text-muted-foreground">
            Lassen Sie uns sprechen – unverbindlich und auf Augenhöhe
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Schreiben Sie uns</CardTitle>
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
                      placeholder="Beschreiben Sie Ihr Anliegen..."
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
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                        Wird gesendet...
                      </>
                    ) : (
                      <>
                        Nachricht senden
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Direkter Kontakt</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <div className="font-medium">E-Mail</div>
                      <a 
                        href="mailto:info@addonware.de" 
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        info@addonware.de
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <div className="font-medium">Telefon</div>
                      <a
                        href="tel:+4936715242790"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        +49 3671 5242790
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <div className="font-medium">Standort</div>
                      <div className="text-muted-foreground">
                        Saalstraße 16<br />
                        07318 Saalfeld
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-primary/5">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">Schweiz</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Für die Umsetzung in der Schweiz arbeiten wir mit der Batix Schweiz AG zusammen –
                  einem zuverlässigen Partner vor Ort, der Schweizer Organisationen mit langjähriger
                  Erfahrung unterstützt.
                </p>
                <a
                  href="https://batix.ch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm font-medium"
                >
                  batix.ch →
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};