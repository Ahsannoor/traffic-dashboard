import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { TrafficRecord } from './entities/traffic-record.entity';
import { TrafficQueryDto } from './dto/traffic-query.dto';
import { CountryTraffic, VehicleTypeTraffic } from './dto/traffic-reponse.dto';

@Injectable()
export class TrafficService {
    private readonly logger = new Logger(TrafficService.name);

    constructor(
        @InjectRepository(TrafficRecord)
        private readonly repo: Repository<TrafficRecord>,
    ) { }

    async byCountry(query: TrafficQueryDto): Promise<CountryTraffic[]> {
        try {
            const qb = this.repo
                .createQueryBuilder('t')
                .select('t.country', 'name')
                .addSelect('SUM(t.count)', 'vehicles')
                .groupBy('t.country')
                .orderBy('vehicles', 'DESC');

            this.applyDateRange(qb, query);

            const rows = await qb.getRawMany<{ name: string; vehicles: string }>();
            return rows.map((row) => ({ name: row.name, vehicles: Number(row.vehicles) }));
        } catch (error) {
            this.logger.error('Failed to aggregate traffic by country', error);
            throw new InternalServerErrorException('Unable to load traffic data by country');
        }
    }

    async byVehicleType(query: TrafficQueryDto): Promise<VehicleTypeTraffic[]> {
        try {
            const qb = this.repo
                .createQueryBuilder('t')
                .select('t.vehicle_type', 'name')
                .addSelect('SUM(t.count)', 'count')
                .groupBy('t.vehicle_type')
                .orderBy('count', 'DESC');

            this.applyDateRange(qb, query);

            const rows = await qb.getRawMany<{ name: string; count: string }>();
            return rows.map((row) => ({ name: row.name, count: Number(row.count) }));
        } catch (error) {
            this.logger.error('Failed to aggregate traffic by vehicle type', error);
            throw new InternalServerErrorException('Unable to load traffic data by vehicle type');
        }
    }

    private applyDateRange(qb: SelectQueryBuilder<TrafficRecord>, query: TrafficQueryDto) {
        if (query.from) qb.andWhere('t.recorded_at >= :from', { from: query.from });
        if (query.to) qb.andWhere('t.recorded_at <= :to', { to: query.to });
    }
}