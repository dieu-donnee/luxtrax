import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, User, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ReviewForm from "./components/ReviewForm";
import { cn } from "@/lib/utils";
import type { Database } from "@/integrations/supabase/types";

type Booking = Database["public"]["Tables"]["bookings"]["Row"] & {
    services: { name: string; price: number } | null;
};

const Bookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    const fetchBookings = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from("bookings")
                .select(`
                    *,
                    services(name, price)
                `)
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setBookings(data || []);
        } catch (error) {
            console.error("Erreur lors du chargement des réservations:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [user]);

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "completed":
                return { label: "Terminé", color: "bg-emerald-50 text-emerald-600 border-emerald-100" };
            case "pending":
                return { label: "En attente", color: "bg-blue-50 text-blue-600 border-blue-100" };
            case "ongoing":
                return { label: "En cours", color: "bg-orange-50 text-orange-600 border-orange-100" };
            case "cancelled":
                return { label: "Annulé", color: "bg-red-50 text-red-600 border-red-100" };
            default:
                return { label: status, color: "bg-muted text-muted-foreground border-border" };
        }
    };

    return (
        <div className="min-h-screen bg-background p-6 pb-28 animate-in fade-in duration-700">
            <div className="max-w-md mx-auto space-y-8">
                {/* Header */}
                <div className="text-center pt-8 space-y-2">
                    <h1 className="text-3xl font-black text-foreground tracking-tighter uppercase">Historique</h1>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
                        Vos prestations de lavage passées
                    </p>
                </div>

                {/* Search */}
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-all duration-300 h-5 w-5" />
                    <Input
                        placeholder="Rechercher par adresse ou service..."
                        className="h-14 pl-12 bg-card border-border rounded-2xl shadow-sm focus:ring-primary/10 transition-all font-bold text-sm tracking-tight"
                    />
                </div>

                {/* Filter Tabs */}
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1.5 rounded-[1.5rem] border border-border/50 shadow-inner">
                        <TabsTrigger value="all" className="rounded-xl text-[10px] uppercase font-black tracking-widest data-[state=active]:bg-card data-[state=active]:shadow-sm">Tout</TabsTrigger>
                        <TabsTrigger value="upcoming" className="rounded-xl text-[10px] uppercase font-black tracking-widest data-[state=active]:bg-card data-[state=active]:shadow-sm">À venir</TabsTrigger>
                        <TabsTrigger value="past" className="rounded-xl text-[10px] uppercase font-black tracking-widest data-[state=active]:bg-card data-[state=active]:shadow-sm">Passées</TabsTrigger>
                        <TabsTrigger value="week" className="rounded-xl text-[10px] uppercase font-black tracking-widest data-[state=active]:bg-card data-[state=active]:shadow-sm">Semaine</TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Bookings List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="text-center py-20 bg-muted rounded-[2.5rem] border border-dashed border-border">
                            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Aucun historique trouvé</p>
                        </div>
                    ) : (
                        bookings.map((booking) => {
                            const status = getStatusConfig(booking.status);
                            const scheduledDate = new Date(booking.scheduled_date);

                            return (
                                <Card key={booking.id} className="relative overflow-hidden group p-6 border-border shadow-sm hover:shadow-2xl hover:shadow-muted/30 transition-all duration-500 rounded-[2.5rem] bg-card">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="space-y-1">
                                            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                                                {scheduledDate.toLocaleDateString('fr-FR', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </p>
                                            <p className="text-lg font-black text-foreground tracking-tighter uppercase">
                                                {scheduledDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <div className={cn(
                                            "px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest shadow-sm",
                                            status.color
                                        )}>
                                            {status.label}
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-2">
                                        <h4 className="font-black text-foreground text-sm tracking-tight uppercase">{booking.services?.name || 'Service inconnu'}</h4>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-muted-foreground">
                                                <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/5 group-hover:text-primary transition-all duration-500">
                                                    <MapPin size={14} />
                                                </div>
                                                <span className="text-xs font-bold text-muted-foreground line-clamp-1">{booking.address}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-muted-foreground">
                                                <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/5 group-hover:text-primary transition-all duration-500">
                                                    <User size={14} />
                                                </div>
                                                <span className="text-xs font-bold text-muted-foreground">Prestataire LustraX</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 mt-6 border-t border-border">
                                        <div className="space-y-0.5">
                                            <p className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest">Montant</p>
                                            <p className="text-lg font-black text-primary tracking-tighter">{booking.services?.price?.toLocaleString() || 0} FCFA</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="h-11 px-6 bg-muted hover:bg-muted/80 text-foreground font-black text-[10px] uppercase tracking-widest rounded-xl transition-all">
                                                Détails
                                            </button>
                                            {booking.status === "completed" && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedBooking(booking);
                                                        setIsReviewOpen(true);
                                                    }}
                                                    className="h-11 px-6 bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 flex items-center gap-2"
                                                >
                                                    <Star size={12} className="fill-current" />
                                                    Avis
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            );
                        })
                    )}
                </div>
            </div>

            {selectedBooking && user && (
                <ReviewForm
                    bookingId={selectedBooking.id}
                    providerId={selectedBooking.provider_id || "default_provider"}
                    clientId={user.id}
                    isOpen={isReviewOpen}
                    onClose={() => setIsReviewOpen(false)}
                    onSuccess={fetchBookings}
                />
            )}
        </div>
    );
};

export default Bookings;
