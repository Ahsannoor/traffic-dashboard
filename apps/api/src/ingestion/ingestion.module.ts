import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrafficRecord } from 'src/traffic/entities/traffic-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrafficRecord])],
  providers: [IngestionService],
  controllers: [IngestionController],
})
export class IngestionModule {}
