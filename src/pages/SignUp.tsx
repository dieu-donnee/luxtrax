import React from 'react';
import { SignUp } from '@clerk/react';
import styles from './Auth.module.css';

import { Layers } from 'lucide-react';

const SignUpPage = () => {
  return (
    <div className={styles.authContainer}>
      <div className={styles.logoWrapper}>
        <Layers className={styles.logoIcon} size={32} strokeWidth={2.5} />
      </div>
      <SignUp routing="path" path="/signup" signInUrl="/auth" />
    </div>
  );
};

export default SignUpPage;
