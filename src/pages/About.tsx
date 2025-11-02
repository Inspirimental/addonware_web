import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Phone, ArrowRight, Eye, X, Linkedin } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Configurator } from "@/components/Configurator";
import { PersonalizedContactForm } from "@/components/PersonalizedContactForm";
import { resolveTeamImage } from "@/lib/teamImageResolver";
import { useNavigate } from "react-router-dom";
import { usePublicEmployees } from "@/hooks/usePublicEmployees";

const About = () => {
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<{ id: string; name: string; email: string } | null>(null);
  const navigate = useNavigate();
  const { employees, isLoading } = usePublicEmployees();

  const handleContactMember = (member: { id: string; name: string; email: string }) => {
    setSelectedMember(member);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onConfiguratorOpen={() => setIsConfiguratorOpen(true)} />
      
      <main className="pt-16">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Beratung mit Haltung – und Erfahrung
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            Wir sind ein interdisziplinäres Team aus Praktiker:innen – mit Erfahrung in der 
            Unternehmensführung, IT-Beratung, Projektsteuerung, Verwaltung und sozialer Trägerschaft. 
            Uns verbindet die Freude an wirksamer Veränderung.
          </p>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">Das Addonware-Beratungsteam</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 text-center mb-12 max-w-3xl mx-auto">
            Wir sind für Sie da – als Sparringspartner:innen, Impulsgeber und Brückenbauer zwischen Strategie und Umsetzung.
            Ob Sparring, Projektanfrage oder vertiefender Austausch – sprechen Sie uns an.
          </p>
          {isLoading ? (
            <div className="text-center">Laden...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {employees.map((member) => (
                <Card key={member.id} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
                      <img 
                        src={resolveTeamImage(member.image_url) || "/placeholder.svg"} 
                        alt={`${member.name} – Portrait`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="font-semibold text-lg mb-0 leading-tight">{member.name}</h3>
                    <p className="text-primary font-medium mb-3 leading-tight">{member.title}</p>
                    <p className="text-muted-foreground text-sm mb-4">{member.description}</p>
                    
                    {/* Contact Icons */}
                    <div className="flex justify-center gap-2 pt-2">
                      <button
                        onClick={() => handleContactMember({ id: member.id, name: member.name, email: member.email })}
                        className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center hover:bg-primary/20 transition-colors"
                        title={`Nachricht an ${member.name} senden`}
                      >
                        <Mail className="w-4 h-4 text-muted-foreground hover:text-primary" />
                      </button>
                      
                      {/* Phone Icon - always show but disabled if no phone */}
                      {member.phone && member.phone.trim() ? (
                        <a 
                          href={`tel:${member.phone}`}
                          className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center hover:bg-primary/20 transition-colors"
                          title={`${member.name} anrufen`}
                        >
                          <Phone className="w-4 h-4 text-muted-foreground hover:text-primary" />
                        </a>
                      ) : (
                        <div 
                          className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center opacity-50 cursor-not-allowed"
                          title="Telefonnummer nicht verfügbar"
                        >
                          <Phone className="w-4 h-4 text-muted-foreground/50" />
                        </div>
                      )}
                      
                      {/* LinkedIn Icon - always show but disabled if no linkedin */}
                      {member.linkedin && member.linkedin.trim() ? (
                        <a 
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center hover:bg-primary/20 transition-colors"
                          title={`${member.name} auf LinkedIn`}
                        >
                          <Linkedin className="w-4 h-4 text-muted-foreground hover:text-primary" />
                        </a>
                      ) : (
                        <div 
                          className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center opacity-50 cursor-not-allowed"
                          title="LinkedIn-Profil nicht verfügbar"
                        >
                          <Linkedin className="w-4 h-4 text-muted-foreground/50" />
                        </div>
                      )}
                      
                      {/* XING Icon - always show but disabled if no xing */}
                      {member.xing && member.xing.trim() ? (
                        <a 
                          href={member.xing}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center hover:bg-primary/20 transition-colors"
                          title={`${member.name} auf XING`}
                        >
                          <svg className="w-4 h-4 text-muted-foreground hover:text-primary" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.188 0c-.517 0-.741.325-.927.66 0 0-7.455 13.224-7.702 13.657.015.024 4.919 9.023 4.919 9.023.17.308.436.66.967.66h3.454c.211 0 .375-.078.463-.22.089-.151.089-.346-.009-.536L14.568 14.6l7.649-13.664c.09-.164.09-.349 0-.465-.089-.142-.252-.22-.463-.22h-3.566zm-9.439 10.22L7.643 8.587H4.266c-.212 0-.375.078-.463.22-.09.151-.09.346.009.536l1.106 2.033-2.764 5.078c-.09.164-.09.349 0 .465.088.142.25.22.463.22h3.457c.517 0 .741-.325.927-.66l2.764-5.078z"/>
                          </svg>
                        </a>
                      ) : (
                        <div 
                          className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center opacity-50 cursor-not-allowed"
                          title="XING-Profil nicht verfügbar"
                        >
                          <svg className="w-4 h-4 text-muted-foreground/50" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.188 0c-.517 0-.741.325-.927.66 0 0-7.455 13.224-7.702 13.657.015.024 4.919 9.023 4.919 9.023.17.308.436.66.967.66h3.454c.211 0 .375-.078.463-.22.089-.151.089-.346-.009-.536L14.568 14.6l7.649-13.664c.09-.164.09-.349 0-.465-.089-.142-.252-.22-.463-.22h-3.566zm-9.439 10.22L7.643 8.587H4.266c-.212 0-.375.078-.463.22-.09.151-.09.346.009.536l1.106 2.033-2.764 5.078c-.09.164-.09.349 0 .465.088.142.25.22.463.22h3.457c.517 0 .741-.325.927-.66l2.764-5.078z"/>
                          </svg>
                        </div>
                      )}
                      
                      <button
                        onClick={() => navigate(`/team/${member.id}`)}
                        className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center hover:bg-primary/20 transition-colors"
                        title="Profil ansehen"
                      >
                        <Eye className="w-4 h-4 text-muted-foreground hover:text-primary" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Standorte */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Unsere Standorte</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <MapPin className="w-6 h-6 text-primary mr-3" />
                  <h3 className="text-xl font-semibold">Deutschland</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Unser Hauptsitz in Thüringen ist das Herz unserer deutschen Aktivitäten. 
                  Von hier aus betreuen wir Kunden im gesamten DACH-Raum.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>info@addonware.de</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>+49 (0) 3671 / 524279-0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <MapPin className="w-6 h-6 text-primary mr-3" />
                  <h3 className="text-xl font-semibold">Schweiz</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Für die Umsetzung in der Schweiz arbeiten wir mit der Batix Schweiz AG zusammen –
                  einem zuverlässigen Partner vor Ort, der Schweizer Organisationen mit langjähriger
                  Erfahrung unterstützt.
                </p>
                <a
                  href="https://batix.ch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm font-medium inline-flex items-center gap-1"
                >
                  batix.ch
                  <ArrowRight className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Lernen Sie uns kennen
              </h3>
              <p className="text-muted-foreground mb-6">
                Interessiert an einer Zusammenarbeit? Lassen Sie uns in einem 
                unverbindlichen Gespräch herausfinden, wie wir Ihnen helfen können.
              </p>
              <Button size="lg" onClick={() => navigate('/contact')}>
                Jetzt Kontakt aufnehmen
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
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

      {/* Personalized Contact Dialog */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              {selectedMember ? `Kontakt zu ${selectedMember.name}` : "Kontakt"}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedMember(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="p-6">
            {selectedMember && (
              <PersonalizedContactForm
                recipientName={selectedMember.name}
                recipientEmail={selectedMember.email}
                employeeId={selectedMember.id}
                onSuccess={() => setSelectedMember(null)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default About;
