import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import BookingFlow from './pages/BookingFlow';
import Profile from './pages/Profile';
import Support from './pages/Support';
import Notifications from './pages/Notifications';
import Review from './pages/Review';
import Complaint from './pages/Complaint';
import Bookings from './pages/Bookings';
import AdminServices from './pages/AdminServices';
import AdminOffers from './pages/AdminOffers';
import ProviderDashboard from './pages/ProviderDashboard';
import { useAuth } from '@/hooks/useAuth';
import { supabase, setClerkTokenFetcher } from '@/integrations/supabase/client';
import { useEffect } from 'react';

function ClerkSupabaseSync() {
  const { user, getToken } = useAuth();

  useEffect(() => {
    setClerkTokenFetcher(() => getToken({ template: 'supabase' }));
  }, [getToken]);

  useEffect(() => {
    if (!user) return;

    const syncProfile = async () => {
      // Read role from Clerk unsafeMetadata (set at signup)
      const meta = user.unsafeMetadata as Record<string, unknown> | undefined;
      const role = meta?.role === 'provider' ? 'provider' : 'client';

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        role: role as any,
      }, { onConflict: 'id' });

      if (error) {
        console.error('[ClerkSupabaseSync] Erreur sync profil:', error);
      }
    };

    syncProfile();
  }, [user]);

  return null;
}

function App() {
  return (
    <Router>
      <ClerkSupabaseSync />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<BookingFlow />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/support" element={<Support />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/review/:bookingId" element={<Review />} />
        <Route path="/complaint/:bookingId" element={<Complaint />} />
        <Route path="/provider" element={<ProviderDashboard />} />
        <Route path="/admin/services" element={<AdminServices />} />
        <Route path="/admin/offers" element={<AdminOffers />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
