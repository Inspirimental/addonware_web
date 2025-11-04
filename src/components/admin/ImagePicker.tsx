import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Search, X, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface ImagePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (imageUrl: string) => void;
  currentImageUrl?: string;
}

export const ImagePicker = ({
  open,
  onOpenChange,
  onSelect,
  currentImageUrl,
}: ImagePickerProps) => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUrl, setSelectedUrl] = useState<string | undefined>(currentImageUrl);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadImages();
      setSelectedUrl(currentImageUrl);
    }
  }, [open, currentImageUrl]);

  const loadImages = async () => {
    try {
      console.log("ImagePicker: Loading images...");

      const { data: { user } } = await supabase.auth.getUser();
      console.log("ImagePicker: Current user:", user?.id);

      const { data, error } = await supabase
        .from("media_files")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("ImagePicker: Query result:", { data, error, count: data?.length });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error("ImagePicker: Error loading images:", error);
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

      const file = files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log("Uploading file to storage bucket 'images':", filePath);

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(filePath);

      console.log("File uploaded, inserting into media_files table:", { publicUrl, filePath });

      const { error: dbError } = await supabase.from("media_files").insert({
        filename: file.name,
        storage_path: filePath,
        url: publicUrl,
        size: file.size,
        mime_type: file.type,
        uploaded_by: user.id,
      });

      if (dbError) {
        console.error("Database error:", dbError);
        throw dbError;
      }

      toast({
        title: "Erfolg",
        description: "Bild erfolgreich hochgeladen",
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

  const handleSelect = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      onOpenChange(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const filteredImages = images.filter((img) =>
    img.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Bild auswählen</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              id="quick-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="flex-1"
            />
            {uploading && <Loader2 className="h-5 w-5 animate-spin" />}
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

          <ScrollArea className="h-[400px] rounded-md border p-4">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                {searchTerm ? "Keine Bilder gefunden" : "Noch keine Bilder hochgeladen"}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredImages.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedUrl(image.url)}
                    className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:border-primary ${
                      selectedUrl === image.url
                        ? "border-primary ring-2 ring-primary ring-offset-2"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt_text || image.filename}
                      className="w-full h-full object-cover"
                    />
                    {selectedUrl === image.url && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="bg-primary text-primary-foreground rounded-full p-2">
                          <Check className="h-5 w-5" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs truncate" title={image.filename}>
                        {image.filename}
                      </p>
                      <p className="text-white/70 text-xs">
                        {formatFileSize(image.size)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleSelect} disabled={!selectedUrl}>
            Bild auswählen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
