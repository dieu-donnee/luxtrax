import React from 'react';
import { SignIn } from '@clerk/react';
import styles from './Auth.module.css';

import { Layers } from 'lucide-react';

const Auth = () => {
  return (
    <div className={styles.authContainer}>
      <div className={styles.logoWrapper}>
        <Layers className={styles.logoIcon} size={32} strokeWidth={2.5} />
      </div>
      <SignIn routing="path" path="/auth" signUpUrl="/signup" />
    </div>
  );
};

export default Auth;
