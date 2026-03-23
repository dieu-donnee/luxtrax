import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { BookingData, ProfileData } from '@/types/models';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import BookingCard from '../components/ui/BookingCard';
import EmptyState from '../components/ui/EmptyState';
import { BookingCardSkeleton } from '../components/ui/Skeleton';
import { ChevronRight, Droplets } from 'lucide-react';
import styles from './Home.module.css';

const Car3D = lazy(() => import('../components/3d/Car3D'));

const Home = () => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [recentBookings, setRecentBookings] = useState<BookingData[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setDataLoading(false); return; }

    const fetchData = async () => {
      const [profileRes, bookingsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('bookings').select('*, services(name, price)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(2),
      ]);
      if (profileRes.data) setProfile(profileRes.data as unknown as ProfileData);
      if (bookingsRes.data) setRecentBookings(bookingsRes.data as unknown as BookingData[]);
      setDataLoading(false);
    };
    fetchData();
  }, [user, authLoading]);

  const firstName = profile?.full_name?.split(' ')[0] || 'Bienvenue';

  return (
    <MainLayout>
      <div className={styles.dashboard}>
        {/* Greeting */}
        <header className={styles.greeting}>
          <div>
            <p className={styles.greetingSub}>Bonjour 👋</p>
            <h1 className={styles.greetingName}>{firstName}</h1>
          </div>
          {!authLoading && !user && (
            <Button onClick={() => navigate('/auth')} size="sm" variant="outline">
              Connexion
            </Button>
          )}
        </header>

        {/* 3D Car */}
        <section className={styles.carSection}>
          <Suspense fallback={<div className={styles.carPlaceholder}>Chargement 3D...</div>}>
            <Car3D height="260px" />
          </Suspense>
          <div className={styles.carOverlay}>
            <span className={styles.carLabel}>Votre véhicule</span>
          </div>
        </section>

        {/* CTA */}
        <Button onClick={() => navigate('/booking')} size="lg" className={styles.ctaButton}>
          <Droplets size={20} />
          Réserver un lavage
        </Button>

        {/* Recent Bookings */}
        {user && (
          <section className={styles.recentSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Réservations récentes</h2>
              <button className={styles.seeAll} onClick={() => navigate('/bookings')}>
                Tout voir <ChevronRight size={14} />
              </button>
            </div>

            {dataLoading ? (
              <div className={styles.bookingList}>
                <BookingCardSkeleton />
                <BookingCardSkeleton />
              </div>
            ) : recentBookings.length > 0 ? (
              <div className={styles.bookingList}>
                {recentBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Aucune réservation"
                description="Réservez votre premier lavage en quelques secondes"
                action={
                  <Button onClick={() => navigate('/booking')} size="sm">
                    Réserver maintenant
                  </Button>
                }
              />
            )}
          </section>
        )}
      </div>
    </MainLayout>
  );
};

export default Home;
