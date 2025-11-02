import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Configurator } from "@/components/Configurator";
import { X } from "lucide-react";

const Contact = ({ advisorName, advisorEmail }: { advisorName?: string; advisorEmail?: string } = {}) => {
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
    privacy: false,
    botTrap: "" // Honeypot field
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Bot trap check
    if (formData.botTrap) {
      return; // Silent fail for bots
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
      // Hier würden Sie EmailJS konfigurieren
      // Für jetzt verwenden wir einen Platzhalter
      console.log("Contact form submitted:", {
        name: formData.name,
        email: formData.email,
        organization: formData.organization,
        message: formData.message,
        recipient: advisorEmail || 'beck@addonware.de',
        advisorName: advisorName
      });
      
      toast({
        title: "Nachricht gesendet!",
        description: "Wir melden uns schnellstmöglich bei Ihnen zurück.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        organization: "",
        message: "",
        privacy: false,
        botTrap: ""
      });
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
    <div className="min-h-screen bg-background">
      <Navigation onConfiguratorOpen={() => setIsConfiguratorOpen(true)} />
      
      <main className="pt-16">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {advisorName ? `Kontakt zu ${advisorName}` : "Nehmen Sie Kontakt mit uns auf"}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {advisorName 
              ? `Nehmen Sie direkt Kontakt zu ${advisorName} auf – wir melden uns innerhalb von 24 h bei Ihnen zurück.`
              : "Ob konkretes Projekt oder erste Orientierung – wir melden uns innerhalb von 24 h bei Ihnen zurück."
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {advisorName ? `Ihre Nachricht an ${advisorName}` : "Ihre Nachricht an uns"}
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
                      placeholder="Beschreiben Sie kurz Ihr Anliegen oder Ihre Herausforderung..."
                      required
                    />
                  </div>

                  {/* Bot trap - hidden field */}
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
                    Nachricht senden
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Direkter Kontakt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">E-Mail</p>
                    <a href="mailto:info@addonware.de" className="text-primary hover:underline">
                      info@addonware.de
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Telefon</p>
                    <a href="tel:+4936715242790" className="text-primary hover:underline">
                      +49 3671 5242790
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Adresse</p>
                    <p className="text-muted-foreground text-sm">
                      Addonware GmbH<br />
                      Saalstraße 16<br />
                      07318 Saalfeld<br />
                      Deutschland
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">Antwortzeit</p>
                    <p className="text-muted-foreground text-sm">
                      Wir melden uns in der Regel 
                      innerhalb von 24 Stunden zurück.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Noch unsicher?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Starten Sie mit unserer kostenlosen Bedarfsanalyse 
                  und finden Sie heraus, wo Ihr Unternehmen steht.
                </p>
                <Button variant="outline" size="sm" onClick={() => setIsConfiguratorOpen(true)}>
                  Zur Bedarfsanalyse
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </main>
      
      <Footer />
      
      {/* Configurator Dialog */}
      <Dialog open={isConfiguratorOpen} onOpenChange={setIsConfiguratorOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Kostenlose Bedarfsanalyse</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsConfiguratorOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="p-6">
            <Configurator />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contact;