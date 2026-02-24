import { create } from 'zustand';
import { getMagicLink, verifyMagicLink, getToken } from '@/apis/auth/authActions';
import { setCookie } from '@/utils/cookieUtils';

interface AuthState {
    email: string;
    setEmail: (email: string) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    isSuccess: boolean;
    setIsSuccess: (isSuccess: boolean) => void;
    requestMagicLink: (email: string, name?: string) => Promise<void>;
    verifyMagicLinkToken: (token: string) => Promise<string | null>;
    fetchUserToken: (accessToken: string) => Promise<boolean>;
    clearStore: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    email: '',
    setEmail: (email) => set({ email }),
    isLoading: false,
    setIsLoading: (isLoading) => set({ isLoading }),
    error: null,
    setError: (error) => set({ error }),
    isSuccess: false,
    setIsSuccess: (isSuccess) => set({ isSuccess }),

    requestMagicLink: async (email: string, name?: string) => {
        set({ isLoading: true, error: null, isSuccess: false });
        try {
            const action = getMagicLink({ email, name });
            await action();
            set({ isSuccess: true });
        } catch (err: any) {
            set({ error: err?.response?.data?.message || err.message || 'Something went wrong while sending the magic link' });
        } finally {
            set({ isLoading: false });
        }
    },

    verifyMagicLinkToken: async (token: string) => {
        set({ isLoading: true, error: null, isSuccess: false });
        try {
            const verifyAction = verifyMagicLink({ token });
            const verifyResponse = await verifyAction();

            if (verifyResponse.status !== 200) {
                set({ error: verifyResponse.data.message || 'Verification failed. The link might be expired or invalid.' });
                return null;
            }

            const accessToken = verifyResponse.data.data?.accessToken

            return accessToken;
        } catch (err: any) {
            console.log(err);
            set({ error: err?.response?.data?.message || err.message || 'Verification failed. The link might be expired or invalid.' });
            return null;
        } finally {
            set({ isLoading: false });
        }
    },

    fetchUserToken: async (accessToken: string) => {
        set({ isLoading: true, error: null, isSuccess: false });
        try {
            const getTokenAction = getToken({ token: accessToken });
            const tokenResponse = await getTokenAction();
            console.log("herer", tokenResponse.status)

            console.log(tokenResponse);
            if (tokenResponse.status !== 200) {
                set({ isSuccess: false })
            } else {
                set({ isSuccess: true })
                const finalToken = tokenResponse.data.token || tokenResponse.data.data?.token || tokenResponse.data.accessToken;
                setCookie("token", finalToken, 30);
            }

            return true;
        } catch (err: any) {
            console.log(err);
            set({ error: err?.response?.data?.message || err.message || 'Verification failed. Failed to get user token.' });
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    clearStore: () => set({ email: '', isLoading: false, error: null, isSuccess: false }),
}));

