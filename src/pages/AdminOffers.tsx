import React, { useEffect, useState, useCallback } from 'react';
import { Layout, Pencil, Plus, Sparkles, Trash2, Megaphone, Image as ImageIcon, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePageMeta } from '@/hooks/usePageMeta';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import styles from './AdminServices.module.css'; // Reusing some base styles for consistency

interface Offer {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  button_text?: string;
  link_url?: string;
  is_active: boolean;
}

const AdminOffers = () => {
  usePageMeta(
    'Gestion des Offres | Luxtrax',
    'Administrez le carrousel publicitaire de Luxtrax.',
  );

  const { user, loading: authLoading } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    button_text: '',
    link_url: '',
    is_active: true,
  });

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await (supabase as any).from('offers').select('*').order('created_at', { ascending: false });
    if (error) toast.error('Erreur lors du chargement des offres');
    else setOffers(data as any as Offer[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authLoading || !user) return;

    const checkAdmin = async () => {
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (data?.role === 'admin') {
        setIsAdmin(true);
        fetchOffers();
      } else {
        toast.error("Accès refusé. Réservé aux administrateurs.");
      }
    };
    checkAdmin();
  }, [user, authLoading, fetchOffers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Le titre et la description sont obligatoires.');
      return;
    }

    const payload = {
      ...formData,
      image_url: formData.image_url || null,
      button_text: formData.button_text || null,
      link_url: formData.link_url || null,
    };

    if (editingId) {
      const { error } = await (supabase as any).from('offers').update(payload).eq('id', editingId);
      if (error) toast.error('Erreur lors de la modification');
      else {
        toast.success('Offre modifiee');
        setEditingId(null);
        fetchOffers();
        resetForm();
      }
    } else {
      const { error } = await (supabase as any).from('offers').insert([payload]);
      if (error) toast.error("Erreur lors de l'ajout");
      else {
        toast.success('Offre ajoutee');
        fetchOffers();
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer cette offre ?')) return;
    const { error } = await (supabase as any).from('offers').delete().eq('id', id);
    if (error) toast.error('Erreur lors de la suppression');
    else {
      toast.success('Offre supprimee');
      fetchOffers();
    }
  };

  const startEdit = (offer: Offer) => {
    setEditingId(offer.id);
    setFormData({
      title: offer.title,
      description: offer.description,
      image_url: offer.image_url || '',
      button_text: offer.button_text || '',
      link_url: offer.link_url || '',
      is_active: offer.is_active,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', image_url: '', button_text: '', link_url: '', is_active: true });
    setEditingId(null);
  };

  if (!isAdmin && !authLoading) return null;

  return (
    <MainLayout>
      <div className={styles.container}>
        <header className={styles.headerCard}>
          <div className={styles.headerTop}>
            <span className={styles.badge}>
              <Megaphone size={14} />
              Marketing
            </span>
          </div>
          <h1 className={styles.title}>Espace Publicitaire & Offres</h1>
          <p className={styles.subtitle}>Gérez les slides du carrousel pour promouvoir des services ou motiver vos clients.</p>
        </header>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>
            {editingId ? <Pencil size={20} /> : <Plus size={20} />}
            {editingId ? 'Modifier l\'offre' : 'Nouvelle publicité / offre'}
          </h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label>Titre de la slide *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Libère ton esprit"
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Texte du bouton (Optionnel)</label>
                <Input
                  value={formData.button_text}
                  onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                  placeholder="Ex: En profiter"
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Lien URL (Optionnel)</label>
                <Input
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className={styles.inputGroup}>
                <label>URL de l'image (Optionnel)</label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="URL d'image Unsplash ou autre"
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label>Statut</label>
                <div className={styles.checkboxWrapper}>
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  <label htmlFor="is_active">Afficher dans le carrousel</label>
                </div>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Description / Message motivateur *</label>
              <textarea
                className={styles.textarea}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Imagine la satisfaction..."
              />
            </div>

            <div className={styles.formActions}>
              <Button type="submit">{editingId ? 'Mettre à jour' : 'Publier'}</Button>
              {editingId && <Button type="button" variant="outline" onClick={resetForm}>Annuler</Button>}
            </div>
          </form>
        </section>

        <section className={styles.listSection}>
          <h2 className={styles.cardTitle}>Contenu actuel</h2>
          <div className={styles.grid}>
            {offers.map((offer) => (
              <article key={offer.id} className={styles.serviceItem} style={{ opacity: offer.is_active ? 1 : 0.6 }}>
                <div className={styles.serviceMain}>
                  <div className={styles.serviceMeta}>
                    <span className={styles.serviceName}>{offer.title}</span>
                    {!offer.is_active && <span className={styles.badgeSecondary}>Inactif</span>}
                  </div>
                  <p className={styles.serviceDesc}>{offer.description.substring(0, 100)}...</p>
                  <div className={styles.tagsRow}>
                    {offer.button_text && <span className={styles.tag}><LinkIcon size={12}/> {offer.button_text}</span>}
                    {offer.image_url && <span className={styles.tag}><ImageIcon size={12}/> Image présente</span>}
                  </div>
                </div>
                <div className={styles.itemActions}>
                  <button onClick={() => startEdit(offer)} className={styles.btnEdit}><Pencil size={17} /></button>
                  <button onClick={() => handleDelete(offer.id)} className={styles.btnDelete}><Trash2 size={17} /></button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default AdminOffers;
