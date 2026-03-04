
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MapPin, PenLine, Car, CircleDollarSign } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { ServicePlan } from "../types";

interface BookingSummaryProps {
  date: Date | undefined;
  time: string;
  address: string;
  notes: string;
  selectedService: ServicePlan | undefined;
}

const BookingSummary = ({ date, time, address, notes, selectedService }: BookingSummaryProps) => {
  const { profile } = useAuth();

  if (!date) {
    return (
      <div className="text-center py-10 space-y-4">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
          <PenLine className="text-gray-200 h-8 w-8" />
        </div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose">
          Incomplete Booking Info
        </p>
      </div>
    );
  }

  const items = [
    { icon: <Calendar size={14} />, label: "Service Date", value: format(date, "EEEE, MMMM d, yyyy") },
    { icon: <Clock size={14} />, label: "Arrival Time", value: time },
    { icon: <MapPin size={14} />, label: "Location", value: address },
    { icon: <Car size={14} />, label: "Vehicle Type", value: profile?.vehicle_type || "Standard" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">
          Review Details
        </label>

        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-5 bg-gray-50/50 rounded-2xl border border-gray-100/50 group hover:bg-white hover:shadow-lg hover:shadow-gray-200/20 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-500">
                {item.icon}
              </div>
              <div>
                <p className="text-[9px] uppercase font-black text-gray-400 tracking-[0.15em] mb-1">{item.label}</p>
                <p className="text-xs font-black text-[#1A1A1A] tracking-tight">{item.value}</p>
              </div>
            </div>
          ))}

          {notes && (
            <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100/50">
              <p className="text-[9px] uppercase font-black text-gray-400 tracking-[0.15em] mb-2">Instructions</p>
              <p className="text-xs font-bold text-gray-600 leading-relaxed">"{notes}"</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-7 bg-primary rounded-[2.5rem] shadow-2xl shadow-primary/20 text-white flex items-center justify-between group hover:scale-[1.02] transition-transform duration-500">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20">
            <CircleDollarSign size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Total Amount</p>
            <p className="text-2xl font-black tracking-tighter">
              {selectedService ? selectedService.price.toLocaleString('fr-FR') : "0"} FCFA
            </p>
          </div>
        </div>
        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

import { ArrowRight } from "lucide-react";

export default BookingSummary;
