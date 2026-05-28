export const myCollectionURLS = {
    GET_MY_COLLECTION: "/trading/my-collections",
    SELL_FRACTAL: "/trading/listings",
    GET_MY_LISTINGS: "/trading/listings/my-with-artist-info",
    ADD_TO_WATCHLIST: "/trading/watchlist",
    HOLDING_CERTIFICATE: (artistProfileId: number) =>
        `/trading/certificate/artist/${artistProfileId}`,
}