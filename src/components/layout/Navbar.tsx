import React, { useEffect, useState } from 'react';
import { Layers, LogIn, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import styles from './Navbar.module.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <Layers className={styles.logoIcon} size={28} strokeWidth={2.5} />
          LustraX
        </Link>
        <div className={styles.navLinks}>
          <Link to="/" className={`${styles.link} ${location.pathname === '/' ? styles.active : ''}`}>Accueil</Link>
          <Link to="/notifications" className={`${styles.link} ${location.pathname === '/notifications' ? styles.active : ''}`}>Notifications</Link>
          
          {user ? (
            <>
              <Link to="/profile" className={`${styles.link} ${location.pathname === '/profile' ? styles.active : ''}`}>Profil</Link>
              <Link to="/support" className={`${styles.link} ${location.pathname === '/support' ? styles.active : ''}`}>Support</Link>
            </>
          ) : (
            <>
              <Link to="/support" className={`${styles.link} ${location.pathname === '/support' ? styles.active : ''}`}>Support</Link>
              <button 
                onClick={() => navigate('/auth')} 
                className={styles.link} 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }}
              >
                <LogIn size={18} />
                Se connecter
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
