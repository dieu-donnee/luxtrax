
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addDays, format, isAfter, isBefore, set } from "date-fns";
import { fr } from "date-fns/locale";

interface DateTimeSelectionProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  onSelectDate: (date: Date | undefined) => void;
  onSelectTime: (time: string) => void;
}

const DateTimeSelection = ({
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime
}: DateTimeSelectionProps) => {
  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00",
    "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">
          Select Date
        </label>
        <div className="p-4 bg-gray-50/50 rounded-[2rem] border border-gray-100/50 shadow-inner">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelectDate}
            className="rounded-3xl border-none bg-transparent"
            disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">
          Select Time
        </label>
        <div className="grid grid-cols-3 gap-3">
          {timeSlots.map((time) => {
            const isSelected = selectedTime === time;
            return (
              <button
                key={time}
                onClick={() => onSelectTime(time)}
                className={cn(
                  "h-12 rounded-2xl font-bold text-sm transition-all border-2",
                  isSelected
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/30"
                    : "bg-white border-gray-100 text-gray-600 hover:border-primary/20"
                )}
              >
                {time}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import { cn } from "@/lib/utils";

export default DateTimeSelection;
