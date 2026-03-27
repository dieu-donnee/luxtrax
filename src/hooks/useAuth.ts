import { useSession, useUser } from '@clerk/react';

type ClerkUser = ReturnType<typeof useUser>['user'];
type ClerkSession = ReturnType<typeof useSession>['session'];

interface AuthState {
  user: ClerkUser | null;
  session: ClerkSession | null;
  loading: boolean;
}

export const useAuth = (): AuthState => {
  const { isLoaded: isUserLoaded, user } = useUser();
  const { isLoaded: isSessionLoaded, session } = useSession();

  return {
    user: user ?? null,
    session: session ?? null,
    loading: !(isUserLoaded && isSessionLoaded),
  };
};
