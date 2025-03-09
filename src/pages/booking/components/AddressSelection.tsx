
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Adresse de service</h3>
        <p className="text-sm text-gray-600 mb-4">
          Veuillez indiquer l'adresse où vous souhaitez que le service soit effectué :
        </p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Adresse complète</Label>
            <Input
              id="address"
              placeholder="12 rue de la République, 75001 Paris"
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
              className="w-full"
              required
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
