import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useClerk } from '@clerk/react';
import { toast } from 'sonner';
import type { ProfileData, BookingData } from '@/types/models';
import { formatDateFull } from '@/types/models';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { User, Phone, MapPin, Lock, LogOut, Trash2, Pencil, ChevronRight, Settings } from 'lucide-react';
import styles from './Profile.module.css';

const MAX_NAME_LEN = 100;
const MAX_PHONE_LEN = 20;
const MAX_ADDR_LEN = 255;
const PHONE_REGEX = /^[+\d\s\-()]{7,20}$/;

const Profile = () => {
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
    if (!user) { navigate('/auth'); return; }

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

    if (name.length > MAX_NAME_LEN) { toast.error('Le nom ne doit pas dépasser 100 caractères'); return; }
    if (phone && !PHONE_REGEX.test(phone)) { toast.error('Numéro de téléphone invalide'); return; }
    if (address.length > MAX_ADDR_LEN) { toast.error("L'adresse ne doit pas dépasser 255 caractères"); return; }

    const sanitized = { full_name: name, phone_number: phone, address };

    const { error } = await supabase.from('profiles').update(sanitized).eq('id', user.id);
    if (error) {
      console.error('[Profile]', error.code, error.message);
      toast.error('Impossible de mettre à jour le profil.');
      return;
    }
    setProfile(prev => prev ? { ...prev, ...sanitized } : null);
    setIsEditing(false);
    toast.success('Profil mis à jour');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || dataLoading) {
    return (
      <MainLayout>
        <div className={styles.container}>
          <div className={styles.header}>
            <Skeleton width="80px" height="80px" borderRadius="50%" />
            <Skeleton width="10rem" height="1.25rem" />
            <Skeleton width="14rem" height="0.875rem" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) return null;

  return (
    <MainLayout>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.avatar}>
            <User size={40} color="var(--muted-foreground)" />
          </div>
          <h2 className={styles.name}>{profile?.full_name || 'Utilisateur'}</h2>
          <span className={styles.email}>{user.email}</span>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className={styles.editBtn}
          >
            <Pencil size={14} />
            {isEditing ? 'Annuler' : 'Modifier mes infos'}
          </Button>
        </div>

        {/* Edit form */}
        {isEditing && (
          <div className={styles.card}>
            <Input
              icon={<User size={18} />}
              placeholder="Nom complet"
              value={formData.full_name}
              onChange={(e) => setFormData(p => ({ ...p, full_name: e.target.value }))}
              maxLength={MAX_NAME_LEN}
            />
            <Input
              icon={<Phone size={18} />}
              placeholder="Téléphone"
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
            <Button onClick={handleSave}>Enregistrer</Button>
          </div>
        )}

        {/* Admin Section */}
        {profile?.role === 'admin' && (
          <div className={styles.adminCard}>
            <div className={styles.adminInfo}>
              <Settings size={20} className={styles.adminIcon} />
              <div>
                <h3 className={styles.adminTitle}>Administration</h3>
                <p className={styles.adminDesc}>Gérez le catalogue des services et les réservations.</p>
              </div>
            </div>
            <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/admin/services')}
                className={styles.adminBtn}
            >
              Gérer les Services
            </Button>
          </div>
        )}

        {/* Personal Info */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Informations personnelles</h3>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Téléphone</span>
            <span className={styles.infoValue}>{profile?.phone_number || 'Non renseigné'}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Adresse</span>
            <span className={styles.infoValue}>{profile?.address || 'Non renseignée'}</span>
          </div>
        </div>

        {/* Booking History */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Historique des lavages</h3>
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
            <EmptyState title="Aucun lavage terminé" description="Vos lavages complétés apparaîtront ici" />
          )}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.actionRow} onClick={() => toast.info('Fonctionnalité à venir')}>
            <Lock size={18} />
            <span>Changer mon mot de passe</span>
            <ChevronRight size={18} />
          </button>
          <button className={styles.actionRow} onClick={handleLogout}>
            <LogOut size={18} />
            <span>Se déconnecter</span>
            <ChevronRight size={18} />
          </button>
          <button className={styles.actionRowDanger} onClick={() => toast.info('Contactez le support')}>
            <Trash2 size={18} />
            <span>Supprimer mon compte</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
