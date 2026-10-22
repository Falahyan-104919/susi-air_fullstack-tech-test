<template>
  <div class="logbook-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Pilot Logbook</h1>
        <p class="page-subtitle">Electronic Flight Bag (EFB) Log Records</p>
      </div>
    </div>

    <!-- Total Hours Overview -->
    <div class="hours-card">
      <span class="card-caption">Total Accumulated Logged Time</span>
      <div class="hours-num-row">
        <span class="hours-big tabular-nums">
          {{ authStore.pilot?.totalFlightHours.toFixed(1) || '0.0' }}
        </span>
        <span class="hours-unit">hours</span>
      </div>
      <span class="status-indicator">Verified by Susi Air Operations</span>
    </div>

    <!-- Coming Soon Banner -->
    <div class="placeholder-box">
      <div class="icon-circle">
        <BookOpen :size="28" />
      </div>
      <h2 class="placeholder-title">Electronic Log Submission</h2>
      <p class="placeholder-text">
        Direct logbook entry, GPS breadcrumbs, and digital captain sign-offs will be enabled in Phase 2 deployment.
      </p>
      <div class="feature-tag">Phase 2 In-Progress</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookOpen } from 'lucide-vue-next';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
</script>

<style scoped lang="scss">
.logbook-page {
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

.hours-card {
  background-color: $color-surface;
  border-radius: $radius-lg;
  border: 1px solid $color-border;
  padding: 18px 20px;
  box-shadow: $shadow-card;
  display: flex;
  flex-direction: column;
  gap: 4px;

  .card-caption {
    font-size: 12px;
    font-weight: 600;
    color: $color-slate;
  }

  .hours-num-row {
    display: flex;
    align-items: baseline;
    gap: 6px;

    .hours-big {
      font-size: 32px;
      font-weight: 800;
      color: $color-navy;
      letter-spacing: -0.02em;
    }

    .hours-unit {
      font-size: 14px;
      font-weight: 600;
      color: $color-slate;
    }
  }

  .status-indicator {
    font-size: 11px;
    font-weight: 600;
    color: #0E8560;
  }
}

.placeholder-box {
  background-color: $color-surface;
  border-radius: $radius-lg;
  border: 1px dashed rgba(14, 33, 56, 0.2);
  padding: 36px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 8px;

  .icon-circle {
    width: 56px;
    height: 56px;
    border-radius: $radius-full;
    background-color: rgba(14, 33, 56, 0.05);
    color: $color-navy;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }

  .placeholder-title {
    font-size: 15px;
    font-weight: 700;
    color: $color-navy;
    margin-bottom: 6px;
  }

  .placeholder-text {
    font-size: 13px;
    color: $color-slate;
    max-width: 320px;
    line-height: 1.5;
    margin-bottom: 16px;
  }

  .feature-tag {
    font-size: 11px;
    font-weight: 700;
    color: $color-red;
    background-color: $color-red-light;
    padding: 4px 12px;
    border-radius: $radius-full;
  }
}
</style>
