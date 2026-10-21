import { IsNotEmpty, Matches } from 'class-validator';

export class ScheduleQueryDto {
  @IsNotEmpty({ message: 'year is required' })
  @Matches(/^\d{4}$/, { message: 'year must be a 4-digit number (YYYY)' })
  year: string;

  @IsNotEmpty({ message: 'month is required' })
  @Matches(/^(0?[1-9]|1[0-2])$/, {
    message: 'month must be between 1 and 12 (MM or M)',
  })
  month: string;
}
