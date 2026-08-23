import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types';
import { MOCK_USERS } from '@/services/mock-data';

const THREE_HOURS_MS = 3 * 60 * 60 * 1000; // 3 hours

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  sessionExpiresAt: number | null;
  loginWithGoogle: (email?: string, name?: string) => void;
  loginAsDemo: (user: User) => void;
  logout: () => void;
  checkSession: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      sessionExpiresAt: null,

      loginWithGoogle: (email = 'alex.morgan@gmail.com', name = 'Alex Morgan') => {
        const initials = name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);

        const googleUser: User = {
          id: `usr-google-${Date.now()}`,
          name,
          email,
          role: 'Workspace Owner',
          initials: initials || 'AM',
          color: '#4285F4', // Google Blue
        };

        const expiresAt = Date.now() + THREE_HOURS_MS;

        set({
          user: googleUser,
          isAuthenticated: true,
          sessionExpiresAt: expiresAt,
        });
      },

      loginAsDemo: (user: User) => {
        const expiresAt = Date.now() + THREE_HOURS_MS;
        set({
          user,
          isAuthenticated: true,
          sessionExpiresAt: expiresAt,
        });
      },

      checkSession: () => {
        const { sessionExpiresAt, isAuthenticated } = get();
        if (!isAuthenticated) return false;
        if (sessionExpiresAt && Date.now() > sessionExpiresAt) {
          set({
            user: null,
            isAuthenticated: false,
            sessionExpiresAt: null,
          });
          return false;
        }
        return true;
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          sessionExpiresAt: null,
        });
      },
    }),
    {
      name: 'harisumiran-google-auth-v3',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
