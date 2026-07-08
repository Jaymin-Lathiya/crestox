"use client"

import { useCallback } from 'react';
import { strings } from '@/utils/strings';

interface UseGoogleSignInOptions {
    intent: 'login' | 'signup';
    userType?: string;
}

/**
 * Google OAuth implicit flow.
 * Redirects the current window to Google sign-in.
 * After authentication, Google redirects to /auth/google/callback
 * with the id_token in the URL hash fragment.
 * The callback page handles the rest (backend call, cookie, redirect).
 */
export function useGoogleSignIn({ intent, userType }: UseGoogleSignInOptions) {
    const triggerGoogleSignIn = useCallback(() => {
        const redirectUri = `${window.location.origin}/auth/google/callback`;
        const nonce = crypto.randomUUID();
        const state = btoa(JSON.stringify({ intent, userType: userType || null, nonce }));

        const params = new URLSearchParams({
            client_id: strings.google_client_id,
            redirect_uri: redirectUri,
            response_type: 'id_token',
            scope: 'openid email profile',
            nonce,
            prompt: 'select_account',
            state,
        });

        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    }, [intent, userType]);

    return { triggerGoogleSignIn };
}
