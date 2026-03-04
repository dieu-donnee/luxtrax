
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Map as MapIcon, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

interface LocationSelectionProps {
    pickup: string;
    destination: string;
    onUpdate: (updates: { pickup?: string; destination?: string }) => void;
    onNext: () => void;
}

const LocationSelectionV2 = ({ pickup, destination, onUpdate, onNext }: LocationSelectionProps) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 animate-fade-in">
            {/* Left: Inputs */}
            <div className="space-y-8 flex flex-col justify-center">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900">Destination</h2>
                    <p className="text-slate-500">Où souhaitez-vous que nous vous récupérions et où allez-vous ?</p>
                </div>

                <div className="space-y-6 relative">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-0.5 h-[60%] bg-slate-200 z-0" />

                    <div className="relative z-10 space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 pl-14">Point de départ</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-focus-within:bg-primary group-focus-within:text-white transition-colors">
                                <MapPin size={18} />
                            </div>
                            <Input
                                value={pickup}
                                onChange={(e) => onUpdate({ pickup: e.target.value })}
                                placeholder="Ex: Aéroport de Douala"
                                className="h-16 pl-16 rounded-2xl border-slate-100 bg-white shadow-sm focus:ring-4 focus:ring-primary/10 transition-all text-lg font-medium"
                            />
                        </div>
                    </div>

                    <div className="relative z-10 space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 pl-14">Destination finale</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-focus-within:bg-primary group-focus-within:text-white transition-colors">
                                <Navigation size={18} />
                            </div>
                            <Input
                                value={destination}
                                onChange={(e) => onUpdate({ destination: e.target.value })}
                                placeholder="Ex: Hôtel Hilton, Yaoundé"
                                className="h-16 pl-16 rounded-2xl border-slate-100 bg-white shadow-sm focus:ring-4 focus:ring-primary/10 transition-all text-lg font-medium"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <Button
                        onClick={onNext}
                        disabled={!pickup || !destination}
                        className="w-full h-16 text-lg font-bold rounded-2xl bg-slate-900 hover:bg-slate-800 transition-all group"
                    >
                        Continuer <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Right: Map Preview Placeholder */}
            <Card className="relative h-[500px] overflow-hidden rounded-3xl border-none shadow-2xl group">
                <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center space-y-4">
                    <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center text-slate-300 animate-pulse">
                        <MapIcon size={40} />
                    </div>
                    <p className="text-slate-400 font-bold italic tracking-widest uppercase">Aperçu de la carte</p>
                </div>

                {/* Decorative Overlay */}
                <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-3xl pointer-events-none" />

                {/* Floating Tag */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 backdrop-blur-md shadow-lg border border-white/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                            <Navigation size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Distance Estimée</p>
                            <p className="text-slate-900 font-black italic">Calcul en cours...</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default LocationSelectionV2;
