import { render, screen, waitFor } from "@testing-library/react";
import CountryTrafficChart from "../CountryTrafficChart";
import { getTrafficByCountry } from "@/app/lib/api";

jest.mock("@/app/lib/api");
jest.mock("recharts");

const mockGetByCountry = getTrafficByCountry as jest.Mock;

describe("CountryTrafficChart", () => {
  it("shows loading state initially", () => {
    mockGetByCountry.mockReturnValue(new Promise(() => {}));
    render(<CountryTrafficChart />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders the chart title once data loads", async () => {
    mockGetByCountry.mockResolvedValue([{ name: "UAE", vehicles: 18200 }]);
    render(<CountryTrafficChart />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Country-wise traffic")).toBeInTheDocument();
  });

  it("shows the bar/line/pie toggle once data loads", async () => {
    mockGetByCountry.mockResolvedValue([{ name: "UAE", vehicles: 18200 }]);
    render(<CountryTrafficChart />);

    await waitFor(() => {
      expect(screen.getByText("bar")).toBeInTheDocument();
    });
    expect(screen.getByText("line")).toBeInTheDocument();
    expect(screen.getByText("pie")).toBeInTheDocument();
  });

  it("shows an error message on failure", async () => {
    mockGetByCountry.mockRejectedValue(
      new Error("Failed to load country traffic data (500)"),
    );
    render(<CountryTrafficChart />);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load country traffic data (500)"),
      ).toBeInTheDocument();
    });
  });
});
