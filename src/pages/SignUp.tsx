import React from 'react';
import { SignUp } from '@clerk/react';
import { Layers, Sparkles } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';
import styles from './Auth.module.css';

const SignUpPage = () => {
  usePageMeta(
    'Inscription | Luxtrax',
    'Cree ton compte Luxtrax pour reserver ton lavage auto a domicile et suivre tes prestations.',
  );

  return (
    <div className={styles.authContainer}>
      <section className={styles.infoPanel}>
        <div className={styles.logoWrapper}>
          <Layers className={styles.logoIcon} size={30} strokeWidth={2.3} />
        </div>
        <span className={styles.badge}>
          <Sparkles size={14} />
          Bienvenue chez Luxtrax
        </span>
        <h1 className={styles.title}>Cree ton compte et reserve ton premier lavage en quelques minutes.</h1>
        <p className={styles.subtitle}>
          On te demande juste l&apos;essentiel. Ensuite, tu peux reserver tranquille et suivre tout simplement.
        </p>
        <div className={styles.bullets}>
          <p>Inscription rapide, sans parcours complique</p>
          <p>Reservation simple depuis ton telephone</p>
          <p>Support dispo si tu bloques a une etape</p>
        </div>
      </section>

      <section className={styles.authPanel}>
        <SignUp routing="path" path="/signup" signInUrl="/auth" />
      </section>
    </div>
  );
};

export default SignUpPage;
