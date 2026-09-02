import axios from "axios";

const api = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("access_token") || localStorage.getItem("token");
    if (!token) {
      token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtb25pa2FAZXhhbXBsZS5jb20iLCJleHAiOjE4MTk4MDc1NzZ9.1ZetbSt7dw3UVDMDBM0Uty3a36VLGzE-eDUN6se_bfc";
      localStorage.setItem("access_token", token);
    }

    if (token) {
      if (config.headers && config.headers.set) {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Save / remove authentication token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("access_token", token);
  } else {
    localStorage.removeItem("access_token");
  }
};

// Dashboard
export const getDashboardReport = async () => {
  const response = await api.get("/reports");
  return response.data;
};

// Content Analytics - GET /reports/content
export const getContentReport = async () => {
  const response = await api.get("/reports/content");
  return response.data;
};

// Audience Analytics
export const getAudienceReport = async () => {
  const response = await api.get("/reports/audience");
  return response.data;
};

// Revenue
export const getRevenueReport = async () => {
  const response = await api.get("/reports/revenue");
  return response.data;
};

// Growth & Trends
export const getGrowthReport = async () => {
  const response = await api.get("/reports/growth");
  return response.data;
};

// Platform Comparison
export const getPlatformReport = async () => {
  const response = await api.get("/reports/platforms");
  return response.data;
};

// Notifications
export const getNotifications = async () => {
  const response = await api.get("/notifications");
  return response.data;
};

export const markNotificationAsRead = async (id) => {
  const response = await api.put(`/notifications/${id}`, { is_read: true });
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await api.put("/notifications/mark-all-read");
  return response.data;
};

export const checkForNewAlerts = async () => {
  const response = await api.post("/notifications/check-alerts");
  return response.data;
};

// PDF Export
export const downloadPdfReport = async () => {
  const response = await api.get("/reports/export/pdf", {
    responseType: "blob",
  });
  return response.data;
};

// Excel Export
export const downloadExcelReport = async () => {
  const response = await api.get("/reports/export/excel", {
    responseType: "blob",
  });
  return response.data;
};

export default api;
