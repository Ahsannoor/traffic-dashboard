import { IngestionService } from './ingestion.service';
import { TrafficRecord } from '../traffic/entities/traffic-record.entity';
import { Repository } from 'typeorm';

describe('IngestionService', () => {
    let ingestionService: IngestionService;
    let trafficRepo: Repository<TrafficRecord>;

    beforeEach(() => {
        trafficRepo = new Repository<TrafficRecord>(TrafficRecord, null as any);
        ingestionService = new IngestionService(trafficRepo);
    });

    it('saves a batch of records and returns the inserted count', async () => {
        const records = [
            { country: 'Oman', vehicleType: 'SUV', count: 500, recordedAt: '2026-08-27T10:00:00Z' },
        ];

        jest.spyOn(trafficRepo, 'save').mockResolvedValue(records as any);

        const result = await ingestionService.upsertBatch(records as any);

        expect(result).toEqual({ inserted: 1 });
        expect(trafficRepo.save).toHaveBeenCalled();
    });
});