
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, ChevronRight, Repeat, CalendarDays } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ScheduleBookingProps {
    date: Date | undefined;
    time: string;
    isRecurring: boolean;
    onUpdate: (updates: { date?: Date; time?: string; isRecurring?: boolean }) => void;
    onNext: () => void;
}

const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2).toString().padStart(2, '0');
    const minutes = i % 2 === 0 ? '00' : '30';
    return `${hour}:${minutes}`;
});

const ScheduleBookingV2 = ({ date, time, isRecurring, onUpdate, onNext }: ScheduleBookingProps) => {
    return (
        <div className="max-w-4xl mx-auto space-y-12 p-6 animate-fade-in">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900">Planification</h2>
                <p className="text-slate-500">Dites-nous quand vous avez besoin de nous.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Date Selection */}
                <Card className="p-8 rounded-3xl border-slate-100 shadow-xl space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <CalendarIcon size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Étape 1</p>
                            <h3 className="font-black italic text-xl uppercase tracking-tighter">Choisir la Date</h3>
                        </div>
                    </div>

                    <div className="pt-4">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(d) => onUpdate({ date: d })}
                            className="rounded-2xl border border-slate-100 mx-auto"
                            locale={fr}
                            disabled={(d) => d < new Date()}
                        />
                    </div>
                </Card>

                {/* Time & Options Selection */}
                <Card className="p-8 rounded-3xl border-slate-100 shadow-xl space-y-10 flex flex-col justify-between">
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Étape 2</p>
                                <h3 className="font-black italic text-xl uppercase tracking-tighter">Choisir l'Heure</h3>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Heure de prise en charge</Label>
                            <Select value={time} onValueChange={(t) => onUpdate({ time: t })}>
                                <SelectTrigger className="h-16 rounded-2xl border-slate-100 bg-slate-50 shadow-inner font-medium text-lg">
                                    <SelectValue placeholder="Sélectionner l'heure" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                    {timeSlots.map((slot) => (
                                        <SelectItem key={slot} value={slot} className="py-3 rounded-xl focus:bg-primary/10">
                                            {slot}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400">
                                    <Repeat size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">Trajet récurrent</p>
                                    <p className="text-xs text-slate-500">Planifier chaque semaine</p>
                                </div>
                            </div>
                            <Switch
                                checked={isRecurring}
                                onCheckedChange={(val) => onUpdate({ isRecurring: val })}
                                className="data-[state=checked]:bg-primary"
                            />
                        </div>
                    </div>

                    <Button
                        onClick={onNext}
                        disabled={!date || !time}
                        className="w-full h-16 text-lg font-bold rounded-2xl bg-slate-900 hover:bg-slate-800 transition-all group mt-6"
                    >
                        Valider la date <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Card>
            </div>

            {date && (
                <div className="text-center p-6 rounded-3xl bg-primary/5 border border-primary/10 animate-in slide-in-from-bottom-4 duration-500">
                    <p className="text-slate-600">
                        Votre trajet est prévu pour le <span className="font-black italic text-primary uppercase">{format(date, "EEEE d MMMM yyyy", { locale: fr })}</span> à <span className="font-black italic text-primary">{time}</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default ScheduleBookingV2;
