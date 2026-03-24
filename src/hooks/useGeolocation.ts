import { useState } from 'react';
import { toast } from 'sonner';

export const useGeolocation = (onSuccess: (address: string) => void) => {
  const [isLocating, setIsLocating] = useState(false);

  const locate = () => {
    if (!('geolocation' in navigator)) {
      toast.error("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse geocoding via OpenStreetMap (gratuit, pas de clé requise)
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          if (!res.ok) throw new Error('Erreur réseau Nominatim');
          
          const data = await res.json();
          const address = data.display_name || `${latitude}, ${longitude}`;
          onSuccess(address);
          toast.success("Position détectée avec succès !");
        } catch (error) {
          console.error("Erreur géocodage:", error);
          toast.error("Impossible de traduire la position en adresse.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Erreur géolocation:", error);
        toast.error("Permission de position refusée ou indisponible.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  return { locate, isLocating };
};
