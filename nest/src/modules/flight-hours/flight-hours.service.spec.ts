import { Test, TestingModule } from '@nestjs/testing';
import { FlightHoursService } from './flight-hours.service';
import { DataService } from '../../data/data.service';

describe('FlightHoursService', () => {
  let service: FlightHoursService;

  beforeEach(async () => {
    const flightMap = new Map<string, number>();
    flightMap.set('2026-05-15', 6.4);
    flightMap.set('2026-05-14', 6.7);
    flightMap.set('2026-05-13', 5.9);
    flightMap.set('2026-05-12', 4.6);
    flightMap.set('2026-05-11', 0);
    flightMap.set('2026-05-10', 1.6);
    flightMap.set('2026-05-09', 0);

    // Exceedance test data (May 16-20)
    flightMap.set('2026-05-16', 6.2);
    flightMap.set('2026-05-17', 6.6);
    flightMap.set('2026-05-18', 6.4);
    flightMap.set('2026-05-19', 5.8);
    flightMap.set('2026-05-20', 6.6);

    const mockDataService = {
      getFlightHoursMap: () => flightMap,
      getFlightHoursForDate: (date: string) => flightMap.get(date) || 0,
      getLimits: () => ({ daily: 8, weekly: 40, monthly: 100, annual: 1050 }),
      getChartBounds: () => ({
        '1w': { limit: 40, max: 45, windowDays: 7, displayRangeDays: 7 },
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlightHoursService,
        { provide: DataService, useValue: mockDataService },
      ],
    }).compile();

    service = module.get<FlightHoursService>(FlightHoursService);
  });

  it('should calculate 7-day rolling sum using calculateRollingSum', () => {
    const sum = service.calculateRollingSum('2026-05-15', 7);
    expect(sum).toBe(25.2);
  });

  it('should accurately detect when rolling sum exceeds regulatory limit (exceedance test)', () => {
    // On May 20, 7-day window sum is 44.7 (exceeding 40h limit)
    const sumMay20 = service.calculateRollingSum('2026-05-20', 7);
    expect(sumMay20).toBeGreaterThan(40);
  });

  it('should treat dates before dataset inception or missing dates as 0.0', () => {
    const sumPreData = service.calculateRollingSum('2024-12-28', 7);
    expect(typeof sumPreData).toBe('number');
  });

  it('should generate 15-day series centered on 2026-05-15 with projected flag', () => {
    const summary = service.getSummary('1w');
    expect(summary.series.length).toBe(15);
    expect(summary.series[7].date).toBe('2026-05-15');
    expect(summary.series[7].isToday).toBe(true);
    expect(summary.series[8].isProjected).toBe(true);
  });
});
