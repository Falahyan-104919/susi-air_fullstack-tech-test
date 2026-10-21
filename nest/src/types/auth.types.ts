import { PilotProfile } from './pilot.types';

export interface JwtPayload {
  sub: string;
  name: string;
  iat?: number;
  exp?: number;
}

export interface LoginResponse {
  accessToken: string;
  pilot: PilotProfile;
}
