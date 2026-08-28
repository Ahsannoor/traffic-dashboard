"use client";
import { useState } from "react";
import CountryTrafficChart from "./components/CountryTrafficChart";
import KpiMetrics from "./components/KpiMetrics";
import VehicleTypeChart from "./components/VehicleTypeChart";
import DateRangeFilter from "./components/DateRangeFilter";

export default function DashboardPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  return (
    <div className="space-y-6">
      <section aria-label="Date range filter" className="flex-end">
        <DateRangeFilter
          from={from}
          to={to}
          onChange={(f, t) => {
            setFrom(f);
            setTo(t);
          }}
        />
      </section>
      <KpiMetrics from={from} to={to} />
      <CountryTrafficChart from={from} to={to} />
      <VehicleTypeChart from={from} to={to} />
    </div>
  );
}
