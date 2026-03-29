import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePageMeta } from '@/hooks/usePageMeta';
import type { BookingData, ProfileData } from '@/types/models';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import BookingCard from '../components/ui/BookingCard';
import EmptyState from '../components/ui/EmptyState';
import { BookingCardSkeleton } from '../components/ui/Skeleton';
import { ArrowRight, CalendarClock, ChevronRight, Droplets, MapPinned, ShieldCheck, Sparkles, Star } from 'lucide-react';
import styles from './Home.module.css';
import OfferCarousel from '../components/ui/OfferCarousel';

const Car3D = lazy(() => import('../components/3d/Car3D'));

const Home = () => {
  usePageMeta(
    'LustraX | On redonne le smile à ta caisse',
    'Ton lavage auto premium à domicile, sans bouger du canapé. On arrive où tu veux, quand tu veux.',
  );

  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [recentBookings, setRecentBookings] = useState<BookingData[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setDataLoading(false);
      return;
    }

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

  const firstName = profile?.full_name?.split(' ')[0] ?? null;

  return (
    <MainLayout>
      <div className={styles.dashboard}>
        <section className={styles.carCarouselSection}>
          <OfferCarousel />
        </section>

        <section className={styles.heroPanel}>

          <section className={styles.carSection}>
            <Suspense fallback={<div className={styles.carPlaceholder}>Chargement de l&apos;experience 3D...</div>}>
              <Car3D height="320px" />
            </Suspense>
          </section>
        </section>


        {user && (
          <section className={styles.recentSection}>
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.storyTag}>Tes reservations</span>
                <h2 className={styles.sectionTitle}>Ce que tu as reserve recemment</h2>
              </div>
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
                title="Tu n&apos;as pas encore reserve"
                description="Des que tu lances ton premier lavage, tu le verras ici avec toutes les infos."
                action={
                  <Button onClick={() => navigate('/booking')} size="sm">
                    Je lance mon premier lavage
                  </Button>
                }
              />
            )}
          </section>
        )}

        <section className={styles.desktopBookingAction}>
          <div className={styles.centeredAction}>
            <Button 
              size="lg" 
              className={styles.ctaLargeButton}
              onClick={() => navigate('/booking')}
            >
              Je réserve maintenant mon lavage
              <ArrowRight size={22} />
            </Button>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Home;
