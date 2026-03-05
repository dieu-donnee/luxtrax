
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, ChevronRight, MessageSquare, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Support = () => {
    const faqs = [
        "Comment réserver un lavage ?",
        "Puis-je annuler ma réservation ?",
        "Comment devenir prestataire ?",
        "Quels sont les moyens de paiement ?",
    ];

    return (
        <div className="min-h-screen bg-background p-6 pb-28 animate-in fade-in duration-700">
            <div className="max-w-md mx-auto space-y-10">
                {/* Support Header */}
                <div className="text-center pt-12 space-y-2">
                    <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase italic">Support</h1>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
                        Votre expérience premium, assistée.
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="group relative">
                        <div className="absolute inset-0 bg-primary/10 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <Card className="relative p-6 flex flex-col items-center justify-center text-center space-y-3 border-border shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer rounded-[2rem] bg-card group-hover:-translate-y-1">
                            <div className="p-4 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                                <Phone size={24} />
                            </div>
                            <span className="font-black text-[10px] uppercase tracking-widest text-foreground">Appeler</span>
                        </Card>
                    </div>
                    <div className="group relative">
                        <div className="absolute inset-0 bg-emerald-500/10 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <Card className="relative p-6 flex flex-col items-center justify-center text-center space-y-3 border-border shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer rounded-[2rem] bg-card group-hover:-translate-y-1">
                            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                                <MessageSquare size={24} />
                            </div>
                            <span className="font-black text-[10px] uppercase tracking-widest text-foreground">WhatsApp</span>
                        </Card>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground pl-1">
                        Envoyer un message
                    </label>
                    <div className="bg-card p-6 md:p-8 rounded-[2.5rem] border border-border shadow-2xl shadow-muted/30 space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary transition-all duration-300" />
                                <Input
                                    placeholder="Objet de votre demande"
                                    className="h-14 pl-12 bg-muted/50 border-transparent rounded-2xl focus:bg-card focus:ring-primary/10 transition-all font-bold text-sm tracking-tight"
                                />
                            </div>
                            <Textarea
                                placeholder="Décrivez votre problème en détail..."
                                className="min-h-[140px] rounded-2xl bg-muted/50 border-transparent p-6 focus:bg-card focus:ring-primary/10 transition-all font-bold text-sm leading-relaxed"
                            />
                        </div>
                        <Button className="w-full h-16 rounded-[2rem] bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 shadow-2xl shadow-primary/20 transition-all duration-500 group">
                            <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            Envoyer le message
                        </Button>
                    </div>
                </div>

                {/* FAQ Selection */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground pl-1">
                        Questions fréquentes
                    </label>
                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <button
                                key={index}
                                className="w-full flex items-center justify-between p-5 bg-card rounded-[1.5rem] border border-border shadow-sm hover:shadow-lg transition-all duration-500 text-left group"
                            >
                                <span className="text-xs font-black text-foreground tracking-tight uppercase group-hover:text-primary transition-colors">{faq}</span>
                                <div className="p-2 bg-muted rounded-full group-hover:bg-primary/5 group-hover:translate-x-1 transition-all">
                                    <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <p className="text-center text-[9px] font-black text-muted-foreground/50 uppercase tracking-[0.4em] pt-4">
                    Support dédié 24/7
                </p>
            </div>
        </div>
    );
};

export default Support;
