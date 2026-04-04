import React, { useState } from 'react';
import { SignUp } from '@clerk/react';
import { Layers, Sparkles, Car, Wrench } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';
import styles from './Auth.module.css';

type UserRole = 'client' | 'provider';

const SignUpPage = () => {
  usePageMeta(
    'Inscription | Luxtrax',
    'Cree ton compte Luxtrax pour reserver ton lavage auto a domicile ou devenir prestataire.',
  );

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  if (!selectedRole) {
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
          <h1 className={styles.title}>Tu es ici pour quoi ?</h1>
          <p className={styles.subtitle}>
            Dis-nous qui tu es pour qu&apos;on te prepare la meilleure experience.
          </p>
        </section>

        <section className={styles.authPanel}>
          <div className={styles.rolePickerContainer}>
            <h2 className={styles.rolePickerTitle}>Choisis ton profil</h2>
            <div className={styles.roleCards}>
              <button
                className={styles.roleCard}
                onClick={() => setSelectedRole('client')}
              >
                <div className={styles.roleIconWrapper}>
                  <Car size={28} />
                </div>
                <strong>Je suis client</strong>
                <p>Je veux reserver un lavage pour mon vehicule.</p>
              </button>

              <button
                className={styles.roleCard}
                onClick={() => setSelectedRole('provider')}
              >
                <div className={`${styles.roleIconWrapper} ${styles.roleIconProvider}`}>
                  <Wrench size={28} />
                </div>
                <strong>Je suis prestataire</strong>
                <p>Je veux proposer mes services de lavage auto.</p>
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const infoBullets = selectedRole === 'client'
    ? [
        'Reservation rapide, sans parcours complique',
        'Reservation simple depuis ton telephone',
        'Support dispo si tu bloques a une etape',
      ]
    : [
        'Recois des missions de lavage pres de chez toi',
        'Gere ton planning en toute liberte',
        'Suis tes gains directement depuis ton espace',
      ];

  return (
    <div className={styles.authContainer}>
      <section className={styles.infoPanel}>
        <div className={styles.logoWrapper}>
          <Layers className={styles.logoIcon} size={30} strokeWidth={2.3} />
        </div>
        <span className={styles.badge}>
          <Sparkles size={14} />
          {selectedRole === 'client' ? 'Espace Client' : 'Espace Prestataire'}
        </span>
        <h1 className={styles.title}>
          {selectedRole === 'client'
            ? 'Cree ton compte et reserve ton premier lavage.'
            : 'Rejoins l\'equipe et commence a gagner.'}
        </h1>
        <p className={styles.subtitle}>
          {selectedRole === 'client'
            ? 'On te demande juste l\'essentiel. Ensuite, tu peux reserver tranquille.'
            : 'Inscris-toi et on te met en relation avec des clients de ta zone.'}
        </p>
        <div className={styles.bullets}>
          {infoBullets.map((b, i) => <p key={i}>{b}</p>)}
        </div>
        <button className={styles.changeRoleBtn} onClick={() => setSelectedRole(null)}>
          ← Changer de profil
        </button>
      </section>

      <section className={styles.authPanel}>
        <SignUp
          routing="path"
          path="/signup"
          signInUrl="/auth"
          unsafeMetadata={{ role: selectedRole }}
        />
      </section>
    </div>
  );
};

export default SignUpPage;
