import axios, { type AxiosAdapter } from "axios";
import { strings } from "./strings";
import { clearCookie, getCookie } from "./cookieUtils";

const baseUrl = strings.base_url ?? "";
const instance = axios.create({ baseURL: baseUrl });

const token = "token";

// ---------------------------------------------------------------------------
// Concurrent-request de-duplication (idempotent GETs only).
//
// If two identical GET requests are in flight at the same time, they share a
// single network request instead of each hitting the API. This eliminates the
// duplicate calls seen when:
//   - React StrictMode double-invokes effects in dev,
//   - the same data is fetched from more than one component, or
//   - a component re-mounts before its first request settles.
//
// Only GETs are deduped (they're safe to share), and the entry is dropped the
// moment the request settles — so sequential calls and refetches still hit the
// network and data freshness is never affected.
// ---------------------------------------------------------------------------
const inFlightGets = new Map<string, Promise<any>>();
const baseAdapter = axios.getAdapter(instance.defaults.adapter ?? axios.defaults.adapter);

const dedupingAdapter: AxiosAdapter = (config) => {
    const method = (config.method ?? "get").toLowerCase();
    if (method !== "get") {
        return baseAdapter(config);
    }

    // Key on everything that distinguishes one GET's result from another,
    // including the auth header so logged-in / logged-out responses never mix.
    const key = [
        config.baseURL ?? "",
        config.url ?? "",
        JSON.stringify(config.params ?? {}),
        config.headers?.["Authorization"] ?? "",
    ].join("|");

    const existing = inFlightGets.get(key);
    if (existing) {
        return existing;
    }

    const request = baseAdapter(config).finally(() => {
        inFlightGets.delete(key);
    });
    inFlightGets.set(key, request);
    return request;
};

instance.defaults.adapter = dedupingAdapter;

function isNgrokApiBase(): boolean {
    return typeof baseUrl === "string" && baseUrl.toLowerCase().includes("ngrok");
}

instance.interceptors.request.use(
    (config: any) => {
        // Ngrok Free shows an HTML warning page to browsers unless this header is set.
        // Only needed when NEXT_PUBLIC_BASE_URL points at an ngrok tunnel.
        if (isNgrokApiBase()) {
            config.headers["ngrok-skip-browser-warning"] = "true";
        }
        const accessToken = getCookie(token);
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        if (config.headers["Content-Type"]) {
            config.headers["Content-Type"] = "multipart/form-data";
        }
        return config;
    },
    (error) => Promise.reject(error)
);

instance.interceptors.response.use((response) => {
    return response;
}, (error) => {
    console.log(error);
    if (error.response?.status === 401 && error.config?.url !== "/auth/login") {
        // clearCookie(token);
        // localStorage.removeItem(USER_DETAILS);
        // window.location.href = "/";
    }
    return Promise.reject(error);
});

export default instance;