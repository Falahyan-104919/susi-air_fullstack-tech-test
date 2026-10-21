import { Injectable } from '@nestjs/common';
import { DataService } from '../../data/data.service';
import { PilotProfile } from '../../types';

@Injectable()
export class PilotService {
  constructor(private readonly dataService: DataService) {}

  getProfile(): PilotProfile {
    return this.dataService.getPilotProfile();
  }
}
