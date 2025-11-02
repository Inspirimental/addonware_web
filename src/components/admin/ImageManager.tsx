import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Trash2, Copy, Search, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Image {
  id: string;
  filename: string;
  storage_path: string;
  url: string;
  alt_text: string | null;
  size: number;
  mime_type: string;
  created_at: string;
}

export const ImageManager = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteImageId, setDeleteImageId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      console.log("ImageManager: Loading images from database...");

      const { data: { user } } = await supabase.auth.getUser();
      console.log("ImageManager: Current user:", user?.id);

      const { data, error } = await supabase
        .from("media_files")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("ImageManager: Images query result:", { data, error, count: data?.length });

      if (error) throw error;

      const imagesWithUrls = (data || []).map(img => {
        const publicUrlData = supabase.storage.from('images').getPublicUrl(img.storage_path);
        console.log('ImageManager: Generated URL for', img.filename, ':', publicUrlData.data.publicUrl);
        return {
          ...img,
          url: publicUrlData.data.publicUrl
        };
      });

      setImages(imagesWithUrls);
      console.log(`ImageManager: Loaded ${imagesWithUrls?.length || 0} images`);
    } catch (error) {
      console.error("Error loading images:", error);
      toast({
        title: "Fehler",
        description: "Bilder konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Nicht authentifiziert");

      for (const file of Array.from(files)) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("images").getPublicUrl(filePath);

        const { error: dbError } = await supabase.from("media_files").insert({
          filename: file.name,
          storage_path: filePath,
          url: publicUrl,
          size: file.size,
          mime_type: file.type,
          uploaded_by: user.id,
        });

        if (dbError) throw dbError;
      }

      toast({
        title: "Erfolg",
        description: `${files.length} Bild(er) erfolgreich hochgeladen`,
      });

      loadImages();
      event.target.value = "";
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Fehler",
        description: "Bild konnte nicht hochgeladen werden",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (image: Image) => {
    try {
      const { error: storageError } = await supabase.storage
        .from("images")
        .remove([image.storage_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from("media_files")
        .delete()
        .eq("id", image.id);

      if (dbError) throw dbError;

      toast({
        title: "Erfolg",
        description: "Bild wurde gelöscht",
      });

      loadImages();
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Fehler",
        description: "Bild konnte nicht gelöscht werden",
        variant: "destructive",
      });
    } finally {
      setDeleteImageId(null);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL kopiert",
      description: "Die Bild-URL wurde in die Zwischenablage kopiert",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const filteredImages = images.filter((img) =>
    img.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bildverwaltung</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="file-upload">Bilder hochladen</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                disabled={uploading}
                className="flex-1"
              />
              {uploading && <Loader2 className="h-5 w-5 animate-spin" />}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Erlaubte Formate: JPEG, PNG, WebP, GIF, SVG. Max. 10 MB pro Bild.
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Bilder durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {filteredImages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {searchTerm ? "Keine Bilder gefunden" : "Noch keine Bilder hochgeladen"}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredImages.map((image) => (
            <Card key={image.id}>
              <CardContent className="p-4">
                <div className="aspect-video relative rounded-lg overflow-hidden bg-muted mb-3">
                  <img
                    src={image.url}
                    alt={image.alt_text || image.filename}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('.error-placeholder')) {
                        const placeholder = document.createElement('div');
                        placeholder.className = 'error-placeholder flex items-center justify-center h-full text-muted-foreground text-sm';
                        placeholder.textContent = 'Bild nicht verfügbar';
                        parent.appendChild(placeholder);
                      }
                    }}
                    loading="lazy"
                  />
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-sm truncate" title={image.filename}>
                    {image.filename}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(image.size)} • {new Date(image.created_at).toLocaleDateString("de-DE")}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => copyToClipboard(image.url)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      URL kopieren
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteImageId(image.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteImageId} onOpenChange={() => setDeleteImageId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bild löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Das Bild wird
              permanent gelöscht.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const image = images.find((img) => img.id === deleteImageId);
                if (image) handleDelete(image);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
