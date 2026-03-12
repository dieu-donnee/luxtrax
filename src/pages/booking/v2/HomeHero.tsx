
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Star, Clock, ShieldCheck, Droplets } from "lucide-react";

interface HomeHeroProps {
    onStart: () => void;
}

const HomeHero = ({ onStart }: HomeHeroProps) => {
    return (
        <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden rounded-3xl mx-4 my-6">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 scale-105 animate-slow-zoom"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl px-6 text-center text-white space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium animate-fade-in-down">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span>Le lavage auto premium à domicile</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-tight animate-fade-in">
                    Votre voiture mérite le <span className="text-primary italic">meilleur soin</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed animate-fade-in delay-200">
                    Réservez un lavage professionnel à domicile en moins de 60 secondes. Produits écologiques, prestataires certifiés, résultat impeccable.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in delay-300">
                    <Button
                        size="lg"
                        onClick={onStart}
                        className="h-16 px-10 text-lg font-bold rounded-2xl bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/40 group overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Réserver maintenant <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Button>
                </div>

                {/* Floating Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-16 border-t border-white/10">
                    <div className="flex items-center gap-4 justify-center md:justify-start">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                            <Clock className="text-primary" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Rapidité</p>
                            <p className="text-white font-medium">Réservation en 60s</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 justify-center md:justify-center">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                            <ShieldCheck className="text-primary" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Confiance</p>
                            <p className="text-white font-medium">Prestataires certifiés</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 justify-center md:justify-end">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                            <Droplets className="text-primary" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Écologique</p>
                            <p className="text-white font-medium">Produits biodégradables</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeHero;
