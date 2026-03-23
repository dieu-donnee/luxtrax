import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import styles from './BookingFlow.module.css';
import layoutStyles from './BookingLayout.module.css';
import { LocationStep, VehicleStep, ServiceStep, ScheduleStep } from './BookingSteps';
import { ShoppingCart } from 'lucide-react';
import type { ServiceData } from '@/types/models';

const BookingFlow = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [services, setServices] = useState<ServiceData[]>([]);
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({
    vehicle: 'sedan',
    service: '',
    location: '',
  });

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('type', 'carwash');

      if (data) {
        setServices(data as unknown as ServiceData[]);
        if (data.length > 0 && !bookingData.service) {
          setBookingData(prev => ({ ...prev, service: data[0].id }));
        }
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
      toast.error('Veuillez vous connecter pour finaliser votre réservation.');
      navigate('/auth');
      return;
    }
    if (!bookingData.service) {
      toast.error('Veuillez sélectionner un service.');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('bookings').insert({
        user_id: user.id,
        service_id: bookingData.service,
        address: bookingData.location.trim() || 'Adresse non spécifiée',
        scheduled_date: new Date().toISOString(),
        status: 'pending',
      }).select();

      if (error) throw error;
      toast.success('Réservation confirmée avec succès !');
      navigate('/');
    } catch {
      toast.error('Impossible de confirmer la réservation. Réessayez.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)' }}>
          Chargement des services...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className={styles.hero}>
        <div className={styles.imageWrapper}>
          <img
            src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=1000&auto=format&fit=crop"
            alt="Lavage auto premium"
            className={styles.image}
            loading="lazy"
          />
        </div>
        <div className={styles.content}>
          <h1 className={styles.title}>Lavez votre voiture chez vous, sans effort.</h1>
          <p className={styles.description}>
            Un service de lavage professionnel à votre porte, 7 jours sur 7.
          </p>
        </div>
      </section>

      <div id="booking-section" className={layoutStyles.bookingLayout}>
        <div className={layoutStyles.stepsColumn}>
          <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 800 }}>Réservez votre service</h2>

          <LocationStep />

          <VehicleStep
            selected={bookingData.vehicle}
            onSelect={(id: string) => setBookingData(prev => ({ ...prev, vehicle: id }))}
          />

          <ServiceStep
            selected={bookingData.service}
            services={services}
            onSelect={(id: string) => setBookingData(prev => ({ ...prev, service: id }))}
          />

          <ScheduleStep />
        </div>

        <aside className={layoutStyles.summaryColumn}>
          <div className={layoutStyles.summaryCard}>
            <h3 className={layoutStyles.summaryTitle}>
              <ShoppingCart size={20} className={layoutStyles.logoIcon} />
              Résumé
            </h3>

            <div className={layoutStyles.summaryRow}>
              <span className={layoutStyles.label}>Service</span>
              <span className={layoutStyles.value}>{selectedService?.name || 'Sélectionnez'}</span>
            </div>
            <div className={layoutStyles.summaryRow}>
              <span className={layoutStyles.label}>Véhicule</span>
              <span className={layoutStyles.value}>{bookingData.vehicle.charAt(0).toUpperCase() + bookingData.vehicle.slice(1)}</span>
            </div>
            <div className={layoutStyles.summaryRow}>
              <span className={layoutStyles.label}>Lieu</span>
              <span className={layoutStyles.value}>{bookingData.location || 'Non spécifié'}</span>
            </div>

            <div className={layoutStyles.divider} />

            <div className={layoutStyles.summaryRow}>
              <span className={layoutStyles.label}>Sous-total</span>
              <span className={layoutStyles.value}>{price.toFixed(2)} €</span>
            </div>
            <div className={layoutStyles.summaryRow}>
              <span className={layoutStyles.label}>TVA (20%)</span>
              <span className={layoutStyles.value}>{tva.toFixed(2)} €</span>
            </div>

            <div className={layoutStyles.total}>
              <span>Total</span>
              <span>{total.toFixed(2)} €</span>
            </div>

            <Button
              style={{ marginTop: '2rem' }}
              onClick={handleConfirm}
              disabled={submitting}
            >
              {submitting ? 'Confirmation...' : 'Confirmer la réservation'}
            </Button>
          </div>
        </aside>
      </div>
    </MainLayout>
  );
};

export default BookingFlow;
