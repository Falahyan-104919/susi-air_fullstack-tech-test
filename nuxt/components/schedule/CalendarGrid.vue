<template>
  <div class="calendar-card">
    <!-- Day Names Header (Mon - Sun) -->
    <div class="weekdays-grid">
      <span
        v-for="day in weekDays"
        :key="day"
        class="weekday-name"
      >
        {{ day }}
      </span>
    </div>

    <!-- Calendar Cells Grid -->
    <div class="days-grid">
      <!-- Leading empty padding days -->
      <div
        v-for="pad in matrix.leadingBlankDays"
        :key="`blank-${pad}`"
        class="calendar-cell blank-cell"
      />

      <!-- Month days -->
      <div
        v-for="cell in matrix.days"
        :key="cell.date"
        class="calendar-cell day-cell"
        :class="{
          'is-today': cell.isToday,
          'has-duty': !!cell.entry,
          'is-off': cell.entry?.duty_type === 'OFF',
        }"
        @click="navigateToDate(cell.date)"
      >
        <div class="cell-top">
          <span class="day-number tabular-nums">{{ cell.dayNumber }}</span>
          <!-- Completion Tick Guard: count_schedules > 0 && count_logbooks === count_schedules -->
          <span
            v-if="cell.isCompleted"
            class="completion-tick"
            title="All duty logbooks completed"
          >
            ✓
          </span>
          <span
            v-else-if="cell.remainingDuties > 0"
            class="remaining-badge"
            :title="`${cell.remainingDuties} duty remaining`"
          >
            {{ cell.remainingDuties }}
          </span>
        </div>

        <div class="cell-content">
          <template v-if="cell.entry">
            <!-- Duty / Base Tag -->
            <span
              v-if="cell.entry.duty_type === 'OFF'"
              class="duty-tag off-tag"
            >
              OFF
            </span>
            <span
              v-else
              class="duty-tag base-tag"
              :style="{
                backgroundColor: cell.entry.base_color || '#0E2138',
                color: '#FFFFFF',
              }"
            >
              {{ cell.entry.base_name || cell.entry.duty_type }}
            </span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { buildMonthlyCalendarMatrix } from '~/utils/calendar-matrix';
import type { ScheduleEntry } from '~/types';

const props = defineProps<{
  year: string;
  month: string;
  entries: ScheduleEntry[];
  today: string;
}>();

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const matrix = computed(() => {
  return buildMonthlyCalendarMatrix(props.year, props.month, props.entries, props.today);
});

function navigateToDate(date: string) {
  navigateTo(`/schedule/${date}`);
}
</script>

<style scoped lang="scss">
.calendar-card {
  background-color: $color-surface;
  border-radius: $radius-lg;
  border: 1px solid $color-border;
  padding: 12px;
  box-shadow: $shadow-card;
}

.weekdays-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 8px;
  border-bottom: 1px solid $color-border;
  padding-bottom: 8px;

  .weekday-name {
    font-size: 11px;
    font-weight: 700;
    color: $color-slate;
    text-transform: uppercase;
  }
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-cell {
  aspect-ratio: 1 / 1.15;
  border-radius: $radius-sm;
  padding: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid transparent;
  transition: all 0.15s ease;

  &.blank-cell {
    background-color: transparent;
    pointer-events: none;
  }

  &.day-cell {
    background-color: $color-canvas;
    cursor: pointer;

    &:hover {
      background-color: rgba(14, 33, 56, 0.05);
      border-color: rgba(14, 33, 56, 0.15);
    }

    &.is-today {
      background-color: #FFFFFF;
      border: 1.5px solid $color-red;
      box-shadow: 0 0 0 1px $color-red;

      .day-number {
        font-weight: 800;
        color: $color-red;
      }
    }

    &.is-off {
      opacity: 0.75;
    }
  }
}

.cell-top {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .day-number {
    font-size: 11px;
    font-weight: 600;
    color: $color-navy;
  }

  .completion-tick {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 13px;
    height: 13px;
    border-radius: $radius-full;
    background-color: #1FBF8F;
    color: #ffffff;
    font-size: 9px;
    font-weight: 800;
    line-height: 1;
  }

  .remaining-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 13px;
    height: 13px;
    border-radius: $radius-full;
    background-color: #F59E0B;
    color: #ffffff;
    font-size: 9px;
    font-weight: 700;
    line-height: 1;
  }
}

.cell-content {
  display: flex;
  justify-content: center;
  margin-top: auto;

  .duty-tag {
    font-size: 9px;
    font-weight: 700;
    padding: 2px 4px;
    border-radius: $radius-xs;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    line-height: 1.1;

    &.off-tag {
      background-color: rgba(107, 114, 128, 0.2);
      color: $color-slate;
    }
  }
}
</style>
