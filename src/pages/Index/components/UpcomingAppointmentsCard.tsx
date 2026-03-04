
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Car } from "lucide-react";

interface Appointment {
  id: number;
  service: string;
  date: string;
  icon: string;
  color: string;
}

interface UpcomingAppointmentsCardProps {
  appointments: Appointment[];
  isLoading: boolean;
}

const UpcomingAppointmentsCard: React.FC<UpcomingAppointmentsCardProps> = ({ appointments, isLoading }) => {
  return (
    <Card className="bg-white border-none rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60_rgba(0,0,0,0.06)]">
      <CardHeader className="p-7 pb-4">
        <CardTitle className="text-xl font-extrabold text-gray-900 flex items-center gap-3">
          <div className="p-2.5 bg-primary/5 text-primary rounded-xl">
            <Car className="h-5 w-5" />
          </div>
          Booking
        </CardTitle>
      </CardHeader>
      <CardContent className="px-7 pb-7">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400 animate-pulse font-medium">Loading books...</p>
          </div>
        ) : appointments.length ? (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-start space-x-4 p-4 rounded-2xl border border-gray-50 hover:border-primary/20 hover:bg-primary/5 transition-all group">
                <div className="bg-primary/5 p-4 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#1A1A1A] leading-snug">{appointment.service}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">{appointment.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400 font-medium italic">No upcoming bookings</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

import { CalendarDays } from "lucide-react";

export default UpcomingAppointmentsCard;
