
import { useState } from "react";
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
  const today = new Date();
  const maxDate = addDays(today, 30);
  
  // Générer les tranches horaires disponibles
  const generateTimeSlots = (date: Date | undefined) => {
    if (!date) return [];
    
    const timeSlots = [];
    const isToday = date.toDateString() === today.toDateString();
    const currentHour = today.getHours();
    const startHour = isToday ? Math.max(9, currentHour + 1) : 9; // Commence à 9h ou l'heure actuelle + 1 si c'est aujourd'hui
    
    for (let hour = startHour; hour <= 19; hour++) {
      for (let minute of [0, 30]) {
        // N'ajoute pas les créneaux déjà passés pour aujourd'hui
        if (isToday && hour === currentHour && minute <= today.getMinutes()) continue;
        
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        timeSlots.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    
    return timeSlots;
  };

  const timeSlots = generateTimeSlots(selectedDate);

  // Si la date sélectionnée change, réinitialiser l'heure si elle n'est plus valide
  useState(() => {
    if (selectedDate && timeSlots.length > 0 && !timeSlots.includes(selectedTime)) {
      onSelectTime(timeSlots[0]);
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Date</h3>
        <p className="text-sm text-gray-600 mb-4">
          Sélectionnez la date souhaitée pour votre service :
        </p>
        <div className="border rounded-md p-4 max-w-sm mx-auto">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelectDate}
            disabled={(date) => 
              isBefore(date, today) || 
              isAfter(date, maxDate) || 
              date.getDay() === 0 // Désactive les dimanches
            }
            locale={fr}
            className="mx-auto"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Heure</h3>
        <p className="text-sm text-gray-600 mb-4">
          Choisissez l'horaire qui vous convient le mieux :
        </p>
        
        {selectedDate ? (
          timeSlots.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Select value={selectedTime} onValueChange={onSelectTime}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une heure" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <p className="text-amber-600">
              Aucun créneau disponible pour cette date. Veuillez sélectionner une autre date.
            </p>
          )
        ) : (
          <p className="text-amber-600">
            Veuillez d'abord sélectionner une date.
          </p>
        )}
      </div>
    </div>
  );
};

export default DateTimeSelection;
