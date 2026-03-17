import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import styles from './BookingFlow.module.css';
import layoutStyles from './BookingLayout.module.css';
import { LocationStep, VehicleStep, ServiceStep, ScheduleStep } from './BookingSteps';
import { ShoppingCart } from 'lucide-react';

const BookingFlow = () => {
  const [step, setStep] = useState(0); 
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({
    vehicle: 'sedan',
    service: '',
    location: '',
  });

  useEffect(() => {
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth Event:", event);
      if (session) {
        setUser(session.user);
        initData();
      } else if (event === 'SIGNED_OUT' || (!session && !isLoading)) {
        navigate('/auth');
      }
    });

    const initData = async () => {
      // Fetch dynamic services immediately while auth initializes
      const { data: servicesData } = await supabase
        .from('services')
        .select('*')
        .eq('type', 'carwash');
      
      if (servicesData) {
        setServices(servicesData);
        if (servicesData.length > 0 && !bookingData.service) {
          setBookingData(prev => ({ ...prev, service: servicesData[0].id }));
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Rediriger "doucement" après avoir attendu si Supabase confirme qu'il n'y a personne en mémoire
        const timer = setTimeout(() => {
          if (!user) navigate('/auth');
        }, 1500);
        return () => clearTimeout(timer);
      } else {
        setUser(session.user);
      }
      setIsLoading(false);
    };

    initData();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, bookingData.service, isLoading, user]);

  const handleStartBooking = () => {
    setStep(1);
    const element = document.getElementById('booking-section');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Chargement...</div>;
  }

  return (
    <MainLayout>
      <section className={styles.hero}>
        <div className={styles.imageWrapper}>
          <img 
            src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=1000&auto=format&fit=crop" 
            alt="Lavage auto premium" 
            className={styles.image}
          />
        </div>
        <div className={styles.content}>
          <h1 className={styles.title}>Lavez votre voiture chez vous, sans effort.</h1>
          <p className={styles.description}>
            Un service de lavage professionnel à votre porte, 7 jours sur 7. 
            Gagnez du temps et gardez votre véhicule impeccable.
          </p>
          <Button onClick={handleStartBooking} size="lg" style={{ maxWidth: '200px' }}>
            Réserver maintenant
          </Button>
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
              <span className={layoutStyles.value}>{services.find(s => s.id === bookingData.service)?.name || 'Sélectionnez'}</span>
            </div>
            <div className={layoutStyles.summaryRow}>
              <span className={layoutStyles.label}>Véhicule</span>
              <span className={layoutStyles.value}>{bookingData.vehicle.charAt(0).toUpperCase() + bookingData.vehicle.slice(1)}</span>
            </div>
            <div className={layoutStyles.summaryRow}>
              <span className={layoutStyles.label}>Lieu</span>
              <span className={layoutStyles.value}>{bookingData.location || '123 Rue de Luxe'}</span>
            </div>

            <div className={layoutStyles.divider} />

            <div className={layoutStyles.summaryRow}>
              <span className={layoutStyles.label}>Sous-total</span>
              <span className={layoutStyles.value}>{services.find(s => s.id === bookingData.service)?.price || '0'} €</span>
            </div>
            <div className={layoutStyles.summaryRow}>
              <span className={layoutStyles.label}>TVA (20%)</span>
              <span className={layoutStyles.value}>
                {(parseFloat(services.find(s => s.id === bookingData.service)?.price || '0') * 0.2).toFixed(2)} €
              </span>
            </div>

            <div className={layoutStyles.total}>
              <span>Total</span>
              <span>
                {(parseFloat(services.find(s => s.id === bookingData.service)?.price || '0') * 1.2).toFixed(2)} €
              </span>
            </div>

            <Button 
              style={{ marginTop: '2rem' }}
              onClick={async () => {
                try {
                  const { data, error } = await supabase.from('bookings').insert({
                    user_id: user.id,
                    service_id: bookingData.service,
                    address: bookingData.location || '123 Rue de Luxe',
                    scheduled_date: new Date().toISOString(), // Simulation aujourd'hui
                    status: 'pending'
                  }).select();

                  if (error) throw error;
                  toast.success("Réservation confirmée avec succès !");
                  setStep(0); 
                } catch (error: any) {
                  toast.error("Erreur : " + error.message);
                }
              }}
            >
              Confirmer la réservation
            </Button>
          </div>
        </aside>
      </div>
    </MainLayout>
  );
};

export default BookingFlow;
