export const ARTIST_URLS = {
    CREATE_ARTIST: "/artists",
    FEATURED_ARTISTS: "/artists/featured",
    BASIC_DETAILS: (id: number) => `/artists/${id}/basic`,
    ACHIEVEMENTS: (id: number) => `/artists/${id}/achievements`,
    HISTORY: (id: number) => `/artists/${id}/history`,
    COLLECTORS: (id: number) => `/artists/${id}/collectors`,
    PRICE_HISTORY: (id: number) => `/artists/${id}/price-history`,
}
