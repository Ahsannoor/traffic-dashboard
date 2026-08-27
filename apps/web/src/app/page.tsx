import CountryTrafficChart from "./components/CountryTrafficChart";
import VehicleTypeChart from "./components/VehicleTypeChart";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <CountryTrafficChart />
      <VehicleTypeChart />
    </div>
  );
}
