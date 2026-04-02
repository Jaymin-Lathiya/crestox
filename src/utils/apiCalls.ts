import axios from "axios";
import { strings } from "./strings";
import { clearCookie, getCookie } from "./cookieUtils";

const baseUrl = strings.base_url ?? "";
const instance = axios.create({ baseURL: baseUrl });

const token = "token";

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