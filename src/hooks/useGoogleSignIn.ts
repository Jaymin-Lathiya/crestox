"use client"

import { useEffect, useCallback, useRef } from 'react';
import { strings } from '@/utils/strings';

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: {
                        client_id: string;
                        callback: (response: { credential: string }) => void;
                        auto_select?: boolean;
                        cancel_on_tap_outside?: boolean;
                    }) => void;
                    prompt: (callback?: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void;
                    renderButton: (
                        element: HTMLElement,
                        config: {
                            type?: 'standard' | 'icon';
                            theme?: 'outline' | 'filled_blue' | 'filled_black';
                            size?: 'large' | 'medium' | 'small';
                            text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
                            shape?: 'rectangular' | 'pill' | 'circle' | 'square';
                            logo_alignment?: 'left' | 'center';
                            width?: string;
                        }
                    ) => void;
                    disableAutoSelect: () => void;
                };
            };
        };
    }
}

interface UseGoogleSignInOptions {
    onSuccess: (idToken: string) => void;
    onError?: (error: string) => void;
}

export function useGoogleSignIn({ onSuccess, onError }: UseGoogleSignInOptions) {
    const isInitialized = useRef(false);
    const callbackRef = useRef(onSuccess);

    callbackRef.current = onSuccess;

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const loadGoogleScript = () => {
            if (document.getElementById('google-signin-script')) {
                initializeGoogle();
                return;
            }

            const script = document.createElement('script');
            script.id = 'google-signin-script';
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = initializeGoogle;
            script.onerror = () => {
                onError?.('Failed to load Google Sign-In');
            };
            document.head.appendChild(script);
        };

        const initializeGoogle = () => {
            if (isInitialized.current || !window.google) return;
            
            try {
                window.google.accounts.id.initialize({
                    client_id: strings.google_client_id,
                    callback: (response) => {
                        if (response.credential) {
                            callbackRef.current(response.credential);
                        } else {
                            onError?.('No credential received from Google');
                        }
                    },
                    auto_select: false,
                    cancel_on_tap_outside: true,
                });
                isInitialized.current = true;
            } catch (error) {
                console.error('Failed to initialize Google Sign-In:', error);
                onError?.('Failed to initialize Google Sign-In');
            }
        };

        loadGoogleScript();
    }, [onError]);

    const triggerGoogleSignIn = useCallback(() => {
        if (!window.google) {
            onError?.('Google Sign-In not loaded');
            return;
        }

        try {
            window.google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    const tempButton = document.createElement('div');
                    tempButton.style.display = 'none';
                    document.body.appendChild(tempButton);
                    
                    window.google?.accounts.id.renderButton(tempButton, {
                        type: 'standard',
                        size: 'large',
                    });

                    const innerButton = tempButton.querySelector('div[role="button"]') as HTMLElement;
                    if (innerButton) {
                        innerButton.click();
                    }
                    
                    setTimeout(() => {
                        document.body.removeChild(tempButton);
                    }, 100);
                }
            });
        } catch (error) {
            console.error('Error triggering Google Sign-In:', error);
            onError?.('Failed to open Google Sign-In');
        }
    }, [onError]);

    return { triggerGoogleSignIn };
}
