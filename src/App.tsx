
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import LoadingScreen from "./pages/Index/components/LoadingScreen";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const AuthPage = lazy(() => import("./pages/auth"));
const BookingPage = lazy(() => import("./pages/booking"));
const PrivacyPolicy = lazy(() => import("./pages/privacy"));
const TermsOfService = lazy(() => import("./pages/terms"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Create a new QueryClient instance with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000, // 1 minute
      cacheTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Component to handle protected routes
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

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
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

// Main App component with proper nesting order
const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <div className="app-container">
            <Toaster />
            <Sonner />
            <AppRoutes />
          </div>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
