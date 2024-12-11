import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('./views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('./views/RegisterView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'Home',
      component: () => import('./views/HomeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/game',
      name: 'Game',
      component: () => import('./views/GameView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/stats',
      name: 'Stats',
      component: () => import('./views/StatsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/account',
      name: 'Account',
      component: () => import('./views/AccountView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/history/:userId',
      name: 'History',
      component: () => import('./views/HistoryView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/history/me',
      name: 'MyHistory',
      component: () => import('./views/HistoryView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/leaderboard',
      name: 'Leaderboard',
      component: () => import('./views/LeaderboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/replay/:gameId',
      name: 'Replay',
      component: () => import('./views/ReplayView.vue'),
      meta: { requiresAuth: true }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/account');
  } else {
    next();
  }
});

export default router;
