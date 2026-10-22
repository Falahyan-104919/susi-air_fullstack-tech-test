<template>
  <div class="documents-card">
    <div class="documents-header">
      <div>
        <h2 class="card-title">Pilot Certifications & Documents</h2>
        <p class="card-subtitle">
          Urgency threshold: {{ warningDays }} days before expiry
        </p>
      </div>
      <span class="count-badge">{{ documents.length }} items</span>
    </div>

    <div v-if="documents.length === 0" class="empty-docs">
      No documents on file.
    </div>

    <div v-else class="documents-list">
      <div
        v-for="doc in documents"
        :key="doc.id"
        class="document-item"
        :class="doc.status"
      >
        <div class="doc-icon-wrapper" :class="doc.status">
          <FileText class="doc-icon" :size="18" />
        </div>

        <div class="doc-details">
          <span class="doc-label">{{ doc.label }}</span>
          <span class="doc-date">Expiry: {{ formatDate(doc.expiryDate) }}</span>
        </div>

        <div class="doc-badge-wrapper">
          <DocumentsDocumentBadge
            :status="doc.status"
            :days-remaining="doc.daysRemaining"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileText } from 'lucide-vue-next';
import type { EvaluatedDocument } from '~/types';

defineProps<{
  documents: EvaluatedDocument[];
  warningDays: number;
}>();

function formatDate(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const day = parts[2];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIdx = parseInt(parts[1], 10) - 1;
  return `${day} ${months[monthIdx] || ''} ${parts[0]}`;
}
</script>

<style scoped lang="scss">
.documents-card {
  background-color: $color-surface;
  border-radius: $radius-lg;
  border: 1px solid $color-border;
  padding: 16px;
  box-shadow: $shadow-card;
}

.documents-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 14px;

  .card-title {
    font-size: 14px;
    font-weight: 700;
    color: $color-navy;
    margin-bottom: 2px;
  }

  .card-subtitle {
    font-size: 11px;
    color: $color-slate;
  }

  .count-badge {
    font-size: 11px;
    font-weight: 600;
    color: $color-slate;
    background-color: $color-canvas;
    padding: 2px 8px;
    border-radius: $radius-full;
  }
}

.documents-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.document-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background-color: $color-canvas;
  border-radius: $radius-md;
  border: 1px solid $color-border;
  transition: all 0.15s ease-in-out;

  &.expired {
    background-color: #FFF5F6;
    border-color: rgba(230, 55, 87, 0.25);
  }

  &.soon {
    background-color: #FFFBEB;
    border-color: rgba(245, 158, 11, 0.25);
  }
}

.doc-icon-wrapper {
  width: 34px;
  height: 34px;
  border-radius: $radius-sm;
  background-color: rgba(14, 33, 56, 0.08);
  color: $color-navy;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.expired {
    background-color: $color-danger-bg;
    color: $color-danger;
  }

  &.soon {
    background-color: $color-warning-bg;
    color: $color-warning;
  }

  &.safe {
    background-color: $color-success-bg;
    color: #0E8560;
  }
}

.doc-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;

  .doc-label {
    font-size: 13px;
    font-weight: 600;
    color: $color-navy;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .doc-date {
    font-size: 11px;
    color: $color-slate;
  }
}

.doc-badge-wrapper {
  flex-shrink: 0;
}

.empty-docs {
  padding: 20px;
  text-align: center;
  font-size: 13px;
  color: $color-slate;
}
</style>
