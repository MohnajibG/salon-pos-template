import axios from "axios";

const getBaseURL = () => {
  // Priorité aux variables Vercel (.env frontend)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Développement local
  if (window.location.hostname === "localhost") {
    return "http://localhost:3000/api";
  }

  // Production
  return "https://site--ankelk--dnxhn8mdblq5.code.run/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Ajout JWT automatique
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Gestion expiration token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/app";
    }

    return Promise.reject(error);
  },
);

export default api;
