import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  const isLoginPage = to.path === '/login';

  // If user is NOT authenticated and trying to access any page other than /login
  if (!authStore.isAuthenticated && !isLoginPage) {
    return navigateTo('/login');
  }

  // If user IS authenticated and visits /login or root /, redirect to /home
  if (authStore.isAuthenticated && (isLoginPage || to.path === '/')) {
    return navigateTo('/home');
  }
});
