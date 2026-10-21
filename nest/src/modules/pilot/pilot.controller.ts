import { Controller, Get } from '@nestjs/common';
import { PilotService } from './pilot.service';
import { PilotProfile } from '../../types';

@Controller('pilot')
export class PilotController {
  constructor(private readonly pilotService: PilotService) {}

  @Get('me')
  getProfile(): PilotProfile {
    return this.pilotService.getProfile();
  }
}
