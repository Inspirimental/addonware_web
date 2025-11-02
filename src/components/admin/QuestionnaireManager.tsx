import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { QuestionnaireResponseList } from "./QuestionnaireResponseList";
import { QuestionnaireSettings } from "./QuestionnaireSettings";

interface Questionnaire {
  id: string;
  slug: string;
  title: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  response_count?: number;
}

type ViewMode = "overview" | "responses" | "settings";

export const QuestionnaireManager = () => {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("overview");
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<Questionnaire | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadQuestionnaires();
  }, []);

  const loadQuestionnaires = async () => {
    try {
      setIsLoading(true);

      const { data: questionnairesData, error: questionnairesError } = await supabase
        .from("questionnaires")
        .select("*")
        .order("sort_order");

      if (questionnairesError) throw questionnairesError;

      const questionnairesWithCounts = await Promise.all(
        (questionnairesData || []).map(async (q) => {
          const { count, error: countError } = await supabase
            .from("questionnaire_responses")
            .select("*", { count: "exact", head: true })
            .eq("questionnaire_id", q.id);

          if (countError) console.error("Error counting responses:", countError);

          return {
            ...q,
            response_count: count || 0,
          };
        })
      );

      setQuestionnaires(questionnairesWithCounts);
    } catch (error) {
      console.error("Error loading questionnaires:", error);
      toast({
        title: "Fehler",
        description: "Umfragen konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActive = async (questionnaireId: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from("questionnaires")
        .update({ is_active: !currentState })
        .eq("id", questionnaireId);

      if (error) throw error;

      toast({
        title: "Erfolgreich aktualisiert",
        description: `Umfrage wurde ${!currentState ? "aktiviert" : "deaktiviert"}`,
      });

      loadQuestionnaires();
    } catch (error) {
      console.error("Error toggling active state:", error);
      toast({
        title: "Fehler",
        description: "Status konnte nicht geändert werden",
        variant: "destructive",
      });
    }
  };

  const openQuestionnaire = (questionnaire: Questionnaire) => {
    setSelectedQuestionnaire(questionnaire);
    setViewMode("responses");
  };

  const openSettings = () => {
    setViewMode("settings");
  };

  const backToOverview = () => {
    setViewMode("overview");
    setSelectedQuestionnaire(null);
    loadQuestionnaires();
  };

  const backToResponses = () => {
    setViewMode("responses");
    loadQuestionnaires();
  };

  if (viewMode === "responses" && selectedQuestionnaire) {
    return (
      <QuestionnaireResponseList
        questionnaireId={selectedQuestionnaire.id}
        questionnaireTitle={selectedQuestionnaire.title}
        onBack={backToOverview}
        onSettings={openSettings}
      />
    );
  }

  if (viewMode === "settings" && selectedQuestionnaire) {
    return (
      <QuestionnaireSettings
        questionnaireId={selectedQuestionnaire.id}
        questionnaireSlug={selectedQuestionnaire.slug}
        onBack={backToResponses}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Umfragen verwalten</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questionnaires.map((questionnaire) => (
              <Card
                key={questionnaire.id}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => openQuestionnaire(questionnaire)}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">{questionnaire.title}</h3>
                      </div>
                      {questionnaire.is_active && (
                        <Badge variant="default" className="bg-green-500">
                          Aktiv
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Antworten:</span>{" "}
                        {questionnaire.response_count || 0}
                      </div>
                    </div>

                    <div
                      className="flex items-center space-x-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Switch
                        checked={questionnaire.is_active}
                        onCheckedChange={() =>
                          toggleActive(questionnaire.id, questionnaire.is_active)
                        }
                      />
                      <span className="text-sm">
                        {questionnaire.is_active ? "Aktiv" : "Inaktiv"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
