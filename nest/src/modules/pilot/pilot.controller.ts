import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PilotService } from './pilot.service';
import { PilotProfile } from '../../types';
import { ApiPilotMe } from './decorators/pilot-swagger.decorator';

@ApiTags('Pilot')
@Controller('pilot')
export class PilotController {
  constructor(private readonly pilotService: PilotService) {}

  @Get('me')
  @ApiPilotMe()
  getProfile(): PilotProfile {
    return this.pilotService.getProfile();
  }
}
