export interface PilotProfile {
  name: string;
  totalFlightHours: number;
  avatarUrl: string;
}

export interface LoginResponse {
  accessToken: string;
  pilot: PilotProfile;
}
