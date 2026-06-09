"use client"

import { useEffect, useCallback, useRef } from 'react';
import { strings } from '@/utils/strings';

declare global {
    interface Window {
        AppleID?: {
            auth: {
                init: (config: {
                    clientId: string;
                    scope: string;
                    redirectURI: string;
                    state?: string;
                    nonce?: string;
                    usePopup: boolean;
                }) => void;
                signIn: () => Promise<{
                    authorization: {
                        id_token: string;
                        code: string;
                        state?: string;
                    };
                    user?: {
                        name?: {
                            firstName?: string;
                            lastName?: string;
                        };
                        email?: string;
                    };
                }>;
            };
        };
    }
}

interface UseAppleSignInOptions {
    onSuccess: (data: {
        idToken: string;
        authorizationCode: string;
        name?: string;
    }) => void;
    onError?: (error: string) => void;
}

export function useAppleSignIn({ onSuccess, onError }: UseAppleSignInOptions) {
    const isInitialized = useRef(false);
    const callbackRef = useRef(onSuccess);
    callbackRef.current = onSuccess;

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const loadAppleScript = () => {
            if (document.getElementById('apple-signin-script')) {
                initializeApple();
                return;
            }

            const script = document.createElement('script');
            script.id = 'apple-signin-script';
            script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
            script.async = true;
            script.defer = true;
            script.onload = initializeApple;
            script.onerror = () => {
                onError?.('Failed to load Apple Sign In');
            };
            document.head.appendChild(script);
        };

        const initializeApple = () => {
            if (isInitialized.current || !window.AppleID) return;

            try {
                window.AppleID.auth.init({
                    clientId: strings.apple_client_id,
                    scope: 'name email',
                    redirectURI: strings.apple_redirect_uri,
                    usePopup: true,
                });
                isInitialized.current = true;
            } catch (error) {
                console.error('Failed to initialize Apple Sign In:', error);
                onError?.('Failed to initialize Apple Sign In');
            }
        };

        loadAppleScript();
    }, [onError]);

    const triggerAppleSignIn = useCallback(async () => {
        if (!window.AppleID) {
            onError?.('Apple Sign In not loaded');
            return;
        }

        try {
            const response = await window.AppleID.auth.signIn();

            const idToken = response.authorization.id_token;
            const authorizationCode = response.authorization.code;

            let name: string | undefined;
            if (response.user?.name) {
                const { firstName, lastName } = response.user.name;
                name = [firstName, lastName].filter(Boolean).join(' ') || undefined;
            }

            callbackRef.current({ idToken, authorizationCode, name });
        } catch (error: unknown) {
            const err = error as { error?: string };
            if (err?.error === 'popup_closed_by_user') {
                return;
            }
            console.error('Error triggering Apple Sign In:', error);
            onError?.('Failed to sign in with Apple');
        }
    }, [onError]);

    return { triggerAppleSignIn };
}
