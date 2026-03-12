
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MoveLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-6 pb-28 animate-in fade-in duration-700">
      <div className="max-w-2xl mx-auto space-y-12 pt-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="h-12 px-6 rounded-xl hover:bg-gray-50 text-[#1A1A1A] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all group"
        >
          <MoveLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Go Back
        </Button>

        <div className="space-y-6 text-center">
          <div className="inline-flex p-4 bg-primary/5 rounded-[2rem] text-primary mb-2">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-4xl font-black text-[#1A1A1A] tracking-tighter uppercase italic">Privacy Policy</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-50 shadow-2xl shadow-gray-200/20 space-y-10">
          <section className="space-y-4">
            <p className="text-sm font-bold text-gray-500 leading-relaxed italic border-l-2 border-primary/20 pl-6">
              At Luxtrax, we prioritize the protection of your personal data.
              This policy describes how we collect, use, and safeguard your information.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#1A1A1A] border-b border-gray-100 pb-2">1. Data Collection</h2>
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Provided by you</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {["Full name", "Email address", "Phone number", "Service address", "Secure payment info"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-bold text-gray-600 bg-gray-50/50 p-3 rounded-xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#1A1A1A] border-b border-gray-100 pb-2">2. Usage of Data</h2>
            <p className="text-xs font-bold text-gray-600 leading-relaxed">
              We use your information to provide bespoke car care, manage your bookings securely,
              and enhance your luxury experience through personalized offers and updates.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#1A1A1A] border-b border-gray-100 pb-2">3. Your Rights</h2>
            <p className="text-xs font-bold text-gray-600 leading-relaxed">
              You maintain full control over your data. Access, modify, or request deletion of your account
              directly through your profile settings or by contacting our concierge.
            </p>
          </section>

          <div className="pt-10 border-t border-gray-50 flex flex-col items-center gap-4">
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">Direct Inquiry</p>
            <a href="mailto:lustrax70@gmail.com" className="text-xs font-black text-primary hover:text-primary/80 transition-colors underline-offset-4 underline">
              lustrax70@gmail.com
            </a>
          </div>
        </div>

        <p className="text-center text-[9px] font-black text-gray-300 uppercase tracking-[0.4em]">
          Luxtrax &bull; Secure & Private
        </p>
      </div>
    </div>
  );
}
