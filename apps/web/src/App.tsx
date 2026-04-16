import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/lib/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { OnboardingGuard } from "@/components/OnboardingGuard";
import Index from "./pages/Index";
import Cours from "./pages/Cours";
import Lesson from "./pages/Lesson";
import Statistiques from "./pages/Statistiques";
import Entrainement from "./pages/Entrainement";
import SousTests from "./pages/SousTests";
import EntrainementTest from "./pages/EntrainementTest";
import Carnet from "./pages/Carnet";
import Parcours from "./pages/Parcours";
import Flashcards from "./pages/Flashcards";
import TestsBlancs from "./pages/TestsBlancs";
import CalculMental from "./pages/CalculMental";
import LectureAlphabetique from "./pages/LectureAlphabetique";
import Fiches from "./pages/Fiches";
import FAQScore from "./pages/FAQScore";
import CoursLive from "./pages/CoursLive";
import Notifications from "./pages/Notifications";
import Parametres from "./pages/Parametres";
import Classement from "./pages/Classement";
import ToeicDashboard from "./pages/ToeicDashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Onboarding TAGE
import OnboardingLayout from "./pages/onboarding/OnboardingLayout";
import OnboardingCompte from "./pages/onboarding/OnboardingCompte";
import OnboardingProfil from "./pages/onboarding/OnboardingProfil";
import OnboardingTour from "./pages/onboarding/OnboardingTour";
import OnboardingAbonnement from "./pages/onboarding/OnboardingAbonnement";
import OnboardingPaiement from "./pages/onboarding/OnboardingPaiement";

// Bienvenue TAGE
import BienvenueLayout from "./pages/bienvenue/BienvenueLayout";
import BienvenueVideo from "./pages/bienvenue/BienvenueVideo";
import BienvenueTest from "./pages/bienvenue/BienvenueTest";
import BienvenueGeneration from "./pages/bienvenue/BienvenueGeneration";
import BienvenueExercice from "./pages/bienvenue/BienvenueExercice";
import BienvenueDiscord from "./pages/bienvenue/BienvenueDiscord";

// TOEIC pages
import ToeicCours from "./pages/toeic/ToeicCours";
import ToeicLesson from "./pages/toeic/ToeicLesson";
import ToeicEntrainement from "./pages/toeic/ToeicEntrainement";
import ToeicEntrainementTest from "./pages/toeic/ToeicEntrainementTest";
import ToeicTestsBlancs from "./pages/toeic/ToeicTestsBlancs";
import ToeicParcours from "./pages/toeic/ToeicParcours";
import ToeicStatistiques from "./pages/toeic/ToeicStatistiques";
import ToeicGenerateur from "./pages/toeic/ToeicGenerateur";
import ToeicCarnet from "./pages/toeic/ToeicCarnet";
import ToeicFlashcards from "./pages/toeic/ToeicFlashcards";
import ToeicListeningTrainer from "./pages/toeic/ToeicListeningTrainer";
import ToeicFiches from "./pages/toeic/ToeicFiches";
import ToeicNotifications from "./pages/toeic/ToeicNotifications";
import ToeicParametres from "./pages/toeic/ToeicParametres";
import ToeicFAQScore from "./pages/toeic/ToeicFAQScore";
import ToeicClassement from "./pages/toeic/ToeicClassement";

// TOEIC Onboarding
import ToeicOnboardingLayout from "./pages/toeic/onboarding/ToeicOnboardingLayout";
import ToeicOnboardingCompte from "./pages/toeic/onboarding/ToeicOnboardingCompte";
import ToeicOnboardingProfil from "./pages/toeic/onboarding/ToeicOnboardingProfil";
import ToeicOnboardingObjectif from "./pages/toeic/onboarding/ToeicOnboardingObjectif";
import ToeicOnboardingPaiement from "./pages/toeic/onboarding/ToeicOnboardingPaiement";

