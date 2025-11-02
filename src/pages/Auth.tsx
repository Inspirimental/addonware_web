import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if user is already logged in and we have their profile
    if (!loading && user && profile) {
      // Small delay to prevent race conditions
      setTimeout(() => {
        if (profile.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/profile', { replace: true });
        }
      }, 100);
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't show login form if user is authenticated and profile is loaded
  if (user && profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <LoginForm />;
};

export default Auth;