<template>
  <div class="limit-card" :class="{ exceeded: isExceeded }">
    <div class="card-header">
      <span class="card-title">{{ title }}</span>
      <span class="window-badge">{{ window }}</span>
    </div>

    <div class="card-values">
      <div class="hours-display">
        <span class="current-hours tabular-nums">{{ current.toFixed(1) }}</span>
        <span class="limit-hours tabular-nums">/ {{ limit }}h</span>
      </div>
      <span v-if="isExceeded" class="exceeded-badge">Exceeded</span>
    </div>

    <!-- Progress Bar -->
    <div class="progress-track">
      <div
        class="progress-fill"
        :class="{ exceeded: isExceeded, warning: isWarning }"
        :style="{ width: `${progressPercent}%` }"
      />
    </div>

    <div class="card-footer">
      <span class="remaining-text">
        <template v-if="isExceeded">
          <span class="over-value tabular-nums">+{{ (current - limit).toFixed(1) }}h</span> over limit
        </template>
        <template v-else>
          <span class="left-value tabular-nums">{{ (limit - current).toFixed(1) }}h</span> remaining
        </template>
      </span>
      <span class="percent-text tabular-nums">{{ Math.round(rawPercent) }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  limit: number;
  current: number;
  window: string;
  isExceeded: boolean;
}>();

const rawPercent = computed(() => {
  if (props.limit <= 0) return 0;
  return (props.current / props.limit) * 100;
});

const progressPercent = computed(() => {
  return Math.min(100, Math.max(0, rawPercent.value));
});

const isWarning = computed(() => {
  return !props.isExceeded && rawPercent.value >= 85;
});
</script>

<style scoped lang="scss">
.limit-card {
  background-color: $color-surface;
  border-radius: $radius-lg;
  border: 1px solid $color-border;
  padding: 14px 16px;
  box-shadow: $shadow-card;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.2s ease;

  &.exceeded {
    border-color: rgba(230, 55, 87, 0.4);
    background: linear-gradient(180deg, #FFFFFF 0%, #FFF5F6 100%);
    box-shadow: 0 2px 10px rgba(230, 55, 87, 0.08);
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .card-title {
    font-size: 13px;
    font-weight: 600;
    color: $color-navy;
  }

  .window-badge {
    font-size: 11px;
    font-weight: 700;
    color: $color-slate;
    background-color: $color-canvas;
    padding: 2px 6px;
    border-radius: $radius-xs;
  }
}

.card-values {
  display: flex;
  align-items: baseline;
  justify-content: space-between;

  .hours-display {
    display: flex;
    align-items: baseline;
    gap: 4px;

    .current-hours {
      font-size: 22px;
      font-weight: 800;
      color: $color-navy;
      letter-spacing: -0.02em;
    }

    .limit-hours {
      font-size: 13px;
      color: $color-slate;
      font-weight: 500;
    }
  }

  .exceeded-badge {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: $color-danger;
    background-color: $color-danger-bg;
    padding: 3px 6px;
    border-radius: $radius-xs;
  }
}

.progress-track {
  width: 100%;
  height: 6px;
  background-color: rgba(14, 33, 56, 0.06);
  border-radius: $radius-full;
  overflow: hidden;

  .progress-fill {
    height: 100%;
    background-color: $color-navy;
    border-radius: $radius-full;
    transition: width 0.3s ease-in-out;

    &.warning {
      background-color: $color-warning;
    }

    &.exceeded {
      background-color: $color-danger;
    }
  }
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;

  .remaining-text {
    color: $color-slate;

    .over-value {
      font-weight: 700;
      color: $color-danger;
    }

    .left-value {
      font-weight: 600;
      color: $color-navy;
    }
  }

  .percent-text {
    font-weight: 600;
    color: $color-slate;
  }
}
</style>
