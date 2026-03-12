
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface ServiceSelectionProps {
    onSelect: (serviceId: string, price: number) => void;
    selectedId?: string;
}

const ServiceSelectionV2 = ({ onSelect, selectedId }: ServiceSelectionProps) => {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data, error } = await supabase
                    .from("services")
                    .select("*")
                    .eq("type", "carwash")
                    .order("price", { ascending: true });

                if (error) throw error;
                setServices(data || []);
            } catch (error) {
                console.error("Erreur chargement services:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const serviceImages = [
        "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1552933071-e4040bd06f2e?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80",
    ];

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in p-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-black italic tracking-tighter uppercase text-foreground">Choisir un service</h2>
                <p className="text-muted-foreground">Sélectionnez le forfait de lavage adapté à vos besoins.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {services.map((service, index) => (
                    <Card
                        key={service.id}
                        className={cn(
                            "group relative overflow-hidden rounded-3xl border-2 transition-all duration-500 cursor-pointer hover:shadow-2xl hover:-translate-y-2",
                            selectedId === service.id
                                ? "border-primary ring-4 ring-primary/10"
                                : "border-border hover:border-primary/50"
                        )}
                        onClick={() => onSelect(service.id, service.price)}
                    >
                        {/* Image Section */}
                        <div className="h-48 overflow-hidden relative">
                            <img
                                src={serviceImages[index % serviceImages.length]}
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
                            {service.is_vip && (
                                <div className="absolute top-4 left-4 px-3 py-1 bg-yellow-500 text-black text-[9px] font-black uppercase tracking-widest rounded-full">
                                    VIP
                                </div>
                            )}
                        </div>

                        {/* Content Section */}
                        <div className="p-6 space-y-4">
                            <p className="text-muted-foreground text-sm leading-relaxed">{service.description || "Service de lavage professionnel"}</p>

                            {service.details && (
                                <p className="text-xs text-muted-foreground/80">{service.details}</p>
                            )}

                            <div className="pt-4 border-t border-border flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Tarif</p>
                                    <p className="text-2xl font-black italic text-primary">{service.price.toLocaleString()} FCFA</p>
                                    {service.discount_percentage && (
                                        <p className="text-xs text-emerald-600 font-bold">-{service.discount_percentage}% de réduction</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {selectedId === service.id && (
                            <div className="absolute top-4 right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg animate-in zoom-in duration-300">
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
