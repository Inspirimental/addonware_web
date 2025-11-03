import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Star, ChevronLeft, ChevronRight, Zap, Target, Crown } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const packages = [
  {
    name: "Starter",
    icon: Zap,
    price: "2.600 €",
    description: "Soforthilfe bei akuten Herausforderungen",
    duration: "2 Beratertage",
    features: [
      "Erste Standortbestimmung und Handlungsideen",
      "Sofortige Unterstützung bei akuten Problemen",
      "Strukturiertes Vorgehen in kritischen Situationen",
      "Klärung staatlicher Hilfen und Fördermöglichkeiten",
      "Neuorganisation notwendiger Bereiche",
      "Kommunikation mit Stakeholdern",
      "Start sofort - Ergebnis in wenigen Tagen"
    ],
    questions: [
      "Wie gehe ich bei akuten Geschäftsproblemen strukturiert vor?",
      "Welche Fördermöglichkeiten gibt es für mein Unternehmen?",
      "Wie kommuniziere ich effektiv mit Mitarbeitern und Partnern?",
      "Was muss ich sofort neu organisieren?"
    ],
    popular: false,
    cta: "Paket anfragen"
  },
  {
    name: "Professional",
    icon: Target,
    price: "7.500 €",
    description: "Strategische Neuausrichtung und Chancenerkennung",
    duration: "6 Beratertage",
    features: [
      "Projektstart oder Transformation begleiten",
      "Strategische Unternehmensabsicherung",
      "Geschäftsmodell-Transformation",
      "Digitalisierungskonzepte entwickeln",
      "Innovation gezielt vorantreiben",
      "Chancen systematisch identifizieren",
      "Nachhaltige Lösungsansätze"
    ],
    questions: [
      "Wie sichere ich mein Unternehmen langfristig ab?",
      "Wie strukturiere ich mein Geschäft um, um neue Chancen zu nutzen?",
      "Wie entwickle ich eine erfolgreiche Digitalisierungsstrategie?",
      "Welche Innovationspotentiale kann ich in meinem Unternehmen heben?"
    ],
    popular: true,
    cta: "Paket anfragen"
  },
  {
    name: "Premium",
    icon: Crown,
    price: "1.440 € pro Tag", 
    description: "Maßgeschneiderte Beratung nach individuellem Bedarf",
    duration: "Flexibel nach Bedarf",
    features: [
      "Strategischer Wandel mit Umsetzung",
      "Vollständig individueller Beratungsansatz",
      "Vertiefung spezifischer Themenfelder",
      "Erweiterung bestehender Beratungsprojekte",
      "Betriebswirtschaftliche Problemstellungen",
      "Technische Herausforderungen lösen",
      "Langfristige Begleitung möglich"
    ],
    questions: [
      "Sie haben spezielle Anforderungen und benötigen individuelle Beratung?",
      "Nach der ersten Beratung möchten Sie den Umfang erweitern?",
      "Sie haben komplexe betriebswirtschaftliche oder technische Problemstellungen?"
    ],
    popular: false,
    cta: "Paket anfragen"
  }
];

const additionalServices = [
  "Datenschutz-Review (ab 2.500 €)",
  "Fördermittelberatung (ab 1.200 €)", 
  "Einzelcoaching für Führungskräfte (ab 800 €/Tag)",
  "Notfall-Support bei kritischen Projekten",
  "Compliance-Audit nach DSGVO/ISO 27001"
];

