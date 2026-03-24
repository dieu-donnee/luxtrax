import { useUser, useSession } from '@clerk/react';

interface AuthState {
  user: any; // On utilise 'any' ou le type de Clerk, mais any simplifie la compatibilité existante
  session: any;
  loading: boolean;
}

export const useAuth = (): AuthState => {
  const { isLoaded: isUserLoaded, user } = useUser();
  const { isLoaded: isSessionLoaded, session } = useSession();

  return {
    user: user ? user : null,
    session: session ? session : null,
    loading: !(isUserLoaded && isSessionLoaded),
  };
};
