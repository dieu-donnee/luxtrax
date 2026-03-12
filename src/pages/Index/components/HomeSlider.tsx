import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const slides = [
    {
        title: "Élevez votre Prestige",
        description: "Le lavage auto qui redéfinit les standards du luxe à domicile.",
        image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=1200&auto=format&fit=crop",
        icon: Sparkles,
        tag: "Exclusivité LuxtraX"
    },
    {
        title: "Brillance Certifiée",
        description: "Des produits haut de gamme et une attention aux détails inégalée.",
        image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=1200&auto=format&fit=crop",
        icon: ShieldCheck,
        tag: "Qualité Premium"
    },
    {
        title: "Rapidité & Simplicité",
        description: "Réservez votre séance de detailing en moins de 60 secondes.",
        image: "https://images.unsplash.com/photo-1552933071-e4040bd06f2e?q=80&w=1200&auto=format&fit=crop",
        icon: Zap,
        tag: "Service Express"
    }
];

const HomeSlider = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 }) as any]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
    }, [emblaApi, onSelect]);

    return (
        <div className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl bg-slate-900 border border-white/10">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {slides.map((slide, index) => (
                        <div key={index} className="flex-[0_0_100%] min-w-0 relative h-[500px] md:h-[600px]">
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-10000 hover:scale-110 opacity-70"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 space-y-4 md:space-y-6">
                                <div className="flex items-center gap-2">
                                    <div className="px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest">
                                        {slide.tag}
                                    </div>
                                </div>

                                <div className="space-y-2 max-w-2xl transform transition-all duration-700 translate-y-0 opacity-100">
                                    <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white leading-tight">
                                        {slide.title.split(' ')[0]} <span className="text-primary">{slide.title.split(' ').slice(1).join(' ')}</span>
                                    </h2>
                                    <p className="text-slate-300 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
                                        {slide.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Indicators */}
            <div className="absolute bottom-8 right-8 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => emblaApi?.scrollTo(index)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${selectedIndex === index ? "w-12 bg-primary" : "w-2 bg-white/30"
                            }`}
                    />
                ))}
            </div>

            <div className="absolute top-8 left-8">
                {slides.map((slide, index) => {
                    const Icon = slide.icon;
                    return index === selectedIndex && (
                        <div key={index} className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 animate-in zoom-in duration-500">
                            <Icon className="text-primary w-8 h-8" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HomeSlider;
