export const ARTWORK_URLS = {
    PRICE_APPROVAL_GET: (token: string) =>
        `/artwork/price-approval/${encodeURIComponent(token)}`,
    PRICE_APPROVAL_RESPOND: (token: string) =>
        `/artwork/price-approval/${encodeURIComponent(token)}/respond`,
};
