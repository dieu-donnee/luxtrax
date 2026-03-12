
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import LoadingScreen from "./pages/Index/components/LoadingScreen";
import BottomNav from "./components/layout/BottomNav";

// Import pages directly to debug the auth import issue
import Index from "./pages/Index";
import AuthPage from "./pages/auth";
const BookingPage = lazy(() => import("./pages/booking/BookingPageV2"));
const AdminPage = lazy(() => import("./pages/admin"));
const PrivacyPolicy = lazy(() => import("./pages/privacy"));
const TermsOfService = lazy(() => import("./pages/terms"));
const ProviderOnboarding = lazy(() => import("./pages/auth/ProviderOnboarding"));
const ProviderWallet = lazy(() => import("./pages/provider/ProviderWallet"));
const Academy = lazy(() => import("./pages/provider/Academy"));
const ProviderMissions = lazy(() => import("./pages/provider/ProviderMissions"));
const Bookings = lazy(() => import("./pages/bookings/v2/BookingHistoryV2"));
const Profile = lazy(() => import("./pages/profile"));
const Support = lazy(() => import("./pages/support"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AuthCallback = lazy(() => import("./pages/auth/AuthCallback"));

// Create a new QueryClient instance with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Component to handle protected routes
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  // The linter might complain if it's not used, but it's checked in the if statement.
  // Wait, the lint said 35:9 'user' is assigned a value but never used. 
  // But it IS used in the line below: if (!user) { ... }
  // This might be a false positive or I misread the line number. 
  // Actually, sometimes linters complain if it's only used in a check but then the body doesn't use it.
  // I'll check if there's any other 'user' variable.


  if (!user) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
}

// Main routes component with Suspense for code splitting
const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/provider/onboarding"
          element={
            <ProtectedRoute>
              <ProviderOnboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/wallet"
          element={
            <ProtectedRoute>
              <ProviderWallet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/academy"
          element={
            <ProtectedRoute>
              <Academy />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/missions"
          element={
            <ProtectedRoute>
              <ProviderMissions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support"
          element={
            <ProtectedRoute>
              <Support />
            </ProtectedRoute>
          }
        />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

import Sidebar from "./components/layout/Sidebar";

// Main App component with proper nesting order
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <AppLayout />
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const AppLayout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";

  return (
    <div className="app-container min-h-screen">
      <Sidebar />
      <div className={cn(
        "min-h-screen flex flex-col",
        !isAuthPage && "lg:pl-72 pt-16 lg:pt-0"
      )}>
        <Toaster />
        <Sonner />
        <main className="flex-1">
          <AppRoutes />
        </main>
      </div>
      <BottomNav />
    </div>
  );
};

export default App;
