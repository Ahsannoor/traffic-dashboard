import { Controller, Get, Query } from '@nestjs/common';
import { TrafficService } from './traffic.service';
import { TrafficQueryDto } from './dto/traffic-query.dto';
import { CountryTraffic, VehicleTypeTraffic } from './dto/traffic-reponse.dto';

@Controller('traffic')
export class TrafficController {
    constructor(private readonly trafficService: TrafficService) { }

    @Get('by-country')
    byCountry(@Query() query: TrafficQueryDto): Promise<CountryTraffic[]> {
        return this.trafficService.byCountry(query);
    }

    @Get('by-vehicle-type')
    byVehicleType(@Query() query: TrafficQueryDto): Promise<VehicleTypeTraffic[]> {
        return this.trafficService.byVehicleType(query);
    }
}