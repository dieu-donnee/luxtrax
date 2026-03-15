import React from 'react';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import styles from './MainLayout.module.css';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.mainLayout}>
      <Navbar />
      <main className={styles.content}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default MainLayout;
