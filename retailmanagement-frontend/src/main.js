import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router' 


import { registerPlugins } from '@/plugins'
import '@/styles/globel.css'
import axios from 'axios'
axios.defaults.baseURL = 'https://localhost:7201';


const getToken = () => localStorage.getItem('authToken');

axios.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

const app = createApp(App)
registerPlugins(app)
app.use(router)
app.mount('#app')
