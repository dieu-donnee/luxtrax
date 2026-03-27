import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePageMeta } from '@/hooks/usePageMeta';
import type { NotificationData } from '@/types/models';
import { formatRelativeTime } from '@/types/models';
import MainLayout from '../components/layout/MainLayout';
import EmptyState from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { Bell, Calendar, CheckCheck, ChevronRight, Info, Sparkles, Tag } from 'lucide-react';
import { toast } from 'sonner';
import styles from './Notifications.module.css';

type TabKey = 'all' | 'reservations' | 'offers' | 'system';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: 'reservations', label: 'Reservations' },
  { key: 'offers', label: 'Offres' },
  { key: 'system', label: 'Systeme' },
];

const ICON_MAP: Record<string, React.ReactNode> = {
  reservations: <Calendar size={20} />,
  offers: <Tag size={20} />,
  system: <Info size={20} />,
};

const Notifications = () => {
  usePageMeta(
    'Notifications | Luxtrax',
    'Retrouve les nouvelles importantes sur tes reservations et ton compte Luxtrax.',
  );

  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/auth');
      return;
    }

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

  const filtered = activeTab === 'all' ? notifications : notifications.filter(n => n.type === activeTab);

  const markAllRead = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success('Toutes les notifications sont marquees comme lues.');
    }
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <header className={styles.headerCard}>
          <div className={styles.titleRow}>
            <h1 className={styles.pageTitle}>Notifications</h1>
            <span className={styles.badge}>
              <Sparkles size={14} />
              Infos importantes
            </span>
          </div>
          <p className={styles.subtitle}>Ici, tu retrouves les messages utiles sans fouiller partout.</p>
          <button className={styles.markAllRead} onClick={markAllRead}>
            <CheckCheck size={16} />
            Tout passer en lu
          </button>
        </header>

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
              <div key={i} className={styles.skeletonRow}>
                <Skeleton width="46px" height="46px" borderRadius="14px" />
                <div className={styles.skeletonText}>
                  <Skeleton width="60%" height="1rem" />
                  <Skeleton width="90%" height="0.75rem" />
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Bell size={48} />}
              title="Aucune notification"
              description="Quand il y a du nouveau, tu le vois ici tout de suite."
            />
          ) : (
            filtered.map(n => (
              <article key={n.id} className={styles.notifCard}>
                <div className={styles.notifIcon}>{ICON_MAP[n.type] || <Bell size={20} />}</div>
                <div className={styles.notifContent}>
                  <div className={styles.notifTitleRow}>
                    <span className={styles.notifTitle}>{n.title}</span>
                    {!n.is_read && <span className={styles.newDot}>Nouveau</span>}
                  </div>
                  <p className={styles.notifBody}>{n.message}</p>
                  <span className={styles.notifTime}>{formatRelativeTime(n.created_at)}</span>
                </div>
                <ChevronRight size={18} color="var(--muted-foreground)" />
              </article>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Notifications;
