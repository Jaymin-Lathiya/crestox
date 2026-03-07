export const ARTIST_URLS = {
    CREATE_ARTIST: "/artists",
    FEATURED_ARTISTS: "/artists/featured",
    BASIC_DETAILS: (id: number) => `/artists/${id}/basic`,
    ACHIEVEMENTS: (id: number) => `/artists/${id}/achievements`,
    HISTORY: (id: number) => `/artists/${id}/history`,
    COLLECTORS: (id: number) => `/artists/${id}/collectors`,
    PRICE_HISTORY: (id: number) => `/artists/${id}/price-history`,
    ARTWORKS: (id: number) => `/artwork/artist/${id}`,
    BUFFER_PRICE_OF_ARTWORK: (id: number) => `/trading/price-quote/${id}`,
    BUFFER_PRICE_QUOTE: (id: number, qty?: number) =>
        qty != null ? `/trading/price-quote/${id}?quantity=${qty}` : `/trading/price-quote/${id}`,
    COLLECT_FRACTALS: `/trading/buy`,
}
