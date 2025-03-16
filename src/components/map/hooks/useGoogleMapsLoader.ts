
import { useState, useEffect } from "react";

const useGoogleMapsLoader = () => {
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

  const setManualApiKeyHandler = (key: string) => {
    setManualApiKey(key);
    setMapApiKey(key);
  };

  return {
    isLoaded,
    mapApiKey,
    setManualApiKey: setManualApiKeyHandler
  };
};

export default useGoogleMapsLoader;
