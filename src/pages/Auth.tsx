import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Layers } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import styles from './Auth.module.css';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Validation basique
  useEffect(() => {
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      setErrors(prev => ({ ...prev, email: 'Adresse email invalide' }));
    } else {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast.success("Connexion réussie !");
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la connexion");
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
      toast.error(error.message || "Erreur lors de la connexion Google");
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.logoWrapper}>
          <Layers className={styles.logoIcon} size={32} strokeWidth={2.5} />
        </div>
        
        <h1 className={styles.title}>Bon retour</h1>
        <p className={styles.subtitle}>Connectez-vous pour continuer sur LustraX</p>

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

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input 
            type="email" 
            placeholder="Adresse email" 
            icon={<Mail size={18} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
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
                aria-label={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            required
            autoComplete="current-password"
          />

          <div className={styles.formFooter}>
            <Button variant="ghost" type="button" className={styles.forgotPassword}>
              Mot de passe oublié ?
            </Button>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>

        <p className={styles.footer}>
          Pas encore de compte ? 
          <Link to="/signup" className={styles.signupLink}>S'inscrire</Link>
        </p>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <Button variant="ghost" onClick={() => navigate('/')}>
            Continuer en tant qu'invité
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
