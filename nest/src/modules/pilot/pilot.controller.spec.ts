import { Test, TestingModule } from '@nestjs/testing';
import { PilotController } from './pilot.controller';
import { PilotService } from './pilot.service';

describe('PilotController', () => {
  let controller: PilotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PilotController],
      providers: [
        {
          provide: PilotService,
          useValue: {
            getProfile: () => ({
              name: 'John Doe',
              totalFlightHours: 1444.5,
              avatarUrl: 'https://example.com/avatar.jpg',
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<PilotController>(PilotController);
  });

  it('should return pilot profile', () => {
    const profile = controller.getProfile();
    expect(profile.name).toBe('John Doe');
    expect(profile.totalFlightHours).toBe(1444.5);
  });
});
