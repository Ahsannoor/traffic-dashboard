import CountryTrafficChart from "./components/CountryTrafficChart";
import KpiMetrics from "./components/KpiMetrics";
import VehicleTypeChart from "./components/VehicleTypeChart";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <KpiMetrics />
      <CountryTrafficChart />
      <VehicleTypeChart />
    </div>
  );
}
