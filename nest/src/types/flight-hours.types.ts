export interface FlightHourEntry {
  date: string;
  hours: number;
}

export interface ChartBoundsConfig {
  limit: number;
  max: number;
  windowDays: number;
  displayRangeDays: number;
}

export type SummaryRange = '1w' | '1m' | '3m' | '6m' | '1y';

export interface DailyHourEntry {
  date: string;
  hours: number;
}

export interface LimitCard {
  limit: number;
  current: number;
  window: string;
  isExceeded: boolean;
}

export interface SeriesPoint {
  date: string;
  rollingSum: number;
  dailyHours: number;
  isToday: boolean;
  isProjected: boolean;
  isExceeded: boolean;
}

export interface SummaryResponse {
  range: string;
  bounds: ChartBoundsConfig;
  cards: {
    daily: LimitCard;
    weekly: LimitCard;
    monthly: LimitCard;
    annual: LimitCard;
  };
  series: SeriesPoint[];
}
