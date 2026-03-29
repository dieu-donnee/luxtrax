import React, { useMemo } from 'react';
import { Calendar, Car, Clock, MapPin } from 'lucide-react';
import { clsx } from 'clsx';
import type { ServiceData } from '@/types/models';
import Input from '../components/ui/Input';
import { useGeolocation } from '@/hooks/useGeolocation';
import styles from './BookingSteps.module.css';

interface LocationStepProps {
  value: string;
  onChange: (value: string, lat?: number, lng?: number) => void;
}

export const LocationStep: React.FC<LocationStepProps> = ({ value, onChange }) => {
  const handleKeyboardActivate = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const onGeoSuccess = React.useCallback((res: { address: string; latitude: number; longitude: number }) => {
    onChange(res.address, res.latitude, res.longitude);
  }, [onChange]);

  const { locate, isLocating } = useGeolocation(onGeoSuccess);

  React.useEffect(() => {
    if (!value) locate();
  }, [value, locate]);

  return (
    <div className={styles.stepCard}>
      <div className={styles.stepHeader}>
        <div className={styles.stepNumber}>1</div>
        <h3 className={styles.stepTitle}>Localisation</h3>
      </div>

      <div
        className={styles.mapPlaceholder}
        onClick={locate}
        onKeyDown={(event) => handleKeyboardActivate(event, locate)}
        role="button"
        tabIndex={0}
        style={{ cursor: 'pointer' }}
      >
        <div className={styles.mapFallback}>
          <div className={styles.radarContainer}>
            <div className={styles.radarPulse} />
            <div className={styles.radarPulse} />
            <div className={styles.radarPulse} />
            <MapPin className={styles.locationIcon3d} size={48} strokeWidth={1.5} />
          </div>
          <span className={styles.locatingText}>
            {isLocating ? 'Detection de ta position...' : 'Touche ici pour te geolocaliser'}
          </span>
          {!isLocating && (
            <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '-1rem' }}>
              ou entre ton adresse manuellement ci-dessous
            </span>
          )}
        </div>
      </div>

      <Input
        icon={<MapPin size={18} />}
        placeholder="Entre ton adresse"
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
  const handleKeyboardActivate = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const vehicles = useMemo(() => [
    { id: 'compact', label: 'Compact', icon: <Car size={20} /> },
    { id: 'sedan', label: 'Sedan', icon: <Car size={20} /> },
    { id: 'suv', label: 'SUV', icon: <Car size={20} /> },
    { id: 'pickup', label: 'Pickup', icon: <Car size={20} /> },
  ], []);

  return (
    <div className={styles.stepCard}>
      <div className={styles.stepHeader}>
        <div className={styles.stepNumber}>2</div>
        <h3 className={styles.stepTitle}>Type de vehicule</h3>
      </div>
      <div className={styles.grid}>
        {vehicles.map((v) => (
          <div
            key={v.id}
            className={clsx(styles.optionCard, selected === v.id && styles.optionCardActive)}
            onClick={() => onSelect(v.id)}
            onKeyDown={(event) => handleKeyboardActivate(event, () => onSelect(v.id))}
            role="button"
            tabIndex={0}
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
  const handleKeyboardActivate = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  return (
    <div className={styles.stepCard}>
      <div className={styles.stepHeader}>
        <div className={styles.stepNumber}>3</div>
        <h3 className={styles.stepTitle}>Selection du service</h3>
      </div>
      <div className={styles.serviceList}>
        {services.map((s) => (
          <div
            key={s.id}
            className={clsx(styles.serviceCard, selected === s.id && styles.serviceCardActive)}
            onClick={() => onSelect(s.id)}
            onKeyDown={(event) => handleKeyboardActivate(event, () => onSelect(s.id))}
            role="button"
            tabIndex={0}
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
              <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Date d&apos;intervention</span>
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
              <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Heure souhaitee</span>
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
