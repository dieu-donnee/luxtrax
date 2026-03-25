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
import { ShoppingCart, AlertCircle } from 'lucide-react';
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
    latitude: null as number | null,
    longitude: null as number | null,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace('h', ':'),
  });

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('type', 'carwash');

      if (error) {
        console.error('[BookingFlow] fetchServices Error:', error);
        if (error.code === '401' || (error as any).status === 401) {
          toast.error('Session Invalide : Veuillez synchroniser le JWT Secret dans Supabase.');
        } else {
          toast.error('Impossible de charger les services (Erreur Base de Données). Vérifiez les permissions RLS.');
        }
        setServices([]);
      } else if (data && data.length > 0) {
        console.log('[BookingFlow] Services chargés:', data.length);
        setServices(data as ServiceData[]);
        setBookingData(prev => prev.service ? prev : { ...prev, service: data[0].id });
      } else {
        console.warn('[BookingFlow] Aucun service trouvé.');
        setServices([]);
      }
      setIsLoading(false);
    };
    fetchServices();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        address: (bookingData.location ?? '').trim() || 'Adresse non spécifiée',
        latitude: bookingData.latitude,
        longitude: bookingData.longitude,
        scheduled_date: `${bookingData.date}T${bookingData.time}:00Z`,
        status: 'pending',
      });

      if (error) throw error;
      toast.success('Réservation confirmée avec succès !');
      navigate('/');
    } catch (err) {
      console.error('[BookingFlow] handleConfirm:', err);
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

          <LocationStep
            value={bookingData.location}
            onChange={(value, lat, lng) => setBookingData(prev => ({ 
              ...prev, 
              location: value,
              latitude: lat !== undefined ? lat : prev.latitude,
              longitude: lng !== undefined ? lng : prev.longitude
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
          {services.length === 0 && (
            <div style={{ padding: '1.5rem', background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '1.25rem', color: '#9a3412', marginBottom: '2rem', textAlign: 'center' }}>
              <AlertCircle style={{ marginBottom: '0.5rem' }} />
              <p style={{ fontWeight: 600, marginBottom: '0.75rem' }}>⚠️ Aucun service disponible.</p>
              <button 
                onClick={() => window.location.reload()}
                style={{ padding: '0.5rem 1rem', background: '#ea580c', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Recharger la page
              </button>
            </div>
          )}

          <ScheduleStep 
            date={bookingData.date}
            time={bookingData.time}
            onDateChange={(val) => setBookingData(prev => ({ ...prev, date: val }))}
            onTimeChange={(val) => setBookingData(prev => ({ ...prev, time: val }))}
          />
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
            <div className={layoutStyles.summaryRow}>
              <span className={layoutStyles.label}>Planification</span>
              <span className={layoutStyles.value}>{bookingData.date} à {bookingData.time}</span>
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
