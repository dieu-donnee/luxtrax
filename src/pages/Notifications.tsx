import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Calendar, Tag, Info, ChevronRight } from 'lucide-react';
import styles from './Notifications.module.css';

type TabKey = 'all' | 'reservations' | 'offers' | 'system';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: 'reservations', label: 'Réservations' },
  { key: 'offers', label: 'Offres' },
  { key: 'system', label: 'Système' },
];

const mockNotifications = [
  {
    id: '1', type: 'reservations' as TabKey,
    icon: <Calendar size={20} />,
    title: 'Réservation confirmée',
    body: 'Lavage prévu le 15 juin à 15h, Calavi Arconville',
    time: 'Il y a 2 heures',
    isNew: true,
  },
  {
    id: '2', type: 'offers' as TabKey,
    icon: <Tag size={20} />,
    title: 'Offre Spéciale Weekend',
    body: '-20% sur tous les services premium ce weekend',
    time: 'Hier',
    isNew: false,
  },
  {
    id: '3', type: 'system' as TabKey,
    icon: <Info size={20} />,
    title: "Mise à jour de l'application",
    body: 'Nouvelle version disponible avec des fonctionnalités améliorées',
    time: '2 jours',
    isNew: false,
  },
];

const Notifications = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  const filtered = activeTab === 'all'
    ? mockNotifications
    : mockNotifications.filter(n => n.type === activeTab);

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Notifications</h1>
          <button className={styles.markAllRead}>Tout marquer comme lu</button>
        </div>

        <div className={styles.tabs}>
          {tabs.map(t => (
            <button
              key={t.key}
              className={`${styles.tab} ${activeTab === t.key ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className={styles.list}>
          {filtered.map(n => (
            <div key={n.id} className={styles.notifCard}>
              <div className={styles.notifIcon} style={{ color: 'var(--primary)' }}>{n.icon}</div>
              <div className={styles.notifContent}>
                <div className={styles.notifTitleRow}>
                  <span className={styles.notifTitle}>{n.title}</span>
                  {n.isNew && <span className={styles.badge}>Nouveau</span>}
                </div>
                <p className={styles.notifBody}>{n.body}</p>
                <span className={styles.notifTime}>{n.time}</span>
              </div>
              <ChevronRight size={18} color="var(--muted-foreground)" />
            </div>
          ))}

          {filtered.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--muted-foreground)', padding: '2rem' }}>
              Aucune notification
            </p>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Notifications;
