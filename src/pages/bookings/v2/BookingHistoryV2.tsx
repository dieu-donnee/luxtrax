
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    MapPin,
    ChevronRight,
    Clock,
    FileText,
    RotateCcw,
    Search,
    Filter,
    Star
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Booking {
    id: string;
    date: string;
    time: string;
    pickup: string;
    destination: string;
    serviceName: string;
    price: number;
    status: 'pending' | 'completed' | 'cancelled';
}

const mockBookings: Booking[] = [
    {
        id: "BK-8829",
        date: "12 Mars 2026",
        time: "14:30",
        pickup: "Aéroport de Douala",
        destination: "Hôtel Akwa Palace",
        serviceName: "Berline de Luxe",
        price: 45000,
        status: 'pending'
    },
    {
        id: "BK-7712",
        date: "28 Février 2026",
        time: "09:00",
        pickup: "Yaoundé Ville",
        destination: "Kribi Plage",
        serviceName: "SUV Exécutif",
        price: 85000,
        status: 'completed'
    },
    {
        id: "BK-6601",
        date: "15 Janvier 2026",
        time: "18:45",
        pickup: "Bonanjo",
        destination: "Golf de Douala",
        serviceName: "Van VIP",
        price: 35000,
        status: 'cancelled'
    }
];

const BookingHistoryV2 = () => {
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [search, setSearch] = useState("");

    const filteredBookings = mockBookings.filter(b => {
        const matchesFilter = filter === 'all' || b.status === filter;
        const matchesSearch = b.pickup.toLowerCase().includes(search.toLowerCase()) ||
            b.destination.toLowerCase().includes(search.toLowerCase()) ||
            b.id.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusBadge = (status: Booking['status']) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-none px-3 py-1 rounded-full font-bold uppercase text-[10px] tracking-widest">En attente</Badge>;
            case 'completed':
                return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none px-3 py-1 rounded-full font-bold uppercase text-[10px] tracking-widest">Terminé</Badge>;
            case 'cancelled':
                return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-none px-3 py-1 rounded-full font-bold uppercase text-[10px] tracking-widest">Annulé</Badge>;
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">Historique <span className="text-primary italic">Activité</span></h1>
                    <p className="text-slate-500 font-medium">Gérez vos réservations passées et suivez vos trajets à venir.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher un trajet..."
                            className="h-12 pl-12 pr-4 w-full md:w-64 rounded-xl border-slate-100 bg-white shadow-sm focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                        />
                    </div>
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-slate-100 hover:bg-slate-50">
                        <Filter size={18} />
                    </Button>
                </div>
            </div>

            {/* Tabs / Filters */}
            <div className="flex gap-2 p-1.5 bg-slate-100/50 rounded-2xl w-fit">
                {(['all', 'pending', 'completed'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all",
                            filter === f
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        {f === 'all' ? 'Tous' : f === 'pending' ? 'À venir' : 'Passés'}
                    </button>
                ))}
            </div>

            {/* Bookings List */}
            <div className="grid gap-6">
                {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                        <Card key={booking.id} className="group relative overflow-hidden rounded-[2rem] border-none shadow-lg hover:shadow-2xl transition-all duration-500 bg-white">
                            <div className="flex flex-col lg:flex-row">
                                {/* Left side: Basic Info */}
                                <div className="p-8 lg:w-1/3 bg-slate-50/50 flex flex-col justify-between border-r border-slate-100">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black italic text-primary uppercase tracking-tighter">{booking.id}</span>
                                            {getStatusBadge(booking.status)}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-slate-900 font-black italic text-xl uppercase tracking-tighter">
                                                <Calendar size={18} className="text-primary" />
                                                {booking.date}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500 font-bold ml-6">
                                                <Clock size={14} />
                                                {booking.time}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Service</p>
                                        <p className="text-slate-900 font-black italic uppercase">{booking.serviceName}</p>
                                    </div>
                                </div>

                                {/* Center: Itinerary */}
                                <div className="p-8 lg:flex-1 space-y-6 flex flex-col justify-center">
                                    <div className="relative space-y-6">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-0.5 h-full bg-slate-100 z-0" />

                                        <div className="relative z-10 flex items-start gap-4">
                                            <div className="w-6 h-6 rounded-full bg-white border-4 border-slate-200 shrink-0" />
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Point de départ</p>
                                                <p className="text-slate-700 font-medium text-sm leading-tight">{booking.pickup}</p>
                                            </div>
                                        </div>

                                        <div className="relative z-10 flex items-start gap-4">
                                            <div className="w-6 h-6 rounded-full bg-primary border-4 border-primary/20 shrink-0" />
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Destination</p>
                                                <p className="text-slate-700 font-bold text-sm leading-tight">{booking.destination}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right side: Actions & Price */}
                                <div className="p-8 lg:w-72 bg-slate-50/30 flex flex-col justify-between items-end border-l border-slate-100">
                                    <div className="text-right">
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Montant</p>
                                        <p className="text-2xl font-black italic text-primary">{booking.price.toLocaleString()} <span className="text-sm">FCFA</span></p>
                                    </div>

                                    <div className="flex gap-2 w-full mt-6 lg:mt-0">
                                        {booking.status === 'completed' ? (
                                            <Button variant="outline" className="flex-1 rounded-xl h-12 border-slate-200 text-slate-600 hover:bg-white hover:text-primary transition-all">
                                                <Star size={16} className="mr-2" /> Note
                                            </Button>
                                        ) : booking.status === 'cancelled' ? (
                                            <Button variant="outline" className="flex-1 rounded-xl h-12 border-slate-200 text-slate-600 hover:bg-white hover:text-primary transition-all">
                                                <RotateCcw size={16} className="mr-2" /> Reprendre
                                            </Button>
                                        ) : (
                                            <Button variant="outline" className="flex-1 rounded-xl h-12 border-slate-200 text-slate-600 hover:bg-white hover:text-primary transition-all">
                                                Détails
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-white border border-slate-200 group-hover:bg-primary group-hover:text-white transition-all">
                                            <ChevronRight size={20} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="py-20 text-center space-y-4 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-300">
                            <FileText size={40} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xl font-black italic uppercase tracking-tighter text-slate-400">Aucun trajet trouvé</p>
                            <p className="text-slate-400">Essayez de modifier vos filtres ou effectuez une nouvelle recherche.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingHistoryV2;
