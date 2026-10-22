<template>
  <div class="chart-container">
    <div v-if="!series || series.length === 0" class="empty-state">
      No flight hours trend data available.
    </div>
    <div v-else class="chart-wrapper">
      <Line :data="chartData" :options="chartOptions" />
    </div>

    <!-- Chart Legend & Annotation Bar -->
    <div class="chart-legend-bar">
      <div class="legend-item">
        <span class="legend-dot actual-dot" />
        <span class="legend-text">Rolling Sum</span>
      </div>
      <div class="legend-item">
        <span class="legend-line limit-line" />
        <span class="legend-text">Limit ({{ bounds.limit }}h)</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot today-dot" />
        <span class="legend-text">Today (15 May)</span>
      </div>
      <div v-if="hasExceedance" class="legend-item">
        <span class="legend-dot exceeded-dot" />
        <span class="legend-text exceeded-text">Exceeded</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  type ChartOptions,
  type ChartData,
} from 'chart.js';
import { Line } from 'vue-chartjs';
import type { ChartBoundsConfig, SeriesPoint, SummaryRange } from '~/types';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
);

const props = defineProps<{
  series: SeriesPoint[];
  bounds: ChartBoundsConfig;
  range: SummaryRange;
}>();

const hasExceedance = computed(() => {
  return props.series.some((p) => p.isExceeded);
});

// Format "2026-05-15" -> "15 May"
function formatDateLabel(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const day = parts[2];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIdx = parseInt(parts[1], 10) - 1;
  return `${day} ${months[monthIdx] || ''}`;
}

const labels = computed(() => {
  return props.series.map((point) => formatDateLabel(point.date));
});

const chartData = computed<ChartData<'line'>>(() => {
  const points = props.series;
  const limitValue = props.bounds.limit;

  const pointBackgroundColors = points.map((p) => {
    if (p.isExceeded) return '#E63757';
    if (p.isToday) return '#0E2138';
    if (p.isProjected) return '#22C5E8';
    return '#22C5E8';
  });

  const pointBorderColors = points.map((p) => {
    if (p.isExceeded) return '#FFFFFF';
    if (p.isToday) return '#FFFFFF';
    return '#22C5E8';
  });

  const pointRadii = points.map((p) => {
    if (p.isExceeded) return 6;
    if (p.isToday) return 5;
    return 3.5;
  });

  const pointHoverRadii = points.map((p) => {
    if (p.isExceeded) return 8;
    return 6;
  });

  return {
    labels: labels.value,
    datasets: [
      {
        label: 'Rolling Flight Hours',
        data: points.map((p) => p.rollingSum),
        borderColor: '#0E2138',
        backgroundColor: 'rgba(34, 197, 232, 0.08)',
        borderWidth: 2.5,
        tension: 0.25,
        fill: true,
        pointBackgroundColor: pointBackgroundColors,
        pointBorderColor: pointBorderColors,
        pointBorderWidth: 2,
        pointRadius: pointRadii,
        pointHoverRadius: pointHoverRadii,
      },
      {
        label: `Limit (${limitValue}h)`,
        data: points.map(() => limitValue),
        borderColor: '#E63757',
        borderWidth: 1.8,
        borderDash: [6, 4],
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: false,
      },
    ],
  };
});

const chartOptions = computed<ChartOptions<'line'>>(() => {
  const maxSeriesValue = Math.max(...props.series.map((p) => p.rollingSum), 0);
  const suggestedMaxY = Math.max(props.bounds.max, Math.ceil(maxSeriesValue * 1.1));

  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0E2138',
        titleFont: { family: 'Plus Jakarta Sans', size: 12, weight: 'bold' },
        bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title(tooltipItems) {
            const index = tooltipItems[0].dataIndex;
            const point = props.series[index];
            if (!point) return '';
            let prefix = point.date;
            if (point.isToday) prefix += ' (Today)';
            if (point.isProjected) prefix += ' [Projected Duty]';
            return prefix;
          },
          label(tooltipItem) {
            const index = tooltipItem.dataIndex;
            const point = props.series[index];
            if (!point) return '';

            const lines = [
              `Rolling Sum: ${point.rollingSum.toFixed(1)} hrs`,
              `Daily Logged: ${point.dailyHours.toFixed(1)} hrs`,
            ];

            if (point.isExceeded) {
              lines.push(`⚠️ Exceeds limit of ${props.bounds.limit} hrs!`);
            }
            return lines;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { family: 'Plus Jakarta Sans', size: 10 },
          color: (ctx) => {
            const point = props.series[ctx.index];
            if (point?.isToday) return '#0E2138';
            return '#6B7280';
          },
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        min: 0,
        suggestedMax: suggestedMaxY,
        grid: {
          color: 'rgba(14, 33, 56, 0.06)',
        },
        ticks: {
          font: { family: 'Plus Jakarta Sans', size: 10 },
          color: '#6B7280',
          callback(tickValue) {
            return `${tickValue}h`;
          },
        },
      },
    },
  };
});
</script>

<style scoped lang="scss">
.chart-container {
  width: 100%;
}

.chart-wrapper {
  position: relative;
  height: 250px;
  width: 100%;
}

.empty-state {
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: $color-slate;
}

.chart-legend-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-top: 14px;
  padding-top: 10px;
  border-top: 1px solid $color-border;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;

  .legend-text {
    font-size: 11px;
    font-weight: 600;
    color: $color-slate;

    &.exceeded-text {
      color: $color-danger;
      font-weight: 700;
    }
  }

  .legend-dot {
    width: 8px;
    height: 8px;
    border-radius: $radius-full;

    &.actual-dot {
      background-color: #22C5E8;
    }

    &.today-dot {
      background-color: $color-navy;
    }

    &.exceeded-dot {
      background-color: $color-danger;
    }
  }

  .legend-line {
    width: 14px;
    height: 2px;

    &.limit-line {
      border-top: 2px dashed $color-danger;
    }
  }
}
</style>
