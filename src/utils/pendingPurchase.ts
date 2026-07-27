// Tracks an in-flight Razorpay purchase across a possible full-page reload.
// Razorpay's redirect-based payment methods (UPI app hand-off, netbanking, some
// wallets) can cause the browser to fully unload and reload our page rather than
// just backgrounding the tab — any plain in-memory ref/state is wiped in that case.
// sessionStorage survives it, so callers can tell "we just came back mid-payment"
// apart from a normal fresh visit even after a hard reload.
const KEY = 'crestox:pending_purchase';
const MAX_AGE_MS = 10 * 60 * 1000;

export function markPurchasePending(artworkId: number): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ artworkId, ts: Date.now() }));
  } catch {
    // sessionStorage unavailable (private mode, etc.) — best-effort only
  }
}

export function clearPurchasePending(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

export function isPurchasePending(artworkId: number | null | undefined): boolean {
  if (typeof window === 'undefined' || artworkId == null) return false;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { artworkId: number; ts: number };
    if (parsed.artworkId !== artworkId) return false;
    if (Date.now() - parsed.ts > MAX_AGE_MS) return false;
    return true;
  } catch {
    return false;
  }
}
