import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrafficRecord } from './entities/traffic-record.entity';
import { CountryTraffic, VehicleTypeTraffic } from './dto/traffic-reponse.dto';

@Injectable()
export class TrafficService {
    private readonly logger = new Logger(TrafficService.name);

    constructor(
        @InjectRepository(TrafficRecord)
        private readonly repo: Repository<TrafficRecord>,
    ) { }

    async byCountry(): Promise<CountryTraffic[]> {
        try {
            const rows = await this.repo
                .createQueryBuilder('t')
                .select('t.country', 'name')
                .addSelect('SUM(t.count)', 'vehicles')
                .groupBy('t.country')
                .orderBy('vehicles', 'DESC')
                .getRawMany<{ name: string; vehicles: string }>();

            return rows.map((row) => ({ name: row.name, vehicles: Number(row.vehicles) }));
        } catch (error) {
            this.logger.error('Failed to aggregate traffic by country', error);
            throw new InternalServerErrorException('Unable to load traffic data by country');
        }
    }

    async byVehicleType(): Promise<VehicleTypeTraffic[]> {
        try {
            const rows = await this.repo
                .createQueryBuilder('t')
                .select('t.vehicle_type', 'name')
                .addSelect('SUM(t.count)', 'count')
                .groupBy('t.vehicle_type')
                .orderBy('count', 'DESC')
                .getRawMany<{ name: string; count: string }>();

            return rows.map((row) => ({ name: row.name, count: Number(row.count) }));
        } catch (error) {
            this.logger.error('Failed to aggregate traffic by vehicle type', error);
            throw new InternalServerErrorException('Unable to load traffic data by vehicle type');
        }
    }
}