import React from "react";
import Sidebar from "./";
import { render } from "@testing-library/react";
import { mockCma, mockSdk } from "../../../test/mocks";

jest.mock("@contentful/react-apps-toolkit", () => ({
  useSDK: () => mockSdk,
  useCMA: () => mockCma,
}));

describe("Sidebar component", () => {
  it("Component mounts", () => {
    const { getAllByText, getByText } = render(<Sidebar />);

    expect(getAllByText("Request Publication")).toHaveLength(2);
    expect(
      getByText("Send a notification to require this entry to be published")
    ).toBeInTheDocument();
  });
});
