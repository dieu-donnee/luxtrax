import HomeSlider from "./components/HomeSlider";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans pb-24 lg:pb-12">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fade-in relative z-20">
        {/* Main Promotional Slider */}
        <section className="w-full">
          <HomeSlider />
        </section>

        {/* Action Section */}
        <section className="flex flex-col items-center justify-center space-y-8 py-12 bg-white rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />

          <div className="text-center space-y-4 max-w-2xl px-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest border border-primary/20 animate-bounce-slow">
              <Sparkles size={14} />
              Prestation de prestige à portée de main
            </div>
            <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-slate-900 leading-tight">
              Prêt pour une brillance <span className="text-primary italic underline underline-offset-8 decoration-primary/20">irréprochable ?</span>
            </h2>
            <p className="text-slate-500 font-medium text-lg max-w-lg mx-auto">
              Rejoignez le cercle exclusif LuxtraX et offrez à votre véhicule le soin qu'il mérite.
            </p>
          </div>

          <div className="pt-4 relative z-10">
            <Button
              onClick={() => navigate('/booking')}
              className="h-16 px-12 bg-primary hover:bg-primary/90 text-white font-black italic uppercase tracking-tighter text-xl rounded-2xl shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 group flex items-center gap-3"
            >
              Réserver Maintenant
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>
        </section>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
          {[
            { icon: Sparkles, title: "Qualité Élite", desc: "Produits biodégradables de haute précision." },
            { icon: ShieldCheck, title: "Sécurité Totale", desc: "Prestataires certifiés et assurés." },
            { icon: Zap, title: "Service Rapide", desc: "Intervention à domicile en un clin d'œil." }
          ].map((item, i) => (
            <div key={i} className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-primary group-hover:text-white transition-colors">
                <item.icon size={28} />
              </div>
              <h3 className="mt-6 font-black italic uppercase tracking-tighter text-slate-900 text-lg">{item.title}</h3>
              <p className="mt-2 text-slate-500 font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
