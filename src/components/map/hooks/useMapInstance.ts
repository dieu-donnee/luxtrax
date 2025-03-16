
import { useState, useEffect, RefObject } from "react";

interface UseMapInstanceProps {
  mapRef: RefObject<HTMLDivElement>;
  isLoaded: boolean;
  address?: string;
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
}

const useMapInstance = ({ mapRef, isLoaded, address, onLocationSelect }: UseMapInstanceProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

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
  }, [isLoaded, onLocationSelect, mapRef]);

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

  return { map, marker };
};

export default useMapInstance;
