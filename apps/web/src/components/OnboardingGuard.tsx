import { Navigate, useLocation } from "react-router-dom";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const path = location.pathname;

  // TOEIC routes
  if (path.startsWith("/toeic")) {
    // Allow onboarding/bienvenue through
    if (path.startsWith("/toeic/onboarding") || path.startsWith("/toeic/bienvenue")) {
      return <>{children}</>;
    }

    const onboardingComplete = localStorage.getItem("toeic-onboarding-complete") === "true";
    const bienvenueComplete = localStorage.getItem("toeic-bienvenue-complete") === "true";

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

  // TAGE routes — allow onboarding/bienvenue through
  if (path.startsWith("/onboarding") || path.startsWith("/bienvenue")) {
    return <>{children}</>;
  }

  const onboardingComplete = localStorage.getItem("onboarding-complete") === "true";
  const bienvenueComplete = localStorage.getItem("bienvenue-complete") === "true";

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
