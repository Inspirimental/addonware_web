import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
} from "lucide-react";
import * as Icons from "lucide-react";
import { ImagePicker } from "./ImagePicker";
import { navItems, footerLinks } from "@/config/navigation";

interface HomepageCard {
  id: string;
  title: string;
  subtitle: string;
  teaser: string;
  category: string;
  icon: string;
  background_image: string;
  link_type: string;
  link_value: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CaseStudy {
  id: string;
  title: string;
}

// Kuratierte Icon-Auswahl (ohne Duplikate)
const popularIcons = [
  // Navigation & Orientierung
  "Compass", "Map", "MapPin", "Navigation", "Flag", "Signpost", "Target",

  // Strategie & Führung
  "Brain", "UserCog", "Lightbulb", "UserCheck", "Users", "BadgeCheck", "Scale",
  "Binoculars", "Award", "Crown",

  // Struktur & Organisation
  "Layers", "Layout", "Building", "Grid", "Boxes", "Settings", "SlidersHorizontal",
  "Sliders", "Database", "Network",

  // Compliance & Sicherheit
  "ShieldCheck", "FileText", "Lock", "Key", "EyeOff", "AlarmCheck", "CheckSquare",

  // Insights & Ideen
  "Sparkles", "Search", "ScanLine", "Stars", "BarChart3", "TrendingUp", "ListChecks",

  // Technik & Umsetzung
  "Cpu", "Server", "Code", "Terminal", "Hammer", "Plug", "Chip", "Wrench", "Bug",

  // Prozesse & Wandel
  "Repeat", "RefreshCw", "Circle", "Activity", "RotateCcw", "ArrowLeftRight",
  "ArrowUpDown", "Timer",

  // Dokumentation & Tools
  "Files", "Notebook", "Edit", "Clipboard", "Pen", "Pencil", "Folder", "Archive",

  // Kommunikation & Zusammenarbeit
  "MessageSquare", "User", "Mic", "Phone", "Headset", "Quote", "Mail",

  // Sonstige / UI
  "Star", "Bookmark", "Tag", "Calendar", "Clock", "HelpCircle", "Info", "Globe",
  "Home", "Trash", "Eye", "Zap"
];

const iconNames = popularIcons;

const linkTypes = [
  { value: "internal", label: "Interner Link" },
  { value: "case-study", label: "Case Study" },
  { value: "external", label: "Externe URL" },
];

// Kombiniere alle Navigationselemente für die Auswahl
const getAllNavigationItems = () => {
  const items = [
    { label: "Startseite", path: "/" },
  ];

  // Füge alle Navigations-Einträge hinzu
  navItems.forEach(item => {
    if (item.submenu) {
      // Füge Hauptmenüpunkt als Gruppierung hinzu
      items.push({ label: item.label, path: "", children: item.submenu.map(sub => ({ label: sub.label, path: sub.href })) });
    } else {
      // Füge normalen Menüpunkt hinzu
      items.push({ label: item.label, path: item.href });
    }
  });

  // Füge Footer-Links hinzu
  footerLinks.forEach(link => {
    items.push({ label: link.label, path: link.href });
  });

  return items;
};

export const HomepageManager = () => {
  const [cards, setCards] = useState<HomepageCard[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<HomepageCard | null>(null);
  const [iconOpen, setIconOpen] = useState(false);
  const [iconSearchTerm, setIconSearchTerm] = useState("");
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    teaser: "",
    category: "",
    icon: "FileText",
    background_image: "",
    link_type: "internal",
    link_value: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCards();
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    const { data, error } = await supabase
      .from("case_studies")
      .select("id, title")
      .order("title");

    if (!error && data) {
      setCaseStudies(data);
    }
  };

  const fetchCards = async () => {
    console.log("HomepageManager: Fetching cards...");

    const { data: { user } } = await supabase.auth.getUser();
    console.log("HomepageManager: Current user:", user?.id);

    const { data, error } = await supabase
      .from("service_cards")
      .select("*")
      .order("order_index");

    console.log("HomepageManager: Cards query result:", { data, error, count: data?.length });

    if (error) {
      console.error("HomepageManager: Error loading cards:", error);
      toast({
        title: "Fehler",
        description: "Karten konnten nicht geladen werden",
        variant: "destructive",
      });
      return;
    }

    setCards(data || []);
  };

  const handleOpenDialog = (card?: HomepageCard) => {
    if (card) {
      setEditingCard(card);
      setFormData({
        title: card.title,
        subtitle: card.subtitle,
        teaser: card.teaser,
        category: card.category,
        icon: card.icon,
        background_image: card.background_image,
        link_type: card.link_type,
        link_value: card.link_value,
      });
    } else {
      setEditingCard(null);
      setFormData({
        title: "",
        subtitle: "",
        teaser: "",
        category: "",
        icon: "FileText",
        background_image: "",
        link_type: "service",
        link_value: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCard(null);
  };

  const handleSave = async () => {
    if (
      !formData.title ||
      !formData.subtitle ||
      !formData.teaser ||
      !formData.category ||
      !formData.background_image ||
      !formData.link_value
    ) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Pflichtfelder aus",
        variant: "destructive",
      });
      return;
    }

    if (formData.link_type === "external") {
      const urlPattern = /^https:\/\/.+/;
      if (!urlPattern.test(formData.link_value)) {
        toast({
          title: "Fehler",
          description: "Externe Links müssen mit https:// beginnen",
          variant: "destructive",
        });
        return;
      }
    }

    if (editingCard) {
      const { error } = await supabase
        .from("service_cards")
        .update({ ...formData, updated_at: new Date().toISOString() })
        .eq("id", editingCard.id);

      if (error) {
        toast({
          title: "Fehler",
          description: "Karte konnte nicht aktualisiert werden",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Erfolg",
        description: "Karte wurde erfolgreich aktualisiert",
      });
    } else {
      const maxOrder = Math.max(...cards.map((c) => c.order_index), -1);

      const { error } = await supabase.from("cards").insert({
        ...formData,
        order_index: maxOrder + 1,
        is_active: true,
      });

      if (error) {
        toast({
          title: "Fehler",
          description: "Karte konnte nicht erstellt werden",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Erfolg",
        description: "Karte wurde erfolgreich erstellt",
      });
    }

    handleCloseDialog();
    fetchCards();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Möchten Sie diese Karte wirklich löschen?")) return;

    const { error } = await supabase
      .from("service_cards")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Fehler",
        description: "Karte konnte nicht gelöscht werden",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Erfolg",
      description: "Karte wurde erfolgreich gelöscht",
    });
    fetchCards();
  };

  const handleToggleActive = async (card: HomepageCard) => {
    const { error } = await supabase
      .from("service_cards")
      .update({ is_active: !card.is_active })
      .eq("id", card.id);

    if (error) {
      toast({
        title: "Fehler",
        description: "Status konnte nicht geändert werden",
        variant: "destructive",
      });
      return;
    }

    fetchCards();
  };

  const handleMoveCard = async (index: number, direction: "up" | "down") => {
    const newCards = [...cards];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newCards.length) return;

    [newCards[index], newCards[targetIndex]] = [
      newCards[targetIndex],
      newCards[index],
    ];

    const updates = newCards.map((card, idx) => ({
      id: card.id,
      order_index: idx,
    }));

    for (const update of updates) {
      await supabase
        .from("service_cards")
        .update({ order_index: update.order_index })
        .eq("id", update.id);
    }

    fetchCards();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Startseiten-Kacheln</CardTitle>
              <CardDescription>
                Verwalten Sie die Kacheln auf der Startseite
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Neue Kachel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Reihenfolge</TableHead>
                <TableHead>Titel</TableHead>
                <TableHead>Kategorie</TableHead>
                <TableHead>Link-Typ</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="w-48 text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cards.map((card, index) => (
                <TableRow key={card.id}>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveCard(index, "up")}
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveCard(index, "down")}
                        disabled={index === cards.length - 1}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{card.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{card.category}</Badge>
                  </TableCell>
                  <TableCell>{card.link_type}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(card)}
                    >
                      {card.is_active ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(card)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(card.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCard ? "Kachel bearbeiten" : "Neue Kachel erstellen"}
            </DialogTitle>
            <DialogDescription>
              Füllen Sie die Felder aus, um eine Kachel zu erstellen oder zu
              bearbeiten
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titel *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subtitle">Untertitel *</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData({ ...formData, subtitle: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="teaser">Teaser-Text *</Label>
              <Textarea
                id="teaser"
                value={formData.teaser}
                onChange={(e) =>
                  setFormData({ ...formData, teaser: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Kategorie *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="z.B. Focus Work, Case Study"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="icon">Icon</Label>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIconOpen(true)}
                className="w-full justify-start"
              >
                <div className="flex items-center gap-2">
                  {formData.icon && (() => {
                    const IconComponent = (Icons as any)[formData.icon];
                    return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
                  })()}
                  <span>{formData.icon || "Icon auswählen"}</span>
                </div>
              </Button>
            </div>

            <Dialog open={iconOpen} onOpenChange={setIconOpen}>
              <DialogContent className="max-w-4xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>Icon auswählen</DialogTitle>
                  <DialogDescription>
                    Wählen Sie ein Icon für die Kachel
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Icon suchen..."
                    value={iconSearchTerm}
                    onChange={(e) => setIconSearchTerm(e.target.value)}
                    className="w-full"
                  />
                  <div className="grid grid-cols-8 gap-2 max-h-[50vh] overflow-y-auto p-2">
                    {iconNames
                      .filter((name) =>
                        name.toLowerCase().includes(iconSearchTerm.toLowerCase())
                      )
                      .map((iconName) => {
                        const IconComponent = (Icons as any)[iconName];
                        if (!IconComponent) return null;

                        return (
                          <button
                            key={iconName}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, icon: iconName });
                              setIconOpen(false);
                              setIconSearchTerm("");
                            }}
                            className={cn(
                              "flex items-center justify-center w-full aspect-square rounded-md border-2 hover:bg-accent transition-colors",
                              formData.icon === iconName
                                ? "border-primary bg-primary/10"
                                : "border-border"
                            )}
                            title={iconName}
                          >
                            <IconComponent className="w-6 h-6" />
                          </button>
                        );
                      })}
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <div className="grid gap-2">
              <Label htmlFor="background_image">Hintergrundbild *</Label>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setImagePickerOpen(true)}
                  className="w-full justify-start overflow-hidden"
                >
                  {formData.background_image ? (
                    <div className="flex items-center gap-2 w-full min-w-0">
                      <img
                        src={formData.background_image}
                        alt="Preview"
                        className="w-8 h-8 object-cover rounded flex-shrink-0"
                      />
                      <span className="truncate flex-1 text-left text-sm" title={formData.background_image}>
                        {(() => {
                          const url = formData.background_image;
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
                {formData.background_image && (
                  <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
                    <img
                      src={formData.background_image}
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
              onSelect={(url) => setFormData({ ...formData, background_image: url })}
              currentImageUrl={formData.background_image}
            />

            <div className="grid gap-2">
              <Label htmlFor="link_type">Link-Typ *</Label>
              <Select
                value={formData.link_type}
                onValueChange={(value) => {
                  setFormData({ ...formData, link_type: value, link_value: "" });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {linkTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="link_value">
                {formData.link_type === "internal" && "Seite auswählen *"}
                {formData.link_type === "case-study" && "Case Study auswählen *"}
                {formData.link_type === "external" && "URL eingeben *"}
              </Label>

              {formData.link_type === "internal" && (
                <Select
                  value={formData.link_value}
                  onValueChange={(value) =>
                    setFormData({ ...formData, link_value: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seite auswählen..." />
                  </SelectTrigger>
                  <SelectContent>
                    {getAllNavigationItems().map((item: any) => (
                      <div key={item.label}>
                        {item.children ? (
                          // Hauptmenüpunkt mit Kindern - ausgegraut, nicht auswählbar
                          <>
                            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                              {item.label}
                            </div>
                            {item.children.map((child: any) => (
                              <SelectItem key={child.path} value={child.path} className="pl-6">
                                → {child.label}
                              </SelectItem>
                            ))}
                          </>
                        ) : (
                          // Normaler Menüpunkt ohne Kinder - auswählbar, auf gleicher Ebene wie Hauptmenüpunkte
                          <SelectItem value={item.path} className="px-2 font-semibold text-foreground">
                            {item.label}
                          </SelectItem>
                        )}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {formData.link_type === "case-study" && (
                <Select
                  value={formData.link_value}
                  onValueChange={(value) =>
                    setFormData({ ...formData, link_value: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Case Study auswählen..." />
                  </SelectTrigger>
                  <SelectContent>
                    {caseStudies.map((cs) => (
                      <SelectItem key={cs.id} value={cs.id}>
                        {cs.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {formData.link_type === "external" && (
                <Input
                  id="link_value"
                  value={formData.link_value}
                  onChange={(e) =>
                    setFormData({ ...formData, link_value: e.target.value })
                  }
                  placeholder="https://example.com"
                />
              )}

              <p className="text-sm text-muted-foreground">
                {formData.link_type === "internal" &&
                  "Wählen Sie eine Seite aus dem Navigationsmenü"}
                {formData.link_type === "case-study" &&
                  "Wählen Sie eine Case Study aus der Datenbank"}
                {formData.link_type === "external" &&
                  "URL muss mit https:// beginnen"}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Abbrechen
            </Button>
            <Button onClick={handleSave}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
