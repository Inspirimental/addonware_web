import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { type Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

interface CVEditorProps {
  employee: Employee;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const CVEditor = ({ employee, isOpen, onClose, onUpdate }: CVEditorProps) => {
  const { toast } = useToast();
  const cvData = (employee.cv_data as CVData) || {};

  const [experience, setExperience] = useState<Experience[]>(cvData.experience || []);
  const [education, setEducation] = useState<Education[]>(cvData.education || []);
  const [skills, setSkills] = useState<string[]>(cvData.skills || []);
  const [languages, setLanguages] = useState<Language[]>(cvData.languages || []);
  const [certifications, setCertifications] = useState<Certification[]>(cvData.certifications || []);
  const [newSkill, setNewSkill] = useState("");

  const addExperience = () => {
    setExperience([...experience, { position: "", company: "", period: "", description: "" }]);
  };

  const removeExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const updated = [...experience];
    updated[index] = { ...updated[index], [field]: value };
    setExperience(updated);
  };

  const addEducation = () => {
    setEducation([...education, { degree: "", institution: "", period: "", description: "" }]);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addLanguage = () => {
    setLanguages([...languages, { language: "", level: "" }]);
  };

  const removeLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const updateLanguage = (index: number, field: keyof Language, value: string) => {
    const updated = [...languages];
    updated[index] = { ...updated[index], [field]: value };
    setLanguages(updated);
  };

  const addCertification = () => {
    setCertifications([...certifications, { name: "", issuer: "", year: "" }]);
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const updateCertification = (index: number, field: keyof Certification, value: string) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    setCertifications(updated);
  };

  const handleSave = async () => {
    try {
      const updatedCVData = {
        experience,
        education,
        skills,
        languages,
        certifications,
      };

      const { error } = await supabase
        .from('employees')
        .update({ cv_data: updatedCVData as any })
        .eq('id', employee.id);

      if (error) throw error;

      toast({
        title: "Erfolg",
        description: "Lebenslauf wurde aktualisiert",
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error saving CV:', error);
      toast({
        title: "Fehler",
        description: "Lebenslauf konnte nicht gespeichert werden",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Lebenslauf bearbeiten - {employee.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Experience Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Berufserfahrung
                <Button onClick={addExperience} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {experience.map((exp, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Erfahrung {index + 1}</h4>
                    <Button
                      onClick={() => removeExperience(index)}
                      size="sm"
                      variant="outline"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Position</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) => updateExperience(index, 'position', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Unternehmen</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Zeitraum</Label>
                    <Input
                      value={exp.period}
                      onChange={(e) => updateExperience(index, 'period', e.target.value)}
                      placeholder="z.B. 2020 - 2023"
                    />
                  </div>
                  <div>
                    <Label>Beschreibung</Label>
                    <Textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Education Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Ausbildung
                <Button onClick={addEducation} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Ausbildung {index + 1}</h4>
                    <Button
                      onClick={() => removeEducation(index)}
                      size="sm"
                      variant="outline"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Abschluss</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Institution</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Zeitraum</Label>
                    <Input
                      value={edu.period}
                      onChange={(e) => updateEducation(index, 'period', e.target.value)}
                      placeholder="z.B. 2016 - 2020"
                    />
                  </div>
                  <div>
                    <Label>Beschreibung</Label>
                    <Textarea
                      value={edu.description}
                      onChange={(e) => updateEducation(index, 'description', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card>
            <CardHeader>
              <CardTitle>Kompetenzen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Neue Kompetenz hinzufügen"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <Button onClick={addSkill}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 bg-secondary px-3 py-1 rounded">
                    <span>{skill}</span>
                    <Button
                      onClick={() => removeSkill(index)}
                      size="sm"
                      variant="ghost"
                      className="p-0 h-auto"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Languages Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Sprachen
                <Button onClick={addLanguage} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {languages.map((lang, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <Label>Sprache</Label>
                    <Input
                      value={lang.language}
                      onChange={(e) => updateLanguage(index, 'language', e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Niveau</Label>
                    <Input
                      value={lang.level}
                      onChange={(e) => updateLanguage(index, 'level', e.target.value)}
                      placeholder="z.B. Muttersprache, Fließend, Grundkenntnisse"
                    />
                  </div>
                  <Button
                    onClick={() => removeLanguage(index)}
                    size="sm"
                    variant="outline"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Certifications Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Zertifikate
                <Button onClick={addCertification} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {certifications.map((cert, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Zertifikat {index + 1}</h4>
                    <Button
                      onClick={() => removeCertification(index)}
                      size="sm"
                      variant="outline"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={cert.name}
                        onChange={(e) => updateCertification(index, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Aussteller</Label>
                      <Input
                        value={cert.issuer}
                        onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Jahr</Label>
                      <Input
                        value={cert.year}
                        onChange={(e) => updateCertification(index, 'year', e.target.value)}
                        placeholder="z.B. 2023"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button onClick={onClose} variant="outline">
              Abbrechen
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Speichern
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};