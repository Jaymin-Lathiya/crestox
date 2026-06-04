import { create } from 'zustand';
import { getProfile } from '@/apis/user/userActions';
import { getCookie } from '@/utils/cookieUtils';
import {
    clearArtistProfileIdStorage,
    syncArtistProfileIdFromProfile,
} from '@/utils/artistProfileStorage';

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
    artist_profile_id?: number | null;
    artist_profile_approved?: boolean;
    artist_onboarding_last_completed_step?: number | null;
}

interface UserState {
    user: User | null;
    /** A profile fetch is currently in flight. */
    isLoading: boolean;
    /** A `token` cookie is present (auth credential exists), regardless of whether the profile has loaded. */
    isLoggedIn: boolean;
    /** The first profile-fetch attempt has settled (resolved, errored, or skipped because there was no token). */
    isInitialized: boolean;
    error: string | null;
    fetchProfile: () => Promise<User | null>;
    /** Read the token cookie and load the profile if present. Drives the global auth/loading state. */
    initialize: () => Promise<void>;
    clearUser: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
    user: null,
    isLoading: false,
    isLoggedIn: false,
    isInitialized: false,
    error: null,

    fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
            const getProfileAction = getProfile();
            const response = await getProfileAction();

            // Assuming response.data.data or similar contains the structured user. Adjust based on your backend response structure.
            const userData = response?.data?.data || response?.data;
            syncArtistProfileIdFromProfile(userData?.artist_profile_id);
            set({ user: userData, isLoading: false, isLoggedIn: true });
            return userData ?? null;
        } catch (err: any) {
            console.error(err);
            set({ error: err?.response?.data?.message || err.message || 'Failed to fetch user profile', isLoading: false });
            return null;
        }
    },

    initialize: async () => {
        const token = getCookie('token');
        if (token === undefined || token === '') {
            // No credential: definitively logged out.
            set({ isLoggedIn: false, user: null, isLoading: false, isInitialized: true });
            return;
        }
        // Credential present: mark as logged in immediately so the UI can show a skeleton
        // (instead of the signed-out state) while the profile request is in flight.
        set({ isLoggedIn: true });
        await get().fetchProfile();
        set({ isInitialized: true });
    },

    clearUser: () => {
        clearArtistProfileIdStorage();
        set({ user: null, error: null, isLoggedIn: false, isInitialized: true });
    },
}));
