import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './auth';
import type { DocumentsResponse, EvaluatedDocument } from '~/types';

export const useDocumentsStore = defineStore('documents', () => {
  const documents = ref<EvaluatedDocument[]>([]);
  const today = ref<string>('2026-05-15');
  const warningDays = ref<number>(30);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  async function fetchDocuments(): Promise<EvaluatedDocument[]> {
    if (!authStore.token) {
      error.value = 'Not authenticated';
      return [];
    }

    isLoading.value = true;
    error.value = null;

    try {
      const res = await $fetch<DocumentsResponse>(
        `${config.public.apiBase}/documents`,
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        },
      );
      documents.value = res.documents;
      today.value = res.today;
      warningDays.value = res.warningDays;
      return res.documents;
    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.response?._data?.message ||
        'Failed to fetch pilot documents';
      error.value = Array.isArray(message) ? message.join(', ') : message;
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
