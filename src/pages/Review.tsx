import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import { CheckCircle2, AlertTriangle, Star } from 'lucide-react';
import { toast } from 'sonner';
import styles from './Review.module.css';

const Review = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<boolean | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/auth'); return; }
    
    setUserId(user.id);

    const checkBooking = async () => {
      if (bookingId) {
        const { data } = await supabase
          .from('bookings')
          .select('id')
          .eq('id', bookingId)
          .eq('user_id', user.id)
          .single();
        if (!data) { toast.error('Réservation introuvable'); navigate('/'); return; }
      }
      setLoading(false);
    };
    checkBooking();
  }, [user, authLoading, bookingId, navigate]);

  if (authLoading || loading) return null;

  const handleSubmit = async () => {
    if (completed === null) { toast.error('Veuillez confirmer le statut'); return; }
    if (!completed) { navigate(`/complaint/${bookingId}`); return; }
    if (rating === 0) { toast.error('Veuillez donner une note'); return; }
    if (!userId || !bookingId) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        booking_id: bookingId,
        user_id: userId,
        rating,
        comment: comment.trim() || null,
      });
      if (error) throw error;
      toast.success('Merci pour votre avis !');
      setSubmitted(true);
      setTimeout(() => navigate('/'), 2000);
    } catch {
      toast.error('Impossible d\'envoyer votre avis. Réessayez.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <h1 className={styles.logo}>LustraX</h1>

        <div className={styles.card}>
          <h2 className={styles.question}>Votre prestation est-elle terminée ?</h2>
          <button
            className={`${styles.statusBtn} ${styles.statusSuccess} ${completed === true ? styles.statusActive : ''}`}
            onClick={() => setCompleted(true)}
          >
            <CheckCircle2 size={20} />
            Oui, lavage terminé
          </button>
          <button
            className={`${styles.statusBtn} ${styles.statusDanger} ${completed === false ? styles.statusActive : ''}`}
            onClick={() => { setCompleted(false); navigate(`/complaint/${bookingId}`); }}
          >
            <AlertTriangle size={20} />
            Non, problème rencontré
          </button>
        </div>

        {completed === true && (
          <>
            <div className={styles.ratingSection}>
              <h2 className={styles.ratingTitle}>Comment s'est passée votre expérience ?</h2>
              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map(i => (
                  <button
                    key={i}
                    className={styles.starBtn}
                    onMouseEnter={() => setHoverRating(i)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(i)}
                  >
                    <Star
                      size={32}
                      fill={(hoverRating || rating) >= i ? '#facc15' : 'none'}
                      color={(hoverRating || rating) >= i ? '#facc15' : 'var(--border)'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              className={styles.textarea}
              placeholder="Partagez votre expérience (facultatif)"
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 500))}
              rows={4}
              maxLength={500}
            />

            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Envoi...' : 'Envoyer mon avis'}
            </Button>
          </>
        )}

        {submitted && (
          <p className={styles.thankYou}>Merci pour votre avis !</p>
        )}
      </div>
    </MainLayout>
  );
};

export default Review;
