import instance from "@/utils/apiCalls";
import { ARTIST_URLS } from "./artistUrls";

export const applyAsArtist = (data: any) => async () => {
    try {
        const response = await instance.post(ARTIST_URLS.CREATE_ARTIST, data);
        console.log({ response, data });
        return response;
    } catch (err: any) {
        console.log({ err });
        throw err;
    }
}
