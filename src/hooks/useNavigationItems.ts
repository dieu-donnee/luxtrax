
import { Home, Calendar, Activity, User, ShieldAlert, Wallet, GraduationCap, Compass, LifeBuoy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import * as React from "react";

export interface NavItem {
    label: string;
    icon: React.ElementType;
    path: string;
}

export const useNavigationItems = () => {
    const { profile } = useAuth();

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

        // Default Client Items
        return [
            { label: "Accueil", icon: Home, path: "/" },
            { label: "Réserver", icon: Calendar, path: "/booking" },
            { label: "Historique", icon: Activity, path: "/bookings" },
            { label: "Profil", icon: User, path: "/profile" },
            { label: "Support", icon: LifeBuoy, path: "/support" },
        ];
    };

    return getNavItems();
};
