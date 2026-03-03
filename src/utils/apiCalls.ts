import axios from "axios";
import { strings } from "./strings";
import { clearCookie, getCookie } from "./cookieUtils";
const instance = axios.create({ baseURL: strings.base_url });
console.log(strings.base_url)
const token = "token"

instance.interceptors.request.use(
    (config: any) => {
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