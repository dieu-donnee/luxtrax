
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";

interface TermsCheckboxProps {
  termsAccepted: boolean;
  setTermsAccepted: (value: boolean) => void;
}

export function TermsCheckbox({ termsAccepted, setTermsAccepted }: TermsCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="terms"
        checked={termsAccepted}
        onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
      />
      <label
        htmlFor="terms"
        className="text-sm text-gray-600"
      >
        J'accepte les{" "}
        <Link to="/terms" className="text-blue-600 hover:underline">
          conditions d'utilisation
        </Link>
        {" "}et la{" "}
        <Link to="/privacy" className="text-blue-600 hover:underline">
          politique de confidentialité
        </Link>
      </label>
    </div>
  );
}
