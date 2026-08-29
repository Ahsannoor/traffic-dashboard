import { IngestionService } from './ingestion.service';
import { TrafficRecord } from '../traffic/entities/traffic-record.entity';
import { Repository } from 'typeorm';
import type { Cache } from 'cache-manager';
import { CreateTrafficRecordDto } from './dto/create-traffic-record.dto';

describe('IngestionService', () => {
  let ingestionService: IngestionService;
  let trafficRepo: Repository<TrafficRecord>;
  let cache: jest.Mocked<Pick<Cache, 'get' | 'set'>>;

  beforeEach(() => {
    trafficRepo = new Repository<TrafficRecord>(TrafficRecord, null as any);
    cache = {
      get: jest.fn().mockResolvedValue(undefined),
      set: jest.fn().mockResolvedValue(undefined),
    };
    ingestionService = new IngestionService(
      trafficRepo,
      cache as unknown as Cache,
    );
  });

  it('saves a batch of records and returns the inserted count', async () => {
    const records = [
      {
        country: 'Oman',
        vehicleType: 'SUV',
        count: 500,
        recordedAt: '2026-08-27T10:00:00Z',
      },
    ] as CreateTrafficRecordDto[];

    jest.spyOn(trafficRepo, 'save').mockResolvedValue(records as any);

    const result = await ingestionService.upsertBatch(records);

    expect(result).toEqual({ inserted: 1 });
    expect(trafficRepo.save).toHaveBeenCalled();
  });

  it('merges new counts into the cached country aggregate when present', async () => {
    const records = [
      {
        country: 'Oman',
        vehicleType: 'SUV',
        count: 500,
        recordedAt: '2026-08-27T10:00:00Z',
      },
    ] as CreateTrafficRecordDto[];

    jest.spyOn(trafficRepo, 'save').mockResolvedValue(records as any);
    cache.get.mockImplementation(async (key: string) =>
      key === 'traffic:by-country::'
        ? [{ name: 'Oman', vehicles: 1000 }]
        : undefined,
    );

    await ingestionService.upsertBatch(records);

    expect(cache.set).toHaveBeenCalledWith('traffic:by-country::', [
      { name: 'Oman', vehicles: 1500 },
    ]);
  });
});
