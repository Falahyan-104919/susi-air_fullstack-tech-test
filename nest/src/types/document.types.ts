export type UrgencyStatus = 'safe' | 'soon' | 'expired';

export interface DocumentEntry {
  id: string;
  label: string;
  expiryDate: string;
}

export interface EvaluatedDocument {
  id: string;
  label: string;
  expiryDate: string;
  daysRemaining: number;
  status: UrgencyStatus;
}

export interface DocumentsResponse {
  today: string;
  warningDays: number;
  documents: EvaluatedDocument[];
}
