<template>
  <div class="day-detail-page">
    <div class="page-top-bar">
      <button
        type="button"
        class="back-btn"
        @click="goBack"
      >
        <ArrowLeft :size="18" />
        <span>Roster</span>
      </button>

      <span class="ref-badge">{{ dateParam }}</span>
    </div>

    <div class="detail-header">
      <h1 class="date-title">{{ formattedDate }}</h1>
      <p class="date-subtitle">Daily Flight Duty & Assignment Record</p>
    </div>

    <!-- Duty Card -->
    <div v-if="entry" class="duty-card">
      <div class="duty-status-header">
        <div class="base-badge" :style="{ backgroundColor: entry.base_color || '#0E2138' }">
          <Plane :size="14" />
          <span>{{ entry.base_name || 'Base' }}</span>
        </div>

        <span
          v-if="isCompleted"
          class="status-pill completed"
        >
          ✓ Completed
        </span>
        <span
          v-else-if="entry.duty_type === 'OFF'"
          class="status-pill off"
        >
          Off Duty
        </span>
        <span
          v-else
          class="status-pill in-progress"
        >
          {{ remainingDuties }} Pending Duty
        </span>
      </div>

      <div class="duty-meta-grid">
        <div class="meta-item">
          <span class="meta-label">Duty Type</span>
          <span class="meta-value">{{ entry.duty_type }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Assigned Schedules</span>
          <span class="meta-value tabular-nums">{{ entry.count_schedules }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Submitted Logbooks</span>
          <span class="meta-value tabular-nums">{{ entry.count_logbooks }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Compliance Ratio</span>
          <span class="meta-value tabular-nums">
            {{ entry.count_schedules > 0 ? Math.round((entry.count_logbooks / entry.count_schedules) * 100) : 100 }}%
          </span>
        </div>
      </div>
    </div>

    <div v-else class="empty-day-card">
      <div class="empty-icon-wrapper">
        <Clock :size="24" />
      </div>
      <h3 class="empty-title">No Duty Scheduled</h3>
      <p class="empty-desc">No operational flights assigned for this date.</p>
    </div>

    <!-- Placeholder Section for Flight Logs -->
    <div class="logs-section">
      <h2 class="section-title">Flight Logs & Legs</h2>
      <div class="flight-leg-card">
        <div class="leg-info">
          <div class="leg-route">
            <span class="airport-code">{{ entry?.base_name || 'SIQ' }}</span>
            <span class="route-arrow">→</span>
            <span class="airport-code">DEST</span>
          </div>
          <span class="aircraft-type">Pilatus Porter PC-6</span>
        </div>
        <span class="leg-badge">Roster Verified</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft, Plane, Clock } from 'lucide-vue-next';
import { useScheduleStore } from '~/stores/schedule';

const route = useRoute();
const router = useRouter();
const scheduleStore = useScheduleStore();

const dateParam = computed(() => {
  return String(route.params.date || '');
});

const entry = computed(() => {
  return scheduleStore.entries.find((e) => e.duty_date === dateParam.value);
});

const isCompleted = computed(() => {
  if (!entry.value) return false;
  return entry.value.count_schedules > 0 && entry.value.count_logbooks === entry.value.count_schedules;
});

const remainingDuties = computed(() => {
  if (!entry.value) return 0;
  return Math.max(0, entry.value.count_schedules - entry.value.count_logbooks);
});

const formattedDate = computed(() => {
  if (!dateParam.value) return '';
  const [y, m, d] = dateParam.value.split('-');
  const dateObj = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
});

function goBack() {
  router.push('/schedule');
}
</script>

<style scoped lang="scss">
.day-detail-page {
  padding: 16px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: $color-navy;
    background-color: $color-surface;
    border: 1px solid $color-border;
    padding: 6px 12px;
    border-radius: $radius-full;
    transition: all 0.15s ease;

    &:hover {
      background-color: $color-canvas;
    }
  }

  .ref-badge {
    font-size: 11px;
    font-weight: 700;
    color: $color-slate;
    background-color: $color-surface;
    border: 1px solid $color-border;
    padding: 3px 8px;
    border-radius: $radius-full;
  }
}

.detail-header {
  .date-title {
    font-size: 18px;
    font-weight: 800;
    color: $color-navy;
    margin-bottom: 2px;
  }

  .date-subtitle {
    font-size: 12px;
    color: $color-slate;
  }
}

.duty-card {
  background-color: $color-surface;
  border-radius: $radius-lg;
  border: 1px solid $color-border;
  padding: 16px;
  box-shadow: $shadow-card;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.duty-status-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .base-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #ffffff;
    font-size: 12px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: $radius-sm;
    text-transform: uppercase;
  }

  .status-pill {
    font-size: 11px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: $radius-full;

    &.completed {
      background-color: $color-success-bg;
      color: #0E8560;
    }

    &.in-progress {
      background-color: $color-warning-bg;
      color: #B45309;
    }

    &.off {
      background-color: rgba(107, 114, 128, 0.15);
      color: $color-slate;
    }
  }
}

.duty-meta-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.meta-item {
  background-color: $color-canvas;
  border-radius: $radius-md;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;

  .meta-label {
    font-size: 11px;
    color: $color-slate;
  }

  .meta-value {
    font-size: 14px;
    font-weight: 700;
    color: $color-navy;
  }
}

.empty-day-card {
  background-color: $color-surface;
  border-radius: $radius-lg;
  border: 1px solid $color-border;
  padding: 32px 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  .empty-icon-wrapper {
    width: 44px;
    height: 44px;
    border-radius: $radius-full;
    background-color: $color-canvas;
    color: $color-slate;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
  }

  .empty-title {
    font-size: 14px;
    font-weight: 700;
    color: $color-navy;
    margin-bottom: 4px;
  }

  .empty-desc {
    font-size: 12px;
    color: $color-slate;
  }
}

.logs-section {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .section-title {
    font-size: 13px;
    font-weight: 700;
    color: $color-navy;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
}

.flight-leg-card {
  background-color: $color-surface;
  border-radius: $radius-md;
  border: 1px solid $color-border;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .leg-info {
    display: flex;
    flex-direction: column;
    gap: 2px;

    .leg-route {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 700;
      font-size: 13px;
      color: $color-navy;

      .route-arrow {
        color: $color-red;
      }
    }

    .aircraft-type {
      font-size: 11px;
      color: $color-slate;
    }
  }

  .leg-badge {
    font-size: 11px;
    font-weight: 600;
    color: $color-slate;
    background-color: $color-canvas;
    padding: 3px 8px;
    border-radius: $radius-xs;
  }
}
</style>
