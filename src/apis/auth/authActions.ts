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
    try {
        const response = await instance.post(AUTH_URLS.MAGIC_LINK_VERIFY, { token: data.token });
        console.log({ response, data });

        return response;
    } catch (err: any) {
        console.log({ err });

        throw err;
    }
}

export const getToken = (data: any) => async () => {
    try {
        const response = await instance.post(AUTH_URLS.GET_TOKEN, data);
        return response;
    } catch (err: any) {
        throw err;
    }
}   
