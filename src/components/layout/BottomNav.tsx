import React from 'react';
import { Home, User, MessageSquare, Sparkles, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import styles from './BottomNav.module.css';

const BottomNav = () => {
  const location = useLocation();

  const items = [
    { icon: <Home size={20} />, label: 'Accueil', path: '/' },
    { icon: <Calendar size={20} />, label: 'Réservations', path: '/bookings' },
    { icon: <Sparkles size={22} />, label: 'Réserver', path: '/booking', isSpecial: true },
    { icon: <MessageSquare size={20} />, label: 'Support', path: '/support' },
    { icon: <User size={20} />, label: 'Profil', path: '/profile' },
  ];

  return (
    <nav className={styles.bottomNav}>
      {items.map((item) => {
        if (item.isSpecial) {
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={styles.special}
            >
              {item.icon}
            </Link>
          );
        }
        
        return (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
          >
            {item.icon}
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
