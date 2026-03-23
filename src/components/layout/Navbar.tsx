import React, { useEffect, useState } from 'react';
import { Layers, LogIn, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
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
          LustraX
        </Link>
        <div className={styles.navLinks}>
          <Link to="/" className={`${styles.link} ${isActive('/') ? styles.active : ''}`}>
            Accueil
          </Link>
          <Link to="/notifications" className={`${styles.link} ${isActive('/notifications') ? styles.active : ''}`}>
            Notifications
          </Link>

          {user ? (
            <>
              <Link to="/profile" className={`${styles.link} ${isActive('/profile') ? styles.active : ''}`}>
                Profil
              </Link>
              <Link to="/support" className={`${styles.link} ${isActive('/support') ? styles.active : ''}`}>
                Support
              </Link>
            </>
          ) : (
            <>
              <Link to="/support" className={`${styles.link} ${isActive('/support') ? styles.active : ''}`}>
                Support
              </Link>
              <button
                onClick={() => navigate('/auth')}
                className={styles.loginBtn}
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
