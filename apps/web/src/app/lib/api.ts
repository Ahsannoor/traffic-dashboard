import { CountryTraffic, TrafficQuery, VehicleTypeTraffic } from "../types/traffic";


const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

async function getTraffic<T>(endpoint: string, query?: TrafficQuery): Promise<T> {
    const params = new URLSearchParams(query as Record<string, string>).toString();
    const res = await fetch(`${BASE_URL}/traffic/${endpoint}${params ? `?${params}` : ""}`, {
        cache: "no-store",
    });

    if (!res.ok) throw new Error(`Failed to load ${endpoint} (${res.status})`);
    return res.json();
}

export const getTrafficByCountry = (query?: TrafficQuery) =>
    getTraffic<CountryTraffic[]>("by-country", query);

export const getTrafficByVehicleType = (query?: TrafficQuery) =>
    getTraffic<VehicleTypeTraffic[]>("by-vehicle-type", query);