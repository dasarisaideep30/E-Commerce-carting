// src/axiosConfig.js
import axios from 'axios';
const instance = axios.create({
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000', // your server
withCredentials: true, // crucial for sending cookies
});
export default instance;