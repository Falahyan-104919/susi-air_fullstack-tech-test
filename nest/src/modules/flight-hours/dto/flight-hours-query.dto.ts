import { IsISO8601, IsNotEmpty } from 'class-validator';

export class FlightHoursQueryDto {
  @IsNotEmpty()
  @IsISO8601({}, { message: 'from must be a valid ISO 8601 date (YYYY-MM-DD)' })
  from: string;

  @IsNotEmpty()
  @IsISO8601({}, { message: 'to must be a valid ISO 8601 date (YYYY-MM-DD)' })
  to: string;
}
