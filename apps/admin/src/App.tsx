import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import AdminGuard from "@/components/layout/AdminGuard";
import AdminLayout from "@/components/layout/AdminLayout";

const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));

const Sections = lazy(() => import("@/pages/content/Sections"));
const Themes = lazy(() => import("@/pages/content/Themes"));
const Chapters = lazy(() => import("@/pages/content/Chapters"));
const Lessons = lazy(() => import("@/pages/content/Lessons"));
const LessonEditor = lazy(() => import("@/pages/content/LessonEditor"));
const Questions = lazy(() => import("@/pages/content/Questions"));
const QuestionEditor = lazy(() => import("@/pages/content/QuestionEditor"));
const Subtests = lazy(() => import("@/pages/content/Subtests"));
const SubtestEditor = lazy(() => import("@/pages/content/SubtestEditor"));
const MockTests = lazy(() => import("@/pages/content/MockTests"));
const MockTestEditor = lazy(() => import("@/pages/content/MockTestEditor"));
const Flashcards = lazy(() => import("@/pages/content/Flashcards"));
const FlashcardEditor = lazy(() => import("@/pages/content/FlashcardEditor"));
const Fiches = lazy(() => import("@/pages/content/Fiches"));
const FicheEditor = lazy(() => import("@/pages/content/FicheEditor"));
const Products = lazy(() => import("@/pages/content/Products"));
const LiveCourses = lazy(() => import("@/pages/content/LiveCourses"));
const LiveCourseEditor = lazy(() => import("@/pages/content/LiveCourseEditor"));

const UsersList = lazy(() => import("@/pages/users/UsersList"));
const UserDetail = lazy(() => import("@/pages/users/UserDetail"));

const AnalyticsOverview = lazy(() => import("@/pages/analytics/AnalyticsOverview"));
const QuizAnalytics = lazy(() => import("@/pages/analytics/QuizAnalytics"));
const EngagementAnalytics = lazy(() => import("@/pages/analytics/EngagementAnalytics"));

function PageLoader() {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="content/products" element={<Products />} />
            <Route path="content/sections" element={<Sections />} />
            <Route path="content/themes" element={<Themes />} />
            <Route path="content/chapters" element={<Chapters />} />
            <Route path="content/lessons" element={<Lessons />} />
            <Route path="content/lessons/new" element={<LessonEditor />} />
            <Route path="content/lessons/:id" element={<LessonEditor />} />
            <Route path="content/questions" element={<Questions />} />
            <Route path="content/questions/new" element={<QuestionEditor />} />
            <Route path="content/questions/:id" element={<QuestionEditor />} />
            <Route path="content/subtests" element={<Subtests />} />
            <Route path="content/subtests/new" element={<SubtestEditor />} />
            <Route path="content/subtests/:id" element={<SubtestEditor />} />
            <Route path="content/mock-tests" element={<MockTests />} />
            <Route path="content/mock-tests/new" element={<MockTestEditor />} />
            <Route path="content/mock-tests/:id" element={<MockTestEditor />} />
            <Route path="content/flashcards" element={<Flashcards />} />
            <Route path="content/flashcards/new" element={<FlashcardEditor />} />
            <Route path="content/flashcards/:id" element={<FlashcardEditor />} />
            <Route path="content/fiches" element={<Fiches />} />
            <Route path="content/fiches/new" element={<FicheEditor />} />
            <Route path="content/fiches/:id" element={<FicheEditor />} />
            <Route path="content/live-courses" element={<LiveCourses />} />
            <Route path="content/live-courses/new" element={<LiveCourseEditor />} />
            <Route path="content/live-courses/:id" element={<LiveCourseEditor />} />
            <Route path="users" element={<UsersList />} />
            <Route path="users/:id" element={<UserDetail />} />
            <Route path="analytics" element={<AnalyticsOverview />} />
            <Route path="analytics/quizzes" element={<QuizAnalytics />} />
            <Route path="analytics/engagement" element={<EngagementAnalytics />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
