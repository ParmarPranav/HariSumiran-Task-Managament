import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types';
import { MOCK_USERS } from '@/services/mock-data';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loginWithGoogle: (email?: string, name?: string) => void;
  loginAsDemo: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

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

        set({
          user: googleUser,
          isAuthenticated: true,
        });
      },

      loginAsDemo: (user: User) => {
        set({
          user,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'harisumiran-auth-session',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
