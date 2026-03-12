import { Input } from "@/components/ui/input";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface LoginFormProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
}

export function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground pl-1">Adresse email</label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-all duration-300 h-5 w-5" />
          <Input
            id="email"
            type="email"
            placeholder="example@domain.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-12 h-14 bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-primary/10 transition-all rounded-2xl text-sm font-bold tracking-tight shadow-inner"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Password</label>
          <button type="button" className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors focus:outline-none">
            Forgot?
          </button>
        </div>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-all duration-300 h-5 w-5" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-12 pr-12 h-14 bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-primary/10 transition-all rounded-2xl text-sm font-bold tracking-tight shadow-inner"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-primary transition-colors p-1"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
