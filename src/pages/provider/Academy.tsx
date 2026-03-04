import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, GraduationCap, CheckCircle, BookOpen, Clock, Star } from "lucide-react";

const Academy = () => {
    const modules = [
        {
            id: "1",
            title: "Introduction to LuxtraX",
            description: "Learn the fundamentals of the platform and how to maximize your earnings with professional tips.",
            duration: "10 min",
            status: "completed",
            image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800&auto=format&fit=crop",
        },
        {
            id: "2",
            title: "Premium Washing Techniques",
            description: "A complete guide on high-end products and specialized care for luxury vehicles.",
            duration: "25 min",
            status: "ongoing",
            image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=800&auto=format&fit=crop",
        },
        {
            id: "3",
            title: "Customer Service Excellence",
            description: "How to maintain a 5-star rating and build a recurring elite clientele.",
            duration: "15 min",
            status: "locked",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
        },
    ];

    return (
        <div className="min-h-screen bg-[#FDFDFD] p-6 pb-28 animate-in fade-in duration-700">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tighter uppercase italic">Academy</h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Excellence in Motion</p>
                    </div>
                    <div className="w-16 h-16 bg-primary/5 rounded-[2rem] flex items-center justify-center text-primary shadow-xl shadow-primary/5">
                        <GraduationCap size={32} />
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    {modules.map((module) => (
                        <Card key={module.id} className="group relative overflow-hidden bg-white rounded-[2.5rem] border-none shadow-[0_20px_50px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:-translate-y-2">
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={module.image}
                                    alt={module.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute top-5 left-5">
                                    <Badge className={`${module.status === 'completed' ? 'bg-green-500' : module.status === 'ongoing' ? 'bg-primary' : 'bg-gray-500'} text-white border-none rounded-xl text-[9px] font-black uppercase tracking-widest px-3 py-1.5`}>
                                        {module.status === 'completed' ? 'Mastered' : module.status === 'ongoing' ? 'In Progress' : 'Locked'}
                                    </Badge>
                                </div>
                                {module.status === 'locked' && (
                                    <div className="absolute inset-0 bg-[#1A1A1A]/40 backdrop-blur-[2px] flex items-center justify-center">
                                        <BookOpen className="text-white opacity-50" size={32} />
                                    </div>
                                )}
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Clock size={12} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{module.duration}</span>
                                    </div>
                                    <h3 className="text-xl font-black text-[#1A1A1A] tracking-tight leading-none group-hover:text-primary transition-colors italic">
                                        {module.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 font-medium leading-relaxed">
                                        {module.description}
                                    </p>
                                </div>

                                <Button
                                    disabled={module.status === 'locked'}
                                    className={`w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 ${module.status === 'completed'
                                            ? 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                            : 'bg-[#1A1A1A] text-white hover:bg-primary'
                                        }`}
                                >
                                    {module.status === 'completed' ? (
                                        <span className="flex items-center gap-2">Review Module <CheckCircle size={16} /></span>
                                    ) : (
                                        <span className="flex items-center gap-2">Start Learning <PlayCircle size={16} /></span>
                                    )}
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>

                <Card className="bg-[#1A1A1A] p-10 rounded-[3rem] border-none shadow-2xl shadow-black/10 relative overflow-hidden">
                    <div className="absolute -right-10 -bottom-10 opacity-5 rotate-12">
                        <Star size={200} />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-primary">
                                <Star size={20} fill="currentColor" />
                            </div>
                            <h2 className="text-xl font-black text-white tracking-widest uppercase italic">Elite Status</h2>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed font-medium max-w-xl">
                            At LuxtraX, quality is our obsession. Complete at least <span className="text-primary font-bold">3 core modules</span> to unlock "Premium" missions and benefit from a reduced platform commission. Knowledge is your greatest asset.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Academy;
