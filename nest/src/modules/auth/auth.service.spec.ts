import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DataService } from '../../data/data.service';
import { JWT_SECRET } from '../../common/constants';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const dataServiceMock = {
      getPilotProfile: () => ({
        name: 'John Doe',
        totalFlightHours: 1444.5,
        avatarUrl: 'https://example.com/avatar.jpg',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: JWT_SECRET,
          signOptions: { expiresIn: '7d' },
        }),
      ],
      providers: [
        AuthService,
        { provide: DataService, useValue: dataServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should authenticate valid credentials johndoe / susiairtest', async () => {
    const res = await service.login({
      username: 'johndoe',
      password: 'susiairtest',
    });
    expect(res.accessToken).toBeDefined();
    expect(res.pilot.name).toBe('John Doe');
  });

  it('should throw UnauthorizedException on wrong credentials', async () => {
    await expect(
      service.login({ username: 'johndoe', password: 'wrongpassword' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
