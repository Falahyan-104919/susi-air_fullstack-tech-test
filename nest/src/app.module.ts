import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { DataModule } from './data/data.module';
import { AuthModule } from './modules/auth/auth.module';
import { PilotModule } from './modules/pilot/pilot.module';
import { FlightHoursModule } from './modules/flight-hours/flight-hours.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    DataModule,
    AuthModule,
    PilotModule,
    FlightHoursModule,
    DocumentsModule,
    SchedulesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
