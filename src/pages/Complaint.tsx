import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { AlertTriangle, Camera, Clock, ArrowLeft } from 'lucide-react';
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
  const [form, setForm] = useState({
    name: '',
    email: '',
    problemType: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.problemType) { toast.error('Sélectionnez le type de problème'); return; }
    toast.success('Réclamation envoyée ! Nous vous répondrons sous 24h.');
    setTimeout(() => navigate('/'), 2000);
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
            <label className={styles.label}>Nom complet</label>
            <Input
              value={form.name}
              onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Jean Dupont"
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Adresse email</label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="jean.dupont@email.com"
              required
            />
          </div>

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
              onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Donnez-nous plus de détails sur votre situation..."
              rows={5}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Ajouter une photo (optionnel)</label>
            <div className={styles.uploadArea}>
              <Camera size={28} color="var(--muted-foreground)" />
              <span>Formats acceptés: JPG, PNG</span>
            </div>
          </div>

          <Button type="submit" style={{ background: '#fca5a5', color: 'var(--error)' }}>
            Envoyer ma réclamation
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
