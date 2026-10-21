import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { DataService } from '../../data/data.service';

describe('DocumentsService', () => {
  let service: DocumentsService;

  beforeEach(async () => {
    const mockDataService = {
      getDocuments: () => [
        { id: 'doc_1', label: 'Expired Doc', expiryDate: '2026-05-01' },
        { id: 'doc_2', label: 'Soon Doc', expiryDate: '2026-05-29' },
        { id: 'doc_3', label: 'Safe Doc', expiryDate: '2026-10-14' },
      ],
      getWarningDays: () => 30,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        { provide: DataService, useValue: mockDataService },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
  });

  it('should categorize documents by urgency relative to 2026-05-15 without presentation leaks', () => {
    const res = service.getEvaluatedDocuments();
    expect(res.documents.length).toBe(3);

    // Sorted by urgency first (Expired -> Soon -> Safe)
    expect(res.documents[0].status).toBe('expired');
    expect(res.documents[1].status).toBe('soon');
    expect(res.documents[2].status).toBe('safe');
  });
});
