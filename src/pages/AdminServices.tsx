import React, { useEffect, useState } from 'react';
import { CheckCircle2, Package, Pencil, Plus, ShieldCheck, Sparkles, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePageMeta } from '@/hooks/usePageMeta';
import type { ServiceData } from '@/types/models';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import styles from './AdminServices.module.css';

type ServiceType = 'carwash' | 'laundry';

const AdminServices = () => {
  usePageMeta(
    'Administration services | Luxtrax',
    'Administrez le catalogue des services Luxtrax: creation, edition et suppression des offres.',
  );

  const { user, loading: authLoading } = useAuth();
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    type: 'carwash' as ServiceType,
    is_vip: false,
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
        toast.error("Acces refuse. Tu n'as pas les droits admin.");
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
      toast.error('Remplis les champs obligatoires.');
      return;
    }

    if (editingId) {
      const { error } = await supabase.from('services').update(formData).eq('id', editingId);
      if (error) toast.error('Erreur lors de la modification');
      else {
        toast.success('Service modifie');
        setEditingId(null);
        fetchServices();
        resetForm();
      }
    } else {
      const { error } = await supabase.from('services').insert([formData]);
      if (error) toast.error("Erreur lors de l'ajout");
      else {
        toast.success('Service ajoute');
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
      toast.success('Service supprime');
      fetchServices();
    }
  };

  const startEdit = (service: ServiceData) => {
    setEditingId(service.id);
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price,
      type: service.type as ServiceType,
      is_vip: !!service.is_vip,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: 0, type: 'carwash', is_vip: false });
    setEditingId(null);
  };

  if (!isAdmin && !authLoading) {
    return (
      <MainLayout>
        <div className={styles.centered}>Acces restreint</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={styles.container}>
        <header className={styles.headerCard}>
          <div className={styles.headerTop}>
            <span className={styles.badge}>
              <Sparkles size={14} />
              Administration
            </span>
            <span className={styles.badgeSecondary}>
              <ShieldCheck size={14} />
              Espace protege
            </span>
          </div>
          <h1 className={styles.title}>Gestion du catalogue de services</h1>
          <p className={styles.subtitle}>Ajoutez, modifiez et structurez les offres visibles dans le parcours de reservation client.</p>
        </header>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>
            {editingId ? <Pencil size={20} /> : <Plus size={20} />}
            {editingId ? 'Modifier le service' : 'Ajouter un nouveau service'}
          </h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="service-name">Nom du service *</label>
                <Input
                  id="service-name"
                  placeholder="Ex: Lavage Express"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="service-price">Prix (FCFA) *</label>
                <Input
                  id="service-price"
                  type="number"
                  placeholder="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value, 10) || 0 })}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="service-type">Type</label>
                <select
                  id="service-type"
                  className={styles.select}
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as ServiceType })}
                >
                  <option value="carwash">Lavage auto</option>
                  <option value="laundry">Blanchisserie</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="service-vip">VIP / Premium</label>
                <div className={styles.checkboxWrapper}>
                  <input
                    type="checkbox"
                    id="service-vip"
                    checked={formData.is_vip}
                    onChange={(e) => setFormData({ ...formData, is_vip: e.target.checked })}
                  />
                  <label htmlFor="service-vip">Activer le badge VIP</label>
                </div>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="service-description">Description</label>
              <textarea
                id="service-description"
                className={styles.textarea}
                placeholder="Decrivez les prestations incluses..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className={styles.formActions}>
              <Button type="submit" variant="primary">
                {editingId ? 'Mettre a jour' : 'Creer le service'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
              )}
            </div>
          </form>
        </section>

        <section className={styles.listSection}>
          <h2 className={styles.cardTitle}>
            <Package size={20} />
            Catalogue actuel
          </h2>
          {loading ? (
            <div className={styles.loading}>Chargement du catalogue...</div>
          ) : (
            <div className={styles.grid}>
              {services.map((service) => (
                <article key={service.id} className={styles.serviceItem}>
                  <div className={styles.serviceMain}>
                    <div className={styles.serviceMeta}>
                      <span className={styles.serviceName}>{service.name}</span>
                      {service.is_vip && <span className={styles.vipBadge}>VIP</span>}
                    </div>
                    <span className={styles.servicePrice}>{Math.round(service.price)} FCFA</span>
                    <p className={styles.serviceDesc}>{service.description || 'Aucune description fournie.'}</p>
                    <span className={styles.serviceType}>
                      <CheckCircle2 size={14} />
                      {service.type === 'carwash' ? 'Service lavage auto' : 'Service blanchisserie'}
                    </span>
                  </div>

                  <div className={styles.itemActions}>
                    <button onClick={() => startEdit(service)} className={styles.btnEdit} title="Modifier">
                      <Pencil size={17} />
                    </button>
                    <button onClick={() => handleDelete(service.id)} className={styles.btnDelete} title="Supprimer">
                      <Trash2 size={17} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
};

export default AdminServices;
