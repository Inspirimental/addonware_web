import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { submitQuestionnaireResponse } from "@/services/emailService";

type QuestionType = 'multiple_choice' | 'rating' | 'text';

interface Question {
  id: string;
  question_text: string;
  question_type: QuestionType;
  rating_min?: number | null;
  rating_max?: number | null;
  sort_order: number;
  options: Option[];
}

interface Option {
  id: string;
  option_text: string;
  sort_order: number;
}

interface Questionnaire {
  id: string;
  slug: string;
  title: string;
  description: string;
  is_active: boolean;
  notification_email?: string | null;
}

const benefits = [
  "Kostenlose Einschätzung Ihrer aktuellen Situation",
  "Konkrete Handlungsempfehlungen für Ihren nächsten Schritt",
  "Orientierung über passende Beratungsleistungen",
  "Unverbindliches 30-minütiges Orientierungsgespräch"
];

const QuestionnaireDigitaleSouveraenitaet = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    loadQuestionnaire();
  }, [slug]);

  const loadQuestionnaire = async () => {
    if (!slug) return;

    try {
      setIsLoading(true);

      const { data: questionnaireData, error: questionnaireError } = await supabase
        .from("questionnaires")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

      if (questionnaireError || !questionnaireData) {
        throw new Error("Questionnaire not found or not active");
      }

      setQuestionnaire(questionnaireData);

      const { data: questionsData, error: questionsError } = await supabase
        .from("questionnaire_questions")
        .select("*")
        .eq("questionnaire_id", questionnaireData.id)
        .order("sort_order");

      if (questionsError) throw questionsError;

      const questionsWithOptions = await Promise.all(
        (questionsData || []).map(async (question) => {
          // Only load options for multiple_choice questions
          if (question.question_type === 'multiple_choice') {
            const { data: options, error: optionsError } = await supabase
              .from("questionnaire_options")
              .select("*")
              .eq("question_id", question.id)
              .order("sort_order");

            if (optionsError) throw optionsError;

            return {
              ...question,
              options: options || [],
            };
          }

          return {
            ...question,
            options: [],
          };
        })
      );

      setQuestions(questionsWithOptions);
    } catch (error) {
      console.error("Error loading questionnaire:", error);
      toast({
        title: "Fehler",
        description: "Die Umfrage konnte nicht geladen werden",
        variant: "destructive",
      });
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!name || !email) {
      toast({
        title: "Fehlende Informationen",
        description: "Bitte geben Sie Ihren Namen und Ihre E-Mail-Adresse ein.",
        variant: "destructive",
      });
      return;
    }

    if (!questionnaire || !slug) {
      toast({
        title: "Fehler",
        description: "Umfrage-Informationen fehlen.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const answerArray = Object.entries(answers).map(([questionId, value]) => {
        const question = questions.find(q => q.id === questionId);
        if (!question) return null;

        let processedValue = value;
        if (question.question_type === 'rating' && value.includes('/')) {
          processedValue = value.split('/')[0];
        }

        return {
          questionId,
          questionType: question.question_type,
          value: processedValue,
        };
      }).filter(Boolean) as Array<{ questionId: string; questionType: string; value: string }>;

      const success = await submitQuestionnaireResponse(
        slug,
        name,
        email,
        company || '',
        answerArray
      );

      if (success) {
        setIsCompleted(true);
        toast({
          title: "Vielen Dank!",
          description: "Ihre Antworten wurden erfolgreich übermittelt.",
        });
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Error submitting questionnaire:", error);
      toast({
        title: "Fehler",
        description: "Ihre Antworten konnten nicht übermittelt werden. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    if (currentStep === questions.length) {
      return name.trim() !== "" && email.trim() !== "";
    }
    const currentQuestion = questions[currentStep];
    return currentQuestion && answers[currentQuestion.id];
  };

  const totalSteps = questions.length + 1;

  return (
    <div className="min-h-screen bg-background">
      <Navigation onConfiguratorOpen={() => {}} />

      <main className="pt-16">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {questions.length} Fragen. Mehr Klarheit.
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Mit unserem {questionnaire?.title || 'Fragebogen'} können Sie schnell prüfen, wo Ihre Organisation in der Transformation steht.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Benefits Card */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Was Sie erhalten:</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Questionnaire */}
          <div>
            {isLoading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p>Umfrage wird geladen...</p>
                </CardContent>
              </Card>
            ) : isCompleted ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-4">Vielen Dank für Ihre Teilnahme!</h2>
                  <p className="text-muted-foreground mb-6">
                    Wir haben Ihre Antworten erhalten und melden uns in Kürze bei Ihnen.
                  </p>
                  <Button asChild>
                    <Link to="/">Zurück zur Startseite</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {currentStep === questions.length ? "Ihre Kontaktdaten" : `Frage ${currentStep + 1} von ${questions.length}`}
                  </CardTitle>
                  <div className="w-full bg-secondary h-2 rounded-full mt-4">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {currentStep === questions.length ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ihr Name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">E-Mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="ihre@email.de"
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Organisation (optional)</Label>
                        <Input
                          id="company"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Ihre Organisation"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {questions[currentStep] && (
                        <>
                          <h3 className="text-lg font-medium">
                            {questions[currentStep].question_text}
                          </h3>
                          {questions[currentStep].question_type === 'multiple_choice' && (
                            <RadioGroup
                              value={answers[questions[currentStep].id] || ""}
                              onValueChange={(value) =>
                                setAnswers({ ...answers, [questions[currentStep].id]: value })
                              }
                            >
                              {questions[currentStep].options.map((option) => (
                                <Label
                                  key={option.id}
                                  htmlFor={option.id}
                                  className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer"
                                >
                                  <RadioGroupItem value={option.id} id={option.id} />
                                  <span className="flex-1">
                                    {option.option_text}
                                  </span>
                                </Label>
                              ))}
                            </RadioGroup>
                          )}
                          {questions[currentStep].question_type === 'rating' && (
                            <div className="space-y-6">
                              <div className="flex justify-between text-sm text-muted-foreground">
                                <span>{questions[currentStep].rating_min || 1}</span>
                                <span>{questions[currentStep].rating_max || 5}</span>
                              </div>
                              <div className="relative px-2">
                                <Slider
                                  value={[parseInt(answers[questions[currentStep].id]?.split('/')[0] || String(questions[currentStep].rating_min || 1))]}
                                  onValueChange={(value) =>
                                    setAnswers({ ...answers, [questions[currentStep].id]: `${value[0]}/${questions[currentStep].rating_max || 5}` })
                                  }
                                  min={questions[currentStep].rating_min || 1}
                                  max={questions[currentStep].rating_max || 5}
                                  step={1}
                                  className="w-full"
                                />
                                {/* Visual markers at snap positions */}
                                <div className="absolute top-1/2 left-0 right-0 flex justify-between px-2 pointer-events-none" style={{ transform: 'translateY(-50%)' }}>
                                  {Array.from({ length: (questions[currentStep].rating_max || 5) - (questions[currentStep].rating_min || 1) + 1 }, (_, i) => (
                                    <div
                                      key={i}
                                      className="w-3 h-3 rounded-full bg-muted-foreground/40"
                                      style={{ marginLeft: i === 0 ? '0' : undefined, marginRight: i === (questions[currentStep].rating_max || 5) - (questions[currentStep].rating_min || 1) ? '0' : undefined }}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="text-center text-2xl font-bold text-primary">
                                {answers[questions[currentStep].id] || `${questions[currentStep].rating_min || 1}/${questions[currentStep].rating_max || 5}`}
                              </div>
                              <div className="text-center text-sm text-muted-foreground italic">
                                Skala [{questions[currentStep].rating_min || 1}–{questions[currentStep].rating_max || 5}]: trifft überhaupt nicht zu → trifft voll zu
                              </div>
                            </div>
                          )}
                          {questions[currentStep].question_type === 'text' && (
                            <Textarea
                              value={answers[questions[currentStep].id] || ""}
                              onChange={(e) =>
                                setAnswers({ ...answers, [questions[currentStep].id]: e.target.value })
                              }
                              placeholder="Ihre Antwort..."
                              className="min-h-[150px]"
                            />
                          )}
                        </>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Zurück
                    </Button>
                    {currentStep < questions.length ? (
                      <Button
                        onClick={() => setCurrentStep(currentStep + 1)}
                        disabled={!isStepValid()}
                      >
                        Weiter
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : currentStep === questions.length ? (
                      <Button onClick={handleSubmit} disabled={!isStepValid() || isSubmitting}>
                        {isSubmitting ? "Wird gesendet..." : "Absenden"}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setCurrentStep(currentStep + 1)}
                        disabled={!isStepValid()}
                      >
                        Weiter
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* CTA Cards below questionnaire */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-3">Keine Zeit für den Fragebogen?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Sprechen Sie direkt mit uns über Ihre Herausforderungen.
                  Wir finden gemeinsam heraus, wie wir helfen können.
                </p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/contact" aria-label="Direktkontakt aufnehmen">
                    Direkten Kontakt aufnehmen
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-3">Passende Angebote finden</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Nach dem Fragebogen können Sie direkt unsere Beratungspakete
                  und Preise einsehen.
                </p>
                <Button asChild variant="ghost" size="sm" className="w-full">
                  <Link to="/pricing" aria-label="Zu Preisen und Paketen">
                    Zu den Preisen & Paketen
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="text-center mt-8">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold mb-4">
                100% kostenlos und unverbindlich
              </h3>
              <p className="text-muted-foreground mb-6">
                Der Fragebogen dauert nur 3-5 Minuten und gibt Ihnen sofort eine
                erste Einschätzung. Ihre Daten werden vertraulich behandelt und
                nicht an Dritte weitergegeben.
              </p>
              <div className="text-sm text-muted-foreground">
                <p>
                  📞 Haben Sie Fragen? Rufen Sie uns an:
                  <a href="tel:+4936715242790" className="text-primary hover:underline ml-1">
                    +49 3671 5242790
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </main>

      <Footer />
    </div>
  );
};

export default QuestionnaireDigitaleSouveraenitaet;
