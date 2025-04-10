
import { MapPin, Navigation } from "lucide-react";

interface MapProps {
  address?: string;
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
}

const Map = ({ onLocationSelect }: MapProps) => {
  // Pour géolocaliser l'utilisateur
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          // Convertir les coordonnées en adresse avec une simple API de géocodage inverse
          if (onLocationSelect) {
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.lat}&lon=${pos.lng}`)
              .then(response => response.json())
              .then(data => {
                onLocationSelect({
                  lat: pos.lat,
                  lng: pos.lng,
                  address: data.display_name || "Adresse actuelle",
                });
              })
              .catch(error => {
                console.error("Erreur de géocodage inverse:", error);
                // Fournir au moins les coordonnées
                onLocationSelect({
                  lat: pos.lat,
                  lng: pos.lng,
                  address: `Latitude: ${pos.lat}, Longitude: ${pos.lng}`,
                });
              });
          }
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
        }
      );
    }
  };

  return (
    <div className="relative w-full h-56 rounded-md overflow-hidden bg-blue-50/50 flex items-center justify-center">
      <div className="text-center p-4">
        <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-4">
          Utilisez votre position actuelle pour définir votre adresse
        </p>
        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 mx-auto hover:bg-blue-700 transition-colors"
          onClick={handleGetCurrentLocation}
        >
          <Navigation className="h-5 w-5" />
          <span className="font-medium">Ma position actuelle</span>
        </button>
      </div>
    </div>
  );
};

export default Map;
