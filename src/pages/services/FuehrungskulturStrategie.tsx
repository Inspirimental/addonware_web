import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowRight, X, Target, Network, MessageSquare, Users2, FileText, TestTube, ChevronLeft, ChevronRight, Zap, Users, TrendingUp, Quote } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Configurator } from "@/components/Configurator";
import { useCaseStudies } from "@/hooks/useCaseStudies";
import { supabase } from "@/integrations/supabase/client";

const FuehrungskulturStrategie = () => {
  const navigate = useNavigate();
  const [showConfigurator, setShowConfigurator] = useState(false);
  const { caseStudies, isLoading } = useCaseStudies();
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [questionnaireTitle, setQuestionnaireTitle] = useState<string>("Reifegrad-Check");
  const [questionCount, setQuestionCount] = useState<number>(10);

  const leadershipCases = caseStudies.filter(cs =>
    cs.tags?.includes('leadership') || cs.tags?.includes('strategy')
  );

  const cards = [
    {
      icon: Target,
      title: "Zielbild-Entwicklung",
      description: "Gemeinsam erarbeiten wir ein realistisches, anschlussfähiges Zielbild – als strategischer Fixstern für Entscheidungen.",
      link: "/services/fuehrungskultur-strategie/zielbild-entwicklung"
    },
    {
      icon: Network,
      title: "Entscheidungsarchitektur",
      description: "Wer trifft was, wann, mit wem? Wir gestalten Entscheidungswege so, dass Verantwortung wächst – nicht Bürokratie.",
      link: "/services/fuehrungskultur-strategie/entscheidungsarchitektur"
    },
    {
      icon: MessageSquare,
      title: "Feedback- & Meetingkultur",
      description: "Regelmäßiger Dialog statt Flurfunk: Wir helfen, Meetings produktiv und Feedback wirksam zu machen.",
      link: "/services/fuehrungskultur-strategie/feedback-meetingkultur"
    },
    {
      icon: Users2,
      title: "Sparring für Geschäftsführung",
      description: "Als externe Gesprächspartner bieten wir Reflexion, strategisches Gegenüber und klare Sparrings auf Augenhöhe.",
      link: "/services/fuehrungskultur-strategie/sparring-geschaeftsfuehrung"
    }
  ];

  useEffect(() => {
    const loadQuestionnaireData = async () => {
      try {
        const { data: questionnaire, error: questionnaireError } = await supabase
          .from("questionnaires")
          .select("id, title")
          .eq("slug", "fuehrung")
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

    loadQuestionnaireData();
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
              src="https://pouyacqshyiqbczmypvd.supabase.co/storage/v1/object/public/images/1761564221762-duwsgl.webp"
              alt="Führungskultur & Strategie"
              className="w-full h-full object-cover object-right"
              loading="eager"
              fetchpriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-[1.2] tracking-tight">
                Führungskultur & Strategie
              </h1>

              <p className="text-xl md:text-2xl text-primary mb-8 font-light">
                Gute Führung heißt:<br />Entscheidungen trifft der Chef!
              </p>

              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
                Mit dieser Einstellung wundern Sie sich bitte nicht, wenn Sie Ihre Teams nicht mehr erreichen. Wir helfen Ihnen lieber, Entscheidungsarchitekturen aufzubauen, die mitziehen statt ausbremsen.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-[200px_1fr] gap-8 md:gap-12 items-center">
                <div className="flex justify-center md:justify-start">
                  <img
                    src="https://pouyacqshyiqbczmypvd.supabase.co/storage/v1/object/public/images/1761564255576-fw45pj.png"
                    alt="Tim Beck, Geschäftsführer & Sparringspartner bei Addonware"
                    className="w-48 h-48 md:w-full md:h-auto aspect-square object-cover rounded-full shadow-md"
                  />
                </div>

                <div className="space-y-6">
                  <blockquote className="text-lg md:text-xl text-slate-800 dark:text-slate-200 leading-relaxed">
                    <p className="mb-4">
                      Viele Inhaber:innen und Geschäftsführer:innen sagen uns:<br />
                      <span className="italic text-xl md:text-2xl">„Ich bin der Einzige, der hier noch mitdenkt."</span>
                    </p>
                    <p>
                      Wir kennen dieses Gefühl. Und genau deshalb setzen wir da an, wo Meetings mehr Zeit kosten als sie bringen, wo Entscheidungen im Kreis laufen, und wo am Ende niemand mehr versteht, wo eigentlich die Prioritäten liegen.
                    </p>
                  </blockquote>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Tim Beck
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Geschäftsführer & Sparringspartner bei Addonware
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
                  Warum gute Führung heutzutage den Unterschied macht
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  Wenn keiner mehr so richtig weiß, worum's gerade geht, fängt man an, lauter zu werden – oder alles selbst zu machen.
                  Doch wie gibt man als Führungsspitze wieder Orientierung und schafft ein gemeinsames Verständnis?
                  Genau da setzen wir an: im Führungsteam, im Alltag – und dazwischen.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                        Kennen wirklich alle das Ziel?
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        Gute Leute haben meist eigene Ziele – nur passen die nicht immer zum Unternehmen.
                        Wir schaffen die Transparenz, die es braucht, sodass alle Mitarbeitenden in dieselbe Richtung laufen.
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
                        Struktur entlastet – wenn sie funktioniert
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        Gute Entscheidungen brauchen keine Extra-Meetings, sondern klare Spielregeln. Eine klug gebaute Struktur schafft Entlastung – wenn sie flexibel ist, verstanden wird und im Alltag trägt.
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
                        Wer mitreden darf, bremst nicht
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        Viele Mitarbeitende wissen ganz genau, was besser laufen könnte – aber keiner fragt sie. Wir schaffen pragmatische Wege, wie Beteiligung direkt in Effizienzsteigerung mündet.
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
                        Weniger Frust, mehr Verantwortung
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        Wenn Führung alles selbst umsetzt, bleibt das Team in der Zuschauerrolle – und verliert die Motivation. Gute Führung erzeugt Selbstverantwortung.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-50 dark:bg-slate-800">
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
                    „Wenn Dein Team ohne Dich nicht funktioniert, hast Du nichts gewonnen – Du hast versagt."
                  </blockquote>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                    — Bernhard Vogler, Soziologe, via brand eins
                  </p>
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                      Gute Führung bedeutet, sich entbehrlich zu machen – nicht überflüssig.
                      Wir helfen, Strukturen zu schaffen, die auch dann halten, wenn die Führungskraft mal nicht präsent ist.
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
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-slate-100">
                  Was wir tun
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                  Wir helfen Führungskräften, ihren Kurs zu finden und das Team mitzunehmen. Denn Führung ist kein Bauchgefühl – sondern ein Handwerk.
                  Wir unterstützen Sie dabei, Rollen zu klären, Entscheidungen besser zu treffen und Führung im beruflichen Alltag zu verankern.
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

        <section className="py-16 bg-slate-50 dark:bg-slate-800">
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
                    „Die Organisation kocht auf vielen Ebenen – und die Kunst ist, die richtigen Momente zu erkennen, in denen alles zusammenpasst."
                  </blockquote>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                    — frei nach Frank Weber zur „Neuen Klasse", BMW
                  </p>
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                      Wir helfen Dir, diese Momente zu sehen – und sie zu nutzen.
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
              <div className="grid md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-2">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-slate-100">
                    Was wir anders machen
                  </h2>
                  <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
                    <p>
                      Für uns ist Führung kein Titel. Führung bedeutet Verantwortung.
                      In vielen Organisationen ist das Potenzial von Führungskräften durch Unsicherheit, Silodenken oder Mikromanagement blockiert.
                      Und wo Führung blockiert ist, bleibt auch die Organisation unter ihren Möglichkeiten.
                    </p>
                    <p>
                      Wir schaffen Raum und Struktur, damit Führung nicht bloß im Kopf bleibt,
                      sondern beim Team ankommt – und alle in eine gemeinsame Richtung laufen.
                    </p>
                  </div>
                </div>
                <div className="bg-primary/10 dark:bg-primary/20 p-8 rounded-lg border-2 border-primary/30 dark:border-primary/40 shadow-sm">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-2">86%</div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      der Führungskräfte bestätigen:
                      Wenn Teams in Entscheidungen einbezogen werden, geht es schneller – und besser.
                    </p>
                  </div>
                  <div className="mt-6 pt-6 border-t border-primary/20 dark:border-primary/30">
                    <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                      Quelle: Cloverpop – Hacking Diversity in Decision-Making
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {!isLoading && leadershipCases.length > 0 && (
          <section className="py-20 bg-slate-50 dark:bg-slate-800">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-slate-900 dark:text-slate-100">
                  Aus der Praxis
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {leadershipCases.slice(0, 2).map((caseStudy) => (
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
                    Wo steht Ihre Führung heute?
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
                          Verschaffen Sie sich Klarheit über den Status Quo Ihrer Führungskultur.
                          Kostenlos und in wenigen Minuten.
                        </p>
                      </div>
                    </div>
                    <Button
                      size="lg"
                      onClick={() => navigate("/umfrage/fuehrung")}
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
                        <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Geschäftsführungs-Sparring</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          Direkter Austausch auf Augenhöhe. Gemeinsam entwickeln wir Lösungen für Ihre
                          strategischen Herausforderungen.
                        </p>
                      </div>
                    </div>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => navigate("/about")}
                      className="w-full border-2"
                    >
                      Sparring anfragen
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

export default FuehrungskulturStrategie;
