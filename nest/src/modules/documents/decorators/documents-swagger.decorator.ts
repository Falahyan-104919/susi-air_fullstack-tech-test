import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiGetDocuments() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary:
        'Retrieve pilot certification documents with server-evaluated expiry and urgency status',
    }),
    ApiResponse({
      status: 200,
      description:
        'List of documents evaluated against reference date (2026-05-15) in urgency order.',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized. Missing or invalid Bearer token.',
    }),
  );
}
