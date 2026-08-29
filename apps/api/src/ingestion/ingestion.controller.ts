import { Body, Controller, Post } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { CreateTrafficRecordDto } from './dto/create-traffic-record.dto';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('batch')
  ingestBatch(
    @Body() records: CreateTrafficRecordDto[],
  ): Promise<{ inserted: number }> {
    return this.ingestionService.upsertBatch(records);
  }
}
