
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronRight, Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface LocationSelectionProps {
    pickup: string;
    destination: string;
    onUpdate: (updates: { pickup?: string; destination?: string }) => void;
    onNext: () => void;
}

const LocationSelectionV2 = ({ pickup, destination, onUpdate, onNext }: LocationSelectionProps) => {
    return (
        <div className="max-w-lg mx-auto space-y-8 p-6 animate-fade-in">
            <div className="space-y-2 text-center">
                <h2 className="text-3xl font-black italic tracking-tighter uppercase text-foreground">Adresse de lavage</h2>
                <p className="text-muted-foreground">Où souhaitez-vous que nous intervenions ?</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-2">Adresse complète</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-focus-within:bg-primary group-focus-within:text-primary-foreground transition-colors">
                            <MapPin size={18} />
                        </div>
                        <Input
                            value={pickup}
                            onChange={(e) => onUpdate({ pickup: e.target.value })}
                            placeholder="Ex: Quartier Arconville, Calavi"
                            className="h-16 pl-16 rounded-2xl border-border bg-card shadow-sm focus:ring-4 focus:ring-primary/10 transition-all text-lg font-medium"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-2">Précisions (optionnel)</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-5 w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-focus-within:bg-primary group-focus-within:text-primary-foreground transition-colors">
                            <Home size={18} />
                        </div>
                        <Textarea
                            value={destination}
                            onChange={(e) => onUpdate({ destination: e.target.value })}
                            placeholder="Ex: Maison avec portail bleu, à côté de la pharmacie..."
                            className="min-h-[100px] pl-16 pt-4 rounded-2xl border-border bg-card shadow-sm focus:ring-4 focus:ring-primary/10 transition-all text-base font-medium"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <Button
                    onClick={onNext}
                    disabled={!pickup}
                    className="w-full h-16 text-lg font-bold rounded-2xl bg-primary hover:bg-primary/90 transition-all group shadow-xl shadow-primary/20"
                >
                    Continuer <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </div>
    );
};

export default LocationSelectionV2;
