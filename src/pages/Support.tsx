import React, { useMemo, useState } from 'react';
import {
  CalendarClock,
  ChevronRight,
  Headset,
  Mail,
  MessageSquare,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { usePageMeta } from '@/hooks/usePageMeta';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import styles from './Support.module.css';

const SUPPORT_EMAIL = 'support@luxtrax.app';
const SUPPORT_PHONE = '+225 01 23 45 67 89';
const SUPPORT_PHONE_RAW = '+2250123456789';

const contactChannels = [
  {
    icon: <Mail size={20} />,
    title: 'Support email',
    detail: SUPPORT_EMAIL,
    description: 'Ideal pour les demandes detaillees (facturation, reclamation, suivi).',
    action: 'Envoyer un email',
    href: `mailto:${SUPPORT_EMAIL}`,
  },
  {
    icon: <Phone size={20} />,
    title: 'Support telephone',
    detail: SUPPORT_PHONE,
    description: 'Pour une urgence sur reservation en cours, privilegie un appel direct.',
    action: 'Appeler maintenant',
    href: `tel:${SUPPORT_PHONE_RAW}`,
  },
  {
    icon: <MessageSquare size={20} />,
    title: 'Espace FAQ',
    detail: 'Reponses immediates',
    description: 'Consulte d abord les cas les plus frequents avant d ouvrir une demande.',
    action: 'Voir la FAQ',
    href: '#faq',
  },
];

const faqItems = [
  {
    category: 'Reservation',
    question: 'Comment modifier mon horaire de passage ?',
    answer: 'Va dans Mes reservations, ouvre la reservation concernee puis mets a jour le creneau avant la confirmation finale.',
  },
  {
    category: 'Paiement',
    question: 'Quels modes de paiement sont acceptes ?',
    answer: 'La plateforme prepare mobile money, carte et espece. Les options visibles au checkout dependent de ton compte et du service.',
  },
  {
    category: 'Qualite',
    question: 'Que faire si la prestation ne correspond pas ?',
    answer: 'Depuis ta reservation terminee, utilise le bouton Signaler. Notre equipe traite les reclamations sous 24h.',
  },
  {
    category: 'Compte',
    question: 'Je n arrive pas a me connecter. Que verifier ?',
    answer: 'Controle ton email de connexion, puis reconnecte-toi via /auth. Si besoin, contacte le support avec ton email client.',
  },
];

type SupportForm = {
  name: string;
  email: string;
  phone: string;
  bookingRef: string;
  subject: string;
  message: string;
};

type FormErrors = Partial<Record<keyof SupportForm, string>>;

const initialForm: SupportForm = {
  name: '',
  email: '',
  phone: '',
  bookingRef: '',
  subject: '',
  message: '',
};

const Support = () => {
  usePageMeta(
    'Support client | LustraX',
    'Contacte rapidement l equipe LustraX et retrouve les reponses aux questions frequentes.',
  );

  const [search, setSearch] = useState('');
  const [form, setForm] = useState<SupportForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const filteredFaq = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return faqItems;
    return faqItems.filter((item) =>
      `${item.category} ${item.question} ${item.answer}`.toLowerCase().includes(q),
    );
  }, [search]);

  const validateForm = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (form.name.trim().length < 2) {
      nextErrors.name = 'Indique un nom valide.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Email invalide.';
    }
    if (form.phone.trim() && form.phone.trim().length < 8) {
      nextErrors.phone = 'Numero trop court.';
    }
    if (!form.subject.trim()) {
      nextErrors.subject = 'Choisis un sujet.';
    }
    if (form.message.trim().length < 20) {
      nextErrors.message = 'Explique ton besoin en au moins 20 caracteres.';
    }

    return nextErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error('Complete les champs obligatoires pour envoyer ta demande.');
      return;
    }

    toast.success('Demande envoyee. Notre equipe revient vers toi sous 24h.');
    setForm(initialForm);
    setErrors({});
  };

  return (
    <MainLayout>
      <div className={styles.page}>
        <header className={styles.hero}>
          <div className={styles.heroMain}>
            <span className={styles.badge}>
              <Sparkles size={14} />
              Support client LustraX
            </span>
            <h1 className={styles.pageTitle}>Un centre de contact clair pour t accompagner rapidement.</h1>
            <p className={styles.subtitle}>
              Choisis ton canal, consulte les reponses frequentes, puis envoie ta demande si besoin.
            </p>
            <div className={styles.heroActions}>
              <Button size="sm" onClick={() => document.getElementById('support-form')?.scrollIntoView({ behavior: 'smooth' })}>
                Envoyer une demande
              </Button>
              <a href={`tel:${SUPPORT_PHONE_RAW}`} className={styles.inlineAction}>
                Appeler le support
                <ChevronRight size={14} />
              </a>
            </div>
          </div>

          <div className={styles.heroStats}>
            <article className={styles.statCard}>
              <CalendarClock size={18} />
              <div>
                <strong>&lt; 24h</strong>
                <span>Delai moyen de reponse</span>
              </div>
            </article>
            <article className={styles.statCard}>
              <Headset size={18} />
              <div>
                <strong>Lun - Sam</strong>
                <span>Support disponible 08:00 - 20:00</span>
              </div>
            </article>
            <article className={styles.statCard}>
              <ShieldCheck size={18} />
              <div>
                <strong>Suivi trace</strong>
                <span>Chaque demande est priorisee selon son impact</span>
              </div>
            </article>
          </div>
        </header>

        <section className={styles.channelsSection}>
          <header className={styles.sectionHeader}>
            <h2>Canaux de contact</h2>
            <p>Selectionne le canal le plus adapte a ta situation.</p>
          </header>
          <div className={styles.channelsGrid}>
            {contactChannels.map((channel) => (
              <article key={channel.title} className={styles.channelCard}>
                <span className={styles.channelIcon}>{channel.icon}</span>
                <div className={styles.channelBody}>
                  <h3>{channel.title}</h3>
                  <p className={styles.channelDetail}>{channel.detail}</p>
                  <p className={styles.channelDescription}>{channel.description}</p>
                  <a className={styles.channelAction} href={channel.href}>
                    {channel.action}
                    <ChevronRight size={14} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.faqSection} id="faq">
          <div className={styles.faqHeader}>
            <div>
              <h2>FAQ operationnelle</h2>
              <p>Recherche rapide sur les demandes les plus frequentes.</p>
            </div>
            <Input
              icon={<Search size={18} />}
              placeholder="Recherche: reservation, paiement, compte..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={styles.faqList}>
            {filteredFaq.length > 0 ? (
              filteredFaq.map((item) => (
                <article key={item.question} className={styles.faqItem}>
                  <span className={styles.faqCategory}>{item.category}</span>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))
            ) : (
              <div className={styles.noResult}>
                Aucun resultat pour cette recherche. Envoie ta demande via le formulaire ci-dessous.
              </div>
            )}
          </div>
        </section>

        <section className={styles.formSection} id="support-form">
          <header className={styles.sectionHeader}>
            <h2>Envoyer une demande au support</h2>
            <p>Donne le maximum de contexte pour accelerer le traitement.</p>
          </header>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Nom complet *</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  error={errors.name}
                  placeholder="Ex: Kouassi Amani"
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Email *</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  error={errors.email}
                  placeholder="ton@email.com"
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Telephone</label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  error={errors.phone}
                  placeholder="+225..."
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Reference reservation (optionnel)</label>
                <Input
                  value={form.bookingRef}
                  onChange={(e) => setForm((p) => ({ ...p, bookingRef: e.target.value }))}
                  placeholder="ID reservation"
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Sujet *</label>
              <select
                className={`${styles.select} ${errors.subject ? styles.selectError : ''}`}
                value={form.subject}
                onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
              >
                <option value="">Choisis un sujet</option>
                <option value="reservation">Reservation</option>
                <option value="payment">Paiement</option>
                <option value="complaint">Reclamation</option>
                <option value="account">Compte utilisateur</option>
                <option value="other">Autre</option>
              </select>
              {errors.subject && <span className={styles.errorText}>{errors.subject}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Message *</label>
              <textarea
                className={`${styles.textarea} ${errors.message ? styles.textareaError : ''}`}
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                placeholder="Decris le contexte, le probleme rencontre, et le resultat attendu."
                rows={6}
              />
              {errors.message && <span className={styles.errorText}>{errors.message}</span>}
            </div>

            <div className={styles.formFooter}>
              <span className={styles.responseTime}>
                <CalendarClock size={14} />
                Reponse moyenne en moins de 24h
              </span>
              <Button type="submit" size="sm">
                Envoyer la demande
              </Button>
            </div>
          </form>
        </section>
      </div>
    </MainLayout>
  );
};

export default Support;
