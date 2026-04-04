import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePageMeta } from '@/hooks/usePageMeta';
import type { BookingData, ProfileData } from '@/types/models';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import BookingCard from '../components/ui/BookingCard';
import EmptyState from '../components/ui/EmptyState';
import { BookingCardSkeleton } from '../components/ui/Skeleton';
import { ArrowRight, CalendarClock, CheckCircle2, MapPinned, ShieldCheck, Sparkles } from 'lucide-react';
import styles from './Home.module.css';
import OfferCarousel from '../components/ui/OfferCarousel';

const processSteps = [
  {
    step: '01',
    title: 'Choisis ton service',
    text: 'Selectionne la formule qui correspond a ton besoin en quelques secondes.',
  },
  {
    step: '02',
    title: 'Definis lieu et horaire',
    text: 'Renseigne ton adresse et le moment qui t arrange. On s adapte a ton planning.',
  },
  {
    step: '03',
    title: 'Suis ta reservation',
    text: 'Retrouve le statut de ta demande, puis laisse un avis une fois le service termine.',
  },
];

const commitments = [
  {
    title: 'Intervention a domicile',
    text: 'Tu restes chez toi ou au bureau pendant qu on s occupe du vehicule.',
    icon: <MapPinned size={18} />,
  },
  {
    title: 'Prestataires verifies',
    text: 'Chaque prestation suit un cadre qualite avec suivi client.',
    icon: <ShieldCheck size={18} />,
  },
  {
    title: 'Reservation rapide',
    text: 'Le parcours est pense mobile-first pour reserver sans friction.',
    icon: <CalendarClock size={18} />,
  },
];

const servicePillars = [
  'Reservation claire avec recapitulatif avant validation',
  'Suivi des statuts dans ton espace client',
  'Support disponible en cas de besoin',
];

const Home = () => {
  usePageMeta(
    'LustraX | Lavage auto a domicile',
    'Reserve un lavage auto premium a domicile en quelques etapes simples avec LustraX.',
  );

  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [recentBookings, setRecentBookings] = useState<BookingData[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setDataLoading(false);
      return;
    }

    const fetchData = async () => {
      const [profileRes, bookingsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase
          .from('bookings')
          .select('*, services(name, price)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(2),
      ]);

      if (profileRes.data) {
        setProfile(profileRes.data as unknown as ProfileData);
      }
      if (bookingsRes.data) {
        setRecentBookings(bookingsRes.data as unknown as BookingData[]);
      }
      setDataLoading(false);
    };

    fetchData();
  }, [user, authLoading]);

  const firstName = profile?.full_name?.split(' ')[0];

  return (
    <MainLayout>
      <div className={styles.page}>
        <section className={styles.heroGrid}>
          <div className={styles.heroContent}>
            <span className={styles.badge}>
              <Sparkles size={14} />
              Lavage auto premium
            </span>

            <h1 className={styles.heroTitle}>
              {firstName ? `Bonjour ${firstName},` : 'Lavage auto a domicile'}
              <br />
              simple, rapide, professionnel.
            </h1>

            <p className={styles.heroSubtitle}>
              LustraX organise ton lavage en quelques clics: choix de la formule, adresse,
              horaire, puis suivi de la reservation dans ton espace client.
            </p>

            <div className={styles.heroActions}>
              <Button size="lg" onClick={() => navigate('/booking')}>
                Reserver maintenant
                <ArrowRight size={18} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={styles.secondaryAction}
                onClick={() => navigate('/support')}
              >
                Contacter le support
              </Button>
            </div>

            <div className={styles.trustGrid}>
              {commitments.map((item) => (
                <article key={item.title} className={styles.trustCard}>
                  <span className={styles.trustIcon}>{item.icon}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.heroVisual}>
            <article className={styles.heroPanel}>
              <span className={styles.heroPanelTag}>Experience LustraX</span>
              <h2 className={styles.heroPanelTitle}>Un parcours concu pour rester simple du debut a la fin.</h2>
              <p className={styles.heroPanelText}>
                Plus de bloc 3D: la home se concentre sur l essentiel pour reserver vite, comprendre le service
                et passer a l action.
              </p>
              <ul className={styles.heroPanelList}>
                {servicePillars.map((pillar) => (
                  <li key={pillar}>
                    <CheckCircle2 size={16} />
                    <span>{pillar}</span>
                  </li>
                ))}
              </ul>
            </article>
            <div className={styles.heroAside}>
              <CheckCircle2 size={16} />
              <span>Parcours de reservation en 4 etapes avec recapitulatif avant validation.</span>
            </div>
          </div>
        </section>

        <section className={styles.offerSection}>
          <OfferCarousel />
        </section>

        <section className={styles.processSection}>
          <header className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Processus</span>
            <h2 className={styles.sectionTitle}>Comment ca fonctionne</h2>
            <p className={styles.sectionSubtitle}>
              Une architecture de parcours pensee pour limiter les frictions et rassurer a chaque etape.
            </p>
          </header>

          <div className={styles.processGrid}>
            {processSteps.map((item) => (
              <article key={item.step} className={styles.processCard}>
                <span className={styles.processStep}>{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        {user && (
          <section className={styles.recentSection}>
            <div className={styles.recentHeader}>
              <div>
                <span className={styles.sectionTag}>Reservations</span>
                <h2 className={styles.sectionTitle}>Tes dernieres reservations</h2>
              </div>
              <button className={styles.seeAll} onClick={() => navigate('/bookings')}>
                Voir tout
                <ArrowRight size={15} />
              </button>
            </div>

            {dataLoading ? (
              <div className={styles.bookingList}>
                <BookingCardSkeleton />
                <BookingCardSkeleton />
              </div>
            ) : recentBookings.length > 0 ? (
              <div className={styles.bookingList}>
                {recentBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Aucune reservation pour le moment"
                description="Lance ton premier lavage et retrouve ensuite tout ton suivi ici."
                action={
                  <Button onClick={() => navigate('/booking')} size="sm">
                    Demarrer une reservation
                  </Button>
                }
              />
            )}
          </section>
        )}

        <section className={styles.ctaBand}>
          <div>
            <h3>Pret a programmer ton prochain lavage ?</h3>
            <p>Planifie maintenant et suis l avancement depuis ton tableau de bord.</p>
          </div>
          <Button size="lg" className={styles.ctaButton} onClick={() => navigate('/booking')}>
            Je reserve mon lavage
            <ArrowRight size={18} />
          </Button>
        </section>
      </div>
    </MainLayout>
  );
};

export default Home;
