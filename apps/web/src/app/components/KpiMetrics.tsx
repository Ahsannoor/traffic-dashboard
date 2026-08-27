"use client";

import { useEffect, useState } from "react";
import { CountryTraffic, VehicleTypeTraffic } from "../types/traffic";
import { getTrafficByCountry, getTrafficByVehicleType } from "../lib/api";

export default function KpiMetrics() {
  const [countryData, setCountryData] = useState<CountryTraffic[]>([]);
  const [vehicleData, setVehicleData] = useState<VehicleTypeTraffic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [countries, vehicles] = await Promise.all([
          getTrafficByCountry(),
          getTrafficByVehicleType(),
        ]);
        setCountryData(countries);
        setVehicleData(vehicles);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const totalVehicles = countryData.reduce((sum, c) => sum + c.vehicles, 0);
  const topCountry = countryData[0]?.name ?? "—";
  const topVehicleType = vehicleData[0]?.name ?? "—";

  const kpis = [
    {
      label: "Vehicles tracked",
      value: isLoading ? "—" : totalVehicles.toLocaleString(),
      accent: "text-amber",
    },
    {
      label: "Top country",
      value: isLoading ? "—" : topCountry,
      accent: "text-teal",
    },
    {
      label: "Top vehicle type",
      value: isLoading ? "—" : topVehicleType,
      accent: "text-coral",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 select-none cursor-default">
      {error && (
        <div className="col-span-full rounded-xl p-4 bg-surface border border-border text-sm text-coral">
          {error}
        </div>
      )}
      {!error &&
        kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl p-4 bg-surface border border-border"
          >
            <p className="text-xs mb-2 text-textMuted select-none cursor-default">
              {kpi.label}
            </p>
            <p
              className={`text-lg font-mono font-bold select-none cursor-default ${kpi.accent}`}
            >
              {kpi.value}
            </p>
          </div>
        ))}
    </div>
  );
}
