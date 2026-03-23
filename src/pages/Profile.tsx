import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { User, Mail, Phone, MapPin, Lock, LogOut, Trash2, Pencil, ChevronRight } from 'lucide-react';
import styles from './Profile.module.css';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', phone_number: '', address: '' });
  const [bookings, setBookings] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/auth'); return; }
      setUser(session.user);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (profileData) {
        setProfile(profileData);
        setFormData({
          full_name: profileData.full_name || '',
          phone_number: profileData.phone_number || '',
          address: profileData.address || '',
        });
      }

      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*, services(name, price)')
        .eq('user_id', session.user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(5);
      if (bookingsData) setBookings(bookingsData);
    };
    init();
  }, [navigate]);

  const handleSave = async () => {
    if (!user) return;

    const MAX_NAME_LEN = 100;
    const MAX_PHONE_LEN = 20;
    const MAX_ADDR_LEN = 255;
    const PHONE_REGEX = /^[+\d\s\-()]{7,20}$/;

    const name = formData.full_name.trim();
    const phone = formData.phone_number.trim();
    const address = formData.address.trim();

    if (name.length > MAX_NAME_LEN) { toast.error('Le nom ne doit pas dépasser 100 caractères'); return; }
    if (phone && !PHONE_REGEX.test(phone)) { toast.error('Numéro de téléphone invalide'); return; }
    if (address.length > MAX_ADDR_LEN) { toast.error("L'adresse ne doit pas dépasser 255 caractères"); return; }

    const sanitized = { full_name: name, phone_number: phone, address };

    const { error } = await supabase
      .from('profiles')
      .update(sanitized)
      .eq('id', user.id);
    if (error) { console.error('[Profile]', error.code, error.message); toast.error("Impossible de mettre à jour le profil."); return; }
    setProfile({ ...profile, ...sanitized });
    setIsEditing(false);
    toast.success('Profil mis à jour');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

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
            Modifier mes infos
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
            />
            <Input
              icon={<Phone size={18} />}
              placeholder="Téléphone"
              value={formData.phone_number}
              onChange={(e) => setFormData(p => ({ ...p, phone_number: e.target.value }))}
            />
            <Input
              icon={<MapPin size={18} />}
              placeholder="Adresse"
              value={formData.address}
              onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))}
            />
            <Button onClick={handleSave}>Enregistrer</Button>
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
        {bookings.length > 0 && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Historique des lavages</h3>
            {bookings.map((b) => (
              <div key={b.id} className={styles.historyRow}>
                <div>
                  <span className={styles.historyService}>{b.services?.name}</span>
                  <span className={styles.historyDate}>{formatDate(b.scheduled_date)}</span>
                </div>
                <span className={styles.historyPrice}>{b.services?.price} €</span>
              </div>
            ))}
          </div>
        )}

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
