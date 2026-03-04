
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
  const { toast } = useToast();
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
            .then(res => res.json())
            .then(data => {
              onAddressChange(data.display_name || `${lat}, ${lng}`);
              toast({ title: "Location found", description: "Address updated successfully." });
            })
            .finally(() => setIsGettingLocation(false));
        },
        () => {
          toast({ title: "Error", description: "Could not access location.", variant: "destructive" });
          setIsGettingLocation(false);
        }
      );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="space-y-6">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">
            Service Location
          </label>
          <div className="relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-primary transition-all duration-300" />
            <Input
              placeholder="Enter your address..."
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
              className="h-14 pl-12 pr-4 bg-white border-gray-100 rounded-2xl shadow-sm focus:ring-primary/10 transition-all font-bold text-sm"
            />
          </div>

          <button
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            className="w-full h-14 rounded-2xl border border-gray-100 bg-white text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            <Navigation size={14} className={cn("group-hover:rotate-12 transition-transform", isGettingLocation ? "animate-spin" : "")} />
            {isGettingLocation ? "Locating..." : "Use Current Location"}
          </button>

          <div className="rounded-[2.5rem] overflow-hidden border border-gray-50 shadow-2xl shadow-gray-200/50 h-56 relative bg-gray-50">
            <Map onLocationSelect={(loc) => onAddressChange(loc.address)} />
            <div className="absolute inset-0 pointer-events-none border-[12px] border-white rounded-[2.5rem]"></div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">
          Special Instructions (Optional)
        </label>
        <Textarea
          placeholder="Access code, car model, floor..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="min-h-[140px] rounded-[2rem] border-gray-100 bg-white p-6 focus:ring-primary/10 transition-all font-bold text-sm leading-relaxed"
        />
      </div>
    </div>
  );
};

import { cn } from "@/lib/utils";

export default AddressSelection;
