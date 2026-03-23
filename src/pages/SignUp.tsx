import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Layers } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import styles from './Auth.module.css';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        if (data.session) {
          toast.success("Inscription réussie !");
          navigate('/');
        } else {
          toast.success("Inscription réussie ! Veuillez vérifier votre email pour activer votre compte.");
          navigate('/auth');
        }
      }
    } catch (error: any) {
      console.error('[SignUp]', error.code, error.message);
      toast.error("Une erreur est survenue lors de l'inscription. Réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'inscription Google");
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.logoWrapper}>
          <Layers className={styles.logoIcon} size={32} strokeWidth={2.5} />
        </div>
        
        <h1 className={styles.title}>Créer un compte</h1>
        <p className={styles.subtitle}>Rejoignez-nous pour commencer sur LustraX</p>

        <Button variant="outline" onClick={handleGoogleLogin}>
          <img 
            src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" 
            alt="Google" 
            width="18" 
            height="18" 
          />
          Continuer avec Google
        </Button>

        <div className={styles.divider}>ou</div>

        <form className={styles.form} onSubmit={handleSignUp}>
          <Input 
            type="text" 
            placeholder="Nom complet" 
            icon={<User size={18} />}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoComplete="name"
          />

          <Input 
            type="email" 
            placeholder="Adresse email" 
            icon={<Mail size={18} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <Input 
            type={showPassword ? "text" : "password"} 
            placeholder="Mot de passe" 
            icon={<Lock size={18} />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            rightAction={
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            required
            autoComplete="new-password"
          />

          <Input 
            type={showPassword ? "text" : "password"} 
            placeholder="Confirmer le mot de passe" 
            icon={<Lock size={18} />}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          <Button type="submit" disabled={isSubmitting} style={{ marginTop: '1rem' }}>
            {isSubmitting ? "Création..." : "S'inscrire"}
          </Button>
        </form>

        <p className={styles.footer}>
          Vous avez déjà un compte ? 
          <Link to="/auth" className={styles.signupLink}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
