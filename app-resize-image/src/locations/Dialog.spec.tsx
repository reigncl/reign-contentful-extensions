import Dialog from "./Dialog";
import { fireEvent, render } from "@testing-library/react";
import { mockCma, mockSdk } from "../../test/mocks";

jest.mock("@contentful/react-apps-toolkit", () => ({
  useSDK: () => mockSdk,
  useCMA: () => mockCma,
}));

describe("Dialog component", () => {
  it("should render the Note element", () => {
    const { getByText } = render(<Dialog />);
    expect(
      getByText(
        "Now you can edit the dimensions of your newly uploaded image, dragging its corners and getting a new resized image"
      )
    ).toBeInTheDocument();
  });

  it("should render the ResizableImage element", async () => {
    const { getByRole } = render(<Dialog />);
    const resizableImage = getByRole("img");
    expect(resizableImage).toBeInTheDocument();
  });

  it("should show the image size when resizing the image", async () => {
    const { getByRole, getByText } = render(<Dialog />);
    const resizableImage = getByRole("img");

    //simulate resizing the image
    fireEvent.mouseDown(resizableImage);
    fireEvent.mouseMove(resizableImage, { clientX: 100, clientY: 50 });

    //check if the badge elements with the selected size are displayed
    expect(getByText(/width/i)).toBeInTheDocument();
    expect(getByText(/height/i)).toBeInTheDocument();
  });
});

