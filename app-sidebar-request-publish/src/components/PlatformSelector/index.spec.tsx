import React from "react";
import PlatformSelector from "./";
import { render } from "@testing-library/react";

describe("PlatformSelector component", () => {
  it("Component mounts", async () => {
    const { getByText } = render(
      <PlatformSelector onPlatformChange={jest.fn(console.log)} />
    );

    expect(getByText("Platform")).toBeInTheDocument();
    expect(
      getByText(
        "Before configuring the necessary values, select the desired platform for integration."
      )
    ).toBeInTheDocument();
  });
});
