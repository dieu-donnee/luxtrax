import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function GoogleAuth() {
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: error?.message || "An error occurred with Google login. Please try again."
      });
    }
  };
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full h-14 flex items-center justify-center gap-4 bg-white border-gray-100 hover:border-primary/20 hover:bg-primary/5 transition-all duration-500 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-gray-200/20 group"
      onClick={handleGoogleSignIn}>

      <svg
        className="h-5 w-5 group-hover:scale-110 transition-transform"
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 488 512">
        <path
          fill="#4285F4"
          d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z">
        </path>
      </svg>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]">Continue with Google</span>
    </Button>
  );
}