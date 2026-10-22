<template>
  <header class="app-header">
    <div class="header-inner">
      <div class="brand">
        <img
          src="/images/susiair-logo.png"
          alt="Susi Air Logo"
          class="logo"
        />
      </div>

      <div v-if="pilot" class="pilot-chip">
        <div class="avatar">
          <img
            v-if="pilot.avatarUrl"
            :src="pilot.avatarUrl"
            :alt="pilot.name"
            class="avatar-img"
            @error="onAvatarError"
          />
          <span v-else class="avatar-fallback">{{ pilotInitials }}</span>
        </div>
        <div class="pilot-info">
          <span class="pilot-name">{{ pilot.name }}</span>
          <span class="pilot-hours">{{ pilot.totalFlightHours.toFixed(1) }} hrs</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { PilotProfile } from '~/types';

const props = defineProps<{
  pilot?: PilotProfile | null;
}>();

const avatarError = ref(false);

const pilotInitials = computed(() => {
  if (!props.pilot?.name) return 'P';
  return props.pilot.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
});

function onAvatarError() {
  avatarError.value = true;
}
</script>

<style scoped lang="scss">
.app-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background-color: $color-surface;
  border-bottom: 1px solid $color-border;
  padding-top: env(safe-area-inset-top, 0px);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  min-height: 56px;
}

.brand {
  display: flex;
  align-items: center;

  .logo {
    height: 32px;
    width: auto;
    object-fit: contain;
    display: block;
  }
}

.pilot-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: $color-canvas;
  padding: 4px 10px 4px 4px;
  border-radius: $radius-full;
  border: 1px solid $color-border;

  .avatar {
    width: 28px;
    height: 28px;
    border-radius: $radius-full;
    background-color: $color-navy;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    overflow: hidden;

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-fallback {
      line-height: 1;
    }
  }

  .pilot-info {
    display: flex;
    flex-direction: column;
    line-height: 1.1;

    .pilot-name {
      font-size: 12px;
      font-weight: 600;
      color: $color-navy;
      max-width: 110px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .pilot-hours {
      font-size: 10px;
      color: $color-slate;
      font-weight: 500;
    }
  }
}
</style>
