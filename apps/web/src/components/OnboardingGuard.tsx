import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useProfile } from "@/hooks/use-profile";

const PUBLIC_PATHS = ["/login", "/onboarding", "/bienvenue", "/toeic/onboarding", "/toeic/bienvenue"];

function isPublic(path: string) {
  return PUBLIC_PATHS.some(p => path === p || path.startsWith(p + "/"));
}

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const path = location.pathname;
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  // Public routes — always pass through
  if (isPublic(path)) {
    return <>{children}</>;
  }

  // Still loading auth/profile
  if (authLoading || (user && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // No session → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // TOEIC routes
  if (path.startsWith("/toeic")) {
    const onboardingComplete =
      profile?.toeic_onboarding_complete ?? localStorage.getItem("toeic-onboarding-complete") === "true";
    const bienvenueComplete =
      profile?.toeic_bienvenue_complete ?? localStorage.getItem("toeic-bienvenue-complete") === "true";

    if (!onboardingComplete) {
      const step = localStorage.getItem("toeic-onboarding-step");
      const redirect = step === "profil" ? "/toeic/onboarding/profil"
        : step === "objectif" ? "/toeic/onboarding/objectif"
        : step === "paiement" ? "/toeic/onboarding/paiement"
        : "/toeic/onboarding";
      return <Navigate to={redirect} replace />;
    }

    if (!bienvenueComplete) {
      const step = localStorage.getItem("toeic-bienvenue-step");
      const redirect = step === "niveau" ? "/toeic/bienvenue/niveau"
        : step === "discord" ? "/toeic/bienvenue/discord"
        : "/toeic/bienvenue";
      return <Navigate to={redirect} replace />;
    }

    return <>{children}</>;
  }

  // TAGE routes
  const onboardingComplete =
    profile?.onboarding_complete ?? localStorage.getItem("onboarding-complete") === "true";
  const bienvenueComplete =
    profile?.bienvenue_complete ?? localStorage.getItem("bienvenue-complete") === "true";

  if (!onboardingComplete) {
    const step = localStorage.getItem("onboarding-step");
    const redirect = step === "profil" ? "/onboarding/profil"
      : step === "tour" ? "/onboarding/tour"
      : step === "abonnement" ? "/onboarding/abonnement"
      : step === "paiement" ? "/onboarding/paiement"
      : "/onboarding";
    return <Navigate to={redirect} replace />;
  }

  if (!bienvenueComplete) {
    const step = localStorage.getItem("bienvenue-step");
    const redirect = step === "test" ? "/bienvenue/test"
      : step === "generation" ? "/bienvenue/generation"
      : step === "exercice" ? "/bienvenue/exercice"
      : step === "discord" ? "/bienvenue/discord"
      : "/bienvenue";
    return <Navigate to={redirect} replace />;
  }

  return <>{children}</>;
}
