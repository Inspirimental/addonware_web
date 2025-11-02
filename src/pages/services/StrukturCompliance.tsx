import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowRight, X, ShieldCheck, FileText, Network, Scale, TestTube, ChevronLeft, ChevronRight, Lock, Users2, Quote } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Configurator } from "@/components/Configurator";
import { useCaseStudies } from "@/hooks/useCaseStudies";
import { supabase } from "@/integrations/supabase/client";

const StrukturCompliance = () => {
  const navigate = useNavigate();
  const [showConfigurator, setShowConfigurator] = useState(false);
  const { caseStudies, isLoading } = useCaseStudies();
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const complianceCases = caseStudies.filter(cs =>
    cs.tags?.includes('compliance') || cs.tags?.includes('security') || cs.tags?.includes('structure')
  );

  const cards = [
    {
      icon: ShieldCheck,
      title: "Datenschutz & Datensouveränität",
      description: "DSGVO, revDSG, ISO 27701 – aber verständlich. Wir helfen, Datenschutz machbar zu machen – und in Prozesse zu integrieren.",
      link: "/services/struktur-compliance/datenschutz"
    },
    {
      icon: Lock,
      title: "Informationssicherheit & IT-Grundschutz",
      description: "BSI-konform denken, pragmatisch umsetzen: Wir verankern IT-Sicherheit in der Organisation.",
      link: "/services/struktur-compliance/it-sicherheit"
    },
    {
      icon: Network,
      title: "Business Continuity & Notfallmanagement",
      description: "Ob Ausfall oder Angriff – wir helfen, vorbereitet zu sein. BCM und IT-Notfallprozesse, die realistisch und wirksam sind.",
      link: "/services/struktur-compliance/business-continuity"
    },
    {
      icon: Scale,
      title: "Compliance & Lieferkette",
      description: "Sorgfaltspflichten ernst nehmen – ohne den Betrieb zu lähmen. Wir helfen, Prozesse anzupassen und Berichtspflichten sauber zu erfüllen.",
      link: "/services/struktur-compliance/lieferkette"
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;

      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);

      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      setScrollProgress(progress);
    };

    const container = scrollContainerRef.current;
    if (container) {
      handleScroll();
      container.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);

      return () => {
        container.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 350;
    const newScrollLeft = direction === 'left'
      ? scrollContainerRef.current.scrollLeft - scrollAmount
      : scrollContainerRef.current.scrollLeft + scrollAmount;

    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const handleSliderPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDraggingSlider(true);
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    updateScrollFromSliderPosition(e);
  };

  const handleSliderPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingSlider) {
      updateScrollFromSliderPosition(e);
    }
  };

  const handleSliderPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDraggingSlider(false);
    const target = e.currentTarget;
    target.releasePointerCapture(e.pointerId);
  };

  const updateScrollFromSliderPosition = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));

    const { scrollWidth, clientWidth } = scrollContainerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    scrollContainerRef.current.scrollLeft = percentage * maxScroll;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation onConfiguratorOpen={() => setShowConfigurator(true)} />

      <main className="flex-1">
        <section className="relative min-h-[80vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://pouyacqshyiqbczmypvd.supabase.co/storage/v1/object/public/images/1761564224420-qme2i.webp"
              alt="Struktur & Compliance"
              className="w-full h-full object-cover object-right"
              loading="eager"
              fetchpriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-[1.2] tracking-tight">
                Digitale Souveränität &<br />
                Compliance
              </h1>

              <p className="text-xl md:text-2xl text-primary mb-8 font-light">
                Skalierung braucht einen Lageplan.
              </p>

              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
                Wer zuverlässig wachsen will, muss wissen, worauf er sich verlassen kann – bei Prozessen, Daten und Systemen. Wir helfen dabei, aus Ihren Daten digitale Produkte zu machen – Datenschutz und Compliance erledigen wir dabei gleich mit.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-[200px_1fr] gap-8 md:gap-12 items-center">
                <div className="flex justify-center md:justify-start">
                  <div className="w-48 h-48 md:w-full md:h-auto aspect-square rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center shadow-md">
                    <span className="text-slate-500 dark:text-slate-400 text-sm">Platzhalter PG</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <blockquote className="text-lg md:text-xl text-slate-800 dark:text-slate-200 leading-relaxed">
                    <p className="mb-4 italic text-xl md:text-2xl">
                      „Datenschutz, IT-Security, Datenstrategie – das klingt für viele wie ein nerviges Pflichtprogramm."
                    </p>
                    <p>
                      Doch wer seine Daten wirklich versteht, kann Prozesse verbessern, Kosten senken und machnmal sogar neue Geschäftsfelder erschließen.
                    </p>
                  </blockquote>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Pierre Gluth
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Berater für Business Continuity Management (BCM) bei Addonware
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-50 dark:bg-slate-800">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  Warum Digitale Souveränität & Compliance entscheidend ist
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  Compliance ist nicht das, was Fortschritt bremst – sondern das, was ihn absichert. Wir entwickeln Konzepte, wie man den Handlungsspielraum zwischen Regulierung und Produktivität optimal nutzen kann.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                        Datenschutz, der funktioniert
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        Die Datenschutzanforderungen rauben Ihnen den letzten Nerv? Wir bringen DSGVO, revDSG & Co. vom Papier in die Praxis – nicht als Checkliste, sondern als Teil der Organisation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                      <Scale className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                        Digitale Souveränität statt Abhängigkeit
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        Wissen Sie, wo Ihre Daten liegen – und wer darauf Zugriff hat? Genau das finden wir heraus und geben Ihnen Ihren Entscheidungsraum zurück.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                      <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                        Sicherheit mit System
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        Die Systeme werden komplexer – und damit auch die Angriffsflächen.
Wir setzen auf moderne IT-Sicherheit, die schützt, bevor sie bremst: Zero Trust, Notfallmanagement, Verschlüsselung & Co.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                      <Network className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                        Angst vor der Cloud?
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        Die Cloud-Diskussion von gestern hilft heute keinem weiter.
Wir finden die Lösung, die zu Ihnen passt – ob selbst gehostet, dediziert gemietet oder souverän integriert.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center border-2 border-primary/20">
                    <Quote className="w-12 h-12 md:w-16 md:h-16 text-primary" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="flex-1">
                  <blockquote className="text-xl md:text-2xl font-light text-slate-700 dark:text-slate-200 mb-4 italic leading-relaxed">
                    „Entscheidend ist nicht, ob wir digitale Tools nutzen – sondern wie bewusst wir das tun."
                  </blockquote>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                    — Stina Bakke-Jensen, Chefredakteurin, iTromsø
                  </p>
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                      Digitalisierung macht nur frei, wenn man weiß, was im Hintergrund läuft. Wer nicht in die Tiefe will, bleibt abhängig – wir bauen mit Ihnen Systeme, die heute entlasten – und morgen Innovation ermöglichen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-50 dark:bg-slate-800">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-slate-100">
                  Was wir tun
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                  Wir helfen Unternehmen, Ordnung ins Komplexe zu bringen.
                  Von Datenschutz bis Lieferkettensorgfalt, von Cloud-Strukturen bis IT-Resilienz – wir schaffen Rahmen, in denen Verantwortung greift.
                </p>
              </div>

              <div className="relative -mx-4 px-4">
                {showLeftArrow && (
                  <button
                    onClick={() => scroll('left')}
                    className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 shadow-lg transition-all duration-300 hover:scale-110"
                    aria-label="Vorherige Kacheln"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-slate-200" />
                  </button>
                )}

                {showRightArrow && (
                  <button
                    onClick={() => scroll('right')}
                    className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 shadow-lg transition-all duration-300 hover:scale-110"
                    aria-label="Nächste Kacheln"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800 dark:text-slate-200" />
                  </button>
                )}

                {showLeftArrow && (
                  <div className="hidden md:block absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />
                )}

                {showRightArrow && (
                  <div className="hidden md:block absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />
                )}

                <div
                  ref={scrollContainerRef}
                  className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth mb-16"
                >
                  {cards.map((card, index) => (
                    <Card
                      key={index}
                      className="flex-shrink-0 w-[280px] md:w-[320px] border-2 hover:border-primary transition-all hover:shadow-lg group snap-start bg-white dark:bg-slate-800 dark:border-slate-700 flex flex-col"
                    >
                      <CardContent className="pt-6 flex flex-col flex-1">
                        <card.icon className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                        <h3 className="text-lg font-semibold mb-3 text-slate-900 dark:text-slate-100">
                          {card.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 flex-1">
                          {card.description}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-auto"
                          onClick={() => navigate(card.link)}
                        >
                          Mehr erfahren
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="max-w-md mx-auto mt-8 px-4">
                  <div
                    ref={sliderRef}
                    className="relative h-2 w-full cursor-pointer rounded-full bg-secondary"
                    onPointerDown={handleSliderPointerDown}
                    onPointerMove={handleSliderPointerMove}
                    onPointerUp={handleSliderPointerUp}
                    onPointerCancel={handleSliderPointerUp}
                  >
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-primary shadow-md transition-transform ${
                        isDraggingSlider ? 'scale-125' : 'scale-100'
                      }`}
                      style={{
                        left: `calc(${scrollProgress * 100}% - 8px)`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {!isLoading && complianceCases.length > 0 && (
          <section className="py-20 bg-slate-50 dark:bg-slate-800">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-slate-900 dark:text-slate-100">
                  Aus der Praxis
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {complianceCases.slice(0, 2).map((caseStudy) => (
                    <Card
                      key={caseStudy.id}
                      className="border-2 hover:border-primary transition-all hover:shadow-lg cursor-pointer bg-white dark:bg-slate-900 dark:border-slate-700"
                      onClick={() => navigate(`/case-studies/${caseStudy.slug}`)}
                    >
                      <CardContent className="pt-6">
                        <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
                          {caseStudy.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                          {caseStudy.excerpt}
                        </p>
                        <Button variant="link" className="p-0 h-auto text-primary">
                          Zum Case <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="py-20 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-slate-100">
                    Wie steht es um Ihre Strukturen?
                  </h2>
                  <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                    Ein Reifegrad-Check für den Bereich Struktur & Compliance ist in Vorbereitung.
                    Bis dahin stehen wir Ihnen gerne für ein persönliches Gespräch zur Verfügung.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-primary transition-colors">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg">
                        <TestTube className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Reifegrad-Check</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          Bald verfügbar: Prüfen Sie den Status Ihrer Compliance- und Sicherheitsstrukturen.
                        </p>
                      </div>
                    </div>
                    <Button
                      size="lg"
                      variant="outline"
                      disabled
                      className="w-full"
                    >
                      In Vorbereitung
                    </Button>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-primary transition-colors">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg">
                        <Users2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Beratungsgespräch</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          Sprechen Sie direkt mit unseren Experten über Ihre spezifischen Anforderungen.
                        </p>
                      </div>
                    </div>
                    <Button
                      size="lg"
                      onClick={() => navigate("/contact")}
                      className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                    >
                      Gespräch vereinbaren
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-center pt-6 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Sie suchen weitere Informationen zu spezifischen Compliance-Themen?
                  </p>
                  <Button
                    variant="link"
                    onClick={() => navigate("/contact")}
                    className="text-primary"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Whitepaper & Vertiefungen anfragen
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <Dialog open={showConfigurator} onOpenChange={setShowConfigurator}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => setShowConfigurator(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          <Configurator />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StrukturCompliance;
