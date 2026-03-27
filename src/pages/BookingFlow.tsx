import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePageMeta } from '@/hooks/usePageMeta';
import { toast } from 'sonner';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import styles from './BookingFlow.module.css';
import layoutStyles from './BookingLayout.module.css';
import { LocationStep, VehicleStep, ServiceStep, ScheduleStep } from './BookingSteps';
import { CheckCircle2, MapPinned, ShieldCheck, ShoppingCart, Sparkles } from 'lucide-react';
import type { ServiceData } from '@/types/models';

const BookingFlow = () => {
  usePageMeta(
    'Reservation | Luxtrax',
    'Choisis ton lavage auto a domicile en quelques etapes: adresse, vehicule, formule, puis validation.',
  );

  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [services, setServices] = useState<ServiceData[]>([]);
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({
    vehicle: 'sedan',
    service: '',
    location: '',
    latitude: null as number | null,
    longitude: null as number | null,
    date: new Date().toISOString().split('T')[0],
    time: '14:30',
  });

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('type', 'carwash');

      if (error) {
        console.error('[BookingFlow] fetchServices:', error.code, error.message);
        toast.error("Oups, on n'arrive pas a charger les services pour le moment.");
        setServices([]);
      } else if (data && data.length > 0) {
        setServices(data as ServiceData[]);
        setBookingData(prev => prev.service ? prev : { ...prev, service: data[0].id });
      } else {
        console.warn('[BookingFlow] Aucun service trouve dans la table "services".');
        setServices([]);
      }
      setIsLoading(false);
    };
    fetchServices();
  }, []);

  const selectedService = services.find(s => s.id === bookingData.service);
  const price = selectedService?.price ?? 0;
  const tva = price * 0.2;
  const total = price + tva;

  const handleConfirm = async () => {
    if (!user) {
      toast.error('Connecte-toi pour finir ta reservation.');
      navigate('/auth');
      return;
    }
    if (!bookingData.service) {
      toast.error('Choisis d&apos;abord une formule.');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('bookings').insert({
        user_id: user.id,
        service_id: bookingData.service,
        address: (bookingData.location ?? '').trim() || 'Adresse non specifiee',
        latitude: bookingData.latitude,
        longitude: bookingData.longitude,
        scheduled_date: new Date().toISOString(),
        status: 'pending',
      });

      if (error) throw error;
      toast.success('Top, ta reservation est confirmee !');
      navigate('/');
    } catch (err) {
      console.error('[BookingFlow] handleConfirm:', err);
      toast.error("On n'a pas pu confirmer. Reessaie dans un instant.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className={styles.loadingState}>On prepare les services...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className={styles.hero}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>
            <Sparkles size={16} />
            Ta reservation en quelques etapes
          </span>
          <h1 className={styles.title}>Dis-nous ou tu es, choisis ta formule, et c&apos;est regle.</h1>
          <p className={styles.description}>
            On te guide pas a pas pour que tu ne rates rien: adresse, vehicule, formule, puis validation.
          </p>

          <div className={styles.benefits}>
            <div>
              <MapPinned size={18} />
              <span>Adresse facile a saisir</span>
            </div>
            <div>
              <ShieldCheck size={18} />
              <span>Resume clair avant validation</span>
            </div>
            <div>
              <CheckCircle2 size={18} />
              <span>Suivi direct dans ton espace</span>
            </div>
          </div>
        </div>

        <div className={styles.imageWrapper}>
          <img
            src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=1000&auto=format&fit=crop"
            alt="Lavage auto premium"
            className={styles.image}
            loading="lazy"
          />
          <div className={styles.imageBadge}>Simple a utiliser, meme sur mobile</div>
        </div>
      </section>

      <div id="booking-section" className={layoutStyles.bookingLayout}>
        <div className={layoutStyles.stepsColumn}>
          <div className={styles.headingBlock}>
            <span className={styles.headingTag}>Etapes</span>
            <h2 className={styles.headingTitle}>Remplis juste l&apos;essentiel.</h2>
            <p className={styles.headingBody}>
              Chaque bloc t&apos;aide a avancer sans te perdre, que tu sois sur telephone ou ordi.
            </p>
          </div>

          <LocationStep
            value={bookingData.location}
            onChange={(value, lat, lng) => setBookingData(prev => ({
              ...prev,
              location: value,
              latitude: lat !== undefined ? lat : prev.latitude,
              longitude: lng !== undefined ? lng : prev.longitude,
            }))}
          />

          <VehicleStep
            selected={bookingData.vehicle}
            onSelect={(id: string) => setBookingData(prev => ({ ...prev, vehicle: id }))}
          />

          <ServiceStep
            selected={bookingData.service}
            services={services}
            onSelect={(id: string) => setBookingData(prev => ({ ...prev, service: id }))}
          />

          <ScheduleStep
            date={bookingData.date}
            time={bookingData.time}
            onDateChange={(value: string) => setBookingData(prev => ({ ...prev, date: value }))}
            onTimeChange={(value: string) => setBookingData(prev => ({ ...prev, time: value }))}
          />
        </div>

        <aside className={layoutStyles.summaryColumn}>
          <div className={layoutStyles.summaryCard}>
            <div className={layoutStyles.summaryHeader}>
              <h3 className={layoutStyles.summaryTitle}>
                <ShoppingCart size={20} className={layoutStyles.logoIcon} />
                Resume
              </h3>
              <span className={layoutStyles.summaryTag}>Avant de valider</span>
            </div>

            <p className={layoutStyles.summaryIntro}>
              Relis tranquillement ici avant de confirmer.
            </p>

            <div className={layoutStyles.summaryRow}>
              <span className={layoutStyles.label}>Service</span>
              <span className={layoutStyles.value}>{selectedService?.name || 'Choisis'}</span>
            </div>
            <div className={layoutStyles.summaryRow}>
              <span className={layoutStyles.label}>Vehicule</span>
              <span className={layoutStyles.value}>{bookingData.vehicle.charAt(0).toUpperCase() + bookingData.vehicle.slice(1)}</span>
            </div>
            <div className={layoutStyles.summaryRow}>
              <span className={layoutStyles.label}>Lieu</span>
              <span className={layoutStyles.value}>{bookingData.location || 'Non specifie'}</span>
            </div>

            <div className={layoutStyles.divider} />

            <div className={layoutStyles.summaryRow}>
              <span className={layoutStyles.label}>Sous-total</span>
              <span className={layoutStyles.value}>{Math.round(price)} FCFA</span>
            </div>
            <div className={layoutStyles.summaryRow}>
              <span className={layoutStyles.label}>TVA (20%)</span>
              <span className={layoutStyles.value}>{Math.round(tva)} FCFA</span>
            </div>

            <div className={layoutStyles.total}>
              <span>Total</span>
              <span>{Math.round(total)} FCFA</span>
            </div>

            <div className={layoutStyles.reassuranceList}>
              <div><CheckCircle2 size={16} /> Tu confirmes en un clic</div>
              <div><CheckCircle2 size={16} /> Le recap reste visible jusqu&apos;a validation</div>
              <div><CheckCircle2 size={16} /> Tu suis tout ensuite dans tes reservations</div>
            </div>

            <Button
              className={layoutStyles.confirmButton}
              onClick={handleConfirm}
              disabled={submitting}
            >
              {submitting ? 'Validation...' : 'Je confirme ma reservation'}
            </Button>
          </div>
        </aside>
      </div>
    </MainLayout>
  );
};

export default BookingFlow;
