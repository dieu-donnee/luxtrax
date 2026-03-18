import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import { CheckCircle2, AlertTriangle, Star } from 'lucide-react';
import { toast } from 'sonner';
import styles from './Review.module.css';

const Review = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [completed, setCompleted] = useState<boolean | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (completed === null) { toast.error('Veuillez confirmer le statut'); return; }
    toast.success('Merci pour votre avis !');
    setSubmitted(true);
    setTimeout(() => navigate('/'), 2000);
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

        <div className={styles.ratingSection}>
          <h2 className={styles.ratingTitle}>Comment s'est passée votre expérien...</h2>
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
          onChange={(e) => setComment(e.target.value)}
          rows={4}
        />

        <Button onClick={handleSubmit}>
          Envoyer mon avis
        </Button>

        {submitted && (
          <p className={styles.thankYou}>Merci pour votre avis !</p>
        )}
      </div>
    </MainLayout>
  );
};

export default Review;
