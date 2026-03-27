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

const Car3D = lazy(() => import('../components/3d/Car3D'));

const Home = () => {
  usePageMeta(
    'Luxtrax | Lavage auto a domicile',
    'Reservez un lavage auto premium a domicile avec un parcours simple, un suivi clair et une experience mobile fluide.',
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
        <section className={styles.heroPanel}>
          <div className={styles.heroCopy}>
            <div className={styles.eyebrow}>
              <Sparkles size={16} />
              Ton lavage, sans bouger de chez toi
            </div>

            <div className={styles.greetingBlock}>
              <p className={styles.welcomeText}>
                {firstName ? `Salut ${firstName},` : 'Ta voiture peut retrouver son eclat sans detour.'}
              </p>
              <h1 className={styles.greetingName}>On lave ta voiture pendant que toi, tu continues ta journee.</h1>
              <p className={styles.heroDescription}>
                Tu choisis l&apos;adresse et la formule, puis on s&apos;occupe du reste. Tout est fait pour que tu
                comprennes vite et que tu reserves sans te prendre la tete.
              </p>
            </div>

            <div className={styles.heroActions}>
              <Button onClick={() => navigate('/booking')} size="lg" className={styles.ctaButton}>
                <Droplets size={20} />
                Je reserve un lavage
              </Button>
              {!authLoading && !user && (
                <Button onClick={() => navigate('/auth')} size="lg" variant="outline" className={styles.secondaryCta}>
                  Je me connecte
                </Button>
              )}
            </div>

            <div className={styles.statGrid}>
              <div className={styles.statCard}>
                <CalendarClock size={18} />
                <div>
                  <strong>Reservation en 2 minutes</strong>
                  <span>Tu avances etape par etape, sans confusion.</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <MapPinned size={18} />
                <div>
                  <strong>On vient jusqu&apos;a toi</strong>
                  <span>Tu donnes ton adresse et c&apos;est parti.</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <ShieldCheck size={18} />
                <div>
                  <strong>Tu gardes le controle</strong>
                  <span>Suivi, notifications et aide quand tu en as besoin.</span>
                </div>
              </div>
            </div>
          </div>

          <section className={styles.carSection}>
            <Suspense fallback={<div className={styles.carPlaceholder}>Chargement de l&apos;experience 3D...</div>}>
              <Car3D height="320px" />
            </Suspense>
            <div className={styles.carOverlay}>
              <span className={styles.carLabel}>Apercu de ton vehicule</span>
            </div>
            <div className={styles.floatingCard}>
              <span className={styles.floatingEyebrow}>Simple et clair</span>
              <strong>Tu comprends tout en un coup d&apos;oeil.</strong>
              <p>Pas de blabla technique, juste ce qu&apos;il faut pour reserver vite.</p>
            </div>
          </section>
        </section>

        <section className={styles.storyGrid}>
          <article className={styles.storyCard}>
            <span className={styles.storyTag}>Comment ca se passe</span>
            <h2 className={styles.sectionTitle}>Tu choisis, tu confirmes, on intervient.</h2>
            <div className={styles.storySteps}>
              <div>
                <strong>01. Donne ton adresse</strong>
                <p>On te geolocalise vite, ou tu peux l&apos;ecrire a la main.</p>
              </div>
              <div>
                <strong>02. Choisis ta formule</strong>
                <p>Tu vois direct ce qui est inclus et combien ca coute.</p>
              </div>
              <div>
                <strong>03. Suis ta reservation</strong>
                <p>Tu retrouves tout dans ton espace, sans chercher partout.</p>
              </div>
            </div>
          </article>

          <article className={styles.storyCardAlt}>
            <span className={styles.storyTag}>Pourquoi c&apos;est pratique</span>
            <ul className={styles.benefitList}>
              <li><Star size={16} /> Tout est pense pour aller droit au but.</li>
              <li><Star size={16} /> Les boutons importants sont visibles tout de suite.</li>
              <li><Star size={16} /> Tu retrouves vite ce que tu cherches.</li>
            </ul>
            <button className={styles.inlineLink} onClick={() => navigate('/support')}>
              Voir l&apos;aide client <ArrowRight size={16} />
            </button>
          </article>
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
      </div>
    </MainLayout>
  );
};

export default Home;
