import instance from "@/utils/apiCalls";
import { myCollectionURLS } from "./myCollectionUrls";

export const getMyCollection = async () => {
    try {
        const response = await instance.get(myCollectionURLS.GET_MY_COLLECTION);
        return response;
    } catch (err: any) {
        throw err;
    }
}

export const sellFractal = async (data: any) => {
    try {
        const response = await instance.post(myCollectionURLS.SELL_FRACTAL, data);
        return response;
    } catch (err: any) {
        throw err;
    }
}

export const getMyListings = async () => {
    try {
        const response = await instance.get(myCollectionURLS.GET_MY_LISTINGS);
        return response;
    } catch (err: any) {
        throw err;
    }
}

export const getWatchlist = async () => {
    try {
        const response = await instance.get(myCollectionURLS.ADD_TO_WATCHLIST);
        return response;
    } catch (err: any) {
        throw err;
    }
}

export interface ToggleWatchlistResponse {
    artist_profile_id: number;
    is_in_watchlist: boolean;
    message?: string;
}

/** POST /trading/watchlist — toggles artist on the user watchlist */
export const toggleArtistWatchlist = async (data: { artist_profile_id: number }) => {
    const response = await instance.post(myCollectionURLS.ADD_TO_WATCHLIST, data);
    return (response.data?.data ?? response.data) as ToggleWatchlistResponse;
};

export const addToWatchlist = async (data: any) => {
    try {
        const response = await instance.post(myCollectionURLS.ADD_TO_WATCHLIST, data);
        return response;
    } catch (err: any) {
        throw err;
    }
}