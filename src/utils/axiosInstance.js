import axios from "axios";

const BASE_URL = "http://65.0.93.117/";
// const BASE_URL = "http://localhost:5001/";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach Bearer Token + custom headers
axiosInstance.interceptors.request.use((config) => {
  // Skip auth for specific endpoints:
  // - GET  api/organizations/list/stats  (leaderboard)
  // - POST api/organizations              (create organization)
  const url = config.url || "";
  const method = (config.method || "get").toLowerCase();

  const skipAuth =
    url.includes("api/organizations/list/stats") ||
    (url === "api/organizations" && method === "post") ||
    url.endsWith("/api/organizations/list/stats") ||
    url.endsWith("/api/organizations");

  if (!skipAuth) {
    const token = localStorage.getItem("token"); // stored after login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } else {
    // ensure Authorization header is not sent for skipped endpoints
    if (config.headers && config.headers.Authorization) {
      delete config.headers.Authorization;
    }
  }
//   axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token"); // stored after login
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   config.headers["x-user-email"] = "shubhampalpal832@gmail.com";
//   return config;
// });

//   config.headers["x-user-email"] = "shubhampalpal832@gmail.com";
  return config;
});

export default axiosInstance;
