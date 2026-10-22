<template>
  <div class="app-viewport">
    <div class="mobile-frame">
      <LayoutAppHeader
        v-if="showChrome"
        :pilot="authStore.pilot"
      />
      <main class="page-content" :class="{ 'with-nav': showChrome }">
        <slot />
      </main>
      <LayoutBottomNav v-if="showChrome" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '~/stores/auth';

const route = useRoute();
const authStore = useAuthStore();

// Hide header and bottom navigation on login page
const showChrome = computed(() => {
  return authStore.isAuthenticated && route.path !== '/login';
});

onMounted(() => {
  if (authStore.isAuthenticated && !authStore.pilot) {
    authStore.fetchProfile();
  }
});
</script>

<style scoped lang="scss">
.app-viewport {
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: $color-staging;

  @include mobile-only {
    background-color: $color-canvas;
  }
}

.mobile-frame {
  width: 100%;
  max-width: 480px;
  min-height: 100dvh;
  background-color: $color-canvas;
  position: relative;
  box-shadow: $shadow-shell;
  display: flex;
  flex-direction: column;

  @include mobile-only {
    box-shadow: none;
    max-width: 100%;
  }
}

.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;

  &.with-nav {
    // Content flows above the sticky bottom navigation
    min-height: calc(100dvh - 56px - 60px);
  }
}
</style>
