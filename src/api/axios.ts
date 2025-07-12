import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://reqres.in/api',
});

instance.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('token');
  // Add Bearer token if available
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // API key by reqres
  config.headers['x-api-key'] = 'reqres-free-v1';

  return config;
});

export default instance;