<template>
  <div class="home-page">
    <!-- Header Title Section -->
    <div class="page-header">
      <div>
        <div class="title-row">
          <h1 class="page-title">Hours to Limit</h1>
          <span class="ref-badge">Today: 15 May 2026</span>
        </div>
        <p class="page-subtitle">Civil Aviation Safety Regulation (CASR) Compliance</p>
      </div>
      <button
        type="button"
        class="refresh-btn"
        title="Refresh data"
        :disabled="isLoading"
        @click="refreshData"
      >
        <RotateCw class="refresh-icon" :class="{ spinning: isLoading }" :size="16" />
      </button>
    </div>

    <!-- Error Callout if fetch fails -->
    <div v-if="fetchError" class="error-banner">
      <AlertCircle :size="18" />
      <span>{{ fetchError }}</span>
      <button type="button" class="retry-btn" @click="refreshData">Retry</button>
    </div>

    <!-- Section 1: 2x2 Limit Cards Grid -->
    <section class="section-cards">
      <div v-if="flightHoursStore.summary" class="cards-grid">
        <FlightHoursLimitCard
          title="Daily"
          :limit="flightHoursStore.summary.cards.daily.limit"
          :current="flightHoursStore.summary.cards.daily.current"
          :window="flightHoursStore.summary.cards.daily.window"
          :is-exceeded="flightHoursStore.summary.cards.daily.isExceeded"
        />
        <FlightHoursLimitCard
          title="Weekly"
          :limit="flightHoursStore.summary.cards.weekly.limit"
          :current="flightHoursStore.summary.cards.weekly.current"
          :window="flightHoursStore.summary.cards.weekly.window"
          :is-exceeded="flightHoursStore.summary.cards.weekly.isExceeded"
        />
        <FlightHoursLimitCard
          title="Monthly"
          :limit="flightHoursStore.summary.cards.monthly.limit"
          :current="flightHoursStore.summary.cards.monthly.current"
          :window="flightHoursStore.summary.cards.monthly.window"
          :is-exceeded="flightHoursStore.summary.cards.monthly.isExceeded"
        />
        <FlightHoursLimitCard
          title="Annual"
          :limit="flightHoursStore.summary.cards.annual.limit"
          :current="flightHoursStore.summary.cards.annual.current"
          :window="flightHoursStore.summary.cards.annual.window"
          :is-exceeded="flightHoursStore.summary.cards.annual.isExceeded"
        />
      </div>
      <div v-else-if="isLoading" class="skeleton-grid">
        <div v-for="i in 4" :key="i" class="card-skeleton" />
      </div>
    </section>

    <!-- Section 2: Trend Chart with Range Toggles -->
    <section class="section-chart">
      <div class="chart-card">
        <div class="chart-header">
          <div>
            <h2 class="chart-title">Hours to Limit Trend</h2>
            <p class="chart-subtitle">15-day rolling window centered on May 15</p>
          </div>
          <FlightHoursRangeToggle
            v-model="selectedRange"
            @update:model-value="onRangeChange"
          />
        </div>

        <ClientOnly>
          <FlightHoursFlightTrendChart
            v-if="flightHoursStore.summary"
            :series="flightHoursStore.summary.series"
            :bounds="flightHoursStore.summary.bounds"
            :range="flightHoursStore.currentRange"
          />
          <div v-else class="chart-loading">
            <Loader2 class="spinner" :size="24" />
            <span>Loading flight trend...</span>
          </div>
          <template #fallback>
            <div class="chart-loading">
              <span>Rendering chart...</span>
            </div>
          </template>
        </ClientOnly>
      </div>
    </section>

    <!-- Section 3: Pilot Credentials & Document Expiry Compliance -->
    <section class="section-documents">
      <DocumentsDocumentList
        :documents="documentsStore.documents"
        :warning-days="documentsStore.warningDays"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { RotateCw, AlertCircle, Loader2 } from 'lucide-vue-next';
import { useFlightHoursStore } from '~/stores/flightHours';
import { useDocumentsStore } from '~/stores/documents';
import type { SummaryRange } from '~/types';

const flightHoursStore = useFlightHoursStore();
const documentsStore = useDocumentsStore();

const selectedRange = ref<SummaryRange>('1w');

const isLoading = computed(() => {
  return flightHoursStore.isLoading || documentsStore.isLoading;
});

const fetchError = computed(() => {
  return flightHoursStore.error || documentsStore.error;
});

async function refreshData() {
  await Promise.all([
    flightHoursStore.fetchSummary(selectedRange.value),
    documentsStore.fetchDocuments(),
  ]);
}

function onRangeChange(range: SummaryRange) {
  selectedRange.value = range;
  flightHoursStore.fetchSummary(range);
}

onMounted(() => {
  refreshData();
});
</script>

<style scoped lang="scss">
.home-page {
  padding: 16px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
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

.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  .card-skeleton {
    height: 120px;
    background-color: $color-surface;
    border-radius: $radius-lg;
    border: 1px solid $color-border;
    animation: pulse 1.5s ease-in-out infinite;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

.chart-card {
  background-color: $color-surface;
  border-radius: $radius-lg;
  border: 1px solid $color-border;
  padding: 16px;
  box-shadow: $shadow-card;
}

.chart-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;

  @include desktop-up {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .chart-title {
    font-size: 14px;
    font-weight: 700;
    color: $color-navy;
  }

  .chart-subtitle {
    font-size: 11px;
    color: $color-slate;
  }
}

.chart-loading {
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: $color-slate;
  font-size: 12px;

  .spinner {
    animation: spin 1s linear infinite;
  }
}
</style>
