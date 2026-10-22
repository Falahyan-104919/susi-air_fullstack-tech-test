import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApiClient, ApiError } from '~/composables/useApiClient';
import type { DocumentsResponse, EvaluatedDocument } from '~/types';

export const useDocumentsStore = defineStore('documents', () => {
  const documents = ref<EvaluatedDocument[]>([]);
  const today = ref<string>('2026-05-15');
  const warningDays = ref<number>(30);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const api = useApiClient();

  async function fetchDocuments(): Promise<EvaluatedDocument[]> {
    isLoading.value = true;
    error.value = null;

    try {
      const res = await api.get<DocumentsResponse>('/documents');
      documents.value = res.documents;
      today.value = res.today;
      warningDays.value = res.warningDays;
      return res.documents;
    } catch (err: any) {
      error.value = err instanceof ApiError ? err.message : 'Failed to fetch pilot documents';
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  return {
    documents,
    today,
    warningDays,
    isLoading,
    error,
    fetchDocuments,
  };
});
