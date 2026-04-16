import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Loader2, ShieldX } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export default function AdminGuard() {
  const { user, loading, signOut } = useAuth();
  const [adminCheck, setAdminCheck] = useState<"loading" | "admin" | "denied">("loading");

  useEffect(() => {
    if (loading || !user) return;

    supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setAdminCheck(data?.is_admin ? "admin" : "denied");
      });
  }, [user, loading]);

  if (loading || (user && adminCheck === "loading")) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (adminCheck === "denied") {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <ShieldX className="h-16 w-16 text-destructive" />
        <h1 className="text-2xl font-bold">Acces refuse</h1>
        <p className="text-muted-foreground">
          Vous n'avez pas les droits d'administration.
        </p>
        <Button variant="outline" onClick={signOut}>Se deconnecter</Button>
      </div>
    );
  }

  return <Outlet />;
}
