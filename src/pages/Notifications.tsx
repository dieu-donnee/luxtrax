import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { NotificationData } from '@/types/models';
import { formatRelativeTime } from '@/types/models';
import MainLayout from '../components/layout/MainLayout';
import EmptyState from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { Calendar, Tag, Info, ChevronRight, Bell } from 'lucide-react';
import { toast } from 'sonner';
import styles from './Notifications.module.css';

type TabKey = 'all' | 'reservations' | 'offers' | 'system';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: 'reservations', label: 'Réservations' },
  { key: 'offers', label: 'Offres' },
  { key: 'system', label: 'Système' },
];

const ICON_MAP: Record<string, React.ReactNode> = {
  reservations: <Calendar size={20} />,
  offers: <Tag size={20} />,
  system: <Info size={20} />,
};

const Notifications = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/auth'); return; }

    const fetchNotifs = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setNotifications(data as unknown as NotificationData[]);
      setLoading(false);
    };
    fetchNotifs();
  }, [user, authLoading, navigate]);

  const filtered = activeTab === 'all'
    ? notifications
    : notifications.filter(n => n.type === activeTab);

  const markAllRead = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success('Toutes les notifications marquées comme lues');
    }
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
          {TABS.map(t => (
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
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ padding: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Skeleton width="40px" height="40px" borderRadius="50%" />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Skeleton width="60%" height="1rem" />
                  <Skeleton width="90%" height="0.75rem" />
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Bell size={48} />}
              title="Aucune notification"
              description="Vous serez notifié ici pour vos réservations et offres"
            />
          ) : (
            filtered.map(n => (
              <div key={n.id} className={styles.notifCard}>
                <div className={styles.notifIcon} style={{ color: 'var(--primary)' }}>
                  {ICON_MAP[n.type] || <Bell size={20} />}
                </div>
                <div className={styles.notifContent}>
                  <div className={styles.notifTitleRow}>
                    <span className={styles.notifTitle}>{n.title}</span>
                    {!n.is_read && <span className={styles.badge}>Nouveau</span>}
                  </div>
                  <p className={styles.notifBody}>{n.message}</p>
                  <span className={styles.notifTime}>{formatRelativeTime(n.created_at)}</span>
                </div>
                <ChevronRight size={18} color="var(--muted-foreground)" />
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Notifications;
