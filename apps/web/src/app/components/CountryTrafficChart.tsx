"use client";

import { useEffect, useState } from "react";
import { CountryTraffic } from "../types/traffic";
import { getTrafficByCountry } from "../lib/api";

export default function CountryTrafficChart() {
  const [trafficDataByCountry, setTrafficDataByCountry] = useState<
    CountryTraffic[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getTrafficByCountry();
        setTrafficDataByCountry(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="rounded-xl border p-5">
      <h2 className="text-base font-medium mb-4">Country-wise traffic</h2>
      <div className="h-64 flex items-center justify-center text-sm text-gray-400">
        {isLoading && "Loading..."}
        {error && <span className="text-coral">{error}</span>}
      </div>
    </div>
  );
}
