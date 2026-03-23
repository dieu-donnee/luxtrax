import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { AlertTriangle, Clock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import styles from './Complaint.module.css';

const problemTypes = [
  'Service non effectué',
  'Qualité insuffisante',
  'Retard du prestataire',
  'Dommage sur le véhicule',
  'Autre',
];

const Complaint = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState({
    problemType: '',
    description: '',
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/auth'); return; }
      setUserId(session.user.id);
      if (bookingId) {
        const { data } = await supabase
          .from('bookings')
          .select('id')
          .eq('id', bookingId)
          .eq('user_id', session.user.id)
          .single();
        if (!data) { toast.error('Réservation introuvable'); navigate('/'); return; }
      }
      setLoading(false);
    };
    checkAuth();
  }, [bookingId, navigate]);

  if (loading) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.problemType) { toast.error('Sélectionnez le type de problème'); return; }
    if (!form.description.trim()) { toast.error('Décrivez votre problème'); return; }
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
      toast.success('Réclamation envoyée ! Nous vous répondrons sous 24h.');
      setTimeout(() => navigate('/'), 2000);
    } catch {
      toast.error('Impossible d\'envoyer la réclamation. Réessayez.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          <span>Signaler un problème</span>
        </button>

        <div className={styles.alertCard}>
          <AlertTriangle size={24} color="var(--error)" />
          <div>
            <h2 className={styles.alertTitle}>Un souci avec votre prestation ?</h2>
            <p className={styles.alertDesc}>
              Dites-nous ce qui s'est passé pour que nous puissions vous aider rapidement.
            </p>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Nature du problème</label>
            <select
              className={styles.select}
              value={form.problemType}
              onChange={(e) => setForm(p => ({ ...p, problemType: e.target.value }))}
              required
            >
              <option value="">Sélectionnez le type de problème</option>
              {problemTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Décrivez votre problème</label>
            <textarea
              className={styles.textarea}
              value={form.description}
              onChange={(e) => setForm(p => ({ ...p, description: e.target.value.slice(0, 1000) }))}
              placeholder="Donnez-nous plus de détails sur votre situation..."
              rows={5}
              maxLength={1000}
              required
            />
          </div>

          <Button type="submit" disabled={submitting} style={{ background: '#fca5a5', color: 'var(--error)' }}>
            {submitting ? 'Envoi...' : 'Envoyer ma réclamation'}
          </Button>
        </form>

        <div className={styles.responseInfo}>
          <Clock size={16} />
          <span>Notre équipe s'engage à vous répondre sous 24h</span>
        </div>
      </div>
    </MainLayout>
  );
};

export default Complaint;
