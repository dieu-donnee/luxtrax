
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClientSignUpFormProps {
  fullName: string;
  setFullName: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  vehicleType: string;
  setVehicleType: (value: string) => void;
}

export function ClientSignUpForm({
  fullName,
  setFullName,
  address,
  setAddress,
  vehicleType,
  setVehicleType,
}: ClientSignUpFormProps) {
  return (
    <>
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Nom complet
        </label>
        <Input
          id="fullName"
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Adresse
        </label>
        <Input
          id="address"
          type="text"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">
          Type de véhicule
        </label>
        <Select value={vehicleType} onValueChange={setVehicleType} required>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Sélectionnez votre type de véhicule" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="berline">Berline</SelectItem>
            <SelectItem value="suv">SUV</SelectItem>
            <SelectItem value="citadine">Citadine</SelectItem>
            <SelectItem value="utilitaire">Utilitaire</SelectItem>
            <SelectItem value="autre">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
