
import { Layers } from "lucide-react";

export function AuthHeader() {
  return (
    <div className="mb-6 flex flex-col items-center">
      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/20 animate-bounce-in">
        <Layers className="text-white w-8 h-8" />
      </div>
    </div>
  );
}
