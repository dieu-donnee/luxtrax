import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePageMeta } from '@/hooks/usePageMeta';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import { AlertTriangle, ArrowLeft, Clock, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import styles from './Complaint.module.css';

const problemTypes = [
  'Service non effectue',
  'Qualite insuffisante',
  'Retard du prestataire',
  'Dommage sur le vehicule',
  'Autre',
];

const Complaint = () => {
  usePageMeta(
    'Signaler un probleme | Luxtrax',
    'Signale facilement un souci sur ta prestation pour qu on puisse le regler vite.',
  );

  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState({
    problemType: '',
    description: '',
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.problemType) { toast.error('Choisis le type de souci.'); return; }
    if (!form.description.trim()) { toast.error('Explique-nous vite ce qui s est passe.'); return; }
    if (!userId || !bookingId) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from('complaints').insert({
        booking_id: bookingId,
        user_id: userId,
        problem_type: form.problemType,
        description: form.description.trim(),
      });
      if (error) throw error;
      toast.success('C est envoye. On te repond sous 24h.');
      setTimeout(() => navigate('/'), 2000);
    } catch {
      toast.error("On n'a pas pu envoyer ta reclamation. Reessaie.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <header className={styles.headerCard}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            Retour
          </button>
          <span className={styles.badge}>
            <Sparkles size={14} />
            Aide rapide
          </span>
          <h1 className={styles.title}>Signaler un souci sur ta prestation</h1>
          <p className={styles.subtitle}>Donne-nous les details importants et on s&apos;en occupe rapidement.</p>
        </header>

        <section className={styles.alertCard}>
          <AlertTriangle size={24} className={styles.alertIcon} />
          <div>
            <h2 className={styles.alertTitle}>Un souci avec ton service ?</h2>
            <p className={styles.alertDesc}>Sois direct et precis pour qu on puisse t aider plus vite.</p>
          </div>
        </section>

        <form className={styles.formCard} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Quel est le souci ?</label>
            <select
              className={styles.select}
              value={form.problemType}
              onChange={(e) => setForm(p => ({ ...p, problemType: e.target.value }))}
              required
            >
              <option value="">Choisis un type de souci</option>
              {problemTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Raconte-nous ce qui s&apos;est passe</label>
            <textarea
              className={styles.textarea}
              value={form.description}
              onChange={(e) => setForm(p => ({ ...p, description: e.target.value.slice(0, 1000) }))}
              placeholder="Exemple: date, ce qui n allait pas, ce que tu attends..."
              rows={5}
              maxLength={1000}
              required
            />
          </div>

          <Button type="submit" disabled={submitting}>
            {submitting ? 'Envoi...' : 'Envoyer ma demande'}
          </Button>
        </form>

        <div className={styles.responseInfo}>
          <Clock size={16} />
          <span>On te repond en general en moins de 24h</span>
        </div>
      </div>
    </MainLayout>
  );
};

export default Complaint;
