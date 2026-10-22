import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FlightHoursService } from './flight-hours.service';
import { FlightHoursQueryDto } from './dto/flight-hours-query.dto';
import { SummaryQueryDto } from './dto/summary-query.dto';
import { DailyHourEntry, SummaryResponse } from '../../types';
import {
  ApiGetFlightHoursRange,
  ApiGetFlightHoursSummary,
} from './decorators/flight-hours-swagger.decorator';

@ApiTags('Flight Hours')
@Controller('flight-hours')
export class FlightHoursController {
  constructor(private readonly flightHoursService: FlightHoursService) {}

  @Get()
  @ApiGetFlightHoursRange()
  getFlightHours(@Query() query: FlightHoursQueryDto): DailyHourEntry[] {
    return this.flightHoursService.getRange(query.from, query.to);
  }

  @Get('summary')
  @ApiGetFlightHoursSummary()
  getSummary(@Query() query: SummaryQueryDto): SummaryResponse {
    return this.flightHoursService.getSummary(query.range);
  }
}
