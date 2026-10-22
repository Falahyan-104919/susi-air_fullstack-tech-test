import { Test, TestingModule } from '@nestjs/testing';
import { SchedulesService } from './schedules.service';
import { DataService } from '../../data/data.service';

describe('SchedulesService', () => {
  let service: SchedulesService;

  beforeEach(async () => {
    const mockSchedules = [
      {
        id: '1',
        duty_date: '2026-05-15',
        status: 1,
        base_name: 'MKW',
        base_color: '#10B981',
        duty_type: 'DTY',
        count_schedules: 4,
        count_logbooks: 4,
      },
      {
        id: '2',
        duty_date: '2026-05-19',
        status: 1,
        base_name: 'SIQ',
        base_color: '#10B981',
        duty_type: 'DTY',
        count_schedules: 2,
        count_logbooks: 0,
      },
      {
        id: '3',
        duty_date: '2026-05-20',
        status: 1,
        base_name: 'OFF',
        base_color: '#E2E8F0',
        duty_type: 'OFF',
        count_schedules: 0,
        count_logbooks: 0,
      },
    ];

    const mockDataService = {
      getSchedules: () => mockSchedules,
      findSchedulesByMonth: (prefix: string) =>
        mockSchedules.filter((s) => s.duty_date.startsWith(prefix)),
      getLegends: () => [{ code: 'DTY', label: 'On Duty', color: '#10B981' }],
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulesService,
        { provide: DataService, useValue: mockDataService },
      ],
    }).compile();

    service = module.get<SchedulesService>(SchedulesService);
  });

  it('should enforce tick guard only when count_schedules > 0', () => {
    const res = service.getMonthSchedules('2026', '05');
    // Entry 1: count_schedules = 4, count_logbooks = 4 -> Completed
    expect(res.entries[0].isCompleted).toBe(true);
    // Entry 2: count_schedules = 2, count_logbooks = 0 -> Incomplete
    expect(res.entries[1].isCompleted).toBe(false);
    // Entry 3: count_schedules = 0, count_logbooks = 0 -> NOT completed (rest/off day)
    expect(res.entries[2].isCompleted).toBe(false);
  });

  it('should include OFF entry in legend', () => {
    const res = service.getMonthSchedules('2026', '05');
    expect(res.legend.some((l) => l.code === 'OFF')).toBe(true);
  });
});
