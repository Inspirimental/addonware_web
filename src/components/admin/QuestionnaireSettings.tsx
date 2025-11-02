import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Save, MoveUp, MoveDown, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";

type QuestionType = 'multiple_choice' | 'rating' | 'text';

interface Question {
  id: string;
  question_text: string;
  question_type: QuestionType;
  sort_order: number;
  rating_min?: number | null;
  rating_max?: number | null;
  options: Option[];
}

interface Option {
  id: string;
  option_text: string;
  sort_order: number;
}

interface Questionnaire {
  title: string;
  description: string;
  is_active: boolean;
  notification_email: string;
}

interface QuestionnaireSettingsProps {
  questionnaireId: string;
  questionnaireSlug: string;
  onBack: () => void;
}

export const QuestionnaireSettings = ({
  questionnaireId,
  questionnaireSlug,
  onBack,
}: QuestionnaireSettingsProps) => {
  const [questionnaire, setQuestionnaire] = useState<Questionnaire>({
    title: "",
    description: "",
    is_active: false,
    notification_email: "",
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadQuestionnaire();
    loadQuestions();
  }, [questionnaireId]);

  const loadQuestionnaire = async () => {
    try {
      const { data, error } = await supabase
        .from("questionnaires")
        .select("title, description, is_active, notification_email")
        .eq("id", questionnaireId)
        .single();

      if (error) throw error;
      if (data) {
        setQuestionnaire({
          title: data.title || "",
          description: data.description || "",
          is_active: data.is_active || false,
          notification_email: data.notification_email || "",
        });
      }
    } catch (error) {
      console.error("Error loading questionnaire:", error);
      toast({
        title: "Fehler",
        description: "Umfrage konnte nicht geladen werden",
        variant: "destructive",
      });
    }
  };

  const loadQuestions = async () => {
    try {
      setIsLoading(true);

      const { data: questionsData, error: questionsError } = await supabase
        .from("questionnaire_questions")
        .select("*")
        .eq("questionnaire_id", questionnaireId)
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
              question_type: question.question_type as QuestionType,
              options: options || [],
            };
          }

          return {
            ...question,
            question_type: question.question_type as QuestionType,
            options: [],
          };
        })
      );

      setQuestions(questionsWithOptions);
    } catch (error) {
      console.error("Error loading questions:", error);
      toast({
        title: "Fehler",
        description: "Fragen konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `new-${Date.now()}`,
      question_text: "",
      question_type: 'multiple_choice',
      sort_order: questions.length + 1,
      rating_min: null,
      rating_max: null,
      options: [],
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const updateQuestion = (questionId: string, field: string, value: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, [field]: value } : q
      )
    );
  };

  const addOption = (questionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [
                ...q.options,
                {
                  id: `new-${Date.now()}`,
                  option_text: "",
                  sort_order: q.options.length + 1,
                },
              ],
            }
          : q
      )
    );
  };

  const removeOption = (questionId: string, optionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.filter((o) => o.id !== optionId) }
          : q
      )
    );
  };

  const updateOption = (questionId: string, optionId: string, value: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === optionId ? { ...o, option_text: value } : o
              ),
            }
          : q
      )
    );
  };

  const moveQuestion = (index: number, direction: "up" | "down") => {
    const newQuestions = [...questions];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newQuestions.length) return;

    [newQuestions[index], newQuestions[targetIndex]] = [
      newQuestions[targetIndex],
      newQuestions[index],
    ];

    newQuestions.forEach((q, i) => {
      q.sort_order = i + 1;
    });

    setQuestions(newQuestions);
  };

  const saveQuestionnaire = async () => {
    try {
      setIsLoading(true);

      // Update questionnaire basic info
      const { error: questionnaireError } = await supabase
        .from("questionnaires")
        .update({
          title: questionnaire.title,
          description: questionnaire.description,
          is_active: questionnaire.is_active,
          notification_email: questionnaire.notification_email,
        })
        .eq("id", questionnaireId);

      if (questionnaireError) throw questionnaireError;

      // Get existing question IDs from database
      const { data: existingQuestions, error: fetchError } = await supabase
        .from("questionnaire_questions")
        .select("id")
        .eq("questionnaire_id", questionnaireId);

      if (fetchError) throw fetchError;

      // Find questions to delete (exist in DB but not in current state)
      const currentQuestionIds = questions
        .filter(q => !q.id.startsWith("new-"))
        .map(q => q.id);
      const questionsToDelete = (existingQuestions || [])
        .filter(q => !currentQuestionIds.includes(q.id))
        .map(q => q.id);

      // Delete removed questions
      for (const questionId of questionsToDelete) {
        const { error: deleteError } = await supabase
          .from("questionnaire_questions")
          .delete()
          .eq("id", questionId);

        if (deleteError) throw deleteError;
      }

      // Update questions
      for (const question of questions) {
        if (question.id.startsWith("new-")) {
          const { data: newQuestion, error: questionError } = await supabase
            .from("questionnaire_questions")
            .insert({
              questionnaire_id: questionnaireId,
              question_text: question.question_text,
              question_type: question.question_type,
              sort_order: question.sort_order,
              rating_min: question.question_type === 'rating' ? question.rating_min : null,
              rating_max: question.question_type === 'rating' ? question.rating_max : null,
            })
            .select()
            .single();

          if (questionError) throw questionError;

          // Only insert options for multiple_choice questions
          if (question.question_type === 'multiple_choice') {
            for (const option of question.options) {
            const { error: optionError } = await supabase
              .from("questionnaire_options")
              .insert({
                question_id: newQuestion.id,
                option_text: option.option_text,
                sort_order: option.sort_order,
              });

            if (optionError) throw optionError;
            }
          }
        } else {
          const { error: questionError } = await supabase
            .from("questionnaire_questions")
            .update({
              question_text: question.question_text,
              question_type: question.question_type,
              sort_order: question.sort_order,
              rating_min: question.question_type === 'rating' ? question.rating_min : null,
              rating_max: question.question_type === 'rating' ? question.rating_max : null,
            })
            .eq("id", question.id);

          if (questionError) throw questionError;

          // Only handle options for multiple_choice questions
          if (question.question_type === 'multiple_choice') {
            // Get existing options from database
            const { data: existingOptions, error: fetchOptionsError } = await supabase
              .from("questionnaire_options")
              .select("id")
              .eq("question_id", question.id);

            if (fetchOptionsError) throw fetchOptionsError;

            // Find options to delete (exist in DB but not in current state)
            const currentOptionIds = question.options
              .filter(o => !o.id.startsWith("new-"))
              .map(o => o.id);
            const optionsToDelete = (existingOptions || [])
              .filter(o => !currentOptionIds.includes(o.id))
              .map(o => o.id);

            // Delete removed options
            for (const optionId of optionsToDelete) {
              const { error: deleteOptionError } = await supabase
                .from("questionnaire_options")
                .delete()
                .eq("id", optionId);

              if (deleteOptionError) throw deleteOptionError;
            }

            // Insert or update options
            for (const option of question.options) {
            if (option.id.startsWith("new-")) {
              const { error: optionError } = await supabase
                .from("questionnaire_options")
                .insert({
                  question_id: question.id,
                  option_text: option.option_text,
                  sort_order: option.sort_order,
                });

              if (optionError) throw optionError;
            } else {
              const { error: optionError } = await supabase
                .from("questionnaire_options")
                .update({
                  option_text: option.option_text,
                  sort_order: option.sort_order,
                })
                .eq("id", option.id);

              if (optionError) throw optionError;
            }
            }
          }
        }
      }

      toast({
        title: "Erfolgreich gespeichert",
        description: "Die Umfrage wurde aktualisiert",
      });

      loadQuestionnaire();
      loadQuestions();
    } catch (error) {
      console.error("Error saving questionnaire:", error);
      toast({
        title: "Fehler",
        description: "Die Umfrage konnte nicht gespeichert werden",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zurück
              </Button>
              <CardTitle>Fragen bearbeiten</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Allgemeine Einstellungen</h3>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titel</Label>
                <Input
                  id="title"
                  value={questionnaire.title}
                  onChange={(e) =>
                    setQuestionnaire({ ...questionnaire, title: e.target.value })
                  }
                  placeholder="Titel der Umfrage"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  value={questionnaire.description}
                  onChange={(e) =>
                    setQuestionnaire({ ...questionnaire, description: e.target.value })
                  }
                  placeholder="Beschreibung der Umfrage"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notification_email">Benachrichtigungs-E-Mail</Label>
                <Input
                  id="notification_email"
                  type="email"
                  value={questionnaire.notification_email}
                  onChange={(e) =>
                    setQuestionnaire({
                      ...questionnaire,
                      notification_email: e.target.value,
                    })
                  }
                  placeholder="email@beispiel.de"
                />
                <p className="text-sm text-muted-foreground">
                  An diese E-Mail-Adresse werden die ausgefüllten Umfragen gesendet
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={questionnaire.is_active}
                  onCheckedChange={(checked) =>
                    setQuestionnaire({ ...questionnaire, is_active: checked })
                  }
                  className="data-[state=checked]:bg-green-600 dark:data-[state=checked]:bg-green-600"
                />
                <Label htmlFor="is_active">Umfrage aktiv</Label>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Fragen</h3>
            <div className="flex gap-2">
              <Button onClick={addQuestion} size="sm" className="bg-blue-900 hover:bg-blue-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                <Plus className="w-4 h-4 mr-2" />
                Frage hinzufügen
              </Button>
              <Button onClick={saveQuestionnaire} disabled={isLoading} size="sm">
                {isLoading ? "Speichert..." : "Änderungen speichern"}
              </Button>
            </div>
          </div>

          {questions.map((question, qIndex) => (
            <Card key={question.id}>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-4">
                    <div>
                      <Label>Frage {qIndex + 1}</Label>
                      <Input
                        value={question.question_text}
                        onChange={(e) =>
                          updateQuestion(question.id, "question_text", e.target.value)
                        }
                        placeholder="Fragetext eingeben..."
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Fragetyp</Label>
                      <Select
                        value={question.question_type}
                        onValueChange={(value: QuestionType) => {
                          setQuestions(
                            questions.map((q) =>
                              q.id === question.id ? { ...q, question_type: value } : q
                            )
                          );
                        }}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple_choice">Multiple Choice (Einzelauswahl)</SelectItem>
                          <SelectItem value="rating">Stimmungsfrage (von-bis)</SelectItem>
                          <SelectItem value="text">Offene Frage (Freitext)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveQuestion(qIndex, "up")}
                      disabled={qIndex === 0}
                    >
                      <MoveUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveQuestion(qIndex, "down")}
                      disabled={qIndex === questions.length - 1}
                    >
                      <MoveDown className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeQuestion(question.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {question.question_type === 'rating' && (
                  <div className="ml-4 grid grid-cols-2 gap-4">
                    <div>
                      <Label>Minimum</Label>
                      <Input
                        type="number"
                        value={question.rating_min || ''}
                        onChange={(e) =>
                          setQuestions(
                            questions.map((q) =>
                              q.id === question.id
                                ? { ...q, rating_min: parseInt(e.target.value) || 1 }
                                : q
                            )
                          )
                        }
                        placeholder="z.B. 1"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Maximum</Label>
                      <Input
                        type="number"
                        value={question.rating_max || ''}
                        onChange={(e) =>
                          setQuestions(
                            questions.map((q) =>
                              q.id === question.id
                                ? { ...q, rating_max: parseInt(e.target.value) || 5 }
                                : q
                            )
                          )
                        }
                        placeholder="z.B. 5"
                        className="mt-2"
                      />
                    </div>
                  </div>
                )}

                {question.question_type === 'multiple_choice' && (
                  <div className="ml-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm text-muted-foreground">Antwortoptionen</Label>
                      <Button
                        onClick={() => addOption(question.id)}
                        size="sm"
                        variant="outline"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Option
                      </Button>
                    </div>

                    {question.options.map((option) => (
                      <div key={option.id} className="flex items-center gap-2">
                        <Input
                          value={option.option_text}
                          onChange={(e) =>
                            updateOption(question.id, option.id, e.target.value)
                          }
                          placeholder="Antwortoption eingeben..."
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(question.id, option.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {question.question_type === 'text' && (
                  <div className="ml-4 text-sm text-muted-foreground">
                    Diese Frage wird als Freitextfeld angezeigt.
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-end items-center gap-2">
            <Button onClick={addQuestion} size="sm" className="bg-blue-900 hover:bg-blue-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
              <Plus className="w-4 h-4 mr-2" />
              Frage hinzufügen
            </Button>
            <Button onClick={saveQuestionnaire} disabled={isLoading} size="sm">
              {isLoading ? "Speichert..." : "Änderungen speichern"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
