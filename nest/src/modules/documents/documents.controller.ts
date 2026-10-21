import { Controller, Get } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsResponse } from '../../types';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  getDocuments(): DocumentsResponse {
    return this.documentsService.getEvaluatedDocuments();
  }
}
