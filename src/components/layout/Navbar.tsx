import React from 'react';
import { Layers } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <Layers className={styles.logoIcon} size={28} strokeWidth={2.5} />
          LustraX
        </Link>
        <div className={styles.navLinks}>
          <Link to="/" className={`${styles.link} ${location.pathname === '/' ? styles.active : ''}`}>Accueil</Link>
          <Link to="/bookings" className={styles.link}>Réservations</Link>
          <Link to="/profile" className={styles.link}>Profil</Link>
          <Link to="/support" className={styles.link}>Support</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
