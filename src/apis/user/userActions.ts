import instance from "@/utils/apiCalls";
import { USER_URLS } from "./userUrls";

export const getProfile = () => async () => {
    try {
        const response = await instance.get(USER_URLS.GET_PROFILE);
        return response;
    } catch (err: any) {
        throw err;
    }
}

