import { Injectable } from '@nestjs/common';
import { DataService } from '../../data/data.service';
import { APP_TODAY } from '../../common/constants';
import { EnrichedScheduleEntry, SchedulesResponse, LegendItem } from '../../types';

@Injectable()
export class SchedulesService {
  constructor(private readonly dataService: DataService) {}

  getMonthSchedules(year: string, month: string): SchedulesResponse {
    const paddedMonth = month.padStart(2, '0');
    const prefix = `${year}-${paddedMonth}`;
    const allSchedules = this.dataService.getSchedules();

    const filtered = allSchedules.filter((s) => s.duty_date.startsWith(prefix));

    const entries: EnrichedScheduleEntry[] = filtered.map((s) => {
      // Guard against 0 === 0 edge cases
      const isCompleted = s.count_schedules > 0 && s.count_logbooks === s.count_schedules;
      const remainingDuties = Math.max(0, s.count_schedules - s.count_logbooks);
      return {
        ...s,
        isCompleted,
        remainingDuties,
      };
    });

    const baseLegend = this.dataService.getLegends();
    const legendWithOff: LegendItem[] = [
      ...baseLegend,
      {
        code: 'OFF',
        label: 'Off Duty / Rest Day',
        color: '#E2E8F0',
      },
    ];

    return {
      year,
      month: paddedMonth,
      today: APP_TODAY,
      entries,
      legend: legendWithOff,
    };
  }
}
