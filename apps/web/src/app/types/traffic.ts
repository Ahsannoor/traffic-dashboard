export interface CountryTraffic {
    name: string;
    vehicles: number;
}

export interface VehicleTypeTraffic {
    name: string;
    count: number;
}

export interface TrafficQuery {
    from?: string;
    to?: string;
}