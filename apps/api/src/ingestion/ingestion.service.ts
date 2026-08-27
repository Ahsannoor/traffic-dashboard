import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrafficRecord } from '../traffic/entities/traffic-record.entity';
import { CreateTrafficRecordDto } from './dto/create-traffic-record.dto';

@Injectable()
export class IngestionService {
    private readonly logger = new Logger(IngestionService.name);

    constructor(
        @InjectRepository(TrafficRecord)
        private readonly repo: Repository<TrafficRecord>,
    ) { }

    async upsertBatch(records: CreateTrafficRecordDto[]): Promise<{ inserted: number }> {
        try {
            const entities = records.map((r) => ({
                country: r.country,
                vehicleType: r.vehicleType,
                count: r.count,
                recordedAt: new Date(r.recordedAt),
            }));
            const saved = await this.repo.save(entities);
            return { inserted: saved.length };
        } catch (error) {
            this.logger.error('Failed to ingest traffic records', error);
            throw new InternalServerErrorException('Unable to save traffic records');
        }
    }
}