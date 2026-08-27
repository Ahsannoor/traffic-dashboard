"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getTrafficByCountry } from "../lib/api";
import { CountryTraffic } from "../types/traffic";

const COLORS = [
  "#F5A623",
  "#2DD4BF",
  "#FF6B4A",
  "#7D8CFF",
  "#C9D14B",
  "#5B6472",
];

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

      {(isLoading || error) && (
        <div className="h-64 flex items-center justify-center text-sm text-gray-400">
          {isLoading && "Loading..."}
          {error && <span className="text-coral">{error}</span>}
        </div>
      )}

      {!isLoading && !error && (
        <ResponsiveContainer height={260} width="100%">
          <BarChart
            accessibilityLayer
            data={trafficDataByCountry}
            layout="horizontal"
            barCategoryGap="10%"
            barGap={4}
            margin={{ top: 4, right: 8, bottom: 0, left: -12 }}
          >
            <XAxis
              dataKey="name"
              tick={{ fill: "#8A93A3", fontSize: 11 }}
              axisLine={{ stroke: "#2A2F3A" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#8A93A3", fontSize: 11 }}
              axisLine={{ stroke: "#2A2F3A" }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#20242E",
                border: "1px solid #2A2F3A",
                borderRadius: 8,
              }}
              labelStyle={{ color: "#EDEFF3" }}
              itemStyle={{ color: "#8A93A3" }}
            />
            <Bar
              dataKey="vehicles"
              radius={[6, 6, 0, 0]}
              shape={(props: any) => (
                <Rectangle
                  {...props}
                  fill={COLORS[props.index % COLORS.length]}
                />
              )}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
