import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowRight, Target, Settings, Shield, Users, X } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Configurator } from "@/components/Configurator";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Target,
    title: "Strategie & Zielbildentwicklung",
    subtitle: "Wirkung braucht Richtung",
    teaser: "Klare Ziele statt Formulierungsträume: Wir helfen, den Weg realistisch zu planen. Mit strukturierten Workshops entwickeln wir gemeinsam Ihr Zielbild und definieren konkrete nächste Schritte.",
    slug: "strategie"
  },
  {
    icon: Settings,
    title: "Projektbegleitung & Digitalisierung",
    subtitle: "Von der Idee zur Umsetzung",
    teaser: "Vom Plan zur Umsetzung: Wir moderieren zwischen Fachbereich und Technik. Als operative Projektleitung sorgen wir für Struktur, Kommunikation und den Blick aufs Wesentliche.",
    slug: "projektbegleitung"
  },
  {
    icon: Shield,
    title: "Datenschutz & Informationssicherheit",
    subtitle: "Datenschutz ist kein Showstopper – sondern Organisations\u00ADaufgabe.",
    teaser: "Sicherheit, die zu Ihnen passt: Recht, Technik und Pragmatismus vereint. Wir entwickeln DSGVO-konforme Lösungen, die Ihre Teams verstehen und gerne umsetzen.",
    slug: "datenschutz"
  },
  {
    icon: Users,
    title: "Prozessberatung öffentlicher Bereich",
    subtitle: "Verwaltung soll gestalten, nicht verwalten.",
    teaser: "Viele Prozesse im öffentlichen Bereich sind historisch gewachsen, papierbasiert, personenabhängig – und oft ein Hindernis für digitale Vorhaben. Wir helfen öffentlichen Einrichtungen dabei, ihre Abläufe so zu gestalten, dass sie effizient, anschlussfähig und zukunftsorientiert funktionieren.",
    slug: "prozessberatung"
  }
];

const Services = () => {
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <Navigation onConfiguratorOpen={() => setIsConfiguratorOpen(true)} />
      
      <main className="pt-16">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Unsere Leistungen
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Von der strategischen Orientierung bis zur operativen Umsetzung – 
            wir begleiten Sie in allen Phasen Ihrer digitalen Transformation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <Card key={index} className="group transition-all hover:shadow-card">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold tracking-tight">{service.title}</CardTitle>
                    <p className="text-sm text-muted-foreground font-light mt-1">{service.subtitle}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-6">
                  {service.teaser}
                </p>
                <Link to={`/services/${service.slug}`}>
                  <Button variant="outline" className="group/btn">
                    Mehr erfahren
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Unsicher, welche Leistung zu Ihnen passt?
              </h3>
              <p className="text-muted-foreground mb-6">
                Finden Sie in 5 Minuten heraus, wo Ihr Unternehmen steht und 
                welche Schritte als nächstes sinnvoll sind.
              </p>
              <Button size="lg" onClick={() => setIsConfiguratorOpen(true)}>
                Bedarfsanalyse starten
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
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

export default Services;