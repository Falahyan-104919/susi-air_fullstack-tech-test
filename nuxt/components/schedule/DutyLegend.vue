<template>
  <div class="duty-legend">
    <div class="legend-header">
      <span class="legend-title">Duty & Base Legend</span>
    </div>

    <div class="legend-chips">
      <div
        v-for="item in legend"
        :key="item.code"
        class="legend-chip"
      >
        <span
          class="color-dot"
          :style="{ backgroundColor: item.color || '#6B7280' }"
        />
        <span class="code-text">{{ item.code }}</span>
        <span class="label-text">{{ item.label }}</span>
      </div>

      <div class="legend-chip">
        <span class="tick-indicator">✓</span>
        <span class="code-text">Complete</span>
        <span class="label-text">All logs submitted</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LegendItem } from '~/types';

defineProps<{
  legend: LegendItem[];
}>();
</script>

<style scoped lang="scss">
.duty-legend {
  background-color: $color-surface;
  border-radius: $radius-lg;
  border: 1px solid $color-border;
  padding: 14px 16px;
  box-shadow: $shadow-card;
}

.legend-header {
  margin-bottom: 10px;

  .legend-title {
    font-size: 12px;
    font-weight: 700;
    color: $color-slate-dark;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
}

.legend-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
}

.legend-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;

  .color-dot {
    width: 8px;
    height: 8px;
    border-radius: $radius-full;
    flex-shrink: 0;
  }

  .tick-indicator {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    border-radius: $radius-full;
    background-color: #1FBF8F;
    color: #ffffff;
    font-size: 9px;
    font-weight: 900;
    line-height: 1;
  }

  .code-text {
    font-weight: 700;
    color: $color-navy;
  }

  .label-text {
    color: $color-slate;
  }
}
</style>
