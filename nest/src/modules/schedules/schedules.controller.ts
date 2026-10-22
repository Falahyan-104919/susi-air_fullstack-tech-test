import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SchedulesService } from './schedules.service';
import { ScheduleQueryDto } from './dto/schedule-query.dto';
import { SchedulesResponse } from '../../types';
import { ApiGetSchedules } from './decorators/schedules-swagger.decorator';

@ApiTags('Schedules')
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  @ApiGetSchedules()
  getSchedules(@Query() query: ScheduleQueryDto): SchedulesResponse {
    return this.schedulesService.getMonthSchedules(query.year, query.month);
  }
}
