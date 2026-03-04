
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Droplets, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    capacity: number;
    luggage: number;
    features: string[];
}

const services: Service[] = [
    {
        id: "standard-wash",
        name: "Lavage Standard",
        description: "Un nettoyage complet extérieur et intérieur pour redonner de l'éclat à votre véhicule.",
        price: 15000,
        image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80",
        capacity: 1,
        luggage: 0,
        features: ["Lavage extérieur à la main", "Aspiration intérieure", "Nettoyage des vitres", "Brillant pneus"],
    },
    {
        id: "premium-wash",
        name: "Lavage Premium",
        description: "Le soin ultime pour votre voiture, incluant un shampouinage complet et une protection cire.",
        price: 25000,
        image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80",
        capacity: 1,
        luggage: 0,
        features: ["Tout du pack Standard", "Shampouinage des sièges", "Nettoyage moteur", "Cire de protection"],
    },
    {
        id: "vip-detailing",
        name: "Detailing VIP",
        description: "Une rénovation complète de votre véhicule avec des produits de haute précision.",
        price: 45000,
        image: "https://images.unsplash.com/photo-1552933071-e4040bd06f2e?auto=format&fit=crop&q=80",
        capacity: 1,
        luggage: 0,
        features: ["Tout du pack Premium", "Polissage carrosserie", "Traitement cuir", "Désinfection habitacle"],
    },
];

interface ServiceSelectionProps {
    onSelect: (serviceId: string, price: number) => void;
    selectedId?: string;
}

const ServiceSelectionV2 = ({ onSelect, selectedId }: ServiceSelectionProps) => {
    return (
        <div className="space-y-8 animate-fade-in p-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900">Service de Lavage</h2>
                <p className="text-slate-500">Sélectionnez le forfait de nettoyage qui correspond à vos exigences de prestige.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {services.map((service) => (
                    <Card
                        key={service.id}
                        className={cn(
                            "group relative overflow-hidden rounded-3xl border-2 transition-all duration-500 cursor-pointer hover:shadow-2xl hover:-translate-y-2",
                            selectedId === service.id
                                ? "border-primary ring-4 ring-primary/10"
                                : "border-slate-100 hover:border-primary/50"
                        )}
                        onClick={() => onSelect(service.id, service.price)}
                    >
                        {/* Image Section */}
                        <div className="h-48 overflow-hidden relative">
                            <img
                                src={service.image}
                                alt={service.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-4 left-4 text-white">
                                <p className="font-black italic uppercase tracking-tighter text-xl">{service.name}</p>
                                <div className="flex items-center gap-3 text-sm text-slate-200 mt-1">
                                    <span className="flex items-center gap-1"><Sparkles size={14} /> Haute Qualité</span>
                                    <span className="flex items-center gap-1"><Droplets size={14} /> Produit Élite</span>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-6 space-y-6">
                            <p className="text-slate-600 text-sm leading-relaxed">{service.description}</p>

                            <div className="space-y-3">
                                {service.features.map((feature) => (
                                    <div key={feature} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">À partir de</p>
                                    <p className="text-2xl font-black italic text-primary">{service.price.toLocaleString()} FCFA</p>
                                </div>
                                <Button
                                    size="icon"
                                    variant={selectedId === service.id ? "default" : "outline"}
                                    className="rounded-xl"
                                >
                                    <Info size={18} />
                                </Button>
                            </div>
                        </div>

                        {selectedId === service.id && (
                            <div className="absolute top-4 right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-lg animate-in zoom-in duration-300">
                                <Check size={20} strokeWidth={3} />
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ServiceSelectionV2;
