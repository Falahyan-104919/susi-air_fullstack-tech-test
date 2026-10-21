import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataService } from '../../data/data.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from '../../types';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private dataService: DataService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { username, password } = loginDto;
    if (username !== 'johndoe' || password !== 'susiairtest') {
      throw new UnauthorizedException('Invalid username or password');
    }

    const pilot = this.dataService.getPilotProfile();
    const payload = { sub: username, name: pilot.name };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      pilot,
    };
  }
}
