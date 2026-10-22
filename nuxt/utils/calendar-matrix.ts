import type { ScheduleEntry } from '~/types';

export interface CalendarDayCell {
  date: string;
  dayNumber: number;
  entry: ScheduleEntry | null;
  isToday: boolean;
  isCompleted: boolean;
  remainingDuties: number;
}

export interface CalendarMatrixResult {
  leadingBlankDays: number;
  days: CalendarDayCell[];
}

/**
 * Pure domain calculation engine for monthly flight duty roster calendar.
 * Computes Monday-first grid offsets, monthly bounds, completion invariants,
 * and duty associations without any coupling to the DOM or Vue reactivity.
 */
export function buildMonthlyCalendarMatrix(
  year: string | number,
  month: string | number,
  entries: ScheduleEntry[],
  today: string,
): CalendarMatrixResult {
  const y = typeof year === 'string' ? parseInt(year, 10) : year;
  const m = typeof month === 'string' ? parseInt(month, 10) : month;

  // Monday-based offset (0 = Monday, ..., 6 = Sunday)
  const firstDay = new Date(y, m - 1, 1);
  const leadingBlankDays = (firstDay.getDay() + 6) % 7;

  // Total days in target month
  const totalDays = new Date(y, m, 0).getDate();

  // Index entries for O(1) date lookup
  const entryMap = new Map<string, ScheduleEntry>();
  for (const entry of entries) {
    entryMap.set(entry.duty_date, entry);
  }

  const days: CalendarDayCell[] = [];
  const formattedMonth = m.toString().padStart(2, '0');

  for (let day = 1; day <= totalDays; day++) {
    const formattedDay = day.toString().padStart(2, '0');
    const dateStr = `${y}-${formattedMonth}-${formattedDay}`;

    const entry = entryMap.get(dateStr) || null;
    const isToday = dateStr === today;

    // Strict completion guard: count > 0 && count_logbooks === count_schedules
    const isCompleted = entry
      ? entry.count_schedules > 0 && entry.count_logbooks === entry.count_schedules
      : false;

    const remainingDuties = entry
      ? Math.max(0, entry.count_schedules - entry.count_logbooks)
      : 0;

    days.push({
      date: dateStr,
      dayNumber: day,
      entry,
      isToday,
      isCompleted,
      remainingDuties,
    });
  }

  return {
    leadingBlankDays,
    days,
  };
}
