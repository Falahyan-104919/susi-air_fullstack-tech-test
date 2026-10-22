<template>
  <nav class="bottom-nav">
    <div class="nav-container">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav-tab"
        :class="{ active: isActive(item.to) }"
      >
        <component :is="item.icon" class="tab-icon" :size="20" />
        <span class="tab-label">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { Home, Calendar, BookOpen, MoreHorizontal } from 'lucide-vue-next';
import { useRoute } from 'vue-router';

const route = useRoute();

interface NavItem {
  label: string;
  to: string;
  icon: any;
}

const navItems: NavItem[] = [
  { label: 'Home', to: '/home', icon: Home },
  { label: 'Schedule', to: '/schedule', icon: Calendar },
  { label: 'Logbook', to: '/logbook', icon: BookOpen },
  { label: 'More', to: '/more', icon: MoreHorizontal },
];

function isActive(path: string): boolean {
  if (path === '/home') {
    return route.path === '/home' || route.path === '/';
  }
  return route.path.startsWith(path);
}
</script>

<style scoped lang="scss">
.bottom-nav {
  position: sticky;
  bottom: 0;
  width: 100%;
  background-color: $color-surface;
  border-top: 1px solid $color-border;
  z-index: 50;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 60px;
  max-width: 480px;
  margin: 0 auto;
}

.nav-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  flex: 1;
  height: 100%;
  color: $color-slate;
  transition: color 0.15s ease-in-out;
  user-select: none;

  .tab-icon {
    stroke-width: 2.2;
    transition: transform 0.15s ease-in-out;
  }

  .tab-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  &:hover {
    color: $color-navy;
  }

  &.active {
    color: $color-red;

    .tab-icon {
      transform: translateY(-1px);
    }

    .tab-label {
      font-weight: 700;
    }
  }
}
</style>
