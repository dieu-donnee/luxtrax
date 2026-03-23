import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '../components/layout/MainLayout';
import { Calendar, Tag, Info, ChevronRight, Bell } from 'lucide-react';
import { toast } from 'sonner';
import styles from './Notifications.module.css';

type TabKey = 'all' | 'reservations' | 'offers' | 'system';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: 'reservations', label: 'Réservations' },
  { key: 'offers', label: 'Offres' },
  { key: 'system', label: 'Système' },
];

const iconMap: Record<string, React.ReactNode> = {
  reservations: <Calendar size={20} />,
  offers: <Tag size={20} />,
  system: <Info size={20} />,
};

const Notifications = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/auth'); return; }

      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (data) setNotifications(data);
      setLoading(false);
    };
    init();
  }, [navigate]);

  const filtered = activeTab === 'all'
    ? notifications
    : notifications.filter(n => n.type === activeTab);

  const markAllRead = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', session.user.id)
      .eq('is_read', false);
    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success('Toutes les notifications marquées comme lues');
    }
  };

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `Il y a ${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Il y a ${days}j`;
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Notifications</h1>
          <button className={styles.markAllRead} onClick={markAllRead}>
            Tout marquer comme lu
          </button>
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
          {loading && (
            <p style={{ textAlign: 'center', color: 'var(--muted-foreground)', padding: '2rem' }}>
              Chargement...
            </p>
          )}

          {!loading && filtered.map(n => (
            <div key={n.id} className={styles.notifCard}>
              <div className={styles.notifIcon} style={{ color: 'var(--primary)' }}>
                {iconMap[n.type] || <Bell size={20} />}
              </div>
              <div className={styles.notifContent}>
                <div className={styles.notifTitleRow}>
                  <span className={styles.notifTitle}>{n.title}</span>
                  {!n.is_read && <span className={styles.badge}>Nouveau</span>}
                </div>
                <p className={styles.notifBody}>{n.message}</p>
                <span className={styles.notifTime}>{formatTime(n.created_at)}</span>
              </div>
              <ChevronRight size={18} color="var(--muted-foreground)" />
            </div>
          ))}

          {!loading && filtered.length === 0 && (
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
