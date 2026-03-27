import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePageMeta } from '@/hooks/usePageMeta';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import { AlertTriangle, CheckCircle2, Sparkles, Star } from 'lucide-react';
import { toast } from 'sonner';
import styles from './Review.module.css';

const Review = () => {
  usePageMeta(
    'Evaluation prestation | Luxtrax',
    'Dis-nous comment ca s est passe apres ton lavage pour nous aider a mieux faire.',
  );

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
    if (!user) {
      navigate('/auth');
      return;
    }

    setUserId(user.id);

    const checkBooking = async () => {
      if (bookingId) {
        const { data } = await supabase
          .from('bookings')
          .select('id')
          .eq('id', bookingId)
          .eq('user_id', user.id)
          .single();
        if (!data) {
          toast.error('Reservation introuvable');
          navigate('/');
          return;
        }
      }
      setLoading(false);
    };
    checkBooking();
  }, [user, authLoading, bookingId, navigate]);

  if (authLoading || loading) return null;

  const handleSubmit = async () => {
    if (completed === null) { toast.error('Dis-nous d abord si la prestation est terminee.'); return; }
    if (!completed) { navigate(`/complaint/${bookingId}`); return; }
    if (rating === 0) { toast.error('Ajoute une note pour continuer.'); return; }
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
      toast.success('Merci pour ton retour !');
      setSubmitted(true);
      setTimeout(() => navigate('/'), 2000);
    } catch {
      toast.error("On n'a pas pu envoyer ton avis. Reessaie.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <header className={styles.headerCard}>
          <span className={styles.badge}>
            <Sparkles size={14} />
            Ton avis compte
          </span>
          <h1 className={styles.logo}>Evaluation de prestation</h1>
          <p className={styles.subtitle}>Confirme que le lavage est fini, puis dis-nous franchement ce que tu en as pense.</p>
        </header>

        <section className={styles.card}>
          <h2 className={styles.question}>Le lavage est bien termine ?</h2>
          <button
            className={`${styles.statusBtn} ${styles.statusSuccess} ${completed === true ? styles.statusActive : ''}`}
            onClick={() => setCompleted(true)}
          >
            <CheckCircle2 size={20} />
            Oui, c&apos;est termine
          </button>
          <button
            className={`${styles.statusBtn} ${styles.statusDanger} ${completed === false ? styles.statusActive : ''}`}
            onClick={() => { setCompleted(false); navigate(`/complaint/${bookingId}`); }}
          >
            <AlertTriangle size={20} />
            Non, je veux signaler un souci
          </button>
        </section>

        {completed === true && (
          <>
            <section className={styles.ratingSection}>
              <h2 className={styles.ratingTitle}>Alors, ca s&apos;est passe comment ?</h2>
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
                      size={34}
                      fill={(hoverRating || rating) >= i ? '#f59e0b' : 'none'}
                      color={(hoverRating || rating) >= i ? '#f59e0b' : 'var(--border)'}
                    />
                  </button>
                ))}
              </div>
            </section>

            <textarea
              className={styles.textarea}
              placeholder="Tu peux ajouter un petit commentaire (facultatif)"
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
          <p className={styles.thankYou}>Merci ! Ton retour nous aide vraiment.</p>
        )}
      </div>
    </MainLayout>
  );
};

export default Review;