const Pricing = () => {
  const handlePackageRequest = (packageName: string) => {
    // Navigate to contact page with package pre-selected
    window.location.href = `/contact?package=${encodeURIComponent(packageName)}`;
  };

  const handleBedarfsanalyse = () => {
    // Navigate to questionnaire
    window.location.href = '/questionnaire';
  };

  const handleErstgespraech = () => {
    // Navigate to contact page
    window.location.href = '/contact';
  };
  return (
    <div className="min-h-screen bg-background">
      <Navigation onConfiguratorOpen={() => {}} />
      
      <main className="pt-16">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Klar kalkuliert – wirkungsvoll gestaltet
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Viele unserer Kunden schätzen planbare Einstiegspakete. Deshalb bieten wir Beratungsformate in festen Umfangsstufen an – mit voller Kostentransparenz.
          </p>
        </div>

        {/* Pricing Cards - Desktop View */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16 items-start">
          {packages.map((pkg, index) => (
            <div key={index} className="h-full">
              <Card className={`relative transition-all hover:shadow-card h-full grid grid-rows-[auto_auto_auto_auto_1fr_auto] ${
                pkg.popular ? 'border-2 border-primary shadow-lg' : ''
              }`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Beliebt
                    </Badge>
                  </div>
                )}
                
                {/* Title with Icon - Row 1 */}
                <div className="text-center pt-6 pb-2">
                  <div className="flex justify-center mb-3">
                    <pkg.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                </div>
                
                {/* Price - Row 2 */}
                <div className="text-center pb-2">
                  <div className="text-3xl font-bold text-primary">{pkg.price}</div>
                </div>
                
                {/* Description - Row 3 */}
                <div className="text-center px-6 pb-4">
                  <p className="text-muted-foreground text-sm">{pkg.description}</p>
                </div>
                
                {/* Duration Badge - Row 4 */}
                <div className="text-center pb-6">
                  <Badge variant="outline">{pkg.duration}</Badge>
                </div>
                
                {/* Content - Row 5 (flex-1) */}
                <CardContent className="pt-0">
                  <div className="mb-6">
                    <h4 className="font-semibold text-sm mb-3 text-muted-foreground">Leistungen:</h4>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-xs">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-8">
                    <h4 className="font-semibold text-sm mb-3 text-muted-foreground">Ihre Fragen:</h4>
                    <ul className="space-y-2">
                      {pkg.questions.map((question, questionIndex) => (
                        <li key={questionIndex} className="text-xs text-muted-foreground italic">
                          „{question}"
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                
                {/* Button - Row 6 */}
                <div className="p-6 pt-0">
                  <Button 
                    className="w-full" 
                    variant={pkg.popular ? "default" : "outline"}
                    size="lg"
                    onClick={() => handlePackageRequest(pkg.name)}
                  >
                    {pkg.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Pricing Cards - Mobile/Tablet Carousel */}
        <div className="lg:hidden max-w-6xl mx-auto mb-16">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent className="md:-ml-4 pt-4 md:items-stretch">
              {packages.map((pkg, index) => (
                <CarouselItem key={index} className="md:basis-1/2 md:pl-4 flex">
                  <div className="w-full flex">
                    <Card className={`relative transition-all hover:shadow-card w-full flex flex-col ${
                      pkg.popular ? 'border-2 border-primary shadow-lg' : ''
                    }`}>
                      {pkg.popular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                          <Badge className="bg-primary text-primary-foreground px-4 py-1">
                            <Star className="w-3 h-3 mr-1" />
                            Beliebt
                          </Badge>
                        </div>
                      )}
                      
                      {/* Header Section with fixed structure */}
                      <div className="text-center pt-6 pb-6 px-6">
                        <div className="flex justify-center mb-3">
                          <pkg.icon className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle className="text-2xl mb-4">{pkg.name}</CardTitle>
                        <div className="text-3xl font-bold text-primary mb-4">{pkg.price}</div>
                        <div className="h-12 flex items-center justify-center mb-4">
                          <p className="text-muted-foreground text-sm">{pkg.description}</p>
                        </div>
                        <Badge variant="outline">{pkg.duration}</Badge>
                      </div>
                      
                      {/* Content Section - flexible */}
                      <CardContent className="pt-0 flex-1 flex flex-col">
                        <div className="mb-6">
                          <h4 className="font-semibold text-sm mb-3 text-muted-foreground">Leistungen:</h4>
                          <ul className="space-y-2">
                            {pkg.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-start gap-3">
                                <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <span className="text-xs">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="mb-8 flex-1">
                          <h4 className="font-semibold text-sm mb-3 text-muted-foreground">Ihre Fragen:</h4>
                          <ul className="space-y-2">
                            {pkg.questions.map((question, questionIndex) => (
                              <li key={questionIndex} className="text-xs text-muted-foreground italic">
                                „{question}"
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Button at bottom */}
                        <Button 
                          className="w-full mt-auto" 
                          variant={pkg.popular ? "default" : "outline"}
                          size="lg"
                          onClick={() => handlePackageRequest(pkg.name)}
                        >
                          {pkg.cta}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8 gap-4">
              <CarouselPrevious className="relative static translate-y-0" />
              <CarouselNext className="relative static translate-y-0" />
            </div>
          </Carousel>
        </div>

        {/* Additional Services */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Zusatzleistungen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {additionalServices.map((service, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{service}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Häufige Fragen</h2>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Sind die Preise verbindlich?</h3>
                <p className="text-muted-foreground text-sm">
                  Die angegebenen Preise sind Startpreise. Der finale Preis richtet sich nach 
                  Ihrem spezifischen Bedarf und wird nach einem kostenlosen Erstgespräch transparent kommuniziert.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Können Pakete kombiniert werden?</h3>
                <p className="text-muted-foreground text-sm">
                  Ja, gerne erstellen wir auch individuelle Kombinationen oder erweitern bestehende Pakete 
                  um zusätzliche Leistungen nach Ihrem Bedarf.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Wie funktioniert die Abrechnung?</h3>
                <p className="text-muted-foreground text-sm">
                  In der Regel arbeiten wir mit einer Anzahlung von 50% bei Projektstart und 
                  Restzahlung nach Abschluss. Bei längeren Projekten sind auch Ratenzahlungen möglich.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Unsicher, welches Paket zu Ihnen passt?
              </h3>
              <p className="text-muted-foreground mb-6">
                Finden Sie in 5 Minuten heraus, welche Beratungsleistung für 
                Ihre aktuelle Situation am besten geeignet ist.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={handleBedarfsanalyse}>
                  Bedarfsanalyse starten
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="outline" size="lg" onClick={handleErstgespraech}>
                  Kostenloses Erstgespräch
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;