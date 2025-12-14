import axios from "axios";
import SummaryApi, { baseURL } from "../common/SummaryApi";

const Axios = axios.create({
    baseURL: baseURL,
    withCredentials: true // Cookies are sent automatically
});

// 1. Request Interceptor: (Optional for Cookies)
// We don't need to manually attach the token header if we use Cookies.
// Browser sends the 'accessToken' cookie automatically.
Axios.interceptors.request.use(
    async(config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 2. Response Interceptor: Handle 401 & Refresh Token
Axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async(error) => {
        let originRequest = error.config;

        // If 401 (Unauthorized) and we haven't retried yet
        if (error.response && error.response.status === 401 && !originRequest.retry) {
            originRequest.retry = true;

            try {
                // Call the Refresh Endpoint
                // We use withCredentials: true so the browser sends the 'refreshToken' cookie
                const response = await axios({
                    ...SummaryApi.refreshToken, 
                    baseURL: baseURL,
                    withCredentials: true 
                });

                // If successful, the Backend should have set a new 'accessToken' cookie.
                if (response.data.success) {
                    // Retry the original failed request
                    return Axios(originRequest);
                }
            } catch (refreshError) {
                // If refresh fails (e.g., refresh token expired), user is truly logged out
                console.log("Session expired:", refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default Axios;