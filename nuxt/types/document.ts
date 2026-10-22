export type UrgencyStatus = 'safe' | 'soon' | 'expired';

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
