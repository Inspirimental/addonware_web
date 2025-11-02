import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, CheckCircle, Target, Lightbulb } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Configurator } from "@/components/Configurator";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { type Tables } from "@/integrations/supabase/types";

type CaseStudyDB = Tables<'case_studies'>;

const CaseStudyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [caseStudy, setCaseStudy] = useState<CaseStudyDB | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCaseStudy = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('case_studies')
          .select('*')
          .eq('id', id)
          .eq('is_active', true)
          .single();
          
        if (error) {
          console.error('Error fetching case study:', error);
          setCaseStudy(null);
        } else {
          setCaseStudy(data);
        }
      } catch (err) {
        console.error('Error:', err);
        setCaseStudy(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCaseStudy();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation onConfiguratorOpen={() => setIsConfiguratorOpen(true)} />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-24 text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Lade Case Study...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!caseStudy) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation onConfiguratorOpen={() => setIsConfiguratorOpen(true)} />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-24 text-center">
            <h1 className="text-4xl font-bold mb-6">Case Study nicht gefunden</h1>
            <p className="text-muted-foreground mb-8">Die angeforderte Fallstudie konnte nicht gefunden werden.</p>
            <Button onClick={() => navigate('/case-studies')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zu den Case Studies
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation onConfiguratorOpen={() => setIsConfiguratorOpen(true)} />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-12">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/case-studies')}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zu den Case Studies
          </Button>

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{caseStudy.title}</h1>
                <p className="text-xl text-muted-foreground">{caseStudy.company}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <Badge variant="outline" className="text-sm">{caseStudy.industry}</Badge>
              <Badge variant="secondary" className="text-sm">{caseStudy.category}</Badge>
              {caseStudy.duration && <Badge variant="outline" className="text-sm">{caseStudy.duration}</Badge>}
              <Badge variant="outline" className="text-sm">
                {new Date(caseStudy.date).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              {(caseStudy.tags as string[] || []).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Project Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Projektübersicht
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Herausforderung</h4>
                    <p className="text-sm">{caseStudy.challenge}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Lösungsansatz</h4>
                    <p className="text-sm">{caseStudy.solution}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Ergebnis</h4>
                    <p className="text-sm font-medium text-primary">{caseStudy.result}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Description */}
              {caseStudy.detailed_description && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      Projektdetails
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{caseStudy.detailed_description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Technologies Used */}
              {caseStudy.technologies && (caseStudy.technologies as string[]).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Eingesetzte Technologien</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(caseStudy.technologies as string[]).map((tech, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-primary" />
                          <span className="text-sm">{tech}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Key Results */}
              {caseStudy.outcomes && (caseStudy.outcomes as string[]).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Zentrale Ergebnisse</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {(caseStudy.outcomes as string[]).map((outcome, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Project Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Projektdaten</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">Kunde</h4>
                    <p className="text-sm">{caseStudy.company}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">Branche</h4>
                    <p className="text-sm">{caseStudy.industry}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">Kategorie</h4>
                    <p className="text-sm">{caseStudy.category}</p>
                  </div>
                  {caseStudy.duration && (
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Projektdauer</h4>
                      <p className="text-sm">{caseStudy.duration}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">Abschluss</h4>
                    <p className="text-sm">
                      {new Date(caseStudy.date).toLocaleDateString('de-DE', { 
                        day: 'numeric',
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Interesse an einem ähnlichen Projekt?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Lassen Sie uns gemeinsam herausfinden, wie wir Ihre spezifischen Herausforderungen 
                mit bewährten Lösungsansätzen angehen können.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => navigate('/contact')}>
                  Projekt besprechen
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="outline" size="lg" onClick={() => setIsConfiguratorOpen(true)}>
                  Bedarfsanalyse starten
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
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

export default CaseStudyDetail;