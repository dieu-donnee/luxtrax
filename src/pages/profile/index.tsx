
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, MapPin, Settings, LogOut, ChevronRight, Bell, Shield, CreditCard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DocumentUpload from "./components/DocumentUpload";

const Profile = () => {
    const { user, profile, signOut } = useAuth();

    const menuItems = [
        { icon: User, label: "Account Info", sub: "Name, Email, Phone" },
        { icon: MapPin, label: "Saved Addresses", sub: "Home, Office" },
        { icon: CreditCard, label: "Payment Methods", sub: "Visa, Mobile Money" },
        { icon: Bell, label: "Notifications", sub: "Alerts, Reminders" },
        { icon: Shield, label: "Security", sub: "Password, 2FA" },
        { icon: Settings, label: "System Settings", sub: "Language, Theme" },
    ];

    return (
        <div className="min-h-screen bg-[#FDFDFD] p-6 pb-28 animate-in fade-in duration-700">
            <div className="max-w-md mx-auto space-y-10">
                {/* Profile Header */}
                <div className="flex flex-col items-center pt-12 pb-6 space-y-6">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-700" />
                        <Avatar className="h-32 w-32 border-[6px] border-white shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-105">
                            <AvatarImage src={user?.user_metadata?.avatar_url} />
                            <AvatarFallback className="bg-primary text-white text-3xl font-black">
                                {profile?.full_name?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <button className="absolute bottom-1 right-1 bg-primary text-white p-2.5 rounded-full border-4 border-white shadow-xl z-20 hover:scale-110 active:scale-95 transition-all duration-300">
                            <Settings size={16} className="animate-spin-slow" />
                        </button>
                    </div>
                    <div className="text-center space-y-1">
                        <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tighter uppercase">
                            {profile?.full_name || "Guest User"}
                        </h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                            {user?.email}
                        </p>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">
                        Preferences
                    </label>
                    <div className="space-y-3">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                className="w-full flex items-center justify-between p-5 bg-white rounded-[2rem] border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-gray-200/30 transition-all duration-500 group"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="p-3.5 bg-gray-50/50 rounded-2xl text-gray-400 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                                        <item.icon size={18} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-black text-[#1A1A1A] text-sm tracking-tight uppercase group-hover:text-primary transition-colors">{item.label}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{item.sub}</p>
                                    </div>
                                </div>
                                <div className="p-2 bg-gray-50/50 rounded-full group-hover:bg-primary/5 group-hover:translate-x-1 transition-all">
                                    <ChevronRight size={14} className="text-gray-300 group-hover:text-primary" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Provider Verification Section */}
                {profile?.role === "provider" && (
                    <div className="pt-2">
                        <DocumentUpload />
                    </div>
                )}

                {/* Log Out */}
                <button
                    onClick={() => signOut()}
                    className="w-full h-16 bg-white border border-red-50 text-red-500 hover:bg-red-50 rounded-[2rem] flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-500 shadow-sm hover:shadow-red-200/20"
                >
                    <LogOut size={16} />
                    Disconnect
                </button>

                <p className="text-center text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] pt-4">
                    Luxtrax v1.0.4 • Premium Access
                </p>
            </div>
        </div>
    );
};

export default Profile;
