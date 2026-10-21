import { Controller, Get, Query } from '@nestjs/common';
import { FlightHoursService } from './flight-hours.service';
import { FlightHoursQueryDto } from './dto/flight-hours-query.dto';
import { SummaryQueryDto } from './dto/summary-query.dto';

@Controller('flight-hours')
export class FlightHoursController {
  constructor(private readonly flightHoursService: FlightHoursService) {}

  @Get()
  getFlightHours(@Query() query: FlightHoursQueryDto) {
    return this.flightHoursService.getRange(query.from, query.to);
  }

  @Get('summary')
  getSummary(@Query() query: SummaryQueryDto) {
    return this.flightHoursService.getSummary(query.range);
  }
}
