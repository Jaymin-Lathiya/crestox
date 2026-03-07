import instance from "@/utils/apiCalls";
import { ARTWORK_URLS } from "./artworkUrls";

export const createArtwork = (data: any) => async () => {
    try {
        const response = await instance.post(ARTWORK_URLS.CREATE_ARTWORK, data);
        console.log({ response, data });
        return response;
    } catch (err: any) {
        console.log({ err });
        throw err;
    }
}
