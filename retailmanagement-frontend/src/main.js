/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router' // Import the router

// Plugins
import { registerPlugins } from '@/plugins'
import '@/styles/globel.css'
import axios from 'axios'
axios.defaults.baseURL = 'https://localhost:7201';

// Create the Vue app
const app = createApp(App)

// Register plugins
registerPlugins(app)

// Use the router
app.use(router)

// Mount the app
app.mount('#app')
