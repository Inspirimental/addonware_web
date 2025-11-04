import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { ImagePicker } from "./ImagePicker";

type CaseStudyDB = Database['public']['Tables']['case_studies']['Row'];
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const categories = ["Smart Factory", "Smart Mobility", "Smart Data"];

export const CaseStudyManager = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudyDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCaseStudy, setEditingCaseStudy] = useState<CaseStudyDB | null>(null);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    industry: "",
    category: "",
    challenge: "",
    result: "",
    duration: "",
    company: "",
    detailed_description: "",
    technologies: [] as string[],
    outcomes: [] as string[],
    tags: [] as string[],
    image_url: "",
    date: new Date().toISOString().split('T')[0],
    is_active: true,
    problem_description: "",
    solution_locked: false,
    pdf_url: ""
  });

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .order('date', { ascending: false });

      const rows = (data ?? []) as any[];
      const normalized = rows.map((r) => ({
        ...r,
        technologies: Array.isArray(r.technologies) ? (r.technologies as string[]) : [],
        outcomes: Array.isArray(r.outcomes) ? (r.outcomes as string[]) : [],
        tags: Array.isArray(r.tags) ? (r.tags as string[]) : [],
      })) as CaseStudyDB[];
      setCaseStudies(normalized);
    } catch (error) {
      console.error('Error fetching case studies:', error);
      toast({
        title: "Fehler",
        description: "Use-Cases konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCaseStudy) {
        const { error } = await supabase
          .from('case_studies')
          .update(formData)
          .eq('id', editingCaseStudy.id);
        
        if (error) throw error;
        toast({
          title: "Erfolg",
          description: "Use-Case wurde aktualisiert",
        });
      } else {
        const { error } = await supabase
          .from('case_studies')
          .insert([formData]);
        
        if (error) throw error;
        toast({
          title: "Erfolg",
          description: "Use-Case wurde erstellt",
        });
      }
      
      setIsDialogOpen(false);
      setEditingCaseStudy(null);
      resetForm();
      fetchCaseStudies();
    } catch (error) {
      console.error('Error saving case study:', error);
      toast({
        title: "Fehler",
        description: "Use-Case konnte nicht gespeichert werden",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (caseStudy: CaseStudyDB) => {
    setEditingCaseStudy(caseStudy);
    setFormData({
      title: caseStudy.title,
      industry: caseStudy.industry,
      category: caseStudy.category,
      challenge: caseStudy.challenge,
      result: caseStudy.result,
      duration: caseStudy.duration,
      company: caseStudy.company,
      detailed_description: caseStudy.detailed_description || "",
      technologies: caseStudy.technologies || [],
      outcomes: caseStudy.outcomes || [],
      tags: caseStudy.tags || [],
      image_url: caseStudy.image_url || "",
      date: (caseStudy.date.includes('T') ? caseStudy.date.split('T')[0] : caseStudy.date),
      is_active: caseStudy.is_active,
      problem_description: caseStudy.problem_description || "",
      solution_locked: caseStudy.solution_locked || false,
      pdf_url: caseStudy.pdf_url || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sind Sie sicher, dass Sie diesen Use-Case löschen möchten?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('case_studies')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({
        title: "Erfolg",
        description: "Use-Case wurde gelöscht",
      });
      fetchCaseStudies();
    } catch (error) {
      console.error('Error deleting case study:', error);
      toast({
        title: "Fehler",
        description: "Use-Case konnte nicht gelöscht werden",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      industry: "",
      category: "",
      challenge: "",
      result: "",
      duration: "",
      company: "",
      detailed_description: "",
      technologies: [],
      outcomes: [],
      tags: [],
      image_url: "",
      date: new Date().toISOString().split('T')[0],
      is_active: true,
      problem_description: "",
      solution_locked: false,
      pdf_url: ""
    });
  };

  const openCreateDialog = () => {
    setEditingCaseStudy(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleArrayFieldChange = (field: 'technologies' | 'outcomes' | 'tags', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData({ ...formData, [field]: items });
  };

  if (isLoading) return <div>Laden...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Use-Cases verwalten</h2>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Neuer Use-Case
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {caseStudies.map((caseStudy) => (
          <Card key={caseStudy.id}>
            <CardContent className="p-4">
              <div className="mb-3">
                <h3 className="font-semibold">{caseStudy.title}</h3>
                <p className="text-sm text-muted-foreground">{caseStudy.company}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {caseStudy.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(caseStudy.date).toLocaleDateString('de-DE')}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{caseStudy.challenge}</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded ${caseStudy.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {caseStudy.is_active ? 'Aktiv' : 'Inaktiv'}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(caseStudy)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(caseStudy.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCaseStudy ? 'Use-Case bearbeiten' : 'Neuer Use-Case'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Titel *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="company">Unternehmen *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="industry">Branche</Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="category">Kategorie</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategorie wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Dauer</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="challenge">Herausforderung</Label>
              <Textarea
                id="challenge"
                value={formData.challenge}
                onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
              />
            </div>


            <div>
              <Label htmlFor="result">Ergebnis</Label>
              <Textarea
                id="result"
                value={formData.result}
                onChange={(e) => setFormData({ ...formData, result: e.target.value })}
              />
            </div>


            <div>
              <Label htmlFor="problem_description">Problemstellung (detailliert)</Label>
              <Textarea
                id="problem_description"
                value={formData.problem_description}
                onChange={(e) => setFormData({ ...formData, problem_description: e.target.value })}
                placeholder="Ausführliche Problemstellung (10-12 Sätze, immer sichtbar)"
                rows={6}
              />
            </div>


            <div className="flex items-center space-x-2">
              <Switch
                id="solution_locked"
                checked={formData.solution_locked}
                onCheckedChange={(checked) => setFormData({ ...formData, solution_locked: checked })}
              />
              <Label htmlFor="solution_locked" className="cursor-pointer">
                Lösung per E-Mail freischalten (Lead-Generierung)
              </Label>
            </div>

            {formData.solution_locked && (
              <div>
                <Label htmlFor="pdf_url">PDF Download URL (optional)</Label>
                <Input
                  id="pdf_url"
                  value={formData.pdf_url}
                  onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                  placeholder="https://..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Wird nach Freischaltung angezeigt
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="detailed_description">Detaillierte Beschreibung</Label>
              <Textarea
                id="detailed_description"
                value={formData.detailed_description}
                onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
                placeholder="Vollständiger Lösungsansatz (30-50 Sätze, nur nach Freischaltung sichtbar)"
                rows={8}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="technologies">Technologien (kommagetrennt)</Label>
                <Textarea
                  id="technologies"
                  value={formData.technologies.join(', ')}
                  onChange={(e) => handleArrayFieldChange('technologies', e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="outcomes">Ergebnisse (kommagetrennt)</Label>
                <Textarea
                  id="outcomes"
                  value={formData.outcomes.join(', ')}
                  onChange={(e) => handleArrayFieldChange('outcomes', e.target.value)}
                  rows={2}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tags">Tags (kommagetrennt)</Label>
                <Input
                  id="tags"
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleArrayFieldChange('tags', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="date">Datum</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="image_url">Bild</Label>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setImagePickerOpen(true)}
                  className="w-full justify-start overflow-hidden"
                >
                  {formData.image_url ? (
                    <div className="flex items-center gap-2 w-full min-w-0">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-8 h-8 object-cover rounded flex-shrink-0"
                      />
                      <span className="truncate flex-1 text-left text-sm" title={formData.image_url}>
                        {(() => {
                          const url = formData.image_url;
                          const parts = url.split('/');
                          const filename = parts[parts.length - 1];
                          return filename.length > 30 ? `...${filename.slice(-30)}` : filename;
                        })()}
                      </span>
                    </div>
                  ) : (
                    "Bild auswählen"
                  )}
                </Button>
                {formData.image_url && (
                  <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <ImagePicker
              open={imagePickerOpen}
              onOpenChange={setImagePickerOpen}
              onSelect={(url) => setFormData({ ...formData, image_url: url })}
              currentImageUrl={formData.image_url}
            />

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Aktiv</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                <X className="w-4 h-4 mr-2" />
                Abbrechen
              </Button>
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" />
                Speichern
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};