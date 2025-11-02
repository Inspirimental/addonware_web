import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Mail, Lock, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("login");
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        throw error;
      }
      
      // Redirect will be handled by auth state change in Auth.tsx
      // No immediate redirect here to allow profile loading
    } catch (error: any) {
      console.error('Sign in error:', error);
      setError(
        error.message === 'Invalid login credentials'
          ? 'Ungültige E-Mail oder Passwort'
          : 'Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await signUp(email, password);
      if (error) {
        throw error;
      }
      
      toast({
        title: "Registrierung erfolgreich",
        description: "Bitte bestätigen Sie Ihre E-Mail-Adresse, bevor Sie sich anmelden.",
      });
      setActiveTab("login");
    } catch (error: any) {
      console.error('Sign up error:', error);
      setError(
        error.message.includes('already registered')
          ? 'Diese E-Mail-Adresse ist bereits registriert'
          : 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.'
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Addonware</CardTitle>
          <p className="text-muted-foreground">
            Melden Sie sich an, um das Admin-System zu verwenden
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mt-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">E-Mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="ihre@email.de"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password">Passwort</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Wird angemeldet..." : "Anmelden"}
                </Button>
              </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};