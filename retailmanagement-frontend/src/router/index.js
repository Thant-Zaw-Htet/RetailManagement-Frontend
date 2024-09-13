import { createRouter, createWebHistory } from 'vue-router';
import Log from '@/view/Log.vue';
import Product from '@/view/Product.vue';
import Sale from '@/view/Sale.vue';
import Dashboard from '@/view/Dashboard.vue';
import Login from '@/view/Login.vue';
import Signup from '@/view/Signup.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/sign-up',
    name: 'Signup',
    component: Signup,
  },
  {
    path: '/',
    name: 'Home',
    component: Login,
    
  },
  {
    path: '/product',
    name: 'Product',
    component: Product,
    meta: { requiresAuth: true, allowedRoles: [2] }, // Only allow roleId 2
  },
  {
    path: '/sale',
    name: 'Sale',
    component: Sale,
    meta: { requiresAuth: true, allowedRoles: [3] }, // Only allow roleId 3
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true, allowedRoles: [1] }, // Only allow roleId 1 (manager)
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard to check for authentication and role
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('authToken');
  const user = JSON.parse(localStorage.getItem('user')) || {};

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      return next({ path: '/login' });
    }
    if (to.meta.allowedRoles && !to.meta.allowedRoles.includes(user.roleId)) {
      console.error('Access denied: insufficient permissions');
      return next({ path: '/' });
    }
  }

  next();
});



export default router;
