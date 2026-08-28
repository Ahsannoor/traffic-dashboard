import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrafficRecord } from '../traffic/entities/traffic-record.entity';
import { CreateTrafficRecordDto } from './dto/create-traffic-record.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { CountryTraffic, VehicleTypeTraffic } from 'src/traffic/dto/traffic-reponse.dto';

@Injectable()
export class IngestionService {
    private readonly logger = new Logger(IngestionService.name);

    constructor(
        @InjectRepository(TrafficRecord)
        private readonly repo: Repository<TrafficRecord>,
        @Inject(CACHE_MANAGER)
        private readonly cache: Cache,
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

            await this.updateCountryCache(records);
            await this.updateVehicleTypeCache(records);

            return { inserted: saved.length };
        } catch (error) {
            this.logger.error('Failed to ingest traffic records', error);
            throw new InternalServerErrorException('Unable to save traffic records');
        }
    }

    private async updateCountryCache(records: CreateTrafficRecordDto[]) {
        const cacheKey = 'traffic:by-country::';
        const cached = await this.cache.get<CountryTraffic[]>(cacheKey);
        if (!cached) return; // nothing cached yet — next GET will populate it fresh

        const updated = [...cached];
        for (const record of records) {
            const existing = updated.find((c) => c.name === record.country);
            if (existing) {
                existing.vehicles += record.count;
            } else {
                updated.push({ name: record.country, vehicles: record.count });
            }
        }
        updated.sort((a, b) => b.vehicles - a.vehicles);
        await this.cache.set(cacheKey, updated);
    }

    private async updateVehicleTypeCache(records: CreateTrafficRecordDto[]) {
        const cacheKey = 'traffic:by-vehicle-type::';
        const cached = await this.cache.get<VehicleTypeTraffic[]>(cacheKey);
        if (!cached) return;

        const updated = [...cached];
        for (const record of records) {
            const existing = updated.find((v) => v.name === record.vehicleType);
            if (existing) {
                existing.count += record.count;
            } else {
                updated.push({ name: record.vehicleType, count: record.count });
            }
        }
        updated.sort((a, b) => b.count - a.count);
        await this.cache.set(cacheKey, updated);
    }

}