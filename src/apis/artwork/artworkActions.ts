import instance from "@/utils/apiCalls";
import { ARTWORK_URLS } from "./artworkUrls";

export interface FeaturedTickerArtwork {
    artwork_id: number;
    artwork_name: string;
    artist_name: string | null;
    primary_image_url: string | null;
    description: string | null;
    fractal_price: number;
    change_24h: number;
    valuation: number;
    available_shares: number;
}

export const getFeaturedArtworksForTicker = () => async (): Promise<FeaturedTickerArtwork[]> => {
    try {
        const response = await instance.get(ARTWORK_URLS.GET_FEATURED_ARTWORKS);
        const data = response.data?.data ?? response.data;
        return Array.isArray(data) ? data : [];
    } catch (err: any) {
        console.log({ err });
        throw err;
    }
};

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

/** Aggregated analytics for artwork detail (valuation series, grades, collectors, portfolio, fractal price, hold time). */
export interface ArtworkAnalyticsPayload {
    artwork_id: number;
    artist_profile_id: number;
    currency: "INR";
    valuation_history: { label: string; price: number }[];
    grade_distribution: { grade: string; count: number }[];
    unique_collectors: number;
    total_portfolio_value: number;
    fractal_price: number;
    avg_hold_days: number | null;
}

export const getArtworkAnalytics = (artworkId: string) => async () => {
    try {
        const response = await instance.get(
            ARTWORK_URLS.GET_ARTWORK_ANALYTICS.replace("{id}", artworkId),
        );
        return response;
    } catch (err: any) {
        console.log({ err });
        throw err;
    }
};