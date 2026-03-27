import React from 'react';
import { SignIn } from '@clerk/react';
import { Layers, Sparkles } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';
import styles from './Auth.module.css';

const Auth = () => {
  usePageMeta(
    'Connexion | Luxtrax',
    'Connecte-toi a ton espace Luxtrax pour suivre tes reservations et gerer ton compte.',
  );

  return (
    <div className={styles.authContainer}>
      <section className={styles.infoPanel}>
        <div className={styles.logoWrapper}>
          <Layers className={styles.logoIcon} size={30} strokeWidth={2.3} />
        </div>
        <span className={styles.badge}>
          <Sparkles size={14} />
          Ton espace Luxtrax
        </span>
        <h1 className={styles.title}>Connecte-toi et reserve ton prochain lavage sans te prendre la tete.</h1>
        <p className={styles.subtitle}>
          Tu choisis ton service, tu valides, et c&apos;est parti. Ici, tu retrouves tout au meme endroit.
        </p>
        <div className={styles.bullets}>
          <p>Regarde ou en est ta reservation en un coup d&apos;oeil</p>
          <p>Recois les infos importantes au bon moment</p>
          <p>Mets a jour ton profil en quelques clics</p>
        </div>
      </section>

      <section className={styles.authPanel}>
        <SignIn routing="path" path="/auth" signUpUrl="/signup" />
      </section>
    </div>
  );
};

export default Auth;
