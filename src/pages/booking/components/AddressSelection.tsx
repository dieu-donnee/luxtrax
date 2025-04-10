
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Map from "@/components/map";

interface AddressSelectionProps {
  address: string;
  notes: string;
  onAddressChange: (address: string) => void;
  onNotesChange: (notes: string) => void;
}

const AddressSelection = ({
  address,
  notes,
  onAddressChange,
  onNotesChange
}: AddressSelectionProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  const savedAddresses = [
    profile?.default_address,
    ...(profile?.additional_addresses || [])
  ].filter(Boolean) as string[];

  const handleSuggestionClick = (suggestion: string) => {
    onAddressChange(suggestion);
    setSuggestions([]);
  };

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    onAddressChange(location.address);
    toast({
      title: "Localisation activée",
      description: "Votre position actuelle a été définie comme lieu de rendez-vous.",
      variant: "default"
    });
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      toast({
        title: "Localisation",
        description: "Récupération de votre position actuelle..."
      });
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          // Utiliser l'API de géocodage inverse de Nominatim (OpenStreetMap)
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.lat}&lon=${pos.lng}`)
            .then(response => response.json())
            .then(data => {
              onAddressChange(data.display_name || "Adresse actuelle");
              toast({
                title: "Localisation activée",
                description: "Votre position actuelle a été définie comme lieu de rendez-vous.",
                variant: "default"
              });
            })
            .catch(error => {
              console.error("Erreur de géocodage inverse:", error);
              toast({
                title: "Erreur de géocodage",
                description: "Impossible de déterminer votre adresse actuelle avec précision.",
                variant: "destructive"
              });
              onAddressChange(`Latitude: ${pos.lat}, Longitude: ${pos.lng}`);
            })
            .finally(() => {
              setIsGettingLocation(false);
            });
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          let errorMessage = "Une erreur est survenue lors de la récupération de votre position.";
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Vous avez refusé l'accès à votre position. Veuillez autoriser l'accès dans les paramètres de votre navigateur.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Les informations de localisation sont indisponibles.";
              break;
            case error.TIMEOUT:
              errorMessage = "La demande pour obtenir votre position a expiré.";
              break;
          }
          
          toast({
            title: "Erreur de localisation",
            description: errorMessage,
            variant: "destructive"
          });
          setIsGettingLocation(false);
        }
      );
    } else {
      toast({
        title: "Localisation non supportée",
        description: "Votre navigateur ne supporte pas la géolocalisation.",
        variant: "destructive"
      });
      setIsGettingLocation(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Adresse de service</h3>
        <p className="text-sm text-gray-600 mb-4">
          Veuillez indiquer l'adresse où vous souhaitez que le service soit effectué :
        </p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="address">Adresse complète</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-blue-600"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
              >
                <Navigation className="h-4 w-4" />
                {isGettingLocation ? "Localisation en cours..." : "Utiliser ma position actuelle"}
              </Button>
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="address"
                placeholder="12 rue de la République, 75001 Paris"
                value={address}
                onChange={(e) => {
                  onAddressChange(e.target.value);
                  if (e.target.value && savedAddresses.length) {
                    setSuggestions(
                      savedAddresses.filter(saved => 
                        saved.toLowerCase().includes(e.target.value.toLowerCase())
                      )
                    );
                  } else {
                    setSuggestions([]);
                  }
                }}
                className="w-full pl-10"
                required
              />
            </div>
            
            {suggestions.length > 0 && (
              <div className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-1 border overflow-hidden max-h-48 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <div 
                    key={index} 
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          {savedAddresses.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Adresses enregistrées</p>
              <div className="flex flex-wrap gap-2">
                {savedAddresses.map((saved, index) => (
                  <button
                    key={index}
                    type="button"
                    className="inline-flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100"
                    onClick={() => onAddressChange(saved)}
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    {saved.length > 30 ? `${saved.substring(0, 30)}...` : saved}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <Map onLocationSelect={handleLocationSelect} />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Instructions spéciales (optionnel)</h3>
        <p className="text-sm text-gray-600 mb-4">
          Ajoutez des informations supplémentaires pour nous aider à vous servir au mieux :
        </p>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Ex: code d'accès, indications pour se garer, particularités du véhicule..."
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            className="w-full min-h-[100px]"
          />
        </div>
      </div>
    </div>
  );
};

export default AddressSelection;
