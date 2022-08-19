import React from "react";
import ConfigScreen from "./";
import { render } from "@testing-library/react";
import { mockCma, mockSdk } from "../../../test/mocks";

jest.mock("@contentful/react-apps-toolkit", () => ({
  useSDK: () => mockSdk,
  useCMA: () => mockCma,
}));

describe("Config Screen component", () => {
  it("Component mounts", async () => {
    const { getByText } = render(<ConfigScreen />);

    // simulate the user clicking the install button
    await mockSdk.app.onConfigure.mock.calls[0][0]();

    expect(getByText("Configuration Details")).toBeInTheDocument();
    expect(
      getByText(
        "To start posting publishing notifications we must first configure some application values"
      )
    ).toBeInTheDocument();
  });
});
