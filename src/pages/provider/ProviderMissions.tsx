import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Car, DollarSign, Clock, ArrowRight } from "lucide-react";

const ProviderMissions = () => {
    const availableMissions = [
        {
            id: "1",
            client: "Jean D.",
            car: "Mercedes-Benz S-Class",
            address: "Cocody, Ambassades",
            distance: "2.4 km",
            price: "25,000",
            time: "14:30 Today",
            type: "Premium Wash",
        },
        {
            id: "2",
            client: "Sarah K.",
            car: "Range Rover Sport",
            address: "Plateau, Av. Chardy",
            distance: "1.8 km",
            price: "15,000",
            time: "16:00 Today",
            type: "Standard Wash",
        },
    ];

    return (
        <div className="min-h-screen bg-[#FDFDFD] p-6 pb-28 animate-in fade-in duration-700">
            <div className="max-w-2xl mx-auto space-y-10">
                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tighter uppercase italic">Missions</h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Available Opportunities</p>
                </div>

                {/* Map Preview Placeholder */}
                <Card className="h-48 bg-gray-100 rounded-[2.5rem] border-none overflow-hidden relative group">
                    <img
                        src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&auto=format&fit=crop"
                        alt="Map Preview"
                        className="w-full h-full object-cover opacity-50 grayscale transition-all group-hover:grayscale-0 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">
                            <Navigation className="text-primary" size={16} />
                            Scanning Nearby
                        </div>
                    </div>
                </Card>

                <div className="space-y-6">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#1A1A1A] px-2">Near You</h2>

                    {availableMissions.map((mission) => (
                        <Card key={mission.id} className="p-8 rounded-[2.5rem] border-none bg-white shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] transition-all group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5">
                                            {mission.type}
                                        </Badge>
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">{mission.distance}</span>
                                    </div>
                                    <h3 className="text-xl font-black text-[#1A1A1A] tracking-tight italic">{mission.car}</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-primary tracking-tight">{mission.price} <span className="text-[10px] opacity-60">FCFA</span></p>
                                    <div className="flex items-center justify-end gap-1 text-gray-400">
                                        <Clock size={10} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{mission.time.split(' ')[0]}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                                        <MapPin size={14} />
                                    </div>
                                    <p className="text-sm font-medium">{mission.address}</p>
                                </div>
                            </div>

                            <Button className="w-full h-14 bg-[#1A1A1A] hover:bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all active:scale-95 group-hover:translate-y-[-2px]">
                                View Details
                                <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={16} />
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProviderMissions;
