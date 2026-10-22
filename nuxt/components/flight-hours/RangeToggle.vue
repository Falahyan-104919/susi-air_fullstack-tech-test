<template>
  <div class="range-toggle-group">
    <button
      v-for="opt in ranges"
      :key="opt.value"
      type="button"
      class="range-btn"
      :class="{ active: modelValue === opt.value }"
      @click="$emit('update:modelValue', opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { SummaryRange } from '~/types';

defineProps<{
  modelValue: SummaryRange;
}>();

defineEmits<{
  (e: 'update:modelValue', value: SummaryRange): void;
}>();

interface RangeOption {
  label: string;
  value: SummaryRange;
}

const ranges: RangeOption[] = [
  { label: '1W', value: '1w' },
  { label: '1M', value: '1m' },
  { label: '3M', value: '3m' },
  { label: '6M', value: '6m' },
  { label: '1Y', value: '1y' },
];
</script>

<style scoped lang="scss">
.range-toggle-group {
  display: inline-flex;
  background-color: $color-canvas;
  border: 1px solid $color-border;
  border-radius: $radius-full;
  padding: 3px;
  gap: 2px;
}

.range-btn {
  padding: 5px 12px;
  border-radius: $radius-full;
  font-size: 11px;
  font-weight: 700;
  color: $color-slate;
  transition: all 0.15s ease-in-out;

  &:hover {
    color: $color-navy;
  }

  &.active {
    background-color: $color-navy;
    color: #ffffff;
    box-shadow: 0 1px 3px rgba(14, 33, 56, 0.15);
  }
}
</style>
