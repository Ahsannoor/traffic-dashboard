import { TrafficService } from './traffic.service';
import { TrafficRecord } from './entities/traffic-record.entity';
import { Repository } from 'typeorm';
import type { Cache } from 'cache-manager';

describe('TrafficService', () => {
    let trafficService: TrafficService;
    let trafficRepo: Repository<TrafficRecord>;
    let cache: jest.Mocked<Pick<Cache, 'get' | 'set'>>;

    const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawMany: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        trafficRepo = new Repository<TrafficRecord>(TrafficRecord, null as any);
        cache = { get: jest.fn().mockResolvedValue(undefined), set: jest.fn().mockResolvedValue(undefined) };
        trafficService = new TrafficService(trafficRepo, cache as unknown as Cache);
    });

    describe('byCountry', () => {
        it('converts SUM string to number', async () => {
            jest.spyOn(trafficRepo, 'createQueryBuilder').mockImplementation(() => mockQueryBuilder as any);
            mockQueryBuilder.getRawMany.mockResolvedValue([{ name: 'UAE', vehicles: '18200' }]);

            const result = await trafficService.byCountry({});

            expect(result).toEqual([{ name: 'UAE', vehicles: 18200 }]);
        });

        it('applies from/to date filters when provided', async () => {
            jest.spyOn(trafficRepo, 'createQueryBuilder').mockImplementation(() => mockQueryBuilder as any);
            mockQueryBuilder.getRawMany.mockResolvedValue([]);

            await trafficService.byCountry({ from: '2026-01-01', to: '2026-12-31' });

            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('t.recorded_at >= :from', {
                from: '2026-01-01',
            });
            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('t.recorded_at <= :to', {
                to: '2026-12-31',
            });
        });
    });

    describe('byVehicleType', () => {
        it('converts SUM string to number', async () => {
            jest.spyOn(trafficRepo, 'createQueryBuilder').mockImplementation(() => mockQueryBuilder as any);
            mockQueryBuilder.getRawMany.mockResolvedValue([{ name: 'Sedan', count: '38200' }]);

            const result = await trafficService.byVehicleType({});

            expect(result).toEqual([{ name: 'Sedan', count: 38200 }]);
        });

        it('returns an empty array when there are no records', async () => {
            jest.spyOn(trafficRepo, 'createQueryBuilder').mockImplementation(() => mockQueryBuilder as any);
            mockQueryBuilder.getRawMany.mockResolvedValue([]);

            const result = await trafficService.byVehicleType({});

            expect(result).toEqual([]);
        });
    });
});