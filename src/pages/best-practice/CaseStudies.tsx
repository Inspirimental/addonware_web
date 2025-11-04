import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Factory, Car, Database, Lock } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Configurator } from "@/components/Configurator";
import { CaseStudySkeleton } from "@/components/ui/skeleton-loaders";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCaseStudies } from "@/hooks/useCaseStudies";


const CaseStudies = () => {
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("Alle");
  const navigate = useNavigate();
  const { caseStudies, isLoading, error } = useCaseStudies();

  // Filtere nach Kategorie
  const filteredCaseStudies = selectedCategory === "Alle" 
    ? caseStudies 
    : caseStudies.filter(study => study.category === selectedCategory);

  const categories = ["Alle", "Smart Factory", "Smart Mobility", "Smart Data"];

  // Icon mapping for categories
  const getIconForCategory = (category: string) => {
    switch (category) {
      case "Smart Factory": return Factory;
      case "Smart Mobility": return Car;
      case "Smart Data": return Database;
      default: return Factory;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onConfiguratorOpen={() => setIsConfiguratorOpen(true)} />
      
      <main className="pt-16">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Erfolgsgeschichten aus der Wirklichkeit
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            Unsere Projekte sprechen für sich – und für unsere Haltung. Hier finden Sie ausgewählte Beispiele aus verschiedenen Organisationstypen.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="mb-2"
            >
              {category}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <CaseStudySkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            {filteredCaseStudies.map((study) => {
              const IconComponent = getIconForCategory(study.category);
              return (
                <Card key={study.id} className="group transition-all hover:shadow-card h-full flex flex-col overflow-hidden">
                  {study.image_url && (
                    <div className="relative h-48 overflow-hidden bg-muted">
                      <img
                        src={study.image_url}
                        alt={study.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {study.solution_locked && (
                        <div className="absolute top-3 right-3">
                          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                            <Lock className="w-3 h-3 mr-1" />
                            Nach Anmeldung
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg mb-1">{study.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{study.industry} • {study.category}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <Badge variant="outline" className="mb-1 whitespace-nowrap min-w-[90px] justify-center">{study.duration}</Badge>
                        <div className="text-xs text-muted-foreground">
                          {new Date(study.date).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {study.tags && Array.isArray(study.tags) && study.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {String(tag)}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-4 flex-1">
                  {study.teaser_short ? (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {study.teaser_short}
                    </p>
                  ) : (
                    <>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Herausforderung</h4>
                        <p className="text-sm line-clamp-2">{study.challenge}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Ergebnis</h4>
                        <p className="text-sm font-medium text-primary line-clamp-2">{study.result}</p>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/case-studies/${study.id}`)}
                  >
                    Mehr erfahren
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/case-studies/${study.id}`)}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
          </div>
        )}

        {/* Filter Hinweis */}
        <div className="text-center mb-12">
          <p className="text-muted-foreground">
            Interessiert an Projekten aus Ihrer Branche? 
            <Button variant="link" className="px-2">
              Kontaktieren Sie uns für spezifische Referenzen
            </Button>
          </p>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Ihr Projekt könnte das nächste sein
              </h3>
              <p className="text-muted-foreground mb-6">
                Jedes erfolgreiche Projekt beginnt mit einem Gespräch. 
                Lassen Sie uns gemeinsam herausfinden, wie wir Ihre Herausforderung lösen können.
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

export default CaseStudies;