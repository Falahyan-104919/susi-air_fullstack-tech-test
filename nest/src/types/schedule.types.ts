export interface ScheduleEntry {
  id: string;
  duty_date: string;
  status: number;
  base_name: string;
  base_color: string;
  duty_type: string;
  count_schedules: number;
  count_logbooks: number;
}

export interface EnrichedScheduleEntry extends ScheduleEntry {
  isCompleted: boolean;
  remainingDuties: number;
}

export interface LegendItem {
  code: string;
  label: string;
  color: string;
}

export interface SchedulesResponse {
  year: string;
  month: string;
  today: string;
  entries: EnrichedScheduleEntry[];
  legend: LegendItem[];
}
