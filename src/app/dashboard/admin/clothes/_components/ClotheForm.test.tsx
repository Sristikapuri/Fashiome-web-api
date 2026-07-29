import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ClotheForm from "./ClotheForm";

const pushMock = vi.fn();
const handleCreateClotheMock = vi.fn();
const handleUpdateClotheMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: { alt: string; src: string }) => <img alt={props.alt} src={props.src} />,
}));

vi.mock("@/lib/api/base-url", () => ({
  getApiBaseUrl: () => "http://localhost:8089",
}));

vi.mock("@/lib/actions/admin/clothes-action", () => ({
  handleCreateClothe: (...args: unknown[]) => handleCreateClotheMock(...args),
  handleUpdateClothe: (...args: unknown[]) => handleUpdateClotheMock(...args),
}));

beforeEach(() => {
  pushMock.mockClear();
  handleCreateClotheMock.mockReset();
  handleUpdateClotheMock.mockReset();
});

function fields(container: HTMLElement) {
  return {
    name: container.querySelector('input[name="name"]') as HTMLInputElement,
    category: container.querySelector('select[name="category"]') as HTMLSelectElement,
    size: container.querySelector('input[name="size"]') as HTMLInputElement,
    color: container.querySelector('input[name="color"]') as HTMLInputElement,
    price: container.querySelector('input[name="price"]') as HTMLInputElement,
    stock: container.querySelector('input[name="stock"]') as HTMLInputElement,
    status: container.querySelector('select[name="status"]') as HTMLSelectElement,
  };
}

describe("ClotheForm", () => {
  test("renders with the expected create defaults", () => {
    const { container } = render(<ClotheForm />);
    const { category, status } = fields(container);

    expect(category.value).toBe("tops");
    expect(status.value).toBe("active");
    expect(screen.getByRole("button", { name: /create item/i })).toBeInTheDocument();
  });

  test("shows required-field validation errors and does not submit", async () => {
    const { container } = render(<ClotheForm />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /create item/i }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/size is required/i)).toBeInTheDocument();
    expect(screen.getByText(/color is required/i)).toBeInTheDocument();
    expect(handleCreateClotheMock).not.toHaveBeenCalled();
    void container;
  });

  test("submits a valid item and navigates back to the catalog", async () => {
    handleCreateClotheMock.mockResolvedValue({ success: true });
    const { container } = render(<ClotheForm />);
    const user = userEvent.setup();
    const { name, size, color, price, stock } = fields(container);

    await user.type(name, "Silk Blazer");
    await user.type(size, "M");
    await user.type(color, "Beige");
    await user.clear(price);
    await user.type(price, "89.99");
    await user.clear(stock);
    await user.type(stock, "12");
    await user.click(screen.getByRole("button", { name: /create item/i }));

    await vi.waitFor(() => expect(handleCreateClotheMock).toHaveBeenCalledTimes(1));
    const submittedFormData = handleCreateClotheMock.mock.calls[0][0] as FormData;
    expect(submittedFormData.get("name")).toBe("Silk Blazer");
    expect(submittedFormData.get("color")).toBe("Beige");
    expect(submittedFormData.get("price")).toBe("89.99");

    await vi.waitFor(() => expect(pushMock).toHaveBeenCalledWith("/dashboard/admin/clothes"));
  });

  test("shows an error message when the save action fails", async () => {
    handleCreateClotheMock.mockResolvedValue({ success: false, message: "Failed to save clothes item" });
    const { container } = render(<ClotheForm />);
    const user = userEvent.setup();
    const { name, size, color } = fields(container);

    await user.type(name, "Silk Blazer");
    await user.type(size, "M");
    await user.type(color, "Beige");
    await user.click(screen.getByRole("button", { name: /create item/i }));

    expect(await screen.findByText(/failed to save clothes item/i)).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
