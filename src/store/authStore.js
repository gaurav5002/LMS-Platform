import { create } from 'zustand';
import { getCurrentUser, logoutUser } from '../api/auth';

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  initialCheckDone: false,

  initialize: async () => {
    try {
      set({ loading: true });
      const { data } = await getCurrentUser();
      console.log(data)
      set({ 
        user: (data.success && data.user.isVerified) ? data.user : null,
        loading: false,
        initialCheckDone: true 
      });
    } catch (error) {
      set({ 
        user: null,
        loading: false,
        initialCheckDone: true 
      });
    }
  },

  login: (userData) => set({ user: userData }),

  logout: async () => {
    try {
      await logoutUser();
      set({ user: null });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
}));

export default useAuthStore;