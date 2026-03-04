
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Home,
    Calendar,
    Activity,
    User,
    Menu,
    X,
    LogOut,
    ChevronRight,
    ShieldAlert,
    Wallet,
    GraduationCap,
    Compass
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavItem {
    label: string;
    icon: React.ElementType;
    path: string;
}

const Sidebar = () => {
    const location = useLocation();
    const { profile, signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const getNavItems = (): NavItem[] => {
        if (profile?.role === 'provider') {
            return [
                { label: "Tableau de bord", icon: Home, path: "/" },
                { label: "Missions", icon: Compass, path: "/provider/missions" },
                { label: "Portefeuille", icon: Wallet, path: "/provider/wallet" },
                { label: "Académie", icon: GraduationCap, path: "/provider/academy" },
                { label: "Profil", icon: User, path: "/profile" },
            ];
        }

        if (profile?.role === 'admin') {
            return [
                { label: "Administration", icon: ShieldAlert, path: "/admin" },
                { label: "Accueil", icon: Home, path: "/" },
                { label: "Profil", icon: User, path: "/profile" },
            ];
        }

        return [
            { label: "Accueil", icon: Home, path: "/" },
            { label: "Réservation", icon: Calendar, path: "/booking" },
            { label: "Activité", icon: Activity, path: "/bookings" },
            { label: "Profil", icon: User, path: "/profile" },
        ];
    };

    const navItems = getNavItems();

    const SidebarContent = ({ className }: { className?: string }) => (
        <div className={cn("flex flex-col h-full bg-[#0F172A] text-white", className)}>
            <div className="p-6">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                        <span className="text-xl font-black italic">LX</span>
                    </div>
                    <span className="text-2xl font-black italic tracking-tighter uppercase">LuxtraX</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group",
                                isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <Icon size={20} className={cn("transition-transform group-hover:scale-110", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                                <span className="font-medium">{item.label}</span>
                            </div>
                            {isActive && <ChevronRight size={16} />}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800/50">
                <Button
                    variant="ghost"
                    onClick={() => signOut()}
                    className="w-full justify-start gap-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl px-4"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Déconnexion</span>
                </Button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-72 z-50 shadow-2xl">
                <SidebarContent />
            </aside>

            {/* Mobile Header & Trigger */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-4 flex items-center justify-between z-40">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold italic">LX</span>
                    </div>
                    <span className="text-xl font-black italic tracking-tighter uppercase text-slate-900">LuxtraX</span>
                </Link>

                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-slate-600">
                            <Menu size={24} />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 border-none w-72">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
};

export default Sidebar;
