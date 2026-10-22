import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';

export function ApiGetSchedules() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Query monthly duty roster entries and duty legend',
    }),
    ApiQuery({
      name: 'year',
      required: true,
      example: '2026',
      description: '4-digit year (YYYY)',
    }),
    ApiQuery({
      name: 'month',
      required: true,
      example: '05',
      description: 'Month (01-12 or 1-12)',
    }),
    ApiResponse({
      status: 200,
      description:
        'Monthly roster entries with duty base colors and completed duty indicators.',
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid year or month format.',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized. Missing or invalid Bearer token.',
    }),
  );
}
