import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiPilotLogin() {
  return applyDecorators(
    ApiOperation({
      summary: 'Authenticate pilot credentials and obtain JWT session token',
    }),
    ApiResponse({
      status: 200,
      description:
        'Authentication successful. Returns JWT access token and pilot profile.',
    }),
    ApiResponse({
      status: 401,
      description: 'Invalid username or password.',
    }),
  );
}
