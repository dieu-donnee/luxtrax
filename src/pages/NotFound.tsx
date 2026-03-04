import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] p-6 animate-in fade-in duration-1000">
      <div className="max-w-md w-full text-center space-y-12">
        <div className="relative">
          <h1 className="text-[12rem] font-black text-gray-50 leading-none tracking-tighter select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-[#1A1A1A] uppercase tracking-tighter">Lost in Luxury?</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">The path you seek is currently unavailable.</p>
            </div>
          </div>
        </div>

        <Link to="/" className="inline-block">
          <Button className="h-16 px-10 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 transition-all duration-500 group">
            <MoveLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Concierge
          </Button>
        </Link>

        <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] pt-8">
          Luxtrax &bull; Premium Experience
        </p>
      </div>
    </div>
  );
};

export default NotFound;
