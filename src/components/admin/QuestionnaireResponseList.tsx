import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Settings, ArrowLeft, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";

interface Response {
  id: string;
  name: string;
  email: string;
  company: string | null;
  created_at: string;
}

interface ResponseDetail {
  id: string;
  name: string;
  email: string;
  company: string | null;
  created_at: string;
  answers: Array<{
    question_text: string;
    option_text: string;
  }>;
}

interface QuestionnaireResponseListProps {
  questionnaireId: string;
  questionnaireTitle: string;
  onBack: () => void;
  onSettings: () => void;
}

export const QuestionnaireResponseList = ({
  questionnaireId,
  questionnaireTitle,
  onBack,
  onSettings,
}: QuestionnaireResponseListProps) => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<ResponseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadResponses();
  }, [questionnaireId]);

  const loadResponses = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("questionnaire_responses")
        .select("id, name, email, company, created_at")
        .eq("questionnaire_id", questionnaireId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setResponses(data || []);
    } catch (error) {
      console.error("Error loading responses:", error);
      toast({
        title: "Fehler",
        description: "Antworten konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadResponseDetail = async (responseId: string) => {
    try {
      setIsDetailLoading(true);

      const { data: responseData, error: responseError } = await supabase
        .from("questionnaire_responses")
        .select("id, name, email, company, created_at")
        .eq("id", responseId)
        .single();

      if (responseError) throw responseError;

      const { data: answersData, error: answersError } = await supabase
        .from("questionnaire_answers")
        .select(`
          question_id,
          option_id,
          answer_text,
          answer_number,
          questionnaire_questions!inner(question_text, question_type)
        `)
        .eq("response_id", responseId);

      if (answersError) throw answersError;

      // Format answers based on question type
      const formattedAnswers = await Promise.all((answersData || []).map(async (a: any) => {
        const question = a.questionnaire_questions;
        let answerText = '';

        if (question.question_type === 'multiple_choice' && a.option_id) {
          const { data: option } = await supabase
            .from('questionnaire_options')
            .select('option_text')
            .eq('id', a.option_id)
            .single();
          answerText = option?.option_text || 'Keine Angabe';
        } else if (question.question_type === 'rating') {
          answerText = String(a.answer_number || 'Keine Angabe');
        } else if (question.question_type === 'text') {
          answerText = a.answer_text || 'Keine Angabe';
        }

        return {
          question_text: question.question_text,
          option_text: answerText,
        };
      }));

      setSelectedResponse({
        ...responseData,
        answers: formattedAnswers,
      });
    } catch (error) {
      console.error("Error loading response detail:", error);
      toast({
        title: "Fehler",
        description: "Details konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setIsDetailLoading(false);
    }
  };

  const deleteResponse = async (responseId: string) => {
    try {
      const { error } = await supabase
        .from("questionnaire_responses")
        .delete()
        .eq("id", responseId);

      if (error) throw error;

      toast({
        title: "Erfolgreich gelöscht",
        description: "Die Antwort wurde entfernt",
      });

      loadResponses();
    } catch (error) {
      console.error("Error deleting response:", error);
      toast({
        title: "Fehler",
        description: "Die Antwort konnte nicht gelöscht werden",
        variant: "destructive",
      });
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
              <CardTitle>{questionnaireTitle} - Antworten</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={onSettings}>
              <Settings className="w-4 h-4 mr-2" />
              Einstellungen
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Lade Antworten...
            </div>
          ) : responses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Noch keine Antworten vorhanden
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kontakt</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {responses.map((response) => (
                  <TableRow
                    key={response.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => loadResponseDetail(response.id)}
                  >
                    <TableCell className="font-medium">
                      <div>
                        <div>{response.name} ({response.email})</div>
                        {response.company && (
                          <div className="text-sm text-muted-foreground">{response.company}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(response.created_at), "dd.MM.yyyy HH:mm")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            loadResponseDetail(response.id);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Antwort löschen?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Diese Aktion kann nicht rückgängig gemacht werden. Die Antwort wird
                              dauerhaft gelöscht.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteResponse(response.id);
                              }}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Löschen
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedResponse} onOpenChange={() => setSelectedResponse(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Antwort-Details</DialogTitle>
          </DialogHeader>
          {isDetailLoading ? (
            <div className="text-center py-8 text-muted-foreground">Lade Details...</div>
          ) : selectedResponse && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-semibold text-muted-foreground mb-1">Name</div>
                  <div className="font-medium">{selectedResponse.name}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-muted-foreground mb-1">E-Mail</div>
                  <div className="font-medium">{selectedResponse.email}</div>
                </div>
                {selectedResponse.company && (
                  <div>
                    <div className="text-sm font-semibold text-muted-foreground mb-1">Organisation</div>
                    <div className="font-medium">{selectedResponse.company}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm font-semibold text-muted-foreground mb-1">Datum</div>
                  <div className="font-medium">
                    {format(new Date(selectedResponse.created_at), "dd.MM.yyyy HH:mm")}
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Antworten</h3>
                <div className="space-y-4">
                  {selectedResponse.answers.map((answer, index) => (
                    <div key={index} className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-sm font-semibold mb-2">{answer.question_text}</div>
                      <div className="text-sm">{answer.option_text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
