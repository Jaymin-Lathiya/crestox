export const ARTIST_PROFILE_ID_KEY = "artist_profile_id";

/** Persist artist_profile_id from a profile API response (client-only). */
export function syncArtistProfileIdFromProfile(
    artistProfileId: number | string | null | undefined,
): void {
    if (typeof window === "undefined") return;

    if (artistProfileId == null) {
        localStorage.removeItem(ARTIST_PROFILE_ID_KEY);
        return;
    }

    const id =
        typeof artistProfileId === "number"
            ? artistProfileId
            : parseInt(String(artistProfileId), 10);

    if (!Number.isNaN(id) && id > 0) {
        localStorage.setItem(ARTIST_PROFILE_ID_KEY, String(id));
    }
}

export function clearArtistProfileIdStorage(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ARTIST_PROFILE_ID_KEY);
}

export function getStoredArtistProfileId(): number | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(ARTIST_PROFILE_ID_KEY);
    if (!raw) return null;
    const id = parseInt(raw, 10);
    return !Number.isNaN(id) && id > 0 ? id : null;
}
