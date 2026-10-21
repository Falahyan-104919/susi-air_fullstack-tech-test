import { Controller, Get, Query } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { ScheduleQueryDto } from './dto/schedule-query.dto';
import { SchedulesResponse } from '../../types';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  getSchedules(@Query() query: ScheduleQueryDto): SchedulesResponse {
    return this.schedulesService.getMonthSchedules(query.year, query.month);
  }
}
