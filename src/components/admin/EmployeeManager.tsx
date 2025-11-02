import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Save, X, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { type Tables } from "@/integrations/supabase/types";
import { resolveTeamImage } from "@/lib/teamImageResolver";

type Employee = Tables<'employees'>;
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CVEditor } from "./CVEditor";
import { ImageCropper } from "@/components/ui/image-cropper";
import { ImagePicker } from "./ImagePicker";

export const EmployeeManager = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [cvEditingEmployee, setCvEditingEmployee] = useState<Employee | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    email: "",
    phone: "",
    linkedin: "",
    xing: "",
    image_url: "",
    is_active: true,
    sort_order: 0,
    cv_data: {}
  });
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [imageCleared, setImageCleared] = useState(false);
  const getCropRef = useRef<(() => string | null) | null>(null);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: "Fehler",
        description: "Mitarbeiter konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      
      console.log('Saving with image URL:', imageUrl ? 'Has image' : 'No image');
      
      if (editingEmployee) {
        const { error } = await supabase
          .from('employees')
          .update({
            ...formData,
            image_url: imageUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingEmployee.id);

        if (error) throw error;
        toast({ title: "Berater aktualisiert", description: "Die Änderungen wurden gespeichert." });
      } else {
        const { error } = await supabase
          .from('employees')
          .insert([{
            ...formData,
            image_url: imageUrl
          }]);

        if (error) throw error;
        toast({ title: "Berater erstellt", description: "Der neue Berater wurde hinzugefügt." });
      }
      
      setIsDialogOpen(false);
      setEditingEmployee(null);
      resetForm();
      fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
      toast({
        title: "Fehler",
        description: "Berater konnte nicht gespeichert werden",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      title: employee.title,
      description: employee.description || "",
      email: employee.email,
      phone: employee.phone || "",
      linkedin: employee.linkedin || "",
      xing: employee.xing || "",
      image_url: employee.image_url || "",
      is_active: employee.is_active,
      sort_order: employee.sort_order || 0,
      cv_data: employee.cv_data || {}
    });
    setCroppedImage(null);
    setImageCleared(false);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sind Sie sicher, dass Sie diesen Mitarbeiter löschen möchten?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({
        title: "Erfolg",
        description: "Mitarbeiter wurde gelöscht",
      });
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast({
        title: "Fehler",
        description: "Mitarbeiter konnte nicht gelöscht werden",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      title: "",
      description: "",
      email: "",
      phone: "",
      linkedin: "",
      xing: "",
      image_url: "",
      is_active: true,
      sort_order: 0,
      cv_data: {}
    });
    setCroppedImage(null);
  };

  const openCreateDialog = () => {
    setEditingEmployee(null);
    resetForm();
    setCroppedImage(null);
    setIsDialogOpen(true);
  };

  if (isLoading) return <div>Laden...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Berater verwalten</h2>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Neuer Berater
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((employee) => (
          <Card key={employee.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                {(() => {
                  const resolved = resolveTeamImage(employee.image_url);
                  console.log('Employee image resolved:', {
                    name: employee.name,
                    original: employee.image_url,
                    resolved,
                  });
                  return (
                    <img
                      src={resolved || "/placeholder.svg"}
                      alt={`${employee.name} – Portrait`}
                      className="w-12 h-12 rounded-full object-cover"
                      loading="lazy"
                    />
                  );
                })()}
                <div>
                  <h3 className="font-semibold">{employee.name}</h3>
                  <p className="text-sm text-muted-foreground">{employee.title}</p>
                  <p className="text-xs text-muted-foreground">Sortierung: {employee.sort_order || 0}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{employee.description}</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded ${employee.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {employee.is_active ? 'Aktiv' : 'Inaktiv'}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(employee)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCvEditingEmployee(employee)}
                  >
                    <FileText className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(employee.id)}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEmployee ? 'Berater bearbeiten' : 'Neuer Berater'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="title">Position *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">E-Mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="xing">Xing URL</Label>
                <Input
                  id="xing"
                  value={formData.xing}
                  onChange={(e) => setFormData({ ...formData, xing: e.target.value })}
                />
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="col-span-2 space-y-2">
              <Label>Profilbild</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setImagePickerOpen(true)}
                  className="flex-1"
                >
                  Bild aus Bibliothek wählen
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({ ...formData, image_url: "" });
                    setImageCleared(true);
                  }}
                >
                  Bild entfernen
                </Button>
              </div>
              {formData.image_url && (
                <div className="aspect-square w-32 mx-auto rounded-full overflow-hidden bg-muted">
                  <img
                    src={resolveTeamImage(formData.image_url)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                Alternativ: Bild hochladen und zuschneiden
              </div>
              <ImageCropper
                onImageChange={(data) => { setImageCleared(data === null); }}
                onGetCurrentCrop={getCropRef}
                initialImage={formData.image_url}
                cropSize={200}
              />
            </div>

            <ImagePicker
              open={imagePickerOpen}
              onOpenChange={setImagePickerOpen}
              onSelect={(url) => setFormData({ ...formData, image_url: url })}
              currentImageUrl={formData.image_url}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sort_order">Sortierung (0 = erste Position)</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  min="0"
                  step="1"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Aktiv</Label>
              </div>
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

      {/* CV Editor Dialog */}
      {cvEditingEmployee && (
        <CVEditor
          employee={cvEditingEmployee}
          isOpen={!!cvEditingEmployee}
          onClose={() => setCvEditingEmployee(null)}
          onUpdate={fetchEmployees}
        />
      )}
    </div>
  );
};