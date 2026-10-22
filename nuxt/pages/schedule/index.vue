<template>
  <div class="schedule-page">
    <div class="page-header">
      <div>
        <div class="title-row">
          <h1 class="page-title">Duty Roster</h1>
          <span class="ref-badge">May 2026</span>
        </div>
        <p class="page-subtitle">Monthly flight assignments & duty logs</p>
      </div>

      <button
        type="button"
        class="refresh-btn"
        title="Refresh roster"
        :disabled="scheduleStore.isLoading"
        @click="scheduleStore.fetchSchedules()"
      >
        <RotateCw class="refresh-icon" :class="{ spinning: scheduleStore.isLoading }" :size="16" />
      </button>
    </div>

    <!-- Error Banner -->
    <div v-if="scheduleStore.error" class="error-banner">
      <AlertCircle :size="18" />
      <span>{{ scheduleStore.error }}</span>
      <button type="button" class="retry-btn" @click="scheduleStore.fetchSchedules()">Retry</button>
    </div>

    <!-- Calendar Component Header -->
    <ScheduleCalendarHeader
      :year="scheduleStore.year"
      :month="scheduleStore.month"
      @prev="scheduleStore.prevMonth"
      @next="scheduleStore.nextMonth"
      @today="scheduleStore.setMonth(2026, 5)"
    />

    <!-- Calendar Grid with Completion Ticks -->
    <ScheduleCalendarGrid
      :year="scheduleStore.year"
      :month="scheduleStore.month"
      :entries="scheduleStore.entries"
      :today="scheduleStore.today"
    />

    <!-- Duty & Base Legend -->
    <ScheduleDutyLegend :legend="scheduleStore.legend" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { RotateCw, AlertCircle } from 'lucide-vue-next';
import { useScheduleStore } from '~/stores/schedule';

const scheduleStore = useScheduleStore();

onMounted(() => {
  scheduleStore.fetchSchedules();
});
</script>

<style scoped lang="scss">
.schedule-page {
  padding: 16px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .title-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 2px;
  }

  .page-title {
    font-size: 20px;
    font-weight: 800;
    color: $color-navy;
    letter-spacing: -0.02em;
  }

  .ref-badge {
    font-size: 11px;
    font-weight: 700;
    color: $color-red;
    background-color: $color-red-light;
    padding: 2px 8px;
    border-radius: $radius-full;
  }

  .page-subtitle {
    font-size: 12px;
    color: $color-slate;
  }

  .refresh-btn {
    padding: 8px;
    border-radius: $radius-full;
    background-color: $color-surface;
    border: 1px solid $color-border;
    color: $color-slate;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;

    &:hover:not(:disabled) {
      color: $color-navy;
      border-color: rgba(14, 33, 56, 0.2);
    }

    &:disabled {
      opacity: 0.5;
    }

    .refresh-icon.spinning {
      animation: spin 1s linear infinite;
    }
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.error-banner {
  background-color: $color-danger-bg;
  border: 1px solid rgba(230, 55, 87, 0.3);
  color: $color-danger;
  padding: 10px 14px;
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  font-weight: 600;

  .retry-btn {
    margin-left: auto;
    font-size: 11px;
    font-weight: 700;
    background-color: $color-danger;
    color: #ffffff;
    padding: 3px 8px;
    border-radius: $radius-xs;
  }
}
</style>
