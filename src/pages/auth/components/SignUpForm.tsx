
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SignUpFormProps {
  fullName: string;
  setFullName: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  gender: string;
  setGender: (value: string) => void;
  carModel: string;
  setCarModel: (value: string) => void;
}

export function SignUpForm({
  fullName,
  setFullName,
  country,
  setCountry,
  gender,
  setGender,
  carModel,
  setCarModel,
}: SignUpFormProps) {
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
        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
          Pays
        </label>
        <Input
          id="country"
          type="text"
          required
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
          Genre
        </label>
        <Select value={gender} onValueChange={setGender} required>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Sélectionnez votre genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Homme</SelectItem>
            <SelectItem value="female">Femme</SelectItem>
            <SelectItem value="other">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="carModel" className="block text-sm font-medium text-gray-700">
          Modèle de voiture
        </label>
        <Input
          id="carModel"
          type="text"
          required
          value={carModel}
          onChange={(e) => setCarModel(e.target.value)}
          className="mt-1"
        />
      </div>
    </>
  );
}
