
import { useEffect, useRef } from "react";
import { MapPin, Navigation } from "lucide-react";
import useGoogleMapsLoader from "./hooks/useGoogleMapsLoader";
import useMapInstance from "./hooks/useMapInstance";
import ApiKeyForm from "./components/ApiKeyForm";

interface MapProps {
  address?: string;
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
}

const Map = ({ address, onLocationSelect }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { mapApiKey, isLoaded, setManualApiKey } = useGoogleMapsLoader();
  const { map, marker } = useMapInstance({
    mapRef,
    isLoaded,
    address,
    onLocationSelect
  });

  // Pour géolocaliser l'utilisateur
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation && map && marker) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          map.setCenter(pos);
          marker.setPosition(pos);
          
          // Convertir les coordonnées en adresse
          if (onLocationSelect) {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: pos }, (results, status) => {
              if (status === "OK" && results && results[0]) {
                onLocationSelect({
                  lat: pos.lat,
                  lng: pos.lng,
                  address: results[0].formatted_address,
                });
              }
            });
          }
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
        }
      );
    }
  };

  // Si nous n'avons pas encore d'API key, afficher un formulaire pour l'entrer
  if (!mapApiKey) {
    return <ApiKeyForm setMapApiKey={setManualApiKey} />;
  }

  // Si la carte est en cours de chargement
  if (!isLoaded) {
    return (
      <div className="w-full h-56 bg-gray-50 flex items-center justify-center border rounded-md">
        <p className="text-sm text-gray-500">Chargement de la carte...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-56 rounded-md overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
      <div className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md flex items-center">
        <button
          type="button"
          className="p-1 text-blue-600 hover:text-blue-800 flex items-center gap-1"
          onClick={handleGetCurrentLocation}
          title="Utiliser ma position actuelle"
        >
          <Navigation className="h-5 w-5" />
          <span className="text-xs font-medium hidden sm:inline">Ma position</span>
        </button>
      </div>
    </div>
  );
};

export default Map;
