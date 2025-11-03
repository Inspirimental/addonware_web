import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowRight, X, Target, Zap, Users, TrendingUp, TestTube, FileText, Users2, Quote, Factory, Heart, Bus, FolderOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Configurator } from "@/components/Configurator";
import { useCaseStudies } from "@/hooks/useCaseStudies";
import { supabase } from "@/integrations/supabase/client";

const FachbereicheSmarteProjekte = () => {
  const navigate = useNavigate();
  const [showConfigurator, setShowConfigurator] = useState(false);
  const { caseStudies, isLoading } = useCaseStudies();
  const [questionnaireTitle, setQuestionnaireTitle] = useState<string>("Reifegrad-Check Digitalisierung");
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [joergImage, setJoergImage] = useState<string | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const digitalizationCases = caseStudies.filter(cs =>
    cs.tags?.includes('digitalization') || cs.tags?.includes('transformation')
  );

  const cards = [
    {
      icon: Factory,
      title: "Digitale Produktion & Smart Factory",
      description: "Smarte Produktionsprozesse, Live-Daten aus der Fertigung und vernetzte Systeme, die helfen, Material, Energie und Zeit zu sparen.",
      example: "Beispiel: Maschinendaten in Echtzeit, Rüstzeitenverkürzung, Nachkalkulation automatisieren"
    },
    {
      icon: Heart,
      title: "Pflege & Gesundheit digital unterstützen",
      description: "Software, die Pflegekräfte entlastet, Doppelarbeit vermeidet und medizinische Qualität stärkt – ohne den Menschen aus dem Blick zu verlieren.",
      example: "Beispiel: Digitale Fallakte, intelligente Schichtplanung, mobile Dokumentation"
    },
    {
      icon: Bus,
      title: "Smarte Mobilität & vernetzte Dienste",
      description: "Wenn Verkehr, Logistik oder ÖPNV intelligenter werden sollen, braucht es mehr als Sensorik: strukturierte Daten, klare Steuerung und nutzerfreundliche Lösungen.",
      example: "Beispiel: L4-Pilotprojekt, Routenoptimierung, digitale Nutzerportale"
    },
    {
      icon: FolderOpen,
      title: "Verwaltung vereinfachen & Prozesse automatisieren",
      description: "Digitale Workflows, automatisierte Freigaben, transparente Akten – wir machen Verwaltung wieder handlungsfähig und anschlussfähig.",
      example: "Beispiel: Rechnungseingang, Fördermittelverwaltung, Bürgerportale"
    }
  ];

  useEffect(() => {
    const loadQuestionnaireData = async () => {
      try {
        const { data: questionnaire, error: questionnaireError } = await supabase
          .from("questionnaires")
          .select("id, title")
          .eq("slug", "digitalisierung")
          .eq("is_active", true)
          .single();

        if (questionnaireError || !questionnaire) {
          console.error("Error loading questionnaire:", questionnaireError);
          return;
        }

        setQuestionnaireTitle(questionnaire.title);

        const { data: questions, error: questionsError } = await supabase
          .from("questionnaire_questions")
          .select("id")
          .eq("questionnaire_id", questionnaire.id);

        if (questionsError) {
          console.error("Error loading questions:", questionsError);
          return;
        }

        setQuestionCount(questions?.length || 0);
      } catch (error) {
        console.error("Error loading questionnaire data:", error);
      }
    };

    const loadJoergImage = async () => {
      try {
        const { data, error } = await supabase
          .from("employees_public")
          .select("image_url")
          .eq("name", "Jörg Flügge")
          .single();

        if (!error && data?.image_url) {
          setJoergImage(data.image_url);
        }
      } catch (error) {
        console.error("Error loading Jörg image:", error);
      }
    };

    loadQuestionnaireData();
    loadJoergImage();
  }, []);

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
              src="https://pouyacqshyiqbczmypvd.supabase.co/storage/v1/object/public/images/1762164865123-cigo.webp"
              alt="Fachbereiche & Smarte Projekte"
              className="w-full h-full object-cover object-right"
              loading="eager"
              fetchpriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-[1.2] tracking-tight">
                Fachbereiche &<br />
                Smarte Projekte
              </h1>

              <p className="text-xl md:text-2xl text-primary mb-8 font-light">
                Veränderung dort starten, wo sie wirklich gebraucht wird.
              </p>

              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
                Digitale Transformation zeigt ihre Wirkung nicht in der Cloud – sondern im Alltag.
                Wir unterstützen Unternehmen dabei, Ideen in konkrete Projekte zu überführen, die Prozesse vereinfachen, Mitarbeitende entlasten und Potenziale freisetzen.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-[200px_1fr] gap-8 md:gap-12 items-center">
                <div className="flex justify-center md:justify-start">
                  {joergImage ? (
                    <img
                      src={joergImage}
                      alt="Jörg Flügge, Berater für digitale Transformationsprojekte bei Addonware"
                      className="w-48 h-48 md:w-full md:h-auto aspect-square object-cover rounded-full shadow-md"
                    />
                  ) : (
                    <div className="w-48 h-48 md:w-full md:h-auto aspect-square rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center shadow-md">
                      <span className="text-slate-500 dark:text-slate-400 text-sm">Jörg Flügge</span>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <blockquote className="text-lg md:text-xl text-slate-800 dark:text-slate-200 leading-relaxed">
                    <p className="mb-4">
                      Wir schicken keine Beraterarmee und schreiben auch keine hundertseitigen Lastenhefte. Entscheidend ist, die richtigen Hebel im Alltag zu finden – mit den Menschen, die den Betrieb am Laufen halten: in der Fertigung, der Verwaltung oder im Gesundheitswesen.
                    </p>
                  </blockquote>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Jörg Flügge
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Berater für digitale Transformationsprojekte
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
                  Warum das Thema entscheidend ist
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  Digitale Vorhaben scheitern oft nicht an Technik – sondern daran, dass kein echtes Projekt daraus wird.
                  Wir helfen dabei, aus guten Ideen echte Wirkung zu machen: mit Fokus, Klarheit und passender Umsetzung.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-16">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                        Nicht jede Idee ist ein Projekt
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        Ideen gibt es viele. Wir helfen, sie mit Aufwand-Nutzen-Blick realistisch einzuordnen – und holen die Menschen im Prozess mit ab.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                        Wirksamkeit schlägt Vision
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        Jede Präsentation sieht erstmal gut aus. Aber erst in der Umsetzung zeigt sich, ob ein Projekt trägt.
                        Wir sorgen dafür, dass die Umsetzung anschlussfähig wird.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                        Fachbereiche brauchen Autonomie
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        Wenn Entscheidungen immer über fünf Tische gehen müssen, wird Digitalisierung zum Bremsklotz.
                        Wir helfen, Entscheidungsräume dort zu schaffen, wo sie gebraucht werden.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                        Transformation braucht Rückenwind
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        Ein Projekt braucht nicht nur Budget – sondern auch jemanden, der dahintersteht.
                        Wir helfen, interne Projektverantwortung und Führung zusammenzubringen.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-20 mb-12">
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  Der richtige Aufwand-Nutzen-Blick
                </h3>
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  Nicht jede Idee verdient die gleiche Aufmerksamkeit. Wir helfen Ihnen, digitale Vorhaben in vier Kategorien einzuordnen.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="order-2 md:order-1">
                  <img
                    src="https://pouyacqshyiqbczmypvd.supabase.co/storage/v1/object/public/images/1762160173845-xwr39k.webp"
                    alt="Aufwand-Nutzen-Matrix: Quick Wins, Schlüsselprojekte, Lückenfüller, Zeitfresser"
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
                <div className="order-1 md:order-2 space-y-4">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <strong className="text-slate-900 dark:text-slate-100">Quick Wins:</strong>
                        <span className="text-slate-600 dark:text-slate-400"> Schnelle Erfolge mit geringem Aufwand – perfekt für den Einstieg</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <strong className="text-slate-900 dark:text-slate-100">Schlüsselprojekte:</strong>
                        <span className="text-slate-600 dark:text-slate-400"> Hoher Nutzen rechtfertigt den Aufwand – strategische Priorität</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-slate-400 rounded-full mt-2"></div>
                      <div>
                        <strong className="text-slate-900 dark:text-slate-100">Lückenfüller:</strong>
                        <span className="text-slate-600 dark:text-slate-400"> Nett zu haben, aber keine Priorität</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div>
                        <strong className="text-slate-900 dark:text-slate-100">Zeitfresser:</strong>
                        <span className="text-slate-600 dark:text-slate-400"> Hoher Aufwand bei geringem Nutzen – besser vermeiden</span>
                      </div>
                    </li>
                  </ul>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed pt-2">
                    Mit dieser Methode fokussieren wir uns auf das Wesentliche und sorgen dafür, dass Ihre Ressourcen dort eingesetzt werden, wo sie den größten Impact erzielen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-50 dark:bg-slate-800">
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
                    „Unsere digitalen Werkzeuge senken den Energieverbrauch, optimieren Personal- und Materialeinsatz und koordinieren das Rohstoff-Recycling."
                  </blockquote>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                    — Enrico Jakusch, Geschäftsführer, Jakusch Drehtechnik GmbH
                  </p>
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                      Digitalisierung ist kein Selbstzweck. Wenn sie konkret wird, spart sie Ressourcen, schont Nerven – und stärkt den Geschäftserfolg. Wir helfen Fachbereichen, genau solche Projekte zu identifizieren und umzusetzen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                  Was wir tun
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                  Wir bringen Bewegung in Ihre Digitalisierung – dort, wo sie gebraucht wird: im Alltag der Fachbereiche. Ob Verwaltung, Produktion oder Pflege – wir identifizieren Projekte, die echten Nutzen stiften, keine Dauerbaustellen sind und Ihre Organisation wirklich weiterbringen.
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
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-auto">
                          → {card.example}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Horizontal Slider */}
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

        {!isLoading && digitalizationCases.length > 0 && (
          <section className="py-20 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-slate-900 dark:text-slate-100">
                  Aus der Praxis
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {digitalizationCases.slice(0, 2).map((caseStudy) => (
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
                    Wo steht Ihre Digitalisierung heute?
                  </h2>
                  <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                    Mit unserem {questionnaireTitle} können Sie in {questionCount} Fragen schnell prüfen,
                    wo Ihre Organisation steht. Wir bieten Ihnen zwei bewährte Einstiegswege:
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-primary transition-colors">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg">
                        <TestTube className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">{questionnaireTitle}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          Verschaffen Sie sich Klarheit über den Status Quo Ihrer Digitalisierung.
                          Kostenlos und in wenigen Minuten.
                        </p>
                      </div>
                    </div>
                    <Button
                      size="lg"
                      onClick={() => navigate("/umfrage/digitalisierung")}
                      className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                    >
                      Jetzt Reifegrad testen
                      <ArrowRight className="ml-2 h-4 w-4" />
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
                          Direkter Austausch auf Augenhöhe. Gemeinsam entwickeln wir Lösungen für Ihre
                          strategischen Herausforderungen.
                        </p>
                      </div>
                    </div>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => navigate("/contact")}
                      className="w-full border-2"
                    >
                      Gespräch vereinbaren
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-center pt-6 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Sie suchen weitere Informationen zu spezifischen Themen?
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

export default FachbereicheSmarteProjekte;
