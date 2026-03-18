import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import { Star, CheckCircle2, AlertTriangle, ChevronRight, Sparkles } from 'lucide-react';
import styles from './Home.module.css';

const Home = () => {
  const [user, setUser] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const { data } = await supabase
          .from('bookings')
          .select('*, services(name, price)')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(3);
        if (data) setRecentBookings(data);
      }
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session) {
        const { data } = await supabase
          .from('bookings')
          .select('*, services(name, price)')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(3);
        if (data) setRecentBookings(data);
      } else {
        setRecentBookings([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: 'En attente', color: 'var(--muted-foreground)' },
    ongoing: { label: 'En cours', color: 'var(--primary)' },
    completed: { label: 'Terminé', color: '#22c55e' },
    cancelled: { label: 'Annulé', color: 'var(--error)' },
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <Sparkles size={14} />
            Service Premium
          </div>
          <h1 className={styles.title}>Lavez votre voiture chez vous, sans effort.</h1>
          <p className={styles.description}>
            Un service de lavage professionnel à votre porte, 7 jours sur 7.
          </p>
          <Button onClick={() => navigate('/booking')} size="lg" className={styles.ctaButton}>
            Réserver maintenant
          </Button>
        </div>
        <div className={styles.heroImage}>
          <img
            src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=1000&auto=format&fit=crop"
            alt="Lavage auto premium"
          />
        </div>
      </section>

      {/* Recent Bookings */}
      {user && recentBookings.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Réservations récentes</h2>
            <button className={styles.seeAll} onClick={() => navigate('/bookings')}>
              Voir tout <ChevronRight size={16} />
            </button>
          </div>

          <div className={styles.bookingList}>
            {recentBookings.map((booking) => {
              const status = statusLabels[booking.status] || statusLabels.pending;
              return (
                <div key={booking.id} className={styles.bookingCard}>
                  <div className={styles.bookingInfo}>
                    <span className={styles.bookingService}>
                      {booking.services?.name || 'Service'}
                    </span>
                    <span className={styles.bookingDate}>
                      {formatDate(booking.scheduled_date)}
                    </span>
                    <span className={styles.bookingStatus} style={{ color: status.color }}>
                      {status.label}
                    </span>
                  </div>
                  <div className={styles.bookingPrice}>
                    {booking.services?.price} €
                  </div>
                  <div className={styles.bookingActions}>
                    {booking.status === 'completed' && (
                      <>
                        <button
                          className={styles.actionBtn}
                          onClick={() => navigate(`/review/${booking.id}`)}
                        >
                          <Star size={16} />
                          Avis
                        </button>
                      </>
                    )}
                    {booking.status === 'completed' && (
                      <button
                        className={styles.actionBtnDanger}
                        onClick={() => navigate(`/complaint/${booking.id}`)}
                      >
                        <AlertTriangle size={16} />
                        Signaler
                      </button>
                    )}
                    {booking.status === 'pending' && (
                      <button
                        className={styles.actionBtn}
                        onClick={() => navigate(`/review/${booking.id}`)}
                      >
                        <CheckCircle2 size={16} />
                        Confirmer
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Trust section */}
      <section className={styles.trustSection}>
        <div className={styles.trustItem}>
          <CheckCircle2 size={24} style={{ color: 'var(--primary)' }} />
          <div>
            <strong>Professionnels vérifiés</strong>
            <p>Équipe formée et assurée</p>
          </div>
        </div>
        <div className={styles.trustItem}>
          <Star size={24} style={{ color: 'var(--primary)' }} />
          <div>
            <strong>Satisfaction garantie</strong>
            <p>Relavage gratuit si insatisfait</p>
          </div>
        </div>
        <div className={styles.trustItem}>
          <Sparkles size={24} style={{ color: 'var(--primary)' }} />
          <div>
            <strong>Produits écologiques</strong>
            <p>Respectueux de votre véhicule</p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
