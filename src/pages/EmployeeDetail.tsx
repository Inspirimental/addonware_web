import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Mail, Phone, Linkedin, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { type Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Configurator } from "@/components/Configurator";
import { resolveTeamImage } from "@/lib/teamImageResolver";
import { CVDownloadModal } from "@/components/CVDownloadModal";

type Employee = Tables<'employees'>;

interface Experience {
  position: string;
  company: string;
  period: string;
  description: string;
}

interface Education {
  degree: string;
  institution: string;
  period: string;
  description: string;
}

interface Language {
  language: string;
  level: string;
}

interface Certification {
  name: string;
  issuer: string;
  year: string;
}

interface CVData {
  experience?: Experience[];
  education?: Education[];
  skills?: string[];
  languages?: Language[];
  certifications?: Certification[];
}

const EmployeeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [isCVDownloadModalOpen, setIsCVDownloadModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEmployee(id);
    }
  }, [id]);

  const fetchEmployee = async (employeeId: string) => {
    try {
      // First try to get public info
      const { data: publicData, error: publicError } = await supabase
        .from('employees_public')
        .select('*')
        .eq('id', employeeId)
        .eq('is_active', true)
        .single();
      
      if (publicError) throw publicError;
      
      // Try to get additional CV data if user is authenticated
      const { data: fullData, error: fullError } = await supabase
        .from('employees')
        .select('cv_data')
        .eq('id', employeeId)
        .eq('is_active', true)
        .single();
      
      // Merge the data - prioritize public data for security
      const employeeData = {
        ...publicData,
        cv_data: fullData?.cv_data || {},
        // Keep email for PDF generation but hide in UI
        email: publicData.email || 'kontakt@addonware.de',
        // Remove other sensitive fields from display
        phone: undefined,
        linkedin: undefined,
        xing: undefined
      };

      setEmployee(employeeData);
    } catch (error) {
      console.error('Error fetching employee:', error);
      toast({
        title: "Fehler",
        description: "Mitarbeiter konnte nicht gefunden werden",
        variant: "destructive",
      });
      navigate('/about');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCV = () => {
    setIsCVDownloadModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation onConfiguratorOpen={() => setIsConfiguratorOpen(true)} />
        <div className="pt-16 container mx-auto px-4 py-24">
          <div className="text-center">Laden...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation onConfiguratorOpen={() => setIsConfiguratorOpen(true)} />
        <div className="pt-16 container mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Mitarbeiter nicht gefunden</h1>
            <Button onClick={() => navigate('/about')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zum Team
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const cvData = (employee.cv_data as CVData) || {};

  return (
    <div className="min-h-screen bg-background">
      <Navigation onConfiguratorOpen={() => setIsConfiguratorOpen(true)} />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-24">
          {/* Back Button */}
          <Button 
            variant="outline" 
            onClick={() => navigate('/about')}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zum Team
          </Button>

          {/* Full Width Hero Section */}
          <div className="relative bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                {employee.image_url && (
                  <img
                    src={resolveTeamImage(employee.image_url) || "/placeholder.svg"}
                    alt={employee.name}
                    className="w-48 h-48 rounded-lg object-cover shadow-lg"
                    loading="lazy"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
                  />
                )}
              </div>
              
              {/* Profile Information */}
              <div className="flex-grow text-center md:text-left">
                <h1 className="text-4xl font-bold mb-4">{employee.name}</h1>
                <p className="text-2xl text-primary font-medium mb-4">{employee.title}</p>
                <p className="text-lg text-muted-foreground mb-6 max-w-2xl">{employee.description}</p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button 
                    onClick={handleDownloadCV}
                    variant="default"
                    size="lg"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Lebenslauf als PDF herunterladen
                  </Button>
                  
                  <Button 
                    onClick={() => navigate('/contact')}
                    variant="outline"
                    size="lg"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Kontakt aufnehmen
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* CV Sections */}
          <div className="space-y-8">
            {/* Experience */}
            {cvData.experience && cvData.experience.length > 0 && (
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6 text-primary border-b border-primary/20 pb-2">Berufserfahrung</h2>
                  <div className="space-y-6">
                    {cvData.experience.map((exp: any, index: number) => (
                      <div key={index} className="border-l-4 border-primary/30 pl-6 hover:border-primary/60 transition-colors">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                          <h3 className="text-xl font-semibold">{exp.position}</h3>
                          <Badge variant="outline" className="mt-1 md:mt-0">{exp.period}</Badge>
                        </div>
                        <p className="text-primary text-lg font-medium mb-3">{exp.company}</p>
                        <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Education */}
            {cvData.education && cvData.education.length > 0 && (
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6 text-primary border-b border-primary/20 pb-2">Ausbildung</h2>
                  <div className="space-y-6">
                    {cvData.education.map((edu: any, index: number) => (
                      <div key={index} className="border-l-4 border-primary/30 pl-6 hover:border-primary/60 transition-colors">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                          <h3 className="text-xl font-semibold">{edu.degree}</h3>
                          <Badge variant="outline" className="mt-1 md:mt-0">{edu.period}</Badge>
                        </div>
                        <p className="text-primary text-lg font-medium mb-3">{edu.institution}</p>
                        {edu.description && (
                          <p className="text-muted-foreground leading-relaxed">{edu.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {cvData.skills && cvData.skills.length > 0 && (
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6 text-primary border-b border-primary/20 pb-2">Kompetenzen</h2>
                  <div className="flex flex-wrap gap-3">
                    {cvData.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-sm py-2 px-4">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Languages */}
            {cvData.languages && cvData.languages.length > 0 && (
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6 text-primary border-b border-primary/20 pb-2">Sprachen</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cvData.languages.map((lang: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                        <span className="text-lg font-medium">{lang.language}</span>
                        <Badge variant="outline" className="text-sm">{lang.level}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Certifications */}
            {cvData.certifications && cvData.certifications.length > 0 && (
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6 text-primary border-b border-primary/20 pb-2">Zertifikate</h2>
                  <div className="space-y-4">
                    {cvData.certifications.map((cert: any, index: number) => (
                      <div key={index} className="flex flex-col md:flex-row md:justify-between md:items-center p-4 bg-muted/50 rounded-lg">
                        <div>
                          <h3 className="text-lg font-medium">{cert.name}</h3>
                          <p className="text-muted-foreground">{cert.issuer}</p>
                        </div>
                        <Badge variant="outline" className="mt-2 md:mt-0 self-start md:self-center">{cert.year}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
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
              ×
            </Button>
          </div>
          <div className="p-6">
            <Configurator />
          </div>
        </DialogContent>
      </Dialog>

      {/* CV Download Modal */}
      {employee && (
        <CVDownloadModal
          isOpen={isCVDownloadModalOpen}
          onClose={() => setIsCVDownloadModalOpen(false)}
          employeeName={employee.name}
          employeeId={employee.id}
          employeeEmail={employee.email || ''}
        />
      )}
    </div>
  );
};

export default EmployeeDetail;