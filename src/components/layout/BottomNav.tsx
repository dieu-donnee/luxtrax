import { Home, Calendar, User, Activity, Wallet, GraduationCap, Compass, ShieldAlert, LifeBuoy } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

import { useNavigationItems } from "@/hooks/useNavigationItems";

const BottomNav = () => {
    const location = useLocation();
    const navItems = useNavigationItems();

    // Don't show on auth page
    if (location.pathname === "/auth") return null;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-t border-border px-4 py-2 lg:hidden shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex justify-around items-center max-w-md mx-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "relative flex flex-col items-center py-2 px-2 transition-all duration-300",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <div className={cn(
                                "relative z-10 transition-transform duration-300",
                                isActive && "transform scale-110"
                            )}>
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={cn(
                                "text-[9px] font-black mt-1 transition-all duration-300 tracking-tight uppercase",
                                isActive ? "opacity-100" : "opacity-70"
                            )}>
                                {item.label}
                            </span>
                            {isActive && (
                                <div className="absolute top-0 w-8 h-1 bg-primary rounded-full animate-in fade-in slide-in-from-top-1 duration-300" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