// TOEIC Bienvenue
import ToeicBienvenueLayout from "./pages/toeic/bienvenue/ToeicBienvenueLayout";
import ToeicBienvenueVideo from "./pages/toeic/bienvenue/ToeicBienvenueVideo";
import ToeicBienvenueNiveau from "./pages/toeic/bienvenue/ToeicBienvenueNiveau";
import ToeicBienvenueDiscord from "./pages/toeic/bienvenue/ToeicBienvenueDiscord";

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
  <ThemeProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <OnboardingGuard>
          <Routes>
            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* TAGE Onboarding pre-payment */}
            <Route element={<OnboardingLayout />}>
              <Route path="/onboarding" element={<OnboardingCompte />} />
              <Route path="/onboarding/profil" element={<OnboardingProfil />} />
              <Route path="/onboarding/abonnement" element={<OnboardingAbonnement />} />
              <Route path="/onboarding/paiement" element={<OnboardingPaiement />} />
            </Route>
            <Route path="/onboarding/tour" element={<OnboardingTour />} />

            {/* TAGE Onboarding post-payment */}
            <Route element={<BienvenueLayout />}>
              <Route path="/bienvenue" element={<BienvenueVideo />} />
              <Route path="/bienvenue/test" element={<BienvenueTest />} />
              <Route path="/bienvenue/generation" element={<BienvenueGeneration />} />
              <Route path="/bienvenue/exercice" element={<BienvenueExercice />} />
              <Route path="/bienvenue/discord" element={<BienvenueDiscord />} />
            </Route>

            {/* TOEIC Onboarding pre-payment */}
            <Route element={<ToeicOnboardingLayout />}>
              <Route path="/toeic/onboarding" element={<ToeicOnboardingCompte />} />
              <Route path="/toeic/onboarding/profil" element={<ToeicOnboardingProfil />} />
              <Route path="/toeic/onboarding/objectif" element={<ToeicOnboardingObjectif />} />
              <Route path="/toeic/onboarding/paiement" element={<ToeicOnboardingPaiement />} />
            </Route>

            {/* TOEIC Onboarding post-payment */}
            <Route element={<ToeicBienvenueLayout />}>
              <Route path="/toeic/bienvenue" element={<ToeicBienvenueVideo />} />
              <Route path="/toeic/bienvenue/niveau" element={<ToeicBienvenueNiveau />} />
              <Route path="/toeic/bienvenue/discord" element={<ToeicBienvenueDiscord />} />
            </Route>

            {/* Main TAGE app */}
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/cours" element={<Cours />} />
              <Route path="/cours/:lessonId" element={<Lesson />} />
              <Route path="/statistiques" element={<Statistiques />} />
              <Route path="/generateur" element={<Entrainement />} />
              <Route path="/sous-tests" element={<SousTests />} />
              <Route path="/entrainement/:testId" element={<EntrainementTest />} />
              <Route path="/tests-blancs" element={<TestsBlancs />} />
              <Route path="/carnet" element={<Carnet />} />
              <Route path="/parcours" element={<Parcours />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/outils/calcul-mental" element={<CalculMental />} />
              <Route path="/outils/lecture-alphabetique" element={<LectureAlphabetique />} />
              <Route path="/outils/fiches" element={<Fiches />} />
              <Route path="/faq-score" element={<FAQScore />} />
              <Route path="/cours-live" element={<CoursLive />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/parametres" element={<Parametres />} />
              <Route path="/classement" element={<Classement />} />

              {/* TOEIC main app */}
              <Route path="/toeic" element={<ToeicDashboard />} />
              <Route path="/toeic/cours" element={<ToeicCours />} />
              <Route path="/toeic/cours/:lessonId" element={<ToeicLesson />} />
              <Route path="/toeic/entrainement" element={<ToeicEntrainement />} />
              <Route path="/toeic/entrainement/:testId" element={<ToeicEntrainementTest />} />
              <Route path="/toeic/tests-blancs" element={<ToeicTestsBlancs />} />
              <Route path="/toeic/parcours" element={<ToeicParcours />} />
              <Route path="/toeic/statistiques" element={<ToeicStatistiques />} />
              <Route path="/toeic/generateur" element={<ToeicGenerateur />} />
              <Route path="/toeic/carnet" element={<ToeicCarnet />} />
              <Route path="/toeic/flashcards" element={<ToeicFlashcards />} />
              <Route path="/toeic/outils/listening-trainer" element={<ToeicListeningTrainer />} />
              <Route path="/toeic/outils/fiches" element={<ToeicFiches />} />
              <Route path="/toeic/notifications" element={<ToeicNotifications />} />
              <Route path="/toeic/parametres" element={<ToeicParametres />} />
              <Route path="/toeic/faq-score" element={<ToeicFAQScore />} />
              <Route path="/toeic/classement" element={<ToeicClassement />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </OnboardingGuard>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ThemeProvider>
  </AuthProvider>
);

export default App;
