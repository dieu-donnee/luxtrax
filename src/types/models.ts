export interface ServiceData {
  id: string;
  name: string;
  price: number;
  description: string | null;
  details: string | null;
  type: string;
  is_vip: boolean | null;
  discount_percentage: number | null;
}

export interface BookingData {
  id: string;
  user_id: string;
  service_id: string;
  status: 'pending' | 'ongoing' | 'completed' | 'cancelled';
  scheduled_date: string;
  address: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  services?: Pick<ServiceData, 'name' | 'price'> | null;
}

export interface ProfileData {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  address: string | null;
  default_address: string | null;
  role: string;
  vehicle_type: string | null;
  email_verified: boolean | null;
}

export interface NotificationData {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: 'En attente', color: 'warning' },
  ongoing: { label: 'En cours', color: 'info' },
  completed: { label: 'Terminé', color: 'success' },
  cancelled: { label: 'Annulé', color: 'danger' },
};

export const formatDateShort = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

export const formatDateFull = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

export const formatRelativeTime = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days}j`;
};
