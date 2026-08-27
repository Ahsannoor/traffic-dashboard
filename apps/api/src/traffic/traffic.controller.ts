import { Controller, Get } from '@nestjs/common';
import { TrafficService } from './traffic.service';

@Controller('traffic')
export class TrafficController {
    constructor(private readonly trafficService: TrafficService) { }

    @Get('by-country')
    byCountry() {
        return this.trafficService.byCountry();
    }

    @Get('by-vehicle-type')
    byVehicleType() {
        return this.trafficService.byVehicleType();
    }
}