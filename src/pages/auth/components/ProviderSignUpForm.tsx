
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProviderSignUpFormProps {
  fullName: string;
  setFullName: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  experienceLevel: string;
  setExperienceLevel: (value: string) => void;
  documents: File[];
  setDocuments: (value: File[]) => void;
}

export function ProviderSignUpForm({
  fullName,
  setFullName,
  address,
  setAddress,
  experienceLevel,
  setExperienceLevel,
  documents,
  setDocuments,
}: ProviderSignUpFormProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };

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
        <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700">
          Niveau d'expérience
        </label>
        <Select value={experienceLevel} onValueChange={setExperienceLevel} required>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Sélectionnez votre niveau d'expérience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="debutant">Débutant</SelectItem>
            <SelectItem value="intermediaire">Intermédiaire</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="documents" className="block text-sm font-medium text-gray-700">
          Documents de vérification
        </label>
        <Input
          id="documents"
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="mt-1"
        />
        <p className="mt-1 text-sm text-gray-500">
          Ajoutez votre permis de conduire, pièce d'identité, assurance, etc.
        </p>
      </div>
    </>
  );
}
