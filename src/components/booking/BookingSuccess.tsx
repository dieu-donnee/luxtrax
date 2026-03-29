import React from 'react';
import { CheckCircle2, Calendar, MapPin, ArrowRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import styles from './BookingSuccess.module.css';

interface BookingSuccessProps {
  serviceName: string;
  date: string;
  time: string;
  location: string;
}

const BookingSuccess: React.FC<BookingSuccessProps> = ({
  serviceName,
  date,
  time,
  location,
}) => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <CheckCircle2 size={64} className={styles.successIcon} />
          <div className={styles.rings}>
            <div className={styles.ring} />
            <div className={styles.ring} />
          </div>
        </div>

        <h2 className={styles.title}>Réservation Confirmée !</h2>
        <p className={styles.subtitle}>
          On a bien reçu ta demande pour ton <strong>{serviceName}</strong>. 
          Un partenaire LustraX te sera bientôt attribué.
        </p>

        <div className={styles.details}>
          <div className={styles.detailItem}>
            <MapPin size={18} />
            <span>{location}</span>
          </div>
          <div className={styles.detailItem}>
            <Calendar size={18} />
            <span>{date} à {time}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Button 
            className={styles.viewBookings}
            onClick={() => navigate('/profile')}
          >
            Voir mes réservations
            <ArrowRight size={18} />
          </Button>
          
          <Button 
            variant="outline" 
            className={styles.goHome}
            onClick={() => navigate('/')}
          >
            <Home size={18} />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
