import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle, ArrowRight, X, Target, Lightbulb, Cog, Anchor, TrendingUp, Download } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Configurator } from "@/components/Configurator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const serviceDetails = {
  strategie: {
    title: "Wirkung braucht Richtung",
    subtitle: "Strategie & Zielbildentwicklung",
    description: "Viele Organisationen wissen, dass Veränderung nötig ist – aber nicht, wo sie anfangen sollen. Wir helfen, das große Bild zu klären, klare Ziele zu formulieren und konkrete nächste Schritte abzuleiten.",
    process: [
      {
        step: "Standortanalyse",
        description: "Wir beginnen mit Ihrer Realität – nicht mit einem Idealbild."
      },
      {
        step: "Zielbild-Entwicklung", 
        description: "Gemeinsam skizzieren wir ein Ziel, das erreichbar und inspirierend zugleich ist."
      },
      {
        step: "Handlungsplan",
        description: "Wir priorisieren mit Ihnen, was wirklich zählt – und wie Sie starten."
      }
    ]
  },
  projektbegleitung: {
    title: "Von der Idee zur Umsetzung",
    subtitle: "Projektbegleitung & Digitalisierung",
    description: "Digitalprojekte scheitern selten an der Technik – sondern an Abstimmung, Geschwindigkeit und Kommunikation. Wir begleiten Ihre Vorhaben operativ und verbindlich.",
    process: [
      {
        step: "Moderation & Struktur",
        description: "Wir verbinden Fachbereiche, IT und Steuerungsgremien."
      },
      {
        step: "Projektsteuerung",
        description: "Transparent, realistisch, wirksam – mit Blick auf Ressourcen und Prioritäten."
      },
      {
        step: "Umsetzungsunterstützung",
        description: "Wir bleiben an Ihrer Seite, wenn andere schon abgeschlossen haben."
      }
    ]
  },
  datenschutz: {
    title: "Datenschutz ist kein Showstopper – sondern Organisations\u00ADaufgabe.",
    subtitle: "Datenschutz & Informationssicherheit",
    description: "Informationssicherheit und Datenschutz werden oft als bürokratische Pflicht gesehen – dabei sind sie strategische Hebel für nachhaltige Digitalisierung. Wir helfen Organisationen, den Schutz von Daten und Informationen so zu gestalten, dass er zur Organisation passt – und nicht blockiert, sondern stärkt.",
    process: [
      {
        step: "Verstehen",
        description: "Analyse des organisatorischen und technischen Kontexts: Was ist wirklich relevant? Welche Anforderungen gelten – und was ist sinnvoll?"
      },
      {
        step: "Fokussieren",
        description: "Wir identifizieren kritische Risiken, klären Rollen & Verantwortlichkeiten und priorisieren Handlungsfelder."
      },
      {
        step: "Wirksam werden",
        description: "Regelmäßige Überprüfung, Evaluation, Weiterentwicklung – pragmatisch und auf Augenhöhe."
      }
    ]
  },
  prozessberatung: {
    title: "Verwaltung soll gestalten, nicht verwalten.",
    subtitle: "Prozessberatung öffentlicher Bereich",
    description: "Viele Prozesse im öffentlichen Bereich sind historisch gewachsen, papierbasiert, personenabhängig – und oft ein Hindernis für digitale Vorhaben. Wir helfen öffentlichen Einrichtungen dabei, ihre Abläufe so zu gestalten, dass sie effizient, anschlussfähig und zukunftsorientiert funktionieren. Ohne Change-Blabla – sondern mit Respekt vor der Realität.",
    process: [
      {
        step: "Verstehen",
        description: "Wir analysieren Abläufe, formelle Regeln und informelle Dynamiken. Was ist offiziell – und was wird wirklich getan?"
      },
      {
        step: "Fokussieren",
        description: "Wir identifizieren Prozesse mit hohem Entlastungs- oder Digitalisierungspotenzial. → Weniger Aktionismus, mehr Wirkung."
      },
      {
        step: "Gestalten",
        description: "Wir entwickeln neue Abläufe, Rollen und Entscheidungswege – anschlussfähig an Ihre Realität."
      },
      {
        step: "Verankern",
        description: "Wir begleiten Pilotierungen, befähigen Mitarbeitende und schaffen Klarheit durch Standards und Kommunikation."
      },
      {
        step: "Wirksam werden",
        description: "Gemeinsam sorgen wir dafür, dass Veränderungen bleiben – nicht nur beschlossen werden."
      }
    ]
  }
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const service = serviceDetails[slug as keyof typeof serviceDetails];

  const handleConfiguratorOpen = () => {
    setIsConfiguratorOpen(true);
  };

  const handleContactClick = () => {
    navigate('/contact');
  };

  if (!service) {
    return <div>Service nicht gefunden</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation onConfiguratorOpen={() => setIsConfiguratorOpen(true)} />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-lg text-muted-foreground mb-4">
                Thema: {service.subtitle}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {service.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {service.description}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {service.process.map((item, index) => (
                <Card key={index} className="relative">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <CheckCircle className="w-6 h-6 text-primary mr-3 flex-shrink-0" />
                      <h3 className="font-semibold text-lg">{item.step}</h3>
                    </div>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Content for Strategie */}
            {slug === 'strategie' && (
              <>
                {/* Erweiterter Einstieg */}
                <div className="mb-16">
                  <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
                    <CardContent className="p-8 text-center">
                      <h2 className="text-3xl font-bold mb-6">Wenn Orientierung fehlt, laufen Teams im Kreis.</h2>
                      <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
                        Eine Strategie ist mehr als ein Plan – sie ist der gemeinsame Blick nach vorn, der Fokus schafft, 
                        Konflikte klärt und Entscheidungen erleichtert. Bei addonware entwickeln wir Zielbilder, die nicht 
                        in der Schublade verschwinden – sondern zum Handlungsrahmen für die Organisation werden.
                      </p>
                      <div className="flex justify-center space-x-4 text-primary font-semibold">
                        <span>Klar.</span>
                        <span>Visuell.</span>
                        <span>Wirksam.</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Was wir anders machen */}
                <div className="mb-16">
                  <h2 className="text-3xl font-bold text-center mb-8">Was wir anders machen</h2>
                  <Card>
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-semibold mb-4">Die meisten Strategien scheitern nicht an der Analyse – sondern an der Umsetzung.</h3>
                      <p className="text-lg text-muted-foreground mb-6">
                        Deshalb stellen wir nicht nur die richtigen Fragen, sondern sorgen auch für die richtige Verankerung. 
                        Gemeinsam mit Ihrem Team erarbeiten wir ein Zielbild, das:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <span>realistisch und motivierend ist,</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <span>konkrete Auswirkungen auf Strukturen und Prozesse hat,</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <span>und als soziales Artefakt in der Organisation verstanden wird – nicht als Top-down-Dokument.</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Methodischer Deep-Dive */}
                <div className="mb-16">
                  <h2 className="text-3xl font-bold text-center mb-8">Unsere Methode: Strategiearbeit in drei Bildern</h2>
                  <p className="text-lg text-muted-foreground text-center mb-8">
                    Wir arbeiten mit einem erprobten Dreischritt:
                  </p>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="zielbild">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center space-x-3">
                          <Target className="w-6 h-6 text-primary" />
                          <div>
                            <h3 className="font-semibold text-lg">1. Zielbild</h3>
                            <p className="text-sm text-muted-foreground">Wo wollen wir gemeinsam hin?</p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-4">
                          <p className="mb-4">
                            Welche Werte, Prinzipien und Rahmenbedingungen gelten für uns?
                          </p>
                          <div className="bg-primary/5 p-4 rounded-lg">
                            <strong>Ergebnis:</strong> Visuelles Zukunftsbild Ihrer Organisation – anschlussfähig, motivierend, greifbar.
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="systembild">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center space-x-3">
                          <Cog className="w-6 h-6 text-primary" />
                          <div>
                            <h3 className="font-semibold text-lg">2. Systembild</h3>
                            <p className="text-sm text-muted-foreground">Wie funktionieren wir heute?</p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-4">
                          <p className="mb-4">
                            Welche Strukturen, Rollen und Dynamiken prägen unser Handeln?
                          </p>
                          <div className="bg-primary/5 p-4 rounded-lg">
                            <strong>Ergebnis:</strong> Systemische Analyse Ihrer Organisation mit Blick auf Entscheidungsarchitekturen.
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="wirkbild">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center space-x-3">
                          <TrendingUp className="w-6 h-6 text-primary" />
                          <div>
                            <h3 className="font-semibold text-lg">3. Wirkbild</h3>
                            <p className="text-sm text-muted-foreground">Was bringt die Veränderung konkret?</p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-4">
                          <p className="mb-4">
                            Wie verändern sich Prozesse, Ressourcen, Verantwortlichkeiten?
                          </p>
                          <div className="bg-primary/5 p-4 rounded-lg">
                            <strong>Ergebnis:</strong> Transformationspfad mit Leuchttürmen und Quick Wins.
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                {/* Impulsfragen */}
                <div className="mb-16">
                  <Card className="bg-gradient-to-r from-accent/10 to-primary/10">
                    <CardContent className="p-8 text-center">
                      <h3 className="text-2xl font-bold mb-6">Drei Fragen, bevor Sie Ihre Strategie weiterentwickeln:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="text-left">
                          <Lightbulb className="w-8 h-8 text-primary mb-3 mx-auto md:mx-0" />
                          <p className="font-medium">Ist unser Zielbild für alle sichtbar und verständlich?</p>
                        </div>
                        <div className="text-left">
                          <Anchor className="w-8 h-8 text-primary mb-3 mx-auto md:mx-0" />
                          <p className="font-medium">Wissen wir, was uns heute zurückhält?</p>
                        </div>
                        <div className="text-left">
                          <Target className="w-8 h-8 text-primary mb-3 mx-auto md:mx-0" />
                          <p className="font-medium">Haben wir konkrete Bilder davon, wie es besser laufen könnte?</p>
                        </div>
                      </div>
                      <Button variant="outline" size="lg" className="whitespace-normal text-center h-auto py-3">
                        <Download className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>Jetzt kostenloses Impuls-PDF herunterladen</span>
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* 5 Stufen Erfolgsmodell */}
                <div className="mb-16">
                  <h2 className="text-3xl font-bold text-center mb-8">Unser Erfolgsmodell: Von der Idee zur Wirkung</h2>
                  <p className="text-lg text-muted-foreground text-center mb-12">
                    Jede Strategie ist nur so gut wie ihre Umsetzung. Deshalb begleiten wir nicht nur das Denken, 
                    sondern auch das Tun – in fünf klaren Schritten:
                  </p>
                  <div className="flex flex-col items-center max-w-2xl mx-auto space-y-6">
                    {[
                      {
                        step: "1. Verstehen",
                        description: "Systemische Analyse von Organisation, Umfeld und Zielsetzung. Keine Symptome behandeln, sondern Ursachen erkennen.",
                        icon: <Lightbulb className="w-8 h-8 text-primary" />
                      },
                      {
                        step: "2. Fokussieren", 
                        description: "Zielbild schärfen, strategische Optionen bewerten, Entscheidungsklarheit schaffen.",
                        icon: <Target className="w-8 h-8 text-primary" />
                      },
                      {
                        step: "3. Gestalten",
                        description: "Prozesse, Strukturen und Rollen so weiterentwickeln, dass das Zielbild erreichbar wird.",
                        icon: <Cog className="w-8 h-8 text-primary" />
                      },
                      {
                        step: "4. Verankern",
                        description: "Veränderungen nicht nur umsetzen, sondern nachhaltig in der Organisation verankern – durch Beteiligung, Führung und Kommunikation.",
                        icon: <Anchor className="w-8 h-8 text-primary" />
                      },
                      {
                        step: "5. Wirksam werden",
                        description: "Erfolge sichtbar machen, Lernen ermöglichen, nächste Entwicklungsschritte anschlussfähig vorbereiten.",
                        icon: <TrendingUp className="w-8 h-8 text-primary" />
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex flex-col items-center w-full">
                        <Card className="w-full text-center">
                          <CardContent className="p-6">
                            <div className="mb-4 flex justify-center">{item.icon}</div>
                            <h3 className="font-semibold text-lg mb-3">{item.step}</h3>
                            <p className="text-muted-foreground">{item.description}</p>
                          </CardContent>
                        </Card>
                        {index < 4 && (
                          <div className="my-4 flex justify-center">
                            <ArrowRight className="w-6 h-6 text-muted-foreground/50 rotate-90" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Additional Content for Prozessberatung */}
            {slug === 'prozessberatung' && (
              <>
                {/* Erweiterter Einstieg */}
                <div className="mb-16">
                  <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
                    <CardContent className="p-8">
                      <h2 className="text-2xl font-bold mb-6 text-center">Unser Blick auf Verwaltung: Möglichmacher statt Bremser</h2>
                      <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto text-center">
                        Prozesse sind nie neutral. Sie zeigen, wie Verantwortung verteilt ist, wie Entscheidungen getroffen werden – und was in einer Organisation wirklich zählt.
                        Deshalb analysieren wir nicht nur Abläufe, sondern auch Entscheidungsarchitekturen, Schnittstellen und implizite Regeln.
                      </p>
                      <div className="flex justify-center">
                        <span className="text-primary font-semibold text-lg">Unser Ziel: Praktikable Lösungen, die wirken und bleiben.</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Typische Herausforderungen */}
                <div className="mb-16">
                  <h2 className="text-3xl font-bold text-center mb-8">Typische Herausforderungen</h2>
                  <p className="text-lg text-muted-foreground text-center mb-8">Wir werden gerufen, wenn …</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      "Mitarbeitende Prozesse immer wieder umgehen, weil sie in der Praxis nicht funktionieren.",
                      "Digitalisierungsvorhaben scheitern, weil formelle Vorgaben und reale Abläufe nicht zusammenpassen.",
                      "Zuständigkeiten unklar sind – und dadurch Frust, Stillstand oder Doppelarbeit entsteht.",
                      "interne Abstimmungen zäh, schriftlich und langsam verlaufen – obwohl alle das anders wollen.",
                      "neue gesetzliche Anforderungen kommen, aber keine Zeit ist, die bestehenden Prozesse zu hinterfragen."
                    ].map((challenge, index) => (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                            <p className="text-muted-foreground">{challenge}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Unser Vorgehen */}
                <div className="mb-16">
                  <h2 className="text-3xl font-bold text-center mb-8">Unser Vorgehen</h2>
                  <Card>
                    <CardContent className="p-8">
                      <p className="text-lg text-muted-foreground mb-6">
                        Wir arbeiten mit Methoden aus der Organisationssoziologie, der Prozessarchitektur und der digitalen Transformation – immer abgestimmt auf Ihre Strukturen und Ressourcen.
                      </p>
                      <p className="text-lg font-semibold mb-4">Gemeinsam mit den Beteiligten identifizieren wir die relevanten Stellschrauben:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          "Welche Abläufe erzeugen Reibung oder Intransparenz?",
                          "Wo fehlen Schnittstellen, Standards oder Klarheit?",
                          "Welche Rollen, Gremien oder Tools bremsen – und welche fehlen?",
                          "Wie kann Digitalisierung anschlussfähig umgesetzt werden?"
                        ].map((question, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                            <span>{question}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Haltung */}
                <div className="mb-16">
                  <Card className="bg-gradient-to-r from-accent/10 to-primary/10">
                    <CardContent className="p-8 text-center">
                      <h2 className="text-3xl font-bold mb-6">Haltung</h2>
                      <div className="max-w-2xl mx-auto">
                        <p className="text-lg mb-4">
                          <strong>Wir glauben an Verwaltungen, die gestalten wollen – wenn man sie lässt.</strong>
                        </p>
                        <p className="text-lg mb-4">
                          Unsere Prozessberatung schafft kein Wunschbild, sondern macht Organisation handlungsfähig.
                        </p>
                        <div className="flex justify-center space-x-6 text-primary font-semibold">
                          <span>Klar.</span>
                          <span>Beteiligend.</span>
                          <span>Praxisnah.</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 5 Stufen Erfolgsmodell */}
                <div className="mb-16">
                  <h2 className="text-3xl font-bold text-center mb-8">Unser Erfolgsmodell: In fünf Schritten zu besseren Prozessen im öffentlichen Bereich</h2>
                  <p className="text-lg text-muted-foreground text-center mb-12">
                    Wir bringen Struktur in die Organisation – nicht nur in die Abläufe.
                    Unsere Prozessberatung folgt einem erprobten Fünfschritt:
                  </p>
                  <div className="flex flex-col items-center max-w-2xl mx-auto space-y-6">
                    {[
                      {
                        step: "1. Verstehen",
                        description: "Wir analysieren Abläufe, formelle Regeln und informelle Dynamiken. Was ist offiziell – und was wird wirklich getan?",
                        icon: <Lightbulb className="w-8 h-8 text-primary" />
                      },
                      {
                        step: "2. Fokussieren", 
                        description: "Wir identifizieren Prozesse mit hohem Entlastungs- oder Digitalisierungspotenzial. → Weniger Aktionismus, mehr Wirkung.",
                        icon: <Target className="w-8 h-8 text-primary" />
                      },
                      {
                        step: "3. Gestalten",
                        description: "Wir entwickeln neue Abläufe, Rollen und Entscheidungswege – anschlussfähig an Ihre Realität.",
                        icon: <Cog className="w-8 h-8 text-primary" />
                      },
                      {
                        step: "4. Verankern",
                        description: "Wir begleiten Pilotierungen, befähigen Mitarbeitende und schaffen Klarheit durch Standards und Kommunikation.",
                        icon: <Anchor className="w-8 h-8 text-primary" />
                      },
                      {
                        step: "5. Wirksam werden",
                        description: "Gemeinsam sorgen wir dafür, dass Veränderungen bleiben – nicht nur beschlossen werden.",
                        icon: <TrendingUp className="w-8 h-8 text-primary" />
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex flex-col items-center w-full">
                        <Card className="w-full text-center">
                          <CardContent className="p-6">
                            <div className="mb-4 flex justify-center">{item.icon}</div>
                            <h3 className="font-semibold text-lg mb-3">{item.step}</h3>
                            <p className="text-muted-foreground">{item.description}</p>
                          </CardContent>
                        </Card>
                        {index < 4 && (
                          <div className="my-4 flex justify-center">
                            <ArrowRight className="w-6 h-6 text-muted-foreground/50 rotate-90" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Additional Content for Projektbegleitung */}
            {slug === 'projektbegleitung' && (
              <>
                {/* Erweiterter Einstieg */}
                <div className="mb-16">
                  <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
                    <CardContent className="p-8 text-center">
                      <h2 className="text-3xl font-bold mb-6">Digitalisierung ist selten ein Technikproblem.</h2>
                      <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
                        Die meisten Projekte scheitern nicht an Software oder Budget – sondern an Unklarheit, 
                        Reibung oder Widerstand im System. Wir begleiten digitale Vorhaben so, dass Technologie, 
                        Organisation und Menschen miteinander ins Arbeiten kommen.
                      </p>
                      <div className="flex justify-center space-x-4 text-primary font-semibold">
                        <span>Pragmatisch.</span>
                        <span>Ehrlich.</span>
                        <span>Wirkungsvoll.</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Was wir tun - und was nicht */}
                <div className="mb-16">
                  <h2 className="text-3xl font-bold text-center mb-8">Was wir tun – und was nicht</h2>
                  <Card>
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-semibold mb-4">Unsere Projektbegleitung ist keine klassische IT-Einführung.</h3>
                      <p className="text-lg text-muted-foreground mb-6">
                        Wir steigen dort ein, wo digitale Vorhaben stocken, zu groß gedacht wurden – oder zu klein. 
                        Gemeinsam klären wir:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <span>Welche Voraussetzungen Ihre Organisation wirklich braucht,</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <span>Wo Strukturen, Rollen oder Prozesse angepasst werden müssen,</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <span>Wie Sie durch gezielte Pilotierung statt Überforderung vorankommen,</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <span>Und wie Sie intern Akzeptanz und Wirkung erzeugen – nicht nur Häkchen auf der Projektliste.</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Unser Vorgehen - Die 5 Ebenen */}
                <div className="mb-16">
                  <h2 className="text-3xl font-bold text-center mb-8">Unser Vorgehen – Die 5 Ebenen erfolgreicher Digitalprojekte</h2>
                  <p className="text-lg text-muted-foreground text-center mb-8">
                    Fünf Hebel für digitale Projekte mit Substanz:
                  </p>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="zweckklarung">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center space-x-3">
                          <Target className="w-6 h-6 text-primary" />
                          <div>
                            <h3 className="font-semibold text-lg">1. Zweckklärung</h3>
                            <p className="text-sm text-muted-foreground">Was genau soll verbessert werden?</p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-4">
                          <p className="mb-4">
                            Welche Ziele sind operativ und strategisch sinnvoll?
                          </p>
                          <div className="bg-primary/5 p-4 rounded-lg">
                            <strong>Ansatz:</strong> Statt „Wir brauchen Digitalisierung", lieber: „Wir lösen dieses konkrete Problem."
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="analyse">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center space-x-3">
                          <Cog className="w-6 h-6 text-primary" />
                          <div>
                            <h3 className="font-semibold text-lg">2. Systemische Analyse</h3>
                            <p className="text-sm text-muted-foreground">Wie funktioniert Ihre Organisation heute wirklich?</p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-4">
                          <p className="mb-4">
                            Entscheidungsarchitekturen, implizite Hürden, Machtverhältnisse sichtbar machen.
                          </p>
                          <div className="bg-primary/5 p-4 rounded-lg">
                            <strong>Ergebnis:</strong> Klares Bild der organisationalen Ausgangslage und Erfolgsfaktoren.
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="pilotieren">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center space-x-3">
                          <Lightbulb className="w-6 h-6 text-primary" />
                          <div>
                            <h3 className="font-semibold text-lg">3. Pilotieren & Prototypisieren</h3>
                            <p className="text-sm text-muted-foreground">Kleine Schritte, reale Tests, schnelle Erkenntnisse</p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-4">
                          <p className="mb-4">
                            Experimentierfelder statt Excel-Projektpläne.
                          </p>
                          <div className="bg-primary/5 p-4 rounded-lg">
                            <strong>Vorteil:</strong> Frühes Lernen und Anpassung vor großen Investitionen.
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="anpassen">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center space-x-3">
                          <Anchor className="w-6 h-6 text-primary" />
                          <div>
                            <h3 className="font-semibold text-lg">4. Rollen & Prozesse anpassen</h3>
                            <p className="text-sm text-muted-foreground">Technik allein verändert nichts</p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-4">
                          <p className="mb-4">
                            Neue Abläufe, klare Zuständigkeiten, weniger Reibung.
                          </p>
                          <div className="bg-primary/5 p-4 rounded-lg">
                            <strong>Fokus:</strong> Menschen und Strukturen für neue Arbeitsweisen befähigen.
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="verankern">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center space-x-3">
                          <TrendingUp className="w-6 h-6 text-primary" />
                          <div>
                            <h3 className="font-semibold text-lg">5. Veränderung verankern</h3>
                            <p className="text-sm text-muted-foreground">Für nachhaltige Wirkung und echtes Lernen</p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-4">
                          <p className="mb-4">
                            Kommunikation, Beteiligung, Feedbackräume – für nachhaltige Wirkung und echtes Lernen.
                          </p>
                          <div className="bg-primary/5 p-4 rounded-lg">
                            <strong>Ziel:</strong> Digitalisierung wird zur selbstverständlichen Organisationspraxis.
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                {/* Typische Szenarien */}
                <div className="mb-16">
                  <Card className="bg-gradient-to-r from-accent/10 to-primary/10">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold mb-6 text-center">Typische Szenarien, bei denen wir helfen:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <span>Ein Digitalprojekt steht kurz vor dem Start – aber niemand weiß, ob die Organisation bereit ist.</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <span>Eine neue Software wurde eingeführt – aber sie wird nicht genutzt.</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <span>Die IT ist fertig – aber die Arbeitsweise ist wie vorher.</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <span>Die Geschäftsführung will „agil" – das Team fragt sich: „Was heißt das für uns?"</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Projektbegleitung mit Haltung */}
                <div className="mb-16">
                  <Card>
                    <CardContent className="p-8 text-center">
                      <h3 className="text-2xl font-bold mb-6">Projektbegleitung mit Haltung</h3>
                      <p className="text-lg text-muted-foreground mb-4 max-w-3xl mx-auto">
                        Wir sehen uns nicht als „IT-Berater", sondern als Brückenbauer zwischen Technik, Organisation und Mensch.
                      </p>
                      <p className="text-lg text-muted-foreground mb-4 max-w-3xl mx-auto">
                        Unsere Aufgabe: Verwirrung reduzieren, Entscheidbarkeit erhöhen, Veränderung anschlussfähig machen.
                      </p>
                      <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Und wenn mal gar nichts geht? Sagen wir es ehrlich. Auch das gehört zu guter Projektbegleitung.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* 5 Schritte Erfolgsmodell für Digitalisierung */}
                <div className="mb-16">
                  <h2 className="text-3xl font-bold text-center mb-8">Unser Erfolgsmodell: In fünf Schritten zur wirksamen Digitalisierung</h2>
                  <p className="text-lg text-muted-foreground text-center mb-12">
                    Digitale Projekte entfalten ihre Wirkung nicht durch Technik allein – sondern durch Klarheit, 
                    Beteiligung und Umsetzungsstärke. Deshalb begleiten wir Ihre Vorhaben in fünf strukturierten, 
                    aber flexiblen Schritten:
                  </p>
                  <div className="flex flex-col items-center max-w-2xl mx-auto space-y-6">
                    {[
                      {
                        step: "1. Verstehen",
                        description: "Wir analysieren den organisationalen Kontext: Wo steht Ihre Organisation wirklich? Welche impliziten Dynamiken wirken? Wo liegen Hürden – und wo Potenziale?",
                        icon: <Lightbulb className="w-8 h-8 text-primary" />
                      },
                      {
                        step: "2. Fokussieren", 
                        description: "Gemeinsam klären wir Ziele, Prioritäten und Wirklogiken. Was soll das Projekt bewirken – und für wen? Damit Digitalvorhaben nicht zum Selbstzweck werden.",
                        icon: <Target className="w-8 h-8 text-primary" />
                      },
                      {
                        step: "3. Gestalten",
                        description: "Wir entwickeln konkrete Umsetzungspfade, Pilotprojekte und Rollenklarheit. Nicht alles auf einmal – sondern das Richtige zuerst.",
                        icon: <Cog className="w-8 h-8 text-primary" />
                      },
                      {
                        step: "4. Verankern",
                        description: "Veränderung braucht Anschluss: an Kultur, Prozesse und Entscheidungswege. Wir sorgen dafür, dass neue Arbeitsweisen auch wirklich greifen.",
                        icon: <Anchor className="w-8 h-8 text-primary" />
                      },
                      {
                        step: "5. Wirksam werden",
                        description: "Wir messen Wirkung statt nur Fortschritt. Lernen, justieren, weiterentwickeln – bis das Projekt seinen vollen Nutzen entfaltet.",
                        icon: <TrendingUp className="w-8 h-8 text-primary" />
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex flex-col items-center w-full">
                        <Card className="w-full text-center">
                          <CardContent className="p-6">
                            <div className="mb-4 flex justify-center">{item.icon}</div>
                            <h3 className="font-semibold text-lg mb-3">{item.step}</h3>
                            <p className="text-muted-foreground">{item.description}</p>
                          </CardContent>
                        </Card>
                        {index < 4 && (
                          <div className="my-4 flex justify-center">
                            <ArrowRight className="w-6 h-6 text-muted-foreground/50 rotate-90" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Additional Content for Datenschutz */}
            {slug === 'datenschutz' && (
              <>
                {/* Unser Ansatz */}
                <div className="mb-16">
                  <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
                    <CardContent className="p-8">
                      <h2 className="text-3xl font-bold text-center mb-6">Unser Ansatz: Pragmatik trifft Verantwortung</h2>
                      <p className="text-lg text-muted-foreground mb-6 text-center max-w-3xl mx-auto">
                        Wir setzen nicht auf Angst oder Drohkulissen. Sondern auf Klarheit, Struktur und Lösungen, die wirklich funktionieren. 
                        Unsere Unterstützung beginnt nicht beim Paragrafen – sondern bei den konkreten Herausforderungen in Ihrer Organisation:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <span>Wer hat wann worauf Zugriff – und warum?</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <span>Wie gut sind sensible Informationen wirklich geschützt?</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <span>Welche Risiken existieren – organisatorisch, technisch, menschlich?</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <span>Und was bedeutet „Datenschutz by Design" konkret für unsere Prozesse?</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-primary font-semibold">
                          Wir verbinden jurisches Grundverständnis mit systemischem Denken und technischem Know-how.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Typische Einsatzszenarien */}
                <div className="mb-16">
                  <h2 className="text-3xl font-bold text-center mb-8">Typische Einsatzszenarien</h2>
                  <Card>
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-semibold mb-6 text-center">Unsere Kunden kommen zu uns, wenn …</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <span>neue Software eingeführt wird – und unklar ist, wie datenschutzkonform sie wirklich ist.</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <span>eine DSFA notwendig wird – aber niemand weiß, wo man anfangen soll.</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <span>ein digitales Projekt stockt, weil die IT-Sicherheit oder der DSB bremsen.</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <span>das Thema Datenschutz auf dem Papier gelöst ist – aber im Alltag keiner damit umgehen kann.</span>
                        </div>
                        <div className="flex items-start space-x-3 md:col-span-2 md:justify-center">
                          <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <span>Unsicherheiten gegenüber externen Partnern (Cloud-Anbieter, Tools, Plattformen) bestehen.</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Unsere Leistungen */}
                <div className="mb-16">
                  <h2 className="text-3xl font-bold text-center mb-8">Unsere Leistungen im Überblick</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      "Datenschutz-Folgenabschätzungen (DSFA)",
                      "Begleitung bei Auftragsverarbeitungsverträgen & Tool-Einsatz",
                      "Sensibilisierung & Workshops für Teams und Führung",
                      "Strukturierte Informationssicherheitskonzepte (ISMS-Light)",
                      "Beratung zu Rollen, Zugriffen, Berechtigungen & Verantwortlichkeiten",
                      "Risikobewertungen im Projektkontext (insb. bei KI, Mobilität, Plattformen)"
                    ].map((leistung, index) => (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                            <span className="font-medium">{leistung}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Haltung */}
                <div className="mb-16">
                  <Card className="bg-gradient-to-r from-accent/10 to-primary/10">
                    <CardContent className="p-8 text-center">
                      <h3 className="text-2xl font-bold mb-6">Haltung</h3>
                      <p className="text-lg text-muted-foreground mb-4 max-w-3xl mx-auto">
                        Wir verstehen Datenschutz nicht als "Verhinderungsabteilung", sondern als Schutzraum für gute Entscheidungen.
                      </p>
                      <p className="text-lg text-muted-foreground mb-4 max-w-3xl mx-auto">
                        Unsere Aufgabe: Risiken sichtbar machen, Handlungsfähigkeit erhalten – und Vertrauen stärken.
                      </p>
                      <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Wir helfen Organisationen, Verantwortung zu übernehmen – ohne sich zu verlieren.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* 5 Schritte Erfolgsmodell für Datenschutz */}
                <div className="mb-16">
                  <h2 className="text-3xl font-bold text-center mb-8">Unser Erfolgsmodell: In fünf Schritten zu pragmatischem Datenschutz</h2>
                  <p className="text-lg text-muted-foreground text-center mb-12">
                    Datenschutz und Informationssicherheit sind kein Selbstzweck – sondern Bausteine für wirksame Organisationen. 
                    Wir begleiten Sie dabei in fünf strukturierten Schritten:
                  </p>
                  <div className="flex flex-col items-center max-w-2xl mx-auto space-y-6">
                    {[
                      {
                        step: "1. Verstehen",
                        description: "Analyse des organisatorischen und technischen Kontexts: Was ist wirklich relevant? Welche Anforderungen gelten – und was ist sinnvoll?",
                        icon: <Lightbulb className="w-8 h-8 text-primary" />
                      },
                      {
                        step: "2. Fokussieren", 
                        description: "Wir identifizieren kritische Risiken, klären Rollen & Verantwortlichkeiten und priorisieren Handlungsfelder.",
                        icon: <Target className="w-8 h-8 text-primary" />
                      },
                      {
                        step: "3. Gestalten",
                        description: "Konkrete Maßnahmen, Regeln und Kommunikationsstrukturen – passgenau zur Organisation.",
                        icon: <Cog className="w-8 h-8 text-primary" />
                      },
                      {
                        step: "4. Verankern",
                        description: "Schulungen, Rollenklarheit, Prozesse und technische Umsetzungen – so, dass Schutz nicht nur auf dem Papier existiert.",
                        icon: <Anchor className="w-8 h-8 text-primary" />
                      },
                      {
                        step: "5. Wirksam werden",
                        description: "Regelmäßige Überprüfung, Evaluation, Weiterentwicklung – pragmatisch und auf Augenhöhe.",
                        icon: <TrendingUp className="w-8 h-8 text-primary" />
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex flex-col items-center w-full">
                        <Card className="w-full text-center">
                          <CardContent className="p-6">
                            <div className="mb-4 flex justify-center">{item.icon}</div>
                            <h3 className="font-semibold text-lg mb-3">{item.step}</h3>
                            <p className="text-muted-foreground">{item.description}</p>
                          </CardContent>
                        </Card>
                        {index < 4 && (
                          <div className="my-4 flex justify-center">
                            <ArrowRight className="w-6 h-6 text-muted-foreground/50 rotate-90" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="text-center">
              <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">
                    Interessiert an einer Zusammenarbeit?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Lassen Sie uns in einem kostenlosen Erstgespräch besprechen, 
                    wie wir Ihr Projekt zum Erfolg führen können.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" onClick={handleContactClick}>
                      {slug === 'strategie' && 'Jetzt Erstgespräch vereinbaren'}
                      {slug === 'projektbegleitung' && 'Projekt begleiten lassen'}
                      {slug === 'datenschutz' && 'Datenschutz anpacken'}
                      {slug === 'prozessberatung' && 'Jetzt Verwaltungsberatung starten'}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    <Button variant="outline" size="lg" onClick={handleConfiguratorOpen}>
                      Bedarfsanalyse starten
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
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

export default ServiceDetail;