import { Injectable } from '@nestjs/common';
import { DataService } from '../../data/data.service';
import { APP_TODAY } from '../../common/constants';
import { EvaluatedDocument, DocumentsResponse, UrgencyStatus } from '../../types';

@Injectable()
export class DocumentsService {
  constructor(private readonly dataService: DataService) {}

  getEvaluatedDocuments(): DocumentsResponse {
    const today = APP_TODAY;
    const warningDays = this.dataService.getWarningDays();
    const rawDocs = this.dataService.getDocuments();

    const todayMs = new Date(`${today}T00:00:00Z`).getTime();

    const evaluated: EvaluatedDocument[] = rawDocs.map((doc) => {
      const expiryMs = new Date(`${doc.expiryDate}T00:00:00Z`).getTime();
      const diffDays = Math.ceil((expiryMs - todayMs) / 86400000);

      let status: UrgencyStatus = 'safe';

      if (diffDays <= 0) {
        status = 'expired';
      } else if (diffDays <= warningDays) {
        status = 'soon';
      }

      return {
        id: doc.id,
        label: doc.label,
        expiryDate: doc.expiryDate,
        daysRemaining: diffDays,
        status,
      };
    });

    const orderWeight: Record<UrgencyStatus, number> = {
      expired: 0,
      soon: 1,
      safe: 2,
    };

    evaluated.sort((a, b) => {
      if (orderWeight[a.status] !== orderWeight[b.status]) {
        return orderWeight[a.status] - orderWeight[b.status];
      }
      return a.daysRemaining - b.daysRemaining;
    });

    return {
      today,
      warningDays,
      documents: evaluated,
    };
  }
}
