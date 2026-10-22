import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { DocumentsResponse } from '../../types';
import { ApiGetDocuments } from './decorators/documents-swagger.decorator';

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  @ApiGetDocuments()
  getDocuments(): DocumentsResponse {
    return this.documentsService.getEvaluatedDocuments();
  }
}
