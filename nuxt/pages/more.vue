<template>
  <div class="more-page">
    <div class="page-header">
      <h1 class="page-title">Settings & Profile</h1>
      <p class="page-subtitle">Pilot operations and app preferences</p>
    </div>

    <!-- Pilot Profile Card -->
    <div class="profile-card">
      <div class="avatar-large">
        <img
          v-if="authStore.pilot?.avatarUrl"
          :src="authStore.pilot.avatarUrl"
          :alt="authStore.pilot.name"
          class="avatar-img"
        />
        <span v-else class="avatar-fallback">{{ pilotInitials }}</span>
      </div>

      <div class="profile-info">
        <h2 class="pilot-name">{{ authStore.pilot?.name || 'Pilot' }}</h2>
        <span class="pilot-role">Line Pilot • Susi Air Fleet</span>
        <div class="hours-tag">
          <span class="hours-val tabular-nums">{{ authStore.pilot?.totalFlightHours.toFixed(1) || '0.0' }}</span>
          <span class="hours-lbl">Total Hours</span>
        </div>
      </div>
    </div>

    <!-- App Information Card -->
    <div class="info-card">
      <div class="info-row">
        <span class="label">Compliance Engine</span>
        <span class="val">CASR Part 135 / 121</span>
      </div>
      <div class="info-row">
        <span class="label">Reference Date</span>
        <span class="val highlight">15 May 2026</span>
      </div>
      <div class="info-row">
        <span class="label">Software Version</span>
        <span class="val">v1.0.0</span>
      </div>
      <div class="info-row">
        <span class="label">Carrier</span>
        <span class="val">PT ASI Pudjiastuti Aviation</span>
      </div>
    </div>

    <!-- Sign Out Button -->
    <button
      type="button"
      class="logout-button"
      @click="handleLogout"
    >
      <LogOut :size="18" />
      <span>Sign Out</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { LogOut } from 'lucide-vue-next';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

const pilotInitials = computed(() => {
  if (!authStore.pilot?.name) return 'P';
  return authStore.pilot.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
});

function handleLogout() {
  authStore.logout();
}
</script>

<style scoped lang="scss">
.more-page {
  padding: 16px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  .page-title {
    font-size: 20px;
    font-weight: 800;
    color: $color-navy;
    letter-spacing: -0.02em;
    margin-bottom: 2px;
  }

  .page-subtitle {
    font-size: 12px;
    color: $color-slate;
  }
}

.profile-card {
  background-color: $color-surface;
  border-radius: $radius-lg;
  border: 1px solid $color-border;
  padding: 20px;
  box-shadow: $shadow-card;
  display: flex;
  align-items: center;
  gap: 16px;

  .avatar-large {
    width: 56px;
    height: 56px;
    border-radius: $radius-full;
    background-color: $color-navy;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 700;
    overflow: hidden;
    flex-shrink: 0;

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .profile-info {
    display: flex;
    flex-direction: column;
    gap: 2px;

    .pilot-name {
      font-size: 16px;
      font-weight: 700;
      color: $color-navy;
    }

    .pilot-role {
      font-size: 12px;
      color: $color-slate;
    }

    .hours-tag {
      display: inline-flex;
      align-items: baseline;
      gap: 4px;
      margin-top: 4px;

      .hours-val {
        font-size: 14px;
        font-weight: 800;
        color: $color-red;
      }

      .hours-lbl {
        font-size: 11px;
        font-weight: 600;
        color: $color-slate;
      }
    }
  }
}

.info-card {
  background-color: $color-surface;
  border-radius: $radius-lg;
  border: 1px solid $color-border;
  padding: 16px;
  box-shadow: $shadow-card;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .info-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;

    .label {
      color: $color-slate;
    }

    .val {
      font-weight: 600;
      color: $color-navy;

      &.highlight {
        color: $color-red;
        font-weight: 700;
      }
    }
  }
}

.logout-button {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 46px;
  border-radius: $radius-full;
  background-color: #FFF5F6;
  border: 1px solid rgba(230, 55, 87, 0.3);
  color: $color-danger;
  font-size: 14px;
  font-weight: 700;
  transition: all 0.15s ease-in-out;

  &:hover {
    background-color: $color-danger;
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(230, 55, 87, 0.2);
  }
}
</style>
