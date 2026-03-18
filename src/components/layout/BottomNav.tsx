import React from 'react';
import { Home, Bell, User, MessageSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import styles from './BottomNav.module.css';

const BottomNav = () => {
  const location = useLocation();

  const items = [
    { icon: <Home size={20} />, label: 'Accueil', path: '/' },
    { icon: <Bell size={20} />, label: 'Notifications', path: '/notifications' },
    { icon: <User size={20} />, label: 'Profil', path: '/profile' },
    { icon: <MessageSquare size={20} />, label: 'Support', path: '/support' },
  ];

  return (
    <nav className={styles.bottomNav}>
      {items.map((item) => (
        <Link 
          key={item.path} 
          to={item.path} 
          className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNav;
