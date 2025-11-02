import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Shield, User, Edit, Trash2, Save, X, Link as LinkIcon, Plus, MailCheck, Mail, Unlink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useEmployees } from "@/hooks/useEmployees";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface Profile {
  id: string;
  employee_id: string | null;
  role: 'admin' | 'employee';
  created_at: string;
  updated_at: string;
  employees?: {
    name: string;
    email: string;
  } | null;
}

interface ProfileWithEmail extends Profile {
  email?: string;
}

interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
}

export const UserManager = () => {
  const [profiles, setProfiles] = useState<ProfileWithEmail[]>([]);
  const [authUsers, setAuthUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState<ProfileWithEmail | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteProfile, setDeleteProfile] = useState<ProfileWithEmail | null>(null);
  const [linkingUserId, setLinkingUserId] = useState<string>('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [confirmedEmails, setConfirmedEmails] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    role: 'employee' as 'admin' | 'employee',
    password: '',
    confirmPassword: '',
  });
  const [createUserData, setCreateUserData] = useState({
    email: '',
    password: '',
    role: 'employee' as 'admin' | 'employee',
  });

  const { isAdmin } = useAuth();
  const { employees } = useEmployees();
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin) {
      fetchProfiles();
      fetchAuthUsers();
    }
  }, [isAdmin]);

  useEffect(() => {
    // Load email confirmation status when profiles are loaded
    if (profiles.length > 0) {
      loadEmailConfirmationStatus();
    }
  }, [profiles]);

  const loadEmailConfirmationStatus = async () => {
    const emails = profiles
      .map(profile => profile.email || profile.employees?.email)
      .filter(Boolean);

    if (emails.length === 0) return;

    try {
      const { data, error } = await supabase.functions.invoke('get-user-status', {
        body: { emails },
      });

      if (error) throw error;

      if (data.success && data.confirmedEmails) {
        setConfirmedEmails(new Set(data.confirmedEmails));
      }
    } catch (error: any) {
      console.error('Error loading email confirmation status:', error);
    }
  };

  const fetchProfiles = async () => {
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .rpc('list_profiles_with_email');

      if (profilesError) throw profilesError;

      // Map the function result to the expected format
      const profilesWithEmail: ProfileWithEmail[] = (profilesData || []).map(profile => ({
        id: profile.id,
        employee_id: profile.employee_id,
        role: profile.role,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        email: profile.email,
        employees: profile.employee_name ? {
          name: profile.employee_name,
          email: profile.employee_email
        } : null
      }));

      setProfiles(profilesWithEmail);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({
        title: "Fehler",
        description: "Profile konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthUsers = async () => {
    try {
      // Note: In a real implementation, you'd need an admin function to fetch auth users
      // For now, we'll just use the profiles data
      setAuthUsers([]);
    } catch (error) {
      console.error('Error fetching auth users:', error);
    }
  };

  const handleEdit = (profile: Profile) => {
    setEditingProfile(profile);
    setFormData({
      role: profile.role,
      password: '',
      confirmPassword: '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;

    // Validate password confirmation if password is provided
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwort-Fehler",
        description: "Die Passwörter stimmen nicht überein.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update profile role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role: formData.role,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingProfile.id);

      if (profileError) throw profileError;

      // Update password if provided
      if (formData.password) {
        const { data, error: passwordError } = await supabase.functions.invoke('update-user-password', {
          body: { 
            userId: editingProfile.id,
            password: formData.password 
          }
        });

        if (passwordError || !data?.success) {
          throw new Error(passwordError?.message || data?.error || 'Failed to update password');
        }

        toast({
          title: "Profil und Passwort aktualisiert",
          description: "Die Benutzerrolle und das Passwort wurden erfolgreich geändert.",
        });
      } else {
        toast({
          title: "Profil aktualisiert",
          description: "Die Benutzerrolle wurde erfolgreich geändert.",
        });
      }

      setIsDialogOpen(false);
      setEditingProfile(null);
      fetchProfiles();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Fehler",
        description: error.message || "Profil konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteProfile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', deleteProfile.id);

      if (error) throw error;

      toast({
        title: "Profil gelöscht",
        description: "Das Benutzerprofil wurde erfolgreich gelöscht.",
      });

      setDeleteProfile(null);
      fetchProfiles();
    } catch (error: any) {
      console.error('Error deleting profile:', error);
      toast({
        title: "Fehler",
        description: "Profil konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    }
  };

  const handleLinkEmployee = async () => {
    if (!linkingUserId || !selectedEmployeeId) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ employee_id: selectedEmployeeId })
        .eq('id', linkingUserId);

      if (error) throw error;

      toast({
        title: "Mitarbeiter verknüpft",
        description: "Der Benutzer wurde erfolgreich mit dem Mitarbeiterprofil verknüpft.",
      });

      setLinkingUserId('');
      setSelectedEmployeeId('');
      fetchProfiles();
    } catch (error: any) {
      console.error('Error linking employee:', error);
      toast({
        title: "Fehler",
        description: "Verknüpfung konnte nicht erstellt werden.",
        variant: "destructive",
      });
    }
  };

  const handleUnlinkEmployee = async (profileId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ employee_id: null })
        .eq('id', profileId);

      if (error) throw error;

      toast({
        title: "Verknüpfung gelöst",
        description: "Der Benutzer wurde erfolgreich vom Berater getrennt.",
      });

      fetchProfiles();
    } catch (error: any) {
      console.error('Error unlinking employee:', error);
      toast({
        title: "Fehler",
        description: "Verknüpfung konnte nicht gelöst werden.",
        variant: "destructive",
      });
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Creating user with email:', createUserData.email);
      
      const { data, error } = await supabase.auth.signUp({
        email: createUserData.email,
        password: createUserData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        }
      });

      if (error) throw error;
      console.log('User signup result:', data);

      if (data.user) {
        // Wait a bit for the trigger to create the profile, then insert/update
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({ 
            id: data.user.id,
            role: createUserData.role 
          }, {
            onConflict: 'id'
          });

        if (profileError) {
          console.error('Error upserting profile role:', profileError);
          throw profileError;
        }
        
        console.log('Profile created/updated successfully');
      }

      toast({
        title: "Benutzer erstellt",
        description: "Der neue Benutzer wurde erfolgreich erstellt.",
      });

      setIsCreateDialogOpen(false);
      resetCreateForm();
      
      // Wait a bit more before refetching to ensure data consistency
      setTimeout(() => {
        fetchProfiles();
      }, 500);
      
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: "Fehler",
        description: error.message || "Benutzer konnte nicht erstellt werden.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmEmail = async (email?: string | null) => {
    if (!email) {
      toast({
        title: "E-Mail fehlt",
        description: "Für dieses Profil ist keine E-Mail hinterlegt.",
        variant: "destructive",
      });
      return;
    }
    try {
      const { data, error } = await supabase.functions.invoke('confirm-user', {
        body: { email },
      });
      if (error) throw error;
      setConfirmedEmails(prev => new Set([...prev, email]));
      toast({
        title: "E-Mail bestätigt",
        description: `Der Benutzer ${email} wurde bestätigt.`,
      });
    } catch (error: any) {
      console.error('Error confirming email:', error);
      toast({
        title: "Fehler",
        description: error.message || "E-Mail konnte nicht bestätigt werden.",
        variant: "destructive",
      });
    }
  };
 
   const resetForm = () => {
     setFormData({
       role: 'employee',
       password: '',
       confirmPassword: '',
     });
     setEditingProfile(null);
     setIsDialogOpen(false);
   };

  const resetCreateForm = () => {
    setCreateUserData({
      email: '',
      password: '',
      role: 'employee',
    });
  };

  const unlinkedEmployees = employees.filter(emp => 
    !profiles.some(profile => profile.employee_id === emp.id)
  );

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Sie haben keine Berechtigung, diese Seite zu sehen.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Benutzerverwaltung</h2>
          <p className="text-muted-foreground">
            Verwalten Sie Benutzerrollen und Berechtigungen
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Benutzer hinzufügen
        </Button>
      </div>

      {/* Link Employee Section */}
      {unlinkedEmployees.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5" />
              Berater verknüpfen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Benutzer auswählen</Label>
                <Select value={linkingUserId} onValueChange={setLinkingUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Benutzer auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles.map((profile) => {
                      const isLinked = !!profile.employee_id;
                      return (
                        <SelectItem 
                          key={profile.id} 
                          value={profile.id}
                          disabled={isLinked}
                          className={isLinked ? "opacity-50 cursor-not-allowed" : ""}
                        >
                          {profile.email || profile.employees?.email || 'Unbekannte E-Mail'}
                          {isLinked && ' (bereits verknüpft)'}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Berater auswählen</Label>
                <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Berater auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => {
                      const isLinked = profiles.some(profile => profile.employee_id === employee.id);
                      return (
                        <SelectItem 
                          key={employee.id} 
                          value={employee.id}
                          disabled={isLinked}
                          className={isLinked ? "opacity-50 cursor-not-allowed" : ""}
                        >
                          {employee.name} - {employee.email}
                          {isLinked && ' (bereits verknüpft)'}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  onClick={handleLinkEmployee}
                  disabled={!linkingUserId || !selectedEmployeeId}
                  className="w-full"
                >
                  Verknüpfen
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profiles List */}
      <div className="grid gap-4">
        {profiles.map((profile) => (
          <Card key={profile.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {profile.role === 'admin' ? (
                      <Shield className="w-8 h-8 text-primary" />
                    ) : (
                      <User className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">
                        {profile.employees?.name || 'Nicht verknüpft'}
                      </h3>
                      <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                        {profile.role === 'admin' ? 'Administrator' : 'Berater'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {(profile.email || profile.employees?.email) ?? 'Keine E-Mail'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Erstellt: {new Date(profile.created_at).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {(() => {
                    const email = profile.email || profile.employees?.email;
                    const isConfirmed = email && confirmedEmails.has(email);
                    const IconComponent = isConfirmed ? MailCheck : Mail;
                    const buttonVariant = "outline";
                    const buttonTitle = isConfirmed ? "E-Mail bereits bestätigt" : "E-Mail bestätigen";
                    const iconColor = isConfirmed ? "text-blue-600" : "text-muted-foreground";
                    
                    return (
                      <Button
                        variant={buttonVariant}
                        size="sm"
                        onClick={() => !isConfirmed && handleConfirmEmail(email)}
                        disabled={!email || isConfirmed}
                        title={buttonTitle}
                        className="bg-white"
                      >
                        <IconComponent className={`w-4 h-4 ${iconColor}`} />
                      </Button>
                    );
                  })()}
                  {profile.employee_id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnlinkEmployee(profile.id)}
                      title="Verknüpfung zum Berater lösen"
                      className="bg-white"
                    >
                      <Unlink className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(profile)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteProfile(profile)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        if (!open) resetForm();
        setIsDialogOpen(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Benutzer bearbeiten</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Rolle</Label>
              <Select value={formData.role} onValueChange={(value: 'admin' | 'employee') => 
                setFormData(prev => ({ ...prev, role: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Berater</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Neues Passwort (optional)</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Leer lassen, um Passwort nicht zu ändern"
                minLength={6}
              />
            </div>
            {formData.password && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Passwort wiederholen"
                  minLength={6}
                />
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={resetForm}>
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

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
        if (!open) resetCreateForm();
        setIsCreateDialogOpen(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neuen Benutzer erstellen</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={createUserData.email}
                onChange={(e) => setCreateUserData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="benutzer@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                value={createUserData.password}
                onChange={(e) => setCreateUserData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Mindestens 6 Zeichen"
                minLength={6}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-role">Rolle</Label>
              <Select value={createUserData.role} onValueChange={(value: 'admin' | 'employee') => 
                setCreateUserData(prev => ({ ...prev, role: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Berater</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                <X className="w-4 h-4 mr-2" />
                Abbrechen
              </Button>
              <Button type="submit">
                <Plus className="w-4 h-4 mr-2" />
                Erstellen
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProfile} onOpenChange={() => setDeleteProfile(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Profil löschen</AlertDialogTitle>
            <AlertDialogDescription>
              Sind Sie sicher, dass Sie das Profil von "{deleteProfile?.employees?.name || 'Unbekannt'}" löschen möchten? 
              Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};