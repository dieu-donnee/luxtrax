import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, Settings, BarChart3, UserCheck, ShieldCheck } from "lucide-react";
import UsersManagement from "./components/UsersManagement";
import BookingsManagement from "./components/BookingsManagement";
import ServicesManagement from "./components/ServicesManagement";
import AdminDashboard from "./components/AdminDashboard";
import ProviderVerification from "./components/ProviderVerification";

const AdminPage = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Redirect if not admin
  if (!user || profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans animate-in fade-in duration-700">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tighter uppercase italic">Control Center</h1>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Platform Authority • Admin Panel</p>
            </div>
            <div className="flex items-center gap-3 bg-primary/5 px-4 py-2 rounded-2xl border border-primary/10">
              <ShieldCheck className="text-primary w-5 h-5" />
              <span className="text-[10px] font-black text-primary uppercase tracking-widest italic">Authorized Session</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
          <div className="overflow-x-auto pb-4 -mx-6 px-6">
            <TabsList className="bg-gray-100/50 p-1.5 rounded-[2rem] gap-2 h-auto w-fit flex">
              {[
                { id: "dashboard", label: "Overview", icon: BarChart3 },
                { id: "users", label: "Customers", icon: Users },
                { id: "bookings", label: "Operations", icon: Calendar },
                { id: "services", label: "Catalog", icon: Settings },
                { id: "providers", label: "Experts", icon: UserCheck },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg rounded-[1.5rem] px-6 py-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="users" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <UsersManagement />
          </TabsContent>

          <TabsContent value="bookings" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <BookingsManagement />
          </TabsContent>

          <TabsContent value="services" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <ServicesManagement />
          </TabsContent>

          <TabsContent value="providers" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <ProviderVerification />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPage;
