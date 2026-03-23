import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import { CheckCircle2, AlertTriangle, Droplets, Star, ChevronRight, ArrowLeft } from 'lucide-react';
import styles from './Home.module.css';

type StatusFilter = 'all' | 'pending' | 'ongoing' | 'completed' | 'cancelled';

const statusFilters: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: 'pending', label: 'En attente' },
  { key: 'ongoing', label: 'En cours' },
  { key: 'completed', label: 'Terminés' },
  { key: 'cancelled', label: 'Annulés' },
];

const statusConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  pending: { label: 'En attente', className: 'statusPending', icon: <Droplets size={14} /> },
  ongoing: { label: 'En cours', className: 'statusOngoing', icon: <Droplets size={14} /> },
  completed: { label: 'Terminé', className: 'statusCompleted', icon: <CheckCircle2 size={14} /> },
  cancelled: { label: 'Annulé', className: 'statusCancelled', icon: <AlertTriangle size={14} /> },
};

const Bookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/auth'); return; }

      const { data } = await supabase
        .from('bookings')
        .select('*, services(name, price)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (data) setBookings(data);
      setLoading(false);
    };
    init();
  }, [navigate]);

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <MainLayout>
      <div className={styles.dashboard}>
        <header style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
            <ArrowLeft size={22} color="var(--foreground)" />
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Mes réservations</h1>
        </header>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1rem' }}>
          {statusFilters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '999px',
                border: '1px solid var(--border)',
                background: filter === f.key ? 'var(--primary)' : 'transparent',
                color: filter === f.key ? 'var(--primary-foreground)' : 'var(--foreground)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading && (
          <p style={{ textAlign: 'center', color: 'var(--muted-foreground)', padding: '3rem 0' }}>
            Chargement...
          </p>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--muted-foreground)' }}>
            <Droplets size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p>Aucune réservation trouvée</p>
            <Button onClick={() => navigate('/booking')} size="sm" style={{ marginTop: '1rem' }}>
              Réserver un lavage
            </Button>
          </div>
        )}

        <div className={styles.bookingList}>
          {filtered.map((booking) => {
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
                  <div className={`${styles.statusBadge} ${styles[status.className]}`}>
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
      </div>
    </MainLayout>
  );
};

export default Bookings;
