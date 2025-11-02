import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProfileManager } from "@/components/auth/ProfileManager";
import { AuthGuard } from "@/components/auth/AuthGuard";

const Profile = () => {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Navigation onConfiguratorOpen={() => {}} />
        <main className="flex-1 py-6">
          <div className="max-w-4xl mx-auto px-4 pt-20">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Mein Profil</h1>
              <p className="text-muted-foreground">
                Verwalten Sie Ihr Benutzerkonto und Mitarbeiterprofil
              </p>
            </div>
            <ProfileManager />
          </div>
        </main>
        <Footer />
      </div>
    </AuthGuard>
  );
};

export default Profile;