import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiPilotMe() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Retrieve authenticated pilot profile information',
    }),
    ApiResponse({
      status: 200,
      description: 'Pilot profile successfully retrieved.',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized. Missing or invalid Bearer token.',
    }),
  );
}
