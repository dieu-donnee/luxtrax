import React from 'react';
import { MapPin, Car, CheckCircle2, Clock, Calendar, ChevronRight } from 'lucide-react';
import styles from './BookingSteps.module.css';
import Input from '../components/ui/Input';
import { clsx } from 'clsx';

export const LocationStep = () => (
  <div className={styles.stepCard}>
    <div className={styles.stepHeader}>
      <div className={styles.stepNumber}>1</div>
      <h3 className={styles.stepTitle}>Localisation</h3>
    </div>
    <div className={styles.mapPlaceholder}>
      <img src="https://api.mapbox.com/styles/v1/mapbox/light-v10/static/pin-s-l+000(-74.006,40.712)/-74.006,40.712,12/600x400?access_token=pk.eyJ1IjoiZGV2ZWxvcGVyIiwiYSI6ImNreHh4eHh4eHh4eHh4eHh4eHh4eHh4In0" alt="Carte" className={styles.mapImage} />
    </div>
    <Input icon={<MapPin size={18} />} placeholder="Entrez votre adresse" />
  </div>
);

export const VehicleStep = ({ selected, onSelect }: any) => {
  const vehicles = [
    { id: 'compact', label: 'Compact', icon: <Car size={24} /> },
    { id: 'sedan', label: 'Sédan', icon: <Car size={24} /> },
    { id: 'suv', label: 'SUV', icon: <Car size={24} /> },
    { id: 'pickup', label: 'Pickup', icon: <Car size={24} /> },
  ];

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

export const ServiceStep = ({ selected, services, onSelect }: any) => {
  return (
    <div className={styles.stepCard}>
      <div className={styles.stepHeader}>
        <div className={styles.stepNumber}>3</div>
        <h3 className={styles.stepTitle}>Sélection du Service</h3>
      </div>
      <div className={styles.serviceList}>
        {services.map((s: any) => (
          <div 
            key={s.id} 
            className={clsx(styles.serviceCard, selected === s.id && styles.serviceCardActive)}
            onClick={() => onSelect(s.id)}
          >
            <div className={styles.serviceInfo}>
              <span className={styles.serviceName}>{s.name}</span>
              <span className={styles.serviceDesc}>{s.description}</span>
              <div className={styles.serviceMeta}>
                <Clock size={14} /> <span>30-90 min</span>
              </div>
            </div>
            <span className={styles.price}>{s.price} €</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ScheduleStep = () => (
  <div className={styles.stepCard}>
    <div className={styles.stepHeader}>
      <div className={styles.stepNumber}>4</div>
      <h3 className={styles.stepTitle}>Planification</h3>
    </div>
    <div className={styles.serviceList}>
      <div className={styles.serviceCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Calendar className={styles.logoIcon} size={20} />
          <div className={styles.serviceInfo}>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Date</span>
            <span className={styles.serviceName}>Aujourd'hui, 15 Mars</span>
          </div>
        </div>
        <ChevronRight size={20} color="var(--muted-foreground)" />
      </div>

      <div className={styles.serviceCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Clock className={styles.logoIcon} size={20} />
          <div className={styles.serviceInfo}>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Heure</span>
            <span className={styles.serviceName}>14:30</span>
          </div>
        </div>
        <ChevronRight size={20} color="var(--muted-foreground)" />
      </div>
    </div>
  </div>
);
