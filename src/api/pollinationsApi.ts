import axios, { AxiosInstance } from "axios"

const pollinationsBaseUrl = "https://text.pollinations.ai"

const instance: AxiosInstance = axios.create({
  baseURL: pollinationsBaseUrl,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_POLLINATIONS_API_KEY}`, // ✅ secure environment variable
  },
})

export default instance
