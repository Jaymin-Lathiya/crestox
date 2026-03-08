import instance from "@/utils/apiCalls";
import { ARTWORK_URLS } from "./artworkUrls";

export const createArtwork = (data: any) => async () => {
    try {
        const response = await instance.post(ARTWORK_URLS.CREATE_ARTWORK, data);
        return response;
    } catch (err: any) {
        console.log({ err });
        throw err;
    }
}

export const getArtworkById = (id: string) => async () => {
    try {
        const response = await instance.get(ARTWORK_URLS.GET_ARTWORK_BY_ID.replace(":id", id));
        return response;
    } catch (err: any) {
        console.log({ err });
        throw err;
    }
}

export const getArtworksByArtist = (artistProfileId: string) => async () => {
    try {
        const response = await instance.get(ARTWORK_URLS.GET_ATWORKS_BY_ARTIST.replace("{artistProfileId}", artistProfileId));
        return response;
    } catch (err: any) {
        console.log({ err });
        throw err;
    }
}

export const getPriceHistory = (artworkId: string, params?: any) => async () => {
    try {
        const response = await instance.get(ARTWORK_URLS.GET_PRICE_HISTORY.replace("{id}", artworkId), { params });
        return response;
    } catch (err: any) {
        console.log({ err });
        throw err;
    }
}