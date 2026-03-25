import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Plus, Pencil, Trash2, X, Check, Package, Info } from 'lucide-react';
import type { ServiceData } from '@/types/models';
import styles from './AdminServices.module.css';

const AdminServices = () => {
  const { user, loading: authLoading } = useAuth();
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // State pour nouveau service / édition
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    type: 'carwash' as 'carwash' | 'laundry',
    is_vip: false
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;

    const checkAdmin = async () => {
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (data?.role === 'admin') {
        setIsAdmin(true);
        fetchServices();
      } else {
        toast.error("Accès refusé. Vous n'êtes pas administrateur.");
      }
    };
    checkAdmin();
  }, [user, authLoading]);

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: false });
    if (error) toast.error('Erreur lors du chargement des services');
    else setServices(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.price <= 0) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }

    if (editingId) {
      const { error } = await supabase.from('services').update(formData).eq('id', editingId);
      if (error) toast.error('Erreur lors de la modification');
      else {
        toast.success('Service modifié');
        setEditingId(null);
        fetchServices();
        resetForm();
      }
    } else {
      const { error } = await supabase.from('services').insert([formData]);
      if (error) toast.error("Erreur lors de l'ajout");
      else {
        toast.success('Service ajouté');
        fetchServices();
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer ce service ?')) return;
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) toast.error('Erreur lors de la suppression');
    else {
      toast.success('Service supprimé');
      fetchServices();
    }
  };

  const startEdit = (s: ServiceData) => {
    setEditingId(s.id);
    setFormData({
      name: s.name,
      description: s.description || '',
      price: s.price,
      type: s.type as any,
      is_vip: !!s.is_vip
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: 0, type: 'carwash', is_vip: false });
    setEditingId(null);
  };

  if (!isAdmin && !authLoading) return <MainLayout><div className={styles.centered}>Accès restreint</div></MainLayout>;

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Gestion des Services</h1>
          <p className={styles.subtitle}>Ajoutez, modifiez ou supprimez les offres de la plateforme.</p>
        </div>

        {/* Formulaire CRUD */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            {editingId ? <Pencil size={20} /> : <Plus size={20} />}
            {editingId ? 'Modifier le service' : 'Ajouter un nouveau service'}
          </h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label>Nom du service *</label>
                <Input 
                  placeholder="Ex: Lavage Express" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Prix (FCFA) *</label>
                <Input 
                  type="number" 
                  placeholder="0" 
                  value={formData.price} 
                  onChange={e => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Type</label>
                <select 
                  className={styles.select}
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as any})}
                >
                  <option value="carwash">Lavage Auto</option>
                  <option value="laundry">Blanchisserie</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>VIP / Premium</label>
                <div className={styles.checkboxWrapper}>
                  <input 
                    type="checkbox" 
                    id="is_vip"
                    checked={formData.is_vip}
                    onChange={e => setFormData({...formData, is_vip: e.target.checked})}
                  />
                  <label htmlFor="is_vip">Activer le badge VIP</label>
                </div>
              </div>
            </div>
            <div className={styles.inputGroup} style={{ marginTop: '1rem' }}>
              <label>Description</label>
              <textarea 
                className={styles.textarea}
                placeholder="Décrivez les prestations incluses..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div className={styles.formActions}>
              <Button type="submit" variant="primary">
                {editingId ? 'Mettre à jour' : 'Créer le service'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>Annuler</Button>
              )}
            </div>
          </form>
        </div>

        {/* Liste des services */}
        <div className={styles.listSection}>
          <h2 className={styles.cardTitle}><Package size={20} /> Catalogue Actuel</h2>
          {loading ? (
            <div className={styles.loading}>Chargement du catalogue...</div>
          ) : (
            <div className={styles.grid}>
              {services.map(s => (
                <div key={s.id} className={styles.serviceItem}>
                  <div className={styles.serviceMain}>
                    <div className={styles.serviceMeta}>
                      <span className={styles.serviceName}>{s.name}</span>
                      {s.is_vip && <span className={styles.vipBadge}>VIP</span>}
                    </div>
                    <span className={styles.servicePrice}>{Math.round(s.price)} FCFA</span>
                    <p className={styles.serviceDesc}>{s.description}</p>
                    <span className={styles.serviceType}>{s.type === 'carwash' ? '🚗 Auto' : '🧺 Linge'}</span>
                  </div>
                  <div className={styles.itemActions}>
                    <button onClick={() => startEdit(s)} className={styles.btnEdit} title="Modifier"><Pencil size={18} /></button>
                    <button onClick={() => handleDelete(s.id)} className={styles.btnDelete} title="Supprimer"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminServices;
