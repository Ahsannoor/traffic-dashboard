"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Sector,
} from "recharts";
import SegmentedControl from "./SegmentedControl";
import { CountryTraffic } from "../types/traffic";
import { getTrafficByCountry } from "../lib/api";
import { scaleOrdinal } from "d3-scale";
import { schemeSet2 } from "d3-scale-chromatic";

function getColorScale(names: string[]) {
  return scaleOrdinal<string, string>().domain(names).range(schemeSet2);
}

export default function CountryTrafficChart() {
  const [trafficDataByCountry, setTrafficDataByCountry] = useState<
    CountryTraffic[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getTrafficByCountry();
        const colorScale = getColorScale(data.map((d) => d.name));
        const withColors = data.map((entry) => ({
          ...entry,
          fill: colorScale(entry.name),
        }));

        setTrafficDataByCountry(withColors);
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
      <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
        <h2 className="text-base font-medium">Country-wise traffic</h2>
        <SegmentedControl value={chartType} onChange={setChartType} />
      </div>

      {(isLoading || error) && (
        <div className="h-64 flex items-center justify-center text-sm text-gray-400">
          {isLoading && "Loading..."}
          {error && <span className="text-coral">{error}</span>}
        </div>
      )}

      {!isLoading && !error && (
        <ResponsiveContainer height={260} width="100%">
          {chartType === "bar" ? (
            <BarChart
              accessibilityLayer
              data={trafficDataByCountry}
              layout="horizontal"
              barCategoryGap="10%"
              barGap={4}
              margin={{ top: 4, right: 8, bottom: 0, left: -12 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#2A2F3A"
                vertical={false}
              />
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
                  <Rectangle {...props} fill={props.payload.fill} />
                )}
              />
            </BarChart>
          ) : chartType === "line" ? (
            <LineChart
              data={trafficDataByCountry}
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
              <Line
                type="monotone"
                dataKey="vehicles"
                stroke="#2DD4BF"
                strokeWidth={2}
                dot={{ r: 3, fill: "#2DD4BF" }}
              />
            </LineChart>
          ) : (
            <PieChart>
              <Tooltip
                contentStyle={{
                  background: "#20242E",
                  border: "1px solid #2A2F3A",
                  borderRadius: 8,
                }}
                labelStyle={{ color: "#EDEFF3" }}
                itemStyle={{ color: "#8A93A3" }}
              />
              <Legend
                {...({
                  wrapperStyle: { fontSize: 11 },
                  formatter: (value: string) => (
                    <span style={{ color: "#FFFFFF" }}>{value}</span>
                  ),
                  payload: trafficDataByCountry.map((entry) => ({
                    value: entry.name,
                    type: "square",
                    color: entry.fill,
                  })),
                } as any)}
              />
              <Pie
                data={trafficDataByCountry}
                dataKey="vehicles"
                nameKey="name"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
                shape={(props: any) => (
                  <Sector {...props} fill={props.payload.fill} />
                )}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
}
