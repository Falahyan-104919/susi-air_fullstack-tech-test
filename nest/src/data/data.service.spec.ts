import { Test, TestingModule } from '@nestjs/testing';
import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataService],
    }).compile();

    service = module.get<DataService>(DataService);
    service.onModuleInit();
  });

  it('should load 521 days of flight hours and limits from config', () => {
    expect(service.getFlightHoursCount()).toBe(521);
    expect(service.getPilotProfile().name).toBe('John Doe');
    expect(service.getLimits().weekly).toBe(40);
  });

  it('should load pilot documents and warningDays threshold', () => {
    const docs = service.getDocuments();
    expect(docs.length).toBe(5);
    expect(service.getWarningDays()).toBe(30);
  });

  it('should load schedules for April, May, June 2026', () => {
    const schedules = service.getSchedules();
    expect(schedules.length).toBeGreaterThan(50);
  });
});
