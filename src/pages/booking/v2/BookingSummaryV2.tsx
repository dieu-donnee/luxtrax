
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    CheckCircle2,
    MapPin,
    Clock,
    Calendar,
    CreditCard,
    ChevronRight,
    ShieldCheck,
    Star
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface BookingSummaryProps {
    selection: {
        pickup: string;
        destination: string;
        serviceId: string;
        servicePrice: number;
        date: Date | undefined;
        time: string;
    };
    onConfirm: () => void;
    isSubmitting: boolean;
}

const BookingSummaryV2 = ({ selection, onConfirm, isSubmitting }: BookingSummaryProps) => {
    const serviceNameMap: Record<string, string> = {
        'luxury-sedan': 'Berline de Luxe',
        'executive-suv': 'SUV Exécutif',
        'vip-van': 'Van VIP',
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 p-6 animate-fade-in">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900">Résumé de Réservation</h2>
                <p className="text-slate-500">Vérifiez vos détails avant de confirmer votre trajet premium.</p>
            </div>

            <Card className="relative overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white">
                {/* Top Decorative Header */}
                <div className="h-32 bg-[#0F172A] p-8 flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-white font-black italic text-2xl uppercase tracking-tighter">Votre Trajet</p>
                        <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest">
                            <ShieldCheck size={14} />
                            <span>Paiement Sécurisé</span>
                        </div>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <Star className="text-primary fill-primary" size={32} />
                    </div>
                </div>

                <div className="p-8 space-y-8 pt-10">
                    {/* Itinerary */}
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Départ</p>
                                <p className="text-slate-900 font-bold text-lg">{selection.pickup}</p>
                            </div>
                        </div>

                        <div className="ml-5 h-8 border-l-2 border-dashed border-slate-200" />

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                                <CheckCircle2 size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Arrivée</p>
                                <p className="text-slate-900 font-bold text-lg">{selection.destination}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                        <div className="space-y-1 text-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <Calendar className="mx-auto text-primary mb-2" size={20} />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Date</p>
                            <p className="text-slate-900 font-black italic uppercase text-xs">
                                {selection.date ? format(selection.date, "dd MMM yyyy", { locale: fr }) : "-"}
                            </p>
                        </div>
                        <div className="space-y-1 text-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <Clock className="mx-auto text-primary mb-2" size={20} />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Heure</p>
                            <p className="text-slate-900 font-black italic text-xs">{selection.time}</p>
                        </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-slate-900 text-white flex items-center justify-between group overflow-hidden relative">
                        <div className="relative z-10">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{serviceNameMap[selection.serviceId]}</p>
                            <p className="text-3xl font-black italic tracking-tighter text-primary">
                                {selection.servicePrice.toLocaleString()} <span className="text-sm">FCFA</span>
                            </p>
                        </div>
                        <CreditCard size={40} className="text-white/10 -rotate-12 transform group-hover:scale-110 transition-transform" />

                        {/* Glass effect reflection */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>

                    <Button
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className="w-full h-18 text-xl font-bold rounded-[2rem] bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isSubmitting ? "Chargement..." : (
                            <span className="flex items-center gap-3">
                                Confirmer & Payer <ChevronRight strokeWidth={3} />
                            </span>
                        )}
                    </Button>
                </div>
            </Card>

            <p className="text-center text-xs text-slate-400 px-12">
                En confirmant, vous acceptez nos conditions générales de service et notre politique d'annulation.
            </p>
        </div>
    );
};

export default BookingSummaryV2;
