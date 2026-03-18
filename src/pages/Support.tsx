import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Search, Calendar, CreditCard, XCircle, Settings, MessageCircle, Clock, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import styles from './Support.module.css';

const faqCategories = [
  { icon: <Calendar size={24} />, label: 'Réservations' },
  { icon: <CreditCard size={24} />, label: 'Paiements' },
  { icon: <XCircle size={24} />, label: 'Annulation' },
  { icon: <Settings size={24} />, label: 'Problèmes techniques' },
];

const Support = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message envoyé ! Nous vous répondrons sous 24h.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Support Client</h1>

        {/* Search */}
        <Input
          icon={<Search size={18} />}
          placeholder="Rechercher une question"
        />

        {/* FAQ */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Questions Fréquentes</h2>
          <div className={styles.faqGrid}>
            {faqCategories.map((cat) => (
              <div key={cat.label} className={styles.faqCard}>
                <span style={{ color: 'var(--primary)' }}>{cat.icon}</span>
                <span className={styles.faqLabel}>{cat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Nous Contacter</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Nom complet</label>
              <Input
                value={form.name}
                onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Adresse e-mail</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Sujet</label>
              <Input
                value={form.subject}
                onChange={(e) => setForm(p => ({ ...p, subject: e.target.value }))}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Message</label>
              <textarea
                className={styles.textarea}
                value={form.message}
                onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))}
                rows={5}
                required
              />
            </div>
            <Button type="submit">Envoyer le message</Button>
          </form>
        </section>

        {/* Live Chat */}
        <div className={styles.chatCard}>
          <MessageCircle size={24} style={{ color: 'var(--primary)' }} />
          <div>
            <strong>Chat en direct</strong>
            <p>Discutez avec notre assistant</p>
          </div>
          <ChevronRight size={20} style={{ marginLeft: 'auto', color: 'var(--muted-foreground)' }} />
        </div>

        <div className={styles.responseTime}>
          <Clock size={16} />
          <span>Nous répondons généralement dans les 24h</span>
        </div>

        <div className={styles.legalLinks}>
          <a href="#">Confidentialité</a>
          <span>›</span>
          <a href="#">Conditions</a>
          <span>›</span>
          <a href="#">Mentions légales</a>
          <span>›</span>
        </div>
      </div>
    </MainLayout>
  );
};

export default Support;
