import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, User, Wallet, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ReviewForm from "./components/ReviewForm";
import { cn } from "@/lib/utils";
import type { Database } from "@/integrations/supabase/types";

type Booking = Database["public"]["Tables"]["bookings"]["Row"] & {
    services: { name: string; price: number } | null;
    profiles: { full_name: string | null } | null; // This would typically be the provider if we had a provider_id on booking
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
            console.error("Error fetching bookings:", error);
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
                return { label: "Completed", color: "bg-emerald-50 text-emerald-600 border-emerald-100" };
            case "pending":
                return { label: "Pending", color: "bg-blue-50 text-blue-600 border-blue-100" };
            case "ongoing":
                return { label: "Ongoing", color: "bg-orange-50 text-orange-600 border-orange-100" };
            case "cancelled":
                return { label: "Cancelled", color: "bg-red-50 text-red-600 border-red-100" };
            default:
                return { label: status, color: "bg-gray-50 text-gray-500 border-gray-100" };
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] p-6 pb-28 animate-in fade-in duration-700">
            <div className="max-w-md mx-auto space-y-8">
                {/* Header */}
                <div className="text-center pt-8 space-y-2">
                    <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tighter uppercase">History</h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                        Your past luxury services
                    </p>
                </div>

                {/* Search */}
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-all duration-300 h-5 w-5" />
                    <Input
                        placeholder="Search by city or provider..."
                        className="h-14 pl-12 bg-white border-gray-100 rounded-2xl shadow-sm focus:ring-primary/10 transition-all font-bold text-sm tracking-tight"
                    />
                </div>

                {/* Filter Tabs */}
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-gray-50/50 p-1.5 rounded-[1.5rem] border border-gray-100/50 shadow-inner">
                        <TabsTrigger value="all" className="rounded-xl text-[10px] uppercase font-black tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">All</TabsTrigger>
                        <TabsTrigger value="upcoming" className="rounded-xl text-[10px] uppercase font-black tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Next</TabsTrigger>
                        <TabsTrigger value="past" className="rounded-xl text-[10px] uppercase font-black tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Past</TabsTrigger>
                        <TabsTrigger value="week" className="rounded-xl text-[10px] uppercase font-black tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Week</TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Bookings List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No history found</p>
                        </div>
                    ) : (
                        bookings.map((booking) => {
                            const status = getStatusConfig(booking.status);
                            const scheduledDate = new Date(booking.scheduled_date);

                            return (
                                <Card key={booking.id} className="relative overflow-hidden group p-6 border-gray-50 shadow-sm hover:shadow-2xl hover:shadow-gray-200/30 transition-all duration-500 rounded-[2.5rem] bg-white border">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="space-y-1">
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                                {scheduledDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </p>
                                            <p className="text-lg font-black text-[#1A1A1A] tracking-tighter uppercase">
                                                {scheduledDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
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
                                        <h4 className="font-black text-[#1A1A1A] text-sm tracking-tight uppercase">{booking.services?.name || 'Unknown Service'}</h4>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-gray-400">
                                                <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-primary/5 group-hover:text-primary transition-all duration-500">
                                                    <MapPin size={14} />
                                                </div>
                                                <span className="text-xs font-bold text-gray-500 line-clamp-1 italic">{booking.address}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-400">
                                                <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-primary/5 group-hover:text-primary transition-all duration-500">
                                                    <User size={14} />
                                                </div>
                                                <span className="text-xs font-bold text-gray-500">Prestataire LuxtraX</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-50">
                                        <div className="space-y-0.5">
                                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Investment</p>
                                            <p className="text-lg font-black text-primary tracking-tighter">{booking.services?.price?.toLocaleString() || 0} F</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="h-11 px-6 bg-gray-50/50 hover:bg-gray-100 text-[#1A1A1A] font-black text-[10px] uppercase tracking-widest rounded-xl transition-all">
                                                Details
                                            </button>
                                            {booking.status === "completed" && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedBooking(booking);
                                                        setIsReviewOpen(true);
                                                    }}
                                                    className="h-11 px-6 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 flex items-center gap-2"
                                                >
                                                    <Star size={12} className="fill-white" />
                                                    Review
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
                    providerId={selectedBooking.provider_id || "default_provider"} // Placeholder until provider_id is standard
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
