import { render, screen, fireEvent } from "@testing-library/react";
import SegmentedControl from "../SegmentedControl";

describe("SegmentedControl", () => {
  it("renders all three chart type options", () => {
    render(<SegmentedControl value="bar" onChange={() => {}} />);

    expect(screen.getByText("bar")).toBeInTheDocument();
    expect(screen.getByText("line")).toBeInTheDocument();
    expect(screen.getByText("pie")).toBeInTheDocument();
  });

  it("calls onChange with the clicked option", () => {
    const handleChange = jest.fn();
    render(<SegmentedControl value="bar" onChange={handleChange} />);

    fireEvent.click(screen.getByText("line"));

    expect(handleChange).toHaveBeenCalledWith("line");
  });
});
