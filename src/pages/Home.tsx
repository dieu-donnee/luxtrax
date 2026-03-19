import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import { Star, CheckCircle2, AlertTriangle, ChevronRight, Droplets } from 'lucide-react';
import styles from './Home.module.css';

const Car3D = lazy(() => import('../components/3d/Car3D'));

const Home = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchBookings = async (userId: string) => {
    const { data } = await supabase
      .from('bookings')
      .select('*, services(name, price)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(2);
    if (data) setRecentBookings(data);
  };

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (data) setProfile(data);
  };

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        fetchBookings(session.user.id);
        fetchProfile(session.user.id);
      }
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session) {
        fetchBookings(session.user.id);
        fetchProfile(session.user.id);
      } else {
        setRecentBookings([]);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const statusConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    pending: { label: 'En attente', className: styles.statusPending, icon: <Droplets size={14} /> },
    ongoing: { label: 'En cours', className: styles.statusOngoing, icon: <Droplets size={14} /> },
    completed: { label: 'Terminé', className: styles.statusCompleted, icon: <CheckCircle2 size={14} /> },
    cancelled: { label: 'Annulé', className: styles.statusCancelled, icon: <AlertTriangle size={14} /> },
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };

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
          {!user && (
            <Button onClick={() => navigate('/auth')} size="sm" variant="outline">
              Connexion
            </Button>
          )}
        </header>

        {/* 3D Car Section */}
        <section className={styles.carSection}>
          <Suspense fallback={<div className={styles.carPlaceholder}>Chargement 3D...</div>}>
            <Car3D height="260px" />
          </Suspense>
          <div className={styles.carOverlay}>
            <span className={styles.carLabel}>Votre véhicule</span>
          </div>
        </section>

        {/* CTA */}
        <Button
          onClick={() => navigate('/booking')}
          size="lg"
          className={styles.ctaButton}
        >
          <Droplets size={20} />
          Réserver un lavage
        </Button>

        {/* Recent Bookings */}
        {user && recentBookings.length > 0 && (
          <section className={styles.recentSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Réservations récentes</h2>
              <button className={styles.seeAll} onClick={() => navigate('/bookings')}>
                Tout voir <ChevronRight size={14} />
              </button>
            </div>

            <div className={styles.bookingList}>
              {recentBookings.map((booking) => {
                const status = statusConfig[booking.status] || statusConfig.pending;
                return (
                  <div key={booking.id} className={styles.bookingCard}>
                    <div className={styles.bookingTop}>
                      <div className={styles.bookingMeta}>
                        <span className={styles.bookingService}>
                          {booking.services?.name || 'Service'}
                        </span>
                        <span className={styles.bookingDate}>
                          {formatDate(booking.scheduled_date)}
                        </span>
                      </div>
                      <div className={`${styles.statusBadge} ${status.className}`}>
                        {status.icon}
                        {status.label}
                      </div>
                    </div>

                    <div className={styles.bookingBottom}>
                      <span className={styles.bookingPrice}>
                        {booking.services?.price} €
                      </span>
                      <div className={styles.bookingActions}>
                        {booking.status === 'completed' && (
                          <>
                            <button
                              className={styles.actionBtn}
                              onClick={() => navigate(`/review/${booking.id}`)}
                            >
                              <Star size={14} />
                              Avis
                            </button>
                            <button
                              className={styles.actionBtnDanger}
                              onClick={() => navigate(`/complaint/${booking.id}`)}
                            >
                              <AlertTriangle size={14} />
                              Signaler
                            </button>
                          </>
                        )}
                        {booking.status === 'pending' && (
                          <button
                            className={styles.actionBtn}
                            onClick={() => navigate(`/review/${booking.id}`)}
                          >
                            <CheckCircle2 size={14} />
                            Confirmer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
};

export default Home;
