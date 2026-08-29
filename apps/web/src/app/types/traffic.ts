export interface CountryTraffic {
  name: string;
  vehicles: number;
  fill: string;
}

export interface VehicleTypeTraffic {
  name: string;
  count: number;
  fill: string;
}

export interface TrafficQuery {
  from?: string;
  to?: string;
}
