import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Clock3, Droplets, Star } from 'lucide-react';
import type { BookingData } from '@/types/models';
import { formatDateFull, formatDateShort } from '@/types/models';
import styles from './BookingCard.module.css';

interface BookingCardProps {
  booking: BookingData;
  showYear?: boolean;
}

const statusMap: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  pending: { label: 'En attente', className: styles.statusPending, icon: <Clock3 size={14} /> },
  ongoing: { label: 'En cours', className: styles.statusOngoing, icon: <Droplets size={14} /> },
  completed: { label: 'Termine', className: styles.statusCompleted, icon: <CheckCircle2 size={14} /> },
  cancelled: { label: 'Annule', className: styles.statusCancelled, icon: <AlertTriangle size={14} /> },
};

const BookingCard: React.FC<BookingCardProps> = ({ booking, showYear = false }) => {
  const navigate = useNavigate();
  const status = statusMap[booking.status] || statusMap.pending;
  const dateStr = showYear ? formatDateFull(booking.scheduled_date) : formatDateShort(booking.scheduled_date);
  const price = Math.round(Number(booking.services?.price ?? 0));

  return (
    <article className={styles.card}>
      <div className={styles.topRow}>
        <div className={styles.meta}>
          <span className={styles.serviceName}>{booking.services?.name || 'Service'}</span>
          <span className={styles.date}>{dateStr}</span>
        </div>
        <div className={`${styles.statusBadge} ${status.className}`}>
          {status.icon}
          {status.label}
        </div>
      </div>

      <div className={styles.bottomRow}>
        <span className={styles.price}>{price} FCFA</span>
        <div className={styles.actions}>
          {booking.status === 'completed' && (
            <>
              <button className={styles.actionBtn} onClick={() => navigate(`/review/${booking.id}`)}>
                <Star size={14} />
                Avis
              </button>
              <button className={styles.actionBtnDanger} onClick={() => navigate(`/complaint/${booking.id}`)}>
                <AlertTriangle size={14} />
                Signaler
              </button>
            </>
          )}
          {booking.status === 'pending' && (
            <span className={styles.statusNote}>Affectation prestataire en cours</span>
          )}
        </div>
      </div>
    </article>
  );
};

export default BookingCard;
