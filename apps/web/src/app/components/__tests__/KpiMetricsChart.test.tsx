import { render, screen, waitFor } from "@testing-library/react";
import KpiMetrics from "../KpiMetrics";
import { getTrafficByCountry, getTrafficByVehicleType } from "@/app/lib/api";

jest.mock("@/app/lib/api");

const mockGetByCountry = getTrafficByCountry as jest.Mock;
const mockGetByVehicleType = getTrafficByVehicleType as jest.Mock;

describe("KpiStrip", () => {
  it("renders all three KPI labels", async () => {
    mockGetByCountry.mockResolvedValue([{ name: "UAE", vehicles: 18200 }]);
    mockGetByVehicleType.mockResolvedValue([{ name: "Sedan", count: 38200 }]);

    render(<KpiMetrics />);

    await waitFor(() => {
      expect(screen.getByText("Vehicles tracked")).toBeInTheDocument();
    });
    expect(screen.getByText("Top country")).toBeInTheDocument();
    expect(screen.getByText("Top vehicle type")).toBeInTheDocument();
  });

  it("shows computed values once data loads", async () => {
    mockGetByCountry.mockResolvedValue([{ name: "UAE", vehicles: 18200 }]);
    mockGetByVehicleType.mockResolvedValue([{ name: "Sedan", count: 38200 }]);

    render(<KpiMetrics />);

    await waitFor(() => {
      expect(screen.getByText("UAE")).toBeInTheDocument();
    });
    expect(screen.getByText("Sedan")).toBeInTheDocument();
  });
});
