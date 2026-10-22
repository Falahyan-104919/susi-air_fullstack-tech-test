import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';

export function ApiGetFlightHoursRange() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary:
        'Query continuous daily flight hours within a specific date range',
    }),
    ApiQuery({
      name: 'from',
      required: true,
      example: '2026-05-01',
      description: 'Start date in ISO 8601 format (YYYY-MM-DD)',
    }),
    ApiQuery({
      name: 'to',
      required: true,
      example: '2026-05-15',
      description: 'End date in ISO 8601 format (YYYY-MM-DD)',
    }),
    ApiResponse({
      status: 200,
      description: 'Array of continuous daily flight hour records.',
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid date format or start date exceeds end date.',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized. Missing or invalid Bearer token.',
    }),
  );
}

export function ApiGetFlightHoursSummary() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary:
        'Retrieve rolling sum series (15 days centered on May 15) and regulatory limit cards',
    }),
    ApiQuery({
      name: 'range',
      required: false,
      enum: ['1w', '1m', '3m', '6m', '1y'],
      example: '1w',
      description: 'Rolling sum window calculation range',
    }),
    ApiResponse({
      status: 200,
      description:
        'Summary payload containing regulatory cards, bounds, and 15-day series points.',
    }),
    ApiResponse({
      status: 400,
      description: 'Unsupported range value.',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized. Missing or invalid Bearer token.',
    }),
  );
}
