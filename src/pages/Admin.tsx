import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AuthGuard } from "@/components/auth/AuthGuard";

const Admin = () => {
  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen flex flex-col">
        <Navigation onConfiguratorOpen={() => {}} />
        <main className="flex-1 py-6">
          <div className="max-w-7xl mx-auto px-4">
            <AdminDashboard />
          </div>
        </main>
        <Footer />
      </div>
    </AuthGuard>
  );
};

export default Admin;