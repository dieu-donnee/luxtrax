
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import AuthPage from "./pages/auth";
import BookingPage from "./pages/booking";
import PrivacyPolicy from "./pages/privacy";
import TermsOfService from "./pages/terms";
import NotFound from "./pages/NotFound";

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Move the useAuth hook inside a component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
}

// Main routes component
const AppRoutes = () => {
  return (
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
  );
};

// Make sure to import useAuth after we use AppRoutes
import { useAuth } from "./contexts/AuthContext";

// Main App component
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
