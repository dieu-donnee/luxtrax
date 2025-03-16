import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
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
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Adresse de service</h3>
        <p className="text-sm text-gray-600 mb-4">
          Veuillez indiquer l'adresse où vous souhaitez que le service soit effectué :
        </p>
        
        <div className="space-y-4">
          <div className="space-y-2 relative">
            <Label htmlFor="address">Adresse complète</Label>
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
            <p className="text-sm text-gray-700 mb-2">Sélectionnez sur la carte</p>
            <Map 
              address={address} 
              onLocationSelect={handleLocationSelect}
            />
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
