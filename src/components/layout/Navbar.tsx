import React from 'react';
import { Bell, Layers, LogIn, Sparkles } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Show, UserButton } from '@clerk/react';
import styles from './Navbar.module.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <Layers className={styles.logoIcon} size={28} strokeWidth={2.5} />
          <div className={styles.logoText}>
            <span className={styles.logoName}>Luxtrax</span>
            <span className={styles.logoTag}>Lavage auto a domicile</span>
          </div>
        </Link>
        <div className={styles.navLinks}>
          <Link to="/" className={`${styles.link} ${isActive('/') ? styles.active : ''}`}>
            Accueil
          </Link>
          <Link to="/bookings" className={`${styles.link} ${isActive('/bookings') ? styles.active : ''}`}>
            Reservations
          </Link>
          <Link to="/notifications" className={`${styles.link} ${isActive('/notifications') ? styles.active : ''}`}>
            Notifications
          </Link>
          <Link to="/support" className={`${styles.link} ${isActive('/support') ? styles.active : ''}`}>
            Assistance
          </Link>

          <Show when="signed-in">
            <Link to="/profile" className={`${styles.link} ${isActive('/profile') ? styles.active : ''}`}>
              Profil
            </Link>
            <Link to="/notifications" className={styles.utilityPill}>
              <Bell size={16} />
              Suivi
            </Link>
            <div style={{ marginLeft: '0.5rem', display: 'flex', alignItems: 'center' }}>
              <UserButton />
            </div>
          </Show>
          
          <Show when="signed-out">
            <button
              onClick={() => navigate('/auth')}
              className={styles.loginBtn}
            >
              <Sparkles size={16} />
              <LogIn size={18} />
              Se connecter
            </button>
          </Show>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
