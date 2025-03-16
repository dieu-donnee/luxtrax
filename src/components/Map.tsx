
import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

interface MapProps {
  address?: string;
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
}

const Map = ({ address, onLocationSelect }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapApiKey, setMapApiKey] = useState<string>("");
  const [manualApiKey, setManualApiKey] = useState<string>("");

  // Pour gérer l'API key en développement
  useEffect(() => {
    // Essayer de charger depuis localStorage (si l'utilisateur l'a déjà entrée)
    const savedApiKey = localStorage.getItem("GOOGLE_MAPS_API_KEY");
    if (savedApiKey) {
      setMapApiKey(savedApiKey);
    }
  }, []);

  // Charger le script Google Maps après avoir l'API key
  useEffect(() => {
    if (!mapApiKey) return;
    
    const loadGoogleMapsScript = () => {
      if (window.google?.maps) {
        setIsLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${mapApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.id = "google-maps-script";
      
      script.onload = () => {
        setIsLoaded(true);
      };
      
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
    
    return () => {
      // Nettoyer le script lors du démontage du composant
      const script = document.getElementById("google-maps-script");
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, [mapApiKey]);

  // Initialiser la carte une fois le script chargé
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const defaultLocation = { lat: 48.856614, lng: 2.3522219 }; // Paris par défaut
    
    const mapInstance = new google.maps.Map(mapRef.current, {
      center: defaultLocation,
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });
    
    setMap(mapInstance);
    
    const markerInstance = new google.maps.Marker({
      position: defaultLocation,
      map: mapInstance,
      draggable: true,
      animation: google.maps.Animation.DROP,
    });
    
    setMarker(markerInstance);
    
    // Ajouter le gestionnaire d'événements pour le marqueur
    markerInstance.addListener("dragend", () => {
      const position = markerInstance.getPosition();
      if (position && onLocationSelect) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: position }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            onLocationSelect({
              lat: position.lat(),
              lng: position.lng(),
              address: results[0].formatted_address,
            });
          }
        });
      }
    });
    
    // Gérer les clics sur la carte
    mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
      if (e.latLng && markerInstance) {
        markerInstance.setPosition(e.latLng);
        
        if (onLocationSelect) {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: e.latLng.toJSON() }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              onLocationSelect({
                lat: e.latLng!.lat(),
                lng: e.latLng!.lng(),
                address: results[0].formatted_address,
              });
            }
          });
        }
      }
    });
    
    return () => {
      // Nettoyer la carte et le marqueur lors du démontage du composant
      if (markerInstance) {
        google.maps.event.clearInstanceListeners(markerInstance);
      }
      if (mapInstance) {
        google.maps.event.clearInstanceListeners(mapInstance);
      }
    };
  }, [isLoaded, onLocationSelect]);

  // Effet pour géocoder l'adresse et centrer la carte
  useEffect(() => {
    if (!isLoaded || !map || !marker || !address) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        map.setCenter(location);
        marker.setPosition(location);
      }
    });
  }, [isLoaded, map, marker, address]);

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
    return (
      <div className="w-full h-56 bg-gray-50 flex flex-col items-center justify-center p-4 border rounded-md">
        <p className="mb-2 text-sm text-gray-700">Veuillez entrer votre clé API Google Maps pour activer la carte</p>
        <div className="flex w-full max-w-md">
          <input
            type="text"
            value={manualApiKey}
            onChange={(e) => setManualApiKey(e.target.value)}
            placeholder="Entrez votre clé API Google Maps"
            className="flex-1 px-3 py-2 border rounded-l-md text-sm"
          />
          <button
            className="bg-blue-600 text-white px-3 py-2 rounded-r-md text-sm"
            onClick={() => {
              if (manualApiKey) {
                localStorage.setItem("GOOGLE_MAPS_API_KEY", manualApiKey);
                setMapApiKey(manualApiKey);
              }
            }}
          >
            Valider
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Vous pouvez obtenir une clé API sur la{" "}
          <a
            href="https://console.cloud.google.com/google/maps-apis/credentials"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            console Google Cloud
          </a>
        </p>
      </div>
    );
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
      <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md">
        <button
          type="button"
          className="p-1 text-blue-600 hover:text-blue-800"
          onClick={handleGetCurrentLocation}
        >
          <MapPin className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Map;
