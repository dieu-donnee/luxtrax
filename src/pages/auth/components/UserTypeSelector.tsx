
import { Button } from "@/components/ui/button";

interface UserTypeSelectorProps {
  isProvider: boolean;
  setIsProvider: (value: boolean) => void;
}

export function UserTypeSelector({ isProvider, setIsProvider }: UserTypeSelectorProps) {
  return (
    <div className="flex items-center space-x-4">
      <Button
        type="button"
        variant={!isProvider ? "default" : "outline"}
        onClick={() => setIsProvider(false)}
        className="flex-1 min-w-[120px]"
      >
        Client
      </Button>
      <Button
        type="button"
        variant={isProvider ? "default" : "outline"}
        onClick={() => setIsProvider(true)}
        className="flex-1 min-w-[120px]"
      >
        Prestataire
      </Button>
    </div>
  );
}
