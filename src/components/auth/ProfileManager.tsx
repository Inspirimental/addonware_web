import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, User, Mail, Phone, Linkedin, ExternalLink, Lock, Upload, Image, Plus, Trash2, FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useEmployees } from "@/hooks/useEmployees";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImageCropper } from "@/components/ui/image-cropper";

// CV data interfaces
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

export const ProfileManager = () => {
  const { user, profile, isAdmin } = useAuth();
  const { employee, updateEmployee, linkToEmployee } = useProfile();
  const { employees } = useEmployees();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    phone: '',
    linkedin: '',
    xing: '',
    image_url: '',
  });
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [imageCleared, setImageCleared] = useState(false);
  const getCropRef = useRef<(() => string | null) | null>(null);

  // CV data state
  const cvData = (employee?.cv_data as CVData) || {};
  const [experience, setExperience] = useState<Experience[]>(cvData.experience || []);
  const [education, setEducation] = useState<Education[]>(cvData.education || []);
  const [skills, setSkills] = useState<string[]>(cvData.skills || []);
  const [languages, setLanguages] = useState<Language[]>(cvData.languages || []);
  const [certifications, setCertifications] = useState<Certification[]>(cvData.certifications || []);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (employee) {
      setFormData({
        title: employee.title || '',
        description: employee.description || '',
        phone: employee.phone || '',
        linkedin: employee.linkedin || '',
        xing: employee.xing || '',
        image_url: employee.image_url || '',
      });
      
      // Update CV data when employee changes
      const cvData = (employee.cv_data as CVData) || {};
      setExperience(cvData.experience || []);
      setEducation(cvData.education || []);
      setSkills(cvData.skills || []);
      setLanguages(cvData.languages || []);
      setCertifications(cvData.certifications || []);
    }
  }, [employee]);

  // CV manipulation functions
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;

    setLoading(true);
    try {
      let imageUrl: string | null = formData.image_url || null;
      
      if (imageCleared) {
        imageUrl = null; // explicit delete
      } else if (getCropRef.current && typeof getCropRef.current === 'function') {
        // Get current crop automatically when saving
        const croppedData = getCropRef.current();
        if (croppedData) {
          imageUrl = croppedData;
        }
      }

      // Include CV data in the update
      const updatedCVData = {
        experience,
        education,
        skills,
        languages,
        certifications,
      };

      await updateEmployee({ 
        ...formData, 
        image_url: imageUrl,
        cv_data: updatedCVData as any
      });
      toast({
        title: "Profil aktualisiert",
        description: "Ihre Änderungen wurden erfolgreich gespeichert.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Fehler",
        description: "Profil konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLinkEmployee = async () => {
    if (!selectedEmployeeId) return;

    setLoading(true);
    try {
      await linkToEmployee(selectedEmployeeId);
      toast({
        title: "Mitarbeiterprofil verknüpft",
        description: "Ihr Konto wurde erfolgreich mit dem Mitarbeiterprofil verknüpft.",
      });
      setSelectedEmployeeId('');
    } catch (error: any) {
      console.error('Error linking employee:', error);
      toast({
        title: "Fehler",
        description: "Mitarbeiterprofil konnte nicht verknüpft werden.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    // Validate password confirmation
    if (passwordData.password !== passwordData.confirmPassword) {
      toast({
        title: "Passwort-Fehler",
        description: "Die Passwörter stimmen nicht überein.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.password.length < 6) {
      toast({
        title: "Passwort-Fehler", 
        description: "Das Passwort muss mindestens 6 Zeichen lang sein.",
        variant: "destructive",
      });
      return;
    }

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.password
      });

      if (error) throw error;

      toast({
        title: "Passwort geändert",
        description: "Ihr Passwort wurde erfolgreich geändert.",
      });
      
      setPasswordData({ password: '', confirmPassword: '' });
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        title: "Fehler",
        description: error.message || "Passwort konnte nicht geändert werden.",
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };


  const unlinkedEmployees = employees.filter(emp => 
    !employees.some(e => e.id === profile?.employee_id)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Mein Profil
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Persönliche Daten</TabsTrigger>
            <TabsTrigger value="photo">Foto</TabsTrigger>
            <TabsTrigger value="password">Passwort</TabsTrigger>
            <TabsTrigger value="cv">Lebenslauf</TabsTrigger>
          </TabsList>
          
          {/* Personal Data Tab */}
          <TabsContent value="personal" className="space-y-6 mt-6">
            {/* User Account Info */}
            <Card>
              <CardHeader>
                <CardTitle>Benutzerkonto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">E-Mail</p>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>
                  <Badge variant={profile?.role === 'admin' ? 'default' : 'secondary'}>
                    {profile?.role === 'admin' ? 'Administrator' : 'Mitarbeiter'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Link to Employee Profile */}
            {!employee && unlinkedEmployees.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Mit Mitarbeiterprofil verknüpfen</CardTitle>
                  <p className="text-muted-foreground">
                    Verknüpfen Sie Ihr Benutzerkonto mit einem bestehenden Mitarbeiterprofil
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Mitarbeiter auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        {unlinkedEmployees.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.name} - {emp.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleLinkEmployee} 
                      disabled={!selectedEmployeeId || loading}
                    >
                      Verknüpfen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Employee Profile Form */}
            {employee && (
              <form onSubmit={handleSubmit}>
                <Card>
                  <CardHeader>
                    <CardTitle>Mitarbeiterprofil</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Read-only fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input value={employee.name} disabled className="bg-muted" />
                        {!isAdmin && (
                          <p className="text-xs text-muted-foreground">Name kann nicht geändert werden</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>E-Mail</Label>
                        <Input value={employee.email} disabled className="bg-muted" />
                        {!isAdmin && (
                          <p className="text-xs text-muted-foreground">E-Mail kann nicht geändert werden</p>
                        )}
                      </div>
                    </div>

                    {/* Editable fields */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Position</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="z.B. Senior-Berater"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Beschreibung</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Kurze Beschreibung Ihrer Tätigkeiten und Expertise"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefon</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="+49 (0) 123 / 456789"
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn Profil</Label>
                        <div className="relative">
                          <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="linkedin"
                            value={formData.linkedin}
                            onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                            placeholder="https://www.linkedin.com/in/ihr-profil"
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="xing">XING Profil</Label>
                        <div className="relative">
                          <ExternalLink className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="xing"
                            value={formData.xing}
                            onChange={(e) => setFormData(prev => ({ ...prev, xing: e.target.value }))}
                            placeholder="https://www.xing.com/profile/Ihr_Name"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <Button type="submit" disabled={loading} className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      {loading ? 'Wird gespeichert...' : 'Änderungen speichern'}
                    </Button>
                  </CardContent>
                </Card>
              </form>
            )}
          </TabsContent>

          {/* Photo Tab */}
          <TabsContent value="photo" className="space-y-6 mt-6">
            {employee ? (
              <Card>
                <CardHeader>
                  <CardTitle>Profilbild</CardTitle>
                  <p className="text-muted-foreground">
                    Laden Sie Ihr Profilbild hoch und passen Sie den Bildausschnitt an
                  </p>
                </CardHeader>
                <CardContent>
                  <ImageCropper
                    onImageChange={(data) => { setImageCleared(data === null); }}
                    onGetCurrentCrop={getCropRef}
                    initialImage={formData.image_url}
                    cropSize={200}
                  />
                  <Button 
                    onClick={handleSubmit} 
                    disabled={loading} 
                    className="flex items-center gap-2 mt-4"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Wird gespeichert...' : 'Foto speichern'}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">
                    Verknüpfen Sie zuerst Ihr Konto mit einem Mitarbeiterprofil, um ein Profilbild hochzuladen.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Password Tab */}
          <TabsContent value="password" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Passwort ändern
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Neues Passwort</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.password}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Mindestens 6 Zeichen"
                      minLength={6}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword">Passwort bestätigen</Label>
                    <Input
                      id="confirmNewPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Passwort wiederholen"
                      minLength={6}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={passwordLoading} className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    {passwordLoading ? 'Wird geändert...' : 'Passwort ändern'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CV Tab */}
          <TabsContent value="cv" className="space-y-6 mt-6">
            {employee ? (
              <div className="space-y-6">
                {/* Experience Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Berufserfahrung
                      </span>
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

                <Button 
                  onClick={handleSubmit} 
                  disabled={loading} 
                  className="flex items-center gap-2 w-full"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Wird gespeichert...' : 'Lebenslauf speichern'}
                </Button>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Verknüpfen Sie zuerst Ihr Konto mit einem Mitarbeiterprofil, um Ihren Lebenslauf zu bearbeiten.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};