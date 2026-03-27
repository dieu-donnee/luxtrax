import React, { useState } from 'react';
import { Calendar, ChevronRight, Clock, CreditCard, MessageCircle, Search, Settings, Sparkles, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { usePageMeta } from '@/hooks/usePageMeta';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import styles from './Support.module.css';

const faqCategories = [
  { icon: <Calendar size={24} />, label: 'Reservations', description: 'Changer une reservation ou verifier ou ca en est.' },
  { icon: <CreditCard size={24} />, label: 'Paiements', description: 'Comprendre ton total et ce qui est facture.' },
  { icon: <XCircle size={24} />, label: 'Annulation', description: 'Voir comment annuler facilement si besoin.' },
  { icon: <Settings size={24} />, label: 'Technique', description: "Debloquer un souci de compte ou d'affichage." },
];

const Support = () => {
  usePageMeta(
    'Support client | Luxtrax',
    'Tu bloques sur une reservation ? Trouve vite une reponse ou contacte le support Luxtrax.',
  );

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Bien recu ! On te repond sous 24h.");
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <header className={styles.heroCard}>
          <span className={styles.badge}>
            <Sparkles size={14} />
            Centre d&apos;aide
          </span>
          <h1 className={styles.pageTitle}>Tu bloques sur une reservation ?</h1>
          <p className={styles.subtitle}>Regarde d&apos;abord les questions les plus courantes, puis ecris-nous si tu veux une aide directe.</p>
          <Input icon={<Search size={18} />} placeholder="Chercher une reponse rapide" />
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Questions frequentes</h2>
          <div className={styles.faqGrid}>
            {faqCategories.map((cat) => (
              <article key={cat.label} className={styles.faqCard}>
                <span className={styles.faqIcon}>{cat.icon}</span>
                <h3 className={styles.faqLabel}>{cat.label}</h3>
                <p className={styles.faqBody}>{cat.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>Ecris-nous</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Ton nom</label>
              <Input
                value={form.name}
                onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Ton e-mail</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Sujet de ta demande</label>
              <Input
                value={form.subject}
                onChange={(e) => setForm(p => ({ ...p, subject: e.target.value }))}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Explique-nous vite ton souci</label>
              <textarea
                className={styles.textarea}
                value={form.message}
                onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))}
                rows={5}
                required
              />
            </div>
            <Button type="submit">Envoyer</Button>
          </form>
        </section>

        <div className={styles.chatCard}>
          <MessageCircle size={24} className={styles.chatIcon} />
          <div>
            <strong>Chat en direct</strong>
            <p>Le chat arrive bientot.</p>
          </div>
          <ChevronRight size={20} className={styles.chevron} />
        </div>

        <div className={styles.responseTime}>
          <Clock size={16} />
          <span>En general, on te repond en moins de 24h</span>
        </div>

        <div className={styles.legalLinks}>
          <a href="#">Confidentialite</a>
          <span>&gt;</span>
          <a href="#">Conditions</a>
          <span>&gt;</span>
          <a href="#">Mentions legales</a>
          <span>&gt;</span>
        </div>
      </div>
    </MainLayout>
  );
};

export default Support;
