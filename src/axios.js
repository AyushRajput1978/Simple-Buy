import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
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
    if (error.response && error.response.status === 401) {
      // localStorage.clear();
      const allCookies = Cookies.get(); // Retrieve all cookies
      Object.keys(allCookies).forEach((cookieName) => {
        Cookies.remove(cookieName); // Remove each cookie
      });
      window.location.href = "/";
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
