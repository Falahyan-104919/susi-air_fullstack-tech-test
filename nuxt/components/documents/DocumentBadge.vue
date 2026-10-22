<template>
  <span class="document-badge" :class="status">
    <component :is="badgeIcon" class="badge-icon" :size="13" />
    <span class="badge-label">{{ badgeText }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-vue-next';
import type { UrgencyStatus } from '~/types';

const props = defineProps<{
  status: UrgencyStatus;
  daysRemaining: number;
}>();

const badgeIcon = computed(() => {
  switch (props.status) {
    case 'expired':
      return AlertCircle;
    case 'soon':
      return AlertTriangle;
    case 'safe':
    default:
      return CheckCircle2;
  }
});

const badgeText = computed(() => {
  if (props.status === 'expired') {
    const overdue = Math.abs(props.daysRemaining);
    return overdue === 0 ? 'Expired Today' : `Expired ${overdue}d ago`;
  }
  if (props.status === 'soon') {
    return props.daysRemaining === 0
      ? 'Expires Today'
      : props.daysRemaining === 1
        ? 'Expires Tomorrow'
        : `Expires in ${props.daysRemaining}d`;
  }
  return `${props.daysRemaining}d remaining`;
});
</script>

<style scoped lang="scss">
.document-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: $radius-full;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;

  .badge-icon {
    flex-shrink: 0;
  }

  &.safe {
    background-color: $color-success-bg;
    color: #0E8560;
  }

  &.soon {
    background-color: $color-warning-bg;
    color: #B45309;
  }

  &.expired {
    background-color: $color-danger-bg;
    color: $color-danger;
  }
}
</style>
