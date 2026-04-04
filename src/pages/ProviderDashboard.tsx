import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePageMeta } from '@/hooks/usePageMeta';
import MainLayout from '../components/layout/MainLayout';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import { BookingCardSkeleton } from '../components/ui/Skeleton';
import { Wrench, CheckCircle2, Clock, MapPin, Calendar, ChevronRight, Star } from 'lucide-react';
import styles from './ProviderDashboard.module.css';

interface ProviderBooking {
  id: string;
  address: string;
  scheduled_date: string;
  status: string;
  notes: string | null;
  created_at: string;
  services?: { name: string; price: number } | null;
}

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  ongoing: 'En cours',
  completed: 'Termine',
  cancelled: 'Annule',
};

const statusColors: Record<string, string> = {
  pending: 'var(--warning)',
  ongoing: 'var(--primary)',
  completed: 'var(--accent)',
  cancelled: 'var(--destructive)',
};

const ProviderDashboard = () => {
  usePageMeta('Espace Prestataire | Luxtrax', 'Gerez vos missions de lavage auto.');

  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<ProviderBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [stats, setStats] = useState({ total: 0, completed: 0, ongoing: 0, pending: 0 });

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    // For now, providers see all bookings (admin-like). 
    // In production, assign bookings to specific providers.
    const { data, error } = await supabase
      .from('bookings')
      .select('*, services(name, price)')
      .order('scheduled_date', { ascending: false });

    if (data) {
      const typed = data as unknown as ProviderBooking[];
      setBookings(typed);
      setStats({
        total: typed.length,
        completed: typed.filter(b => b.status === 'completed').length,
        ongoing: typed.filter(b => b.status === 'ongoing').length,
        pending: typed.filter(b => b.status === 'pending').length,
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authLoading || !user) return;
    fetchBookings();
  }, [user, authLoading, fetchBookings]);

  const updateStatus = async (bookingId: string, newStatus: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus as any })
      .eq('id', bookingId);

    if (!error) {
      fetchBookings();
    }
  };

  const filteredBookings = filter === 'all'
    ? bookings
    : bookings.filter(b => b.status === filter);

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <span className={styles.badge}>
              <Wrench size={14} />
              Prestataire
            </span>
          </div>
          <h1 className={styles.title}>Bonjour{user?.firstName ? `, ${user.firstName}` : ''} 👋</h1>
          <p className={styles.subtitle}>Voici tes missions du jour. Reste focus, chaque client compte.</p>
        </header>

        {/* Stats */}
        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.total}</span>
            <span className={styles.statLabel}>Total</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue} style={{ color: 'var(--warning)' }}>{stats.pending}</span>
            <span className={styles.statLabel}>En attente</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue} style={{ color: 'var(--primary)' }}>{stats.ongoing}</span>
            <span className={styles.statLabel}>En cours</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue} style={{ color: 'var(--accent)' }}>{stats.completed}</span>
            <span className={styles.statLabel}>Termines</span>
          </div>
        </section>

        {/* Filters */}
        <div className={styles.filters}>
          {['all', 'pending', 'ongoing', 'completed'].map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'Toutes' : statusLabels[f]}
            </button>
          ))}
        </div>

        {/* Bookings list */}
        <section className={styles.bookingsList}>
          {loading ? (
            <>
              <BookingCardSkeleton />
              <BookingCardSkeleton />
              <BookingCardSkeleton />
            </>
          ) : filteredBookings.length === 0 ? (
            <EmptyState
              title="Aucune mission"
              description="Il n'y a pas de reservations correspondant a ce filtre pour le moment."
            />
          ) : (
            filteredBookings.map(booking => (
              <article key={booking.id} className={styles.bookingCard}>
                <div className={styles.bookingHeader}>
                  <span
                    className={styles.statusDot}
                    style={{ background: statusColors[booking.status] || 'var(--muted)' }}
                  />
                  <span className={styles.statusLabel}>{statusLabels[booking.status] || booking.status}</span>
                  <span className={styles.bookingPrice}>
                    {booking.services?.price ? `${booking.services.price} FCFA` : ''}
                  </span>
                </div>

                <h3 className={styles.bookingService}>{booking.services?.name || 'Service'}</h3>

                <div className={styles.bookingMeta}>
                  <span><MapPin size={14} /> {booking.address}</span>
                  <span><Calendar size={14} /> {formatDate(booking.scheduled_date)}</span>
                </div>

                {booking.notes && (
                  <p className={styles.bookingNotes}>"{booking.notes}"</p>
                )}

                <div className={styles.bookingActions}>
                  {booking.status === 'pending' && (
                    <Button size="sm" onClick={() => updateStatus(booking.id, 'ongoing')}>
                      <Clock size={14} /> Commencer
                    </Button>
                  )}
                  {booking.status === 'ongoing' && (
                    <Button size="sm" onClick={() => updateStatus(booking.id, 'completed')}>
                      <CheckCircle2 size={14} /> Marquer termine
                    </Button>
                  )}
                  {booking.status === 'completed' && (
                    <span className={styles.completedBadge}>
                      <CheckCircle2 size={14} /> Termine
                    </span>
                  )}
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </MainLayout>
  );
};

export default ProviderDashboard;
