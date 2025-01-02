import axios from 'axios';

// URL base do backend no Render
const api = axios.create({
  baseURL: 'https://projeto-sucata.onrender.com', // Substitua pela URL do backend no Render
});

export default api;
