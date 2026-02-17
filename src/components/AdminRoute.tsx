import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AdminRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AdminRoute = ({ children, requireAuth = false }: AdminRouteProps) => {
  const [status, setStatus] = useState<"loading" | "admin" | "authenticated" | "denied">("loading");

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // No session: allow access to login page, deny dashboard
        setStatus(requireAuth ? "denied" : "admin");
        return;
      }

      const { data: isAdmin } = await supabase.rpc("is_admin", {
        _email: session.user.email ?? "",
      });

      if (isAdmin) {
        setStatus("admin");
      } else {
        // Logged in but not admin
        await supabase.auth.signOut();
        setStatus("denied");
      }
    };

    check();
  }, [requireAuth]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Checking access...</p>
      </div>
    );
  }

  if (status === "denied") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
