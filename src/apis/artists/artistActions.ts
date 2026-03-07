import instance from "@/utils/apiCalls";
import { ARTIST_URLS } from "./artistUrls";

// --- Basic details response ---
export interface ArtistBasicDetails {
    artist_name: string;
    bio: string | null;
    location: string | null;
    university_name: string | null;
    avatar_url: string | null;
    social_media_links: { platform: string; url: string }[];
    total_fractals: number;
    available_fractals: number;
    current_share_value: number;
}

// --- Achievements response ---
export interface ArtistAchievement {
    id: number;
    title: string;
    description: string | null;
    media: { media_id: number; file_path: string; original_file_name: string } | null;
    display_order: number;
    created_at: string;
}

// --- History response ---
export interface ArtistHistory {
    id: number;
    title: string;
    description: string | null;
    media: { media_id: number; file_path: string; original_file_name: string } | null;
    display_order: number;
    created_at: string;
}

// --- Collectors response ---
export interface ArtistCollector {
    name: string;
    total_shares_held: number;
    started_holding_date: string;
}

// --- Price history response ---
export interface ArtistPriceHistory {
    current_price: number;
    history: { month: string; price: number }[];
}

export interface ArtistArtwork {
    artistProfileId: number;
}


export interface FeaturedArtist {
    artist_profile_id: number;
    artist_id: number;
    artist_name: string;
    artist_bio: string | null;
    avatar_url: string | null;
    total_fractals: number;
    available_fractals: number;
}

interface FeaturedArtistsResponse {
    success: boolean;
    data: FeaturedArtist[];
    error?: string;
    message?: string;
}

export const getFeaturedArtists = () => async (): Promise<FeaturedArtist[]> => {
    try {
        const response = await instance.get<FeaturedArtistsResponse>(ARTIST_URLS.FEATURED_ARTISTS);
        return response.data?.data ?? [];
    } catch (err: any) {
        console.error({ err });
        throw err;
    }
};

export const applyAsArtist = (data: any) => async () => {
    try {
        const response = await instance.post(ARTIST_URLS.CREATE_ARTIST, data);
        console.log({ response, data });
        return response;
    } catch (err: any) {
        console.log({ err });
        throw err;
    }
};

export const getArtistBasicDetails = (id: number) => async (): Promise<ArtistBasicDetails | null> => {
    const response = await instance.get(ARTIST_URLS.BASIC_DETAILS(id));
    return response.data?.data ?? null;
};

export const getArtistAchievements = (id: number) => async (): Promise<ArtistAchievement[]> => {
    const response = await instance.get(ARTIST_URLS.ACHIEVEMENTS(id));
    const data = response.data?.data;
    return Array.isArray(data) ? data : [];
};

export const getArtistHistory = (id: number) => async (): Promise<ArtistHistory[]> => {
    const response = await instance.get(ARTIST_URLS.HISTORY(id));
    const data = response.data?.data;
    return Array.isArray(data) ? data : [];
};

export const getArtistCollectors = (id: number) => async (): Promise<ArtistCollector[]> => {
    const response = await instance.get(ARTIST_URLS.COLLECTORS(id));
    const data = response.data?.data;
    return Array.isArray(data) ? data : [];
};

export const getArtistPriceHistory = (id: number) => async (): Promise<ArtistPriceHistory> => {
    const response = await instance.get(ARTIST_URLS.PRICE_HISTORY(id));
    return response.data?.data ?? { current_price: 0, history: [] };
}

export const getArtistArtworks = (id: number) => async (): Promise<any[]> => {
    const response = await instance.get(ARTIST_URLS.ARTWORKS(id));
    const body = response.data;
    const data = body?.data ?? body?.artworks ?? body;
    const list = Array.isArray(data) ? data : [];
    return list;
};

export const getBufferPriceOfArtwork = (id: number) => async (): Promise<number> => {
    const response = await instance.get(ARTIST_URLS.BUFFER_PRICE_OF_ARTWORK(id));
    const data = response.data?.data;
    const currentPrice = data?.current_price;
    const value = currentPrice != null ? parseFloat(String(currentPrice)) : NaN;
    return Number.isFinite(value) ? value : 0;
};

export interface BufferPriceQuote {
    current_price: number;
    buffer_percent: number | null;
}

export const getBufferPriceQuote = (artworkId: number, quantity?: number) => async (): Promise<BufferPriceQuote> => {
    const response = await instance.get(ARTIST_URLS.BUFFER_PRICE_QUOTE(artworkId, quantity));
    const data = response.data?.data;
    const currentPrice = data?.current_price;
    const price = currentPrice != null ? parseFloat(String(currentPrice)) : NaN;
    const bufferPercent = data?.buffer_percent != null ? parseFloat(String(data.buffer_percent)) : null;
    return {
        current_price: Number.isFinite(price) ? price : 0,
        buffer_percent: bufferPercent != null && Number.isFinite(bufferPercent) ? bufferPercent : null,
    };
};

export const collectFractals = (data: any) => async () => {
    const response = await instance.post(ARTIST_URLS.COLLECT_FRACTALS, data);
    return response.data?.data ?? null;
};
