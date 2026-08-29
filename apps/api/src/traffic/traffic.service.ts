import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { TrafficRecord } from './entities/traffic-record.entity';
import { TrafficQueryDto } from './dto/traffic-query.dto';
import { CountryTraffic, VehicleTypeTraffic } from './dto/traffic-reponse.dto';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class TrafficService {
  private readonly logger = new Logger(TrafficService.name);

  constructor(
    @InjectRepository(TrafficRecord)
    private readonly repo: Repository<TrafficRecord>,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  async byCountry(query: TrafficQueryDto): Promise<CountryTraffic[]> {
    try {
      const cacheKey = `traffic:by-country:${query.from ?? ''}:${query.to ?? ''}`;
      const cached = await this.cache.get<CountryTraffic[]>(cacheKey);
      if (cached) return cached;

      const qb = this.repo
        .createQueryBuilder('t')
        .select('t.country', 'name')
        .addSelect('SUM(t.count)', 'vehicles')
        .groupBy('t.country')
        .orderBy('vehicles', 'DESC');

      this.applyDateRange(qb, query);

      const rows = await qb.getRawMany<{ name: string; vehicles: string }>();
      const result = rows.map((row) => ({
        name: row.name,
        vehicles: Number(row.vehicles),
      }));

      await this.cache.set(cacheKey, result);
      return result;
    } catch (error) {
      this.logger.error('Failed to aggregate traffic by country', error);
      throw new InternalServerErrorException(
        'Unable to load traffic data by country',
      );
    }
  }

  async byVehicleType(query: TrafficQueryDto): Promise<VehicleTypeTraffic[]> {
    try {
      const cacheKey = `traffic:by-vehicle:${query.from ?? ''}:${query.to ?? ''}`;
      const cached = await this.cache.get<VehicleTypeTraffic[]>(cacheKey);
      if (cached) return cached;

      const qb = this.repo
        .createQueryBuilder('t')
        .select('t.vehicle_type', 'name')
        .addSelect('SUM(t.count)', 'count')
        .groupBy('t.vehicle_type')
        .orderBy('count', 'DESC');

      this.applyDateRange(qb, query);

      const rows = await qb.getRawMany<{ name: string; count: string }>();
      const result = rows.map((row) => ({
        name: row.name,
        count: Number(row.count),
      }));

      await this.cache.set(cacheKey, result);
      return result;
    } catch (error) {
      this.logger.error('Failed to aggregate traffic by vehicle type', error);
      throw new InternalServerErrorException(
        'Unable to load traffic data by vehicle type',
      );
    }
  }

  private applyDateRange(
    qb: SelectQueryBuilder<TrafficRecord>,
    query: TrafficQueryDto,
  ) {
    if (query.from) qb.andWhere('t.recorded_at >= :from', { from: query.from });
    if (query.to) qb.andWhere('t.recorded_at <= :to', { to: query.to });
  }
}
