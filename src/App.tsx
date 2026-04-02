import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";

// Landing Page Components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import FeaturedFreelancers from "./components/FeaturedFreelancers";
import RecentProjects from "./components/RecentProjects";
import UniqueFeatures from "./components/UniqueFeatures";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import AIChatbot from "./components/AIChatbot";

/* ── Scroll Progress Bar ─────────────────────────────────── */
function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-transparent pointer-events-none">
      <div className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 transition-all duration-75" style={{ width: `${progress}%` }} />
    </div>
  );
}

/* ── Back to Top Button ──────────────────────────────────── */
function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-28 right-6 z-40 w-11 h-11 bg-white border-2 border-slate-200 rounded-2xl shadow-xl shadow-slate-900/10 flex items-center justify-center hover:border-violet-400 hover:shadow-violet-100 hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <svg className="w-4 h-4 text-slate-500 group-hover:text-violet-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path d="M5 15l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/* ── Landing Page ────────────────────────────────────────── */
function LandingPage() {
  return (
    <div className="min-h-screen bg-white antialiased overflow-x-hidden">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Categories />
        <FeaturedFreelancers />
        <RecentProjects />
        <UniqueFeatures />
        <HowItWorks />
        <Testimonials />
      </main>
      <Footer />
      <BackToTop />
      <AIChatbot />
    </div>
  );
}

/* ── Protected Route ─────────────────────────────────────── */
function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === "client" ? "/client-dashboard" : "/freelancer-dashboard"} replace />;
  }
  return <>{children}</>;
}

/* ── App Router ──────────────────────────────────────────── */
function AppRouter() {
  const { isAuthenticated, user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/signin"
        element={isAuthenticated ? <Navigate to={user?.role === "client" ? "/client-dashboard" : "/freelancer-dashboard"} replace /> : <SignIn />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to={user?.role === "client" ? "/client-dashboard" : "/freelancer-dashboard"} replace />: <SignUp />}
      />
      <Route
        path="/client-dashboard"
        element={<ProtectedRoute requiredRole="client"><ClientDashboard /></ProtectedRoute>}
      />
      <Route
        path="/freelancer-dashboard"
        element={<ProtectedRoute requiredRole="freelancer"><FreelancerDashboard /></ProtectedRoute>}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/* ── Root App ────────────────────────────────────────────── */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}
