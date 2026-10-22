import { Injectable, BadRequestException } from '@nestjs/common';
import { DataService } from '../../data/data.service';
import { APP_TODAY } from '../../common/constants';
import { DailyHourEntry, SummaryResponse, SeriesPoint } from '../../types';

@Injectable()
export class FlightHoursService {
  constructor(private readonly dataService: DataService) {}

  /**
   * Computes the rolling sum of flight hours for a given target date over a specified window.
   * Days prior to dataset inception or missing dates contribute 0.0 hours.
   * Future dates within the dataset contribute their planned/rostered flight hours.
   */
  calculateRollingSum(targetDate: string, windowDays: number): number {
    let sum = 0;
    const targetMs = new Date(`${targetDate}T00:00:00Z`).getTime();

    for (let i = 0; i < windowDays; i++) {
      const d = new Date(targetMs - i * 86400000);
      const iso = d.toISOString().split('T')[0];
      sum += this.dataService.getFlightHoursForDate(iso);
    }

    return Math.round(sum * 10) / 10;
  }

  getRange(from: string, to: string): DailyHourEntry[] {
    const startMs = new Date(`${from}T00:00:00Z`).getTime();
    const endMs = new Date(`${to}T00:00:00Z`).getTime();

    if (isNaN(startMs) || isNaN(endMs)) {
      throw new BadRequestException('Invalid date format. Expected YYYY-MM-DD');
    }

    if (startMs > endMs) {
      throw new BadRequestException('from date must be before or equal to to date');
    }

    const entries: DailyHourEntry[] = [];
    let currentMs = startMs;

    while (currentMs <= endMs) {
      const iso = new Date(currentMs).toISOString().split('T')[0];
      entries.push({
        date: iso,
        hours: this.dataService.getFlightHoursForDate(iso),
      });
      currentMs += 86400000;
    }

    return entries;
  }

  getSummary(range: string = '1w'): SummaryResponse {
    const boundsConfig = this.dataService.getChartBounds()[range];
    if (!boundsConfig) {
      throw new BadRequestException(`Unsupported range: ${range}`);
    }

    const limits = this.dataService.getLimits();
    const today = APP_TODAY;

    // 1. Calculate 4 Regulatory Limit Cards (dynamic from config)
    const dailyCurrent = this.dataService.getFlightHoursForDate(today);
    const weeklyCurrent = this.calculateRollingSum(today, 7);
    const monthlyCurrent = this.calculateRollingSum(today, 30);
    const annualCurrent = this.calculateRollingSum(today, 365);

    const cards = {
      daily: {
        limit: limits.daily ?? 8,
        current: dailyCurrent,
        window: 'Today only',
        isExceeded: dailyCurrent > (limits.daily ?? 8),
      },
      weekly: {
        limit: limits.weekly ?? 40,
        current: weeklyCurrent,
        window: 'Rolling 7 days',
        isExceeded: weeklyCurrent > (limits.weekly ?? 40),
      },
      monthly: {
        limit: limits.monthly ?? 100,
        current: monthlyCurrent,
        window: 'Rolling 30 days',
        isExceeded: monthlyCurrent > (limits.monthly ?? 100),
      },
      annual: {
        limit: limits.annual ?? 1050,
        current: annualCurrent,
        window: 'Rolling 365 days',
        isExceeded: annualCurrent > (limits.annual ?? 1050),
      },
    };

    // 2. Build 15-day display series (7 days before today, today, 7 days after today)
    const todayMs = new Date(`${today}T00:00:00Z`).getTime();
    const series: SeriesPoint[] = [];

    for (let offset = -7; offset <= 7; offset++) {
      const d = new Date(todayMs + offset * 86400000);
      const iso = d.toISOString().split('T')[0];
      const rollingSum = this.calculateRollingSum(iso, boundsConfig.windowDays);
      const dailyHours = this.dataService.getFlightHoursForDate(iso);

      series.push({
        date: iso,
        rollingSum,
        dailyHours,
        isToday: offset === 0,
        isProjected: offset > 0,
        isExceeded: rollingSum > boundsConfig.limit,
      });
    }

    return {
      range,
      bounds: boundsConfig,
      cards,
      series,
    };
  }
}
