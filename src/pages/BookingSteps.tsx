import React, { useMemo } from 'react';
import { MapPin, Car, Clock, Calendar, ChevronRight } from 'lucide-react';
import type { ServiceData } from '@/types/models';
import styles from './BookingSteps.module.css';
import Input from '../components/ui/Input';
import { clsx } from 'clsx';
import { toast } from 'sonner';

interface LocationStepProps {
  value: string;
  onChange: (value: string, lat?: number, lng?: number) => void;
}

import { useGeolocation } from '@/hooks/useGeolocation';

export const LocationStep: React.FC<LocationStepProps> = ({ value, onChange }) => {
  const { locate, isLocating } = useGeolocation((res) => {
    onChange(res.address, res.latitude, res.longitude);
  });

  // Géolocalisation proactive : on tente de localiser dès que le composant est monté
  // si aucune adresse n'est encore renseignée.
  React.useEffect(() => {
    if (!value) {
      locate();
    }
  }, []); // Exécuté une seule fois au montage

  return (
    <div className={styles.stepCard}>
      <div className={styles.stepHeader}>
        <div className={styles.stepNumber}>1</div>
        <h3 className={styles.stepTitle}>Localisation</h3>
      </div>
      <div 
        className={styles.mapPlaceholder}
        onClick={locate}
        style={{ cursor: 'pointer' }}
      >
        <div className={styles.mapFallback}>
          <div className={styles.radarContainer}>
            <div className={styles.radarPulse}></div>
            <div className={styles.radarPulse}></div>
            <div className={styles.radarPulse}></div>
            <MapPin className={styles.locationIcon3d} size={48} strokeWidth={1.5} />
          </div>
          <span className={styles.locatingText}>
            {isLocating 
              ? '📡 Détection de votre position...' 
              : '📍 Touchez ici pour vous géolocaliser'}
          </span>
          {!isLocating && (
            <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '-1rem' }}>
              ou entrez votre adresse manuellement ci-dessous
            </span>
          )}
        </div>
      </div>
      <Input
        icon={<MapPin size={18} />}
        placeholder="Entrez votre adresse"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

interface VehicleStepProps {
  selected: string;
  onSelect: (id: string) => void;
}

export const VehicleStep: React.FC<VehicleStepProps> = ({ selected, onSelect }) => {
  const vehicles = useMemo(() => [
    { id: 'compact', label: 'Compact', icon: <Car size={24} /> },
    { id: 'sedan', label: 'Sédan', icon: <Car size={24} /> },
    { id: 'suv', label: 'SUV', icon: <Car size={24} /> },
    { id: 'pickup', label: 'Pickup', icon: <Car size={24} /> },
  ], []);

  return (
    <div className={styles.stepCard}>
      <div className={styles.stepHeader}>
        <div className={styles.stepNumber}>2</div>
        <h3 className={styles.stepTitle}>Type de Véhicule</h3>
      </div>
      <div className={styles.grid}>
        {vehicles.map(v => (
          <div 
            key={v.id} 
            className={clsx(styles.optionCard, selected === v.id && styles.optionCardActive)}
            onClick={() => onSelect(v.id)}
          >
            {v.icon}
            <span className={styles.optionLabel}>{v.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface ServiceStepProps {
  selected: string;
  services: ServiceData[];
  onSelect: (id: string) => void;
}

export const ServiceStep: React.FC<ServiceStepProps> = ({ selected, services, onSelect }) => {
  return (
    <div className={styles.stepCard}>
      <div className={styles.stepHeader}>
        <div className={styles.stepNumber}>3</div>
        <h3 className={styles.stepTitle}>Sélection du Service</h3>
      </div>
      <div className={styles.serviceList}>
        {services.map((s) => (
          <div 
            key={s.id} 
            className={clsx(styles.serviceCard, selected === s.id && styles.serviceCardActive)}
            onClick={() => onSelect(s.id)}
          >
            <div className={styles.serviceInfo}>
              <span className={styles.serviceName}>{s.name}</span>
              <span className={styles.serviceDesc}>{s.description ?? ''}</span>
              <div className={styles.serviceMeta}>
                <Clock size={14} /> <span>30-90 min</span>
              </div>
            </div>
            <span className={styles.price}>{Math.round(s.price)} FCFA</span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface ScheduleStepProps {
  date: string;
  time: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
}

export const ScheduleStep: React.FC<ScheduleStepProps> = ({ date, time, onDateChange, onTimeChange }) => {
  const minDate = new Date().toISOString().split('T')[0];

  return (
  <div className={styles.stepCard}>
    <div className={styles.stepHeader}>
      <div className={styles.stepNumber}>4</div>
      <h3 className={styles.stepTitle}>Planification</h3>
    </div>
    <div className={styles.serviceList}>
      <div className={styles.serviceCard} style={{ cursor: 'default' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
          <Calendar className={styles.logoIcon} size={20} />
          <div className={styles.serviceInfo} style={{ flex: 1 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Date d'intervention</span>
            <input 
              type="date" 
              value={date} 
              min={minDate}
              onChange={(e) => onDateChange(e.target.value)}
              className={styles.dynamicInput}
            />
          </div>
        </div>
      </div>

      <div className={styles.serviceCard} style={{ cursor: 'default' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
          <Clock className={styles.logoIcon} size={20} />
          <div className={styles.serviceInfo} style={{ flex: 1 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Heure souhaitée</span>
            <input 
              type="time" 
              value={time} 
              onChange={(e) => onTimeChange(e.target.value)}
              className={styles.dynamicInput}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
