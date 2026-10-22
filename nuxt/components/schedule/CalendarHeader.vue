<template>
  <div class="calendar-header">
    <div class="month-selector">
      <button
        type="button"
        class="nav-btn"
        title="Previous Month"
        @click="$emit('prev')"
      >
        <ChevronLeft :size="18" />
      </button>

      <div class="current-month-display">
        <h2 class="month-title">{{ monthLabel }} {{ year }}</h2>
      </div>

      <button
        type="button"
        class="nav-btn"
        title="Next Month"
        @click="$emit('next')"
      >
        <ChevronRight :size="18" />
      </button>
    </div>

    <button
      type="button"
      class="today-btn"
      @click="$emit('today')"
    >
      Today
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

const props = defineProps<{
  year: string;
  month: string;
}>();

defineEmits<{
  (e: 'prev'): void;
  (e: 'next'): void;
  (e: 'today'): void;
}>();

const monthLabel = computed(() => {
  const m = parseInt(props.month, 10);
  const names = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return names[m - 1] || props.month;
});
</script>

<style scoped lang="scss">
.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.month-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-btn {
  width: 32px;
  height: 32px;
  border-radius: $radius-full;
  background-color: $color-surface;
  border: 1px solid $color-border;
  color: $color-navy;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover {
    background-color: $color-canvas;
    border-color: rgba(14, 33, 56, 0.2);
  }
}

.current-month-display {
  .month-title {
    font-size: 16px;
    font-weight: 700;
    color: $color-navy;
    min-width: 140px;
    text-align: center;
  }
}

.today-btn {
  font-size: 12px;
  font-weight: 600;
  color: $color-navy;
  background-color: $color-surface;
  border: 1px solid $color-border;
  padding: 5px 12px;
  border-radius: $radius-full;
  transition: all 0.15s ease;

  &:hover {
    background-color: $color-canvas;
    border-color: $color-navy;
  }
}
</style>
