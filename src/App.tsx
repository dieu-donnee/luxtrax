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
import { useAuth } from '@clerk/react';
import { setClerkTokenFetcher } from '@/integrations/supabase/client';
import { useEffect } from 'react';

function ClerkSupabaseSync() {
  const { getToken } = useAuth();
  useEffect(() => {
    // Lie le client Supabase au token Clerk (en utilisant le template 'supabase')
    setClerkTokenFetcher(() => getToken({ template: 'supabase' }));
  }, [getToken]);
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
