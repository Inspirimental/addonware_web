import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { submitQuestionnaireResponse } from "@/services/emailService";
import { supabase } from "@/integrations/supabase/client";

interface QuestionOption {
  id: string;
  option_text: string;
  sort_order: number;
}

interface Question {
  id: string;
  question_text: string;
  sort_order: number;
  options: QuestionOption[];
}

interface Questionnaire {
  id: string;
  title: string;
  slug: string;
}

export const Configurator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [botTrap, setBotTrap] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadQuestionnaire();
  }, []);

  const loadQuestionnaire = async () => {
    try {
      const { data: questionnaireData, error: qError } = await supabase
        .from('questionnaires')
        .select('id, title, slug')
        .eq('slug', 'digitalisierung')
        .maybeSingle();

      if (qError) {
        console.error('Error loading questionnaire:', qError);
        throw new Error(`Database error: ${qError.message}`);
      }

      if (!questionnaireData) {
        throw new Error('Questionnaire not found');
      }

      setQuestionnaire(questionnaireData);

      const { data: questionsData, error: questionsError } = await supabase
        .from('questionnaire_questions')
        .select(`
          id,
          question_text,
          sort_order,
          questionnaire_options (
            id,
            option_text,
            sort_order
          )
        `)
        .eq('questionnaire_id', questionnaireData.id)
        .order('sort_order');

      if (questionsError) {
        console.error('Error loading questions:', questionsError);
        throw new Error(`Failed to load questions: ${questionsError.message}`);
      }

      if (!questionsData || questionsData.length === 0) {
        throw new Error('No questions found for this questionnaire');
      }

      const formattedQuestions = questionsData.map((q: any) => ({
        id: q.id,
        question_text: q.question_text,
        sort_order: q.sort_order,
        options: q.questionnaire_options.sort((a: any, b: any) => a.sort_order - b.sort_order)
      }));

      setQuestions(formattedQuestions);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading questionnaire:', error);
      const errorMessage = error instanceof Error ? error.message : 'Umfrage konnte nicht geladen werden.';
      toast({
        title: "Fehler",
        description: errorMessage,
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Show email form
      setCurrentStep(questions.length);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (botTrap) {
      return;
    }

    if (!name || !email) {
      toast({
        title: "Fehlende Informationen",
        description: "Bitte geben Sie Ihren Namen und Ihre E-Mail-Adresse ein.",
        variant: "destructive"
      });
      return;
    }

    if (!privacy) {
      toast({
        title: "Datenschutz-Zustimmung erforderlich",
        description: "Bitte stimmen Sie der Datenverarbeitung zu.",
        variant: "destructive"
      });
      return;
    }

    if (Object.keys(answers).length < questions.length) {
      toast({
        title: "Unvollständig",
        description: "Bitte beantworten Sie alle Fragen.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const formattedAnswers = Object.entries(answers).map(([questionId, optionId]) => ({
        questionId,
        questionType: 'multiple_choice',
        value: optionId
      }));

      const success = await submitQuestionnaireResponse(
        'digitalisierung',
        name,
        email,
        company,
        formattedAnswers
      );

      if (success) {
        setIsComplete(true);
        toast({
          title: "Vielen Dank!",
          description: "Wir melden uns innerhalb von 24h für ein kostenloses 30-minütiges Orientierungsgespräch.",
        });
      } else {
        throw new Error("Failed to submit questionnaire");
      }
    } catch (error) {
      console.error("Questionnaire error:", error);

      toast({
        title: "Fehler beim Übermitteln",
        description: "Es gab ein Problem beim Senden Ihrer Analyse. Bitte versuchen Sie es erneut.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetConfigurator = () => {
    setCurrentStep(0);
    setAnswers({});
    setName("");
    setEmail("");
    setCompany("");
    setPrivacy(false);
    setBotTrap("");
    setIsComplete(false);
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <p>Umfrage wird geladen...</p>
        </CardContent>
      </Card>
    );
  }

  if (isComplete) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Vielen Dank für Ihre Teilnahme!</h3>
            <p className="text-muted-foreground">
              Wir haben Ihre Antworten erhalten und melden uns in Kürze bei Ihnen.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isEmailStep = currentStep === questions.length;
  const currentQuestion = questions[currentStep];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const progress = ((currentStep + 1) / (questions.length + 1)) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <CardTitle>{questionnaire?.title || 'Fragebogen'}</CardTitle>
          <span className="text-sm text-muted-foreground">
            {currentStep + 1} von {questions.length + 1}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isEmailStep ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Ihre Kontaktdaten</h3>
              <p className="text-muted-foreground mb-6">
                Hinterlassen Sie uns Ihre Kontaktdaten und wir melden uns mit einem
                maßgeschneiderten Beratungsvorschlag bei Ihnen.
              </p>
            </div>
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
                  placeholder="ihre@email.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

            {/* Bot trap field - hidden from users */}
            <div style={{ display: "none" }}>
              <Label htmlFor="botTrap">Bitte dieses Feld leer lassen</Label>
              <Input
                id="botTrap"
                value={botTrap}
                onChange={(e) => setBotTrap(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="privacy"
                checked={privacy}
                onCheckedChange={(checked) => setPrivacy(checked as boolean)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="privacy" className="text-sm font-normal cursor-pointer">
                  Ich stimme zu, dass meine Angaben zur Bearbeitung meiner Anfrage 
                  erhoben und verarbeitet werden. Die Daten werden nach abgeschlossener 
                  Bearbeitung gelöscht. *
                </Label>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zurück
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !name || !email || !privacy}
              >
                {isSubmitting ? "Wird gesendet..." : "Absenden"}
              </Button>
            </div>
          </div>
        ) : currentQuestion ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">{currentStep + 1}. {currentQuestion.question_text}</h3>
              <RadioGroup
                value={currentAnswer || ""}
                onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
              >
                {currentQuestion.options.map((option) => (
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
            </div>
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zurück
              </Button>
              <Button
                onClick={handleNext}
                disabled={!currentAnswer}
              >
                Weiter
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};