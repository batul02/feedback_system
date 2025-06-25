import axios from "axios";

const API_BASE_URL = "https://feedback-system-1l45.onrender.com/"; // Change to your backend URL

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}
