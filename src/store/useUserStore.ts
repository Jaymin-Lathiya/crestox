import { create } from 'zustand';
import { getProfile } from '@/apis/user/userActions';

export interface User {
    id: number;
    name: string;
    email: string;
    phoneNumber: string | null;
    emailVerified: boolean;
    activeFlag: boolean;
    createdAt: string;
    updatedAt: string;
    roles: string[];
    permissions: string[];
    isAdmin: boolean;
}

interface UserState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    fetchProfile: () => Promise<void>;
    clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    isLoading: false,
    error: null,

    fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
            const getProfileAction = getProfile();
            const response = await getProfileAction();

            // Assuming response.data.data or similar contains the structured user. Adjust based on your backend response structure.
            const userData = response?.data?.data || response?.data;
            set({ user: userData, isLoading: false });
        } catch (err: any) {
            console.error(err);
            set({ error: err?.response?.data?.message || err.message || 'Failed to fetch user profile', isLoading: false });
        }
    },

    clearUser: () => set({ user: null, error: null }),
}));
