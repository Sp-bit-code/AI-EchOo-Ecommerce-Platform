import axios from "axios";
import { supabase } from "./supabaseClient";

const AI_API_BASE_URL =
  import.meta.env.VITE_AI_API_BASE_URL ||
  "https://sparshsrivastava95111-echoo-ai-commerce-api.hf.space";

const aiClient = axios.create({
  baseURL: AI_API_BASE_URL.endsWith("/")
    ? AI_API_BASE_URL.slice(0, -1)
    : AI_API_BASE_URL,
  timeout: 90000,
  headers: {
    "Content-Type": "application/json",
  },
});

aiClient.interceptors.request.use(
  async (config) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      console.error("AI API request interceptor error:", error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

export const sendChatMessage = async ({
  message,
  userId = null,
  user = null,
  chatHistory = [],
  activeFeature = null,
}) => {
  const response = await aiClient.post("/chat", {
    message,
    user_id: userId,
    user,
    chat_history: chatHistory,
    active_feature: activeFeature,
  });

  return response.data;
};

export const resetChatbot = async () => {
  const response = await aiClient.post("/reset");
  return response.data;
};

export const checkChatbotHealth = async () => {
  const response = await aiClient.get("/health");
  return response.data;
};

export default aiClient;