import instance from "@/utils/apiCalls";
import { AUTH_URLS } from "./authUrls";

export const getMagicLink = (data: any) => async () => {
    try {
        const response = await instance.post(AUTH_URLS.MAGIC_LINK_REQUEST, data);
        return response;
    } catch (err: any) {
        throw err;
    }
}

export const verifyMagicLink = (data: { token: string }) => async () => {
    return instance.post(AUTH_URLS.MAGIC_LINK_VERIFY, { token: data.token });
}

export const googleAuth = (data: {
    idToken: string;
    user_type?: string;
    intent?: 'login' | 'signup';
}) => async () => {
    try {
        const response = await instance.post(AUTH_URLS.GOOGLE_AUTH, data);
        return response;
    } catch (err: any) {
        throw err;
    }
}

export const googleAuthCode = (data: {
    code: string;
    redirect_uri: string;
    user_type?: string;
    intent?: 'login' | 'signup';
}) => async () => {
    try {
        const response = await instance.post(AUTH_URLS.GOOGLE_AUTH_CODE, data);
        return response;
    } catch (err: any) {
        throw err;
    }
}

export const passkeyRegisterOptions = () => async () => {
    try {
        const response = await instance.post(AUTH_URLS.PASSKEY_REGISTER_OPTIONS);
        return response;
    } catch (err: any) {
        throw err;
    }
}

export const passkeyRegister = (data: any) => async () => {
    try {
        const response = await instance.post(AUTH_URLS.PASSKEY_REGISTER, data);
        return response;
    } catch (err: any) {
        throw err;
    }
}

export const passkeyAuthenticateOptions = () => async () => {
    try {
        const response = await instance.post(AUTH_URLS.PASSKEY_AUTHENTICATE_OPTIONS);
        return response;
    } catch (err: any) {
        throw err;
    }
}

export const passkeyAuthenticate = (data: any) => async () => {
    try {
        const response = await instance.post(AUTH_URLS.PASSKEY_AUTHENTICATE, data);
        return response;
    } catch (err: any) {
        throw err;
    }
}

export const appleAuth = (data: {
    idToken: string;
    authorizationCode?: string;
    name?: string;
    user_type?: string;
    intent?: 'login' | 'signup';
}) => async () => {
    try {
        const response = await instance.post(AUTH_URLS.APPLE_AUTH, data);
        return response;
    } catch (err: any) {
        throw err;
    }
}
