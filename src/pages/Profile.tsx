import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useClerk } from '@clerk/react';
import { toast } from 'sonner';
import type { ProfileData, BookingData } from '@/types/models';
import { formatDateFull } from '@/types/models';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { ChevronRight, Lock, LogOut, MapPin, Pencil, Phone, Settings, ShieldCheck, Trash2, User } from 'lucide-react';
import styles from './Profile.module.css';

const MAX_NAME_LEN = 100;
const MAX_PHONE_LEN = 20;
const MAX_ADDR_LEN = 255;
const PHONE_REGEX = /^[+\d\s\-()]{7,20}$/;

const Profile = () => {
  usePageMeta(
    'Mon profil | Luxtrax',
    'Mets a jour tes infos et retrouve facilement ton historique de lavages sur Luxtrax.',
  );

  const { user, loading: authLoading } = useAuth();
  const { signOut } = useClerk();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', phone_number: '', address: '' });
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchData = async () => {
      const [profileRes, bookingsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('bookings').select('*, services(name, price)').eq('user_id', user.id).eq('status', 'completed').order('created_at', { ascending: false }).limit(5),
      ]);

      if (profileRes.data) {
        const p = profileRes.data as unknown as ProfileData;
        setProfile(p);
        setFormData({
          full_name: p.full_name || '',
          phone_number: p.phone_number || '',
          address: p.address || '',
        });
      }
      if (bookingsRes.data) setBookings(bookingsRes.data as unknown as BookingData[]);
      setDataLoading(false);
    };
    fetchData();
  }, [user, authLoading, navigate]);

  const handleSave = async () => {
    if (!user) return;

    const name = formData.full_name.trim();
    const phone = formData.phone_number.trim();
    const address = formData.address.trim();

    if (name.length > MAX_NAME_LEN) { toast.error('Ton nom est un peu trop long (max 100 caracteres).'); return; }
    if (phone && !PHONE_REGEX.test(phone)) { toast.error('Le numero ne semble pas valide.'); return; }
    if (address.length > MAX_ADDR_LEN) { toast.error("Ton adresse est trop longue (max 255 caracteres)."); return; }

    const sanitized = { full_name: name, phone_number: phone, address };

    const { error } = await supabase.from('profiles').update(sanitized).eq('id', user.id);
    if (error) {
      console.error('[Profile]', error.code, error.message);
      toast.error("On n'a pas pu enregistrer tes infos.");
      return;
    }
    setProfile(prev => prev ? { ...prev, ...sanitized } : null);
    setIsEditing(false);
    toast.success('Parfait, ton profil est a jour.');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || dataLoading) {
    return (
      <MainLayout>
        <div className={styles.container}>
          <div className={styles.heroCard}>
            <div className={styles.heroTop}>
              <Skeleton width="84px" height="84px" borderRadius="50%" />
              <div className={styles.heroTextSkeleton}>
                <Skeleton width="11rem" height="1.2rem" />
                <Skeleton width="15rem" height="0.95rem" />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) return null;

  return (
    <MainLayout>
      <div className={styles.container}>
        <section className={styles.heroCard}>
          <div className={styles.heroTop}>
            <div className={styles.avatar}>
              <User size={38} color="var(--muted-foreground)" />
            </div>
            <div>
              <h1 className={styles.name}>{profile?.full_name || 'Utilisateur'}</h1>
              <p className={styles.email}>{user.email}</p>
            </div>
          </div>

          <div className={styles.pills}>
            <span className={styles.pill}><ShieldCheck size={14} /> Ton compte</span>
            <span className={styles.pill}>Role: {profile?.role || 'client'}</span>
          </div>

          <Button
            variant={isEditing ? 'outline' : 'primary'}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className={styles.editBtn}
          >
            <Pencil size={14} />
            {isEditing ? 'Fermer' : 'Modifier mes infos'}
          </Button>
        </section>

        {isEditing && (
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Modifier mes coordonnees</h2>
            <div className={styles.formGrid}>
              <Input
                icon={<User size={18} />}
                placeholder="Nom complet"
                value={formData.full_name}
                onChange={(e) => setFormData(p => ({ ...p, full_name: e.target.value }))}
                maxLength={MAX_NAME_LEN}
              />
              <Input
                icon={<Phone size={18} />}
                placeholder="Telephone"
                value={formData.phone_number}
                onChange={(e) => setFormData(p => ({ ...p, phone_number: e.target.value }))}
                maxLength={MAX_PHONE_LEN}
              />
              <Input
                icon={<MapPin size={18} />}
                placeholder="Adresse"
                value={formData.address}
                onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))}
                maxLength={MAX_ADDR_LEN}
              />
            </div>
            <Button onClick={handleSave}>Enregistrer</Button>
          </section>
        )}

        {profile?.role === 'admin' && (
          <section className={styles.adminCard}>
            <div className={styles.adminInfo}>
              <Settings size={20} className={styles.adminIcon} />
              <div>
                <h3 className={styles.adminTitle}>Espace administration</h3>
                <p className={styles.adminDesc}>Gere les services et le catalogue en quelques clics.</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/services')} className={styles.adminBtn}>
              Gerer les services
            </Button>
          </section>
        )}

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Informations personnelles</h2>
          <div className={styles.infoList}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Telephone</span>
              <span className={styles.infoValue}>{profile?.phone_number || 'Non renseigne'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Adresse</span>
              <span className={styles.infoValue}>{profile?.address || 'Non renseignee'}</span>
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Historique des lavages</h2>
          {bookings.length > 0 ? (
            bookings.map((b) => (
              <div key={b.id} className={styles.historyRow}>
                <div>
                  <span className={styles.historyService}>{b.services?.name}</span>
                  <span className={styles.historyDate}>{formatDateFull(b.scheduled_date)}</span>
                </div>
                <span className={styles.historyPrice}>{Math.round(b.services?.price || 0)} FCFA</span>
              </div>
            ))
          ) : (
            <EmptyState title="Pas encore de lavage termine" description="Des que ce sera fait, tu retrouveras l&apos;historique ici." />
          )}
        </section>

        <section className={styles.actionsCard}>
          <button className={styles.actionRow} onClick={() => toast.info('Cette option arrive bientot.')}>
            <Lock size={18} />
            <span>Changer mon mot de passe</span>
            <ChevronRight size={18} />
          </button>
          <button className={styles.actionRow} onClick={handleLogout}>
            <LogOut size={18} />
            <span>Se deconnecter</span>
            <ChevronRight size={18} />
          </button>
          <button className={styles.actionRowDanger} onClick={() => toast.info('Ecris-nous via le support pour cette demande.')}>
            <Trash2 size={18} />
            <span>Supprimer mon compte</span>
            <ChevronRight size={18} />
          </button>
        </section>
      </div>
    </MainLayout>
  );
};

export default Profile;
