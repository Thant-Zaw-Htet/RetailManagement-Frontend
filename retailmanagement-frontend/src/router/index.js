import { createRouter, createWebHistory } from 'vue-router';
import Log from '@/view/Log.vue'; // This is now your Home.vue component
import Product from '@/view/Product.vue';
import Sale from '@/view/Sale.vue';
import Dashboard from '@/view/Dashboard.vue';

import { components } from 'vuetify/dist/vuetify-labs.js';


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Log, // Display Home.vue on the root path
  },
  {
    path: '/product',
    name: 'Product',
    component: Product,
  },
  {
    path: '/sale',
    name: 'Sale',
    component: Sale,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard, 
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
