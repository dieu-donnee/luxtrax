import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { BookingData } from '@/types/models';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import BookingCard from '../components/ui/BookingCard';
import EmptyState from '../components/ui/EmptyState';
import { BookingCardSkeleton } from '../components/ui/Skeleton';
import { ArrowLeft } from 'lucide-react';
import styles from './Bookings.module.css';

type StatusFilter = 'all' | 'pending' | 'ongoing' | 'completed' | 'cancelled';

const FILTERS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: 'pending', label: 'En attente' },
  { key: 'ongoing', label: 'En cours' },
  { key: 'completed', label: 'Terminés' },
  { key: 'cancelled', label: 'Annulés' },
];

const Bookings = () => {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/auth'); return; }

    const fetchBookings = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*, services(name, price)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setBookings(data as unknown as BookingData[]);
      setLoading(false);
    };
    fetchBookings();
  }, [user, authLoading, navigate]);

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <MainLayout>
      <div className={styles.container}>
        <header className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate('/')}>
            <ArrowLeft size={22} />
          </button>
          <h1 className={styles.pageTitle}>Mes réservations</h1>
        </header>

        <div className={styles.filters}>
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`${styles.filterBtn} ${filter === f.key ? styles.filterBtnActive : ''}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className={styles.list}>
          {loading ? (
            <>
              <BookingCardSkeleton />
              <BookingCardSkeleton />
              <BookingCardSkeleton />
            </>
          ) : filtered.length === 0 ? (
            <EmptyState
              title="Aucune réservation trouvée"
              description="Réservez votre premier lavage en quelques secondes"
              action={
                <Button onClick={() => navigate('/booking')} size="sm">
                  Réserver un lavage
                </Button>
              }
            />
          ) : (
            filtered.map((booking) => (
              <BookingCard key={booking.id} booking={booking} showYear />
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Bookings;
