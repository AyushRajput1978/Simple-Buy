import axios from "axios";
import Cookies from "js-cookie";
import { store } from "./redux/store";
import { logout } from "./redux/reducer/authSlice";

const sessionId = localStorage.getItem("sessionId");
console.log(sessionId, "session ki id");
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  headers: {
    "x-session-id": sessionId,
  },
  params: {},
});

// Set default headers using interceptors
instance.interceptors.request.use((config) => {
  // const authToken = localStorage.getItem("authToken");
  const authToken = Cookies.get("JWT");
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

instance.show_notif = true;
instance.withCredentials = true;

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const isLoginRequest = error?.config?.url?.includes("/login");
    if (error.response && error.response.status === 401) {
      if (!isLoginRequest) {
        // localStorage.clear();
        const allCookies = Cookies.get(); // Retrieve all cookies
        Object.keys(allCookies).forEach((cookieName) => {
          Cookies.remove(cookieName); // Remove each cookie
        });
        store.dispatch(logout());
        window.location.href = "/login";
      }
    } else {
      if (instance.show_notif) {
        // showNotification({
        //   title: "Error",
        //   message: error.response
        //     ? error.response.data.message
        //     : "An error occurred",
        //   color: "red",
        //   autoClose: 5000,
        // });
        alert(
          error.response ? error.response.data.message : "An error occurred"
        );
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
