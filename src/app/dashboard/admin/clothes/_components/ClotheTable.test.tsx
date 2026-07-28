import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ClotheTable from "./ClotheTable";
import type { AdminClothe, PaginationMeta } from "@/lib/api/admin/clothes";

const pushMock = vi.fn();
const refreshMock = vi.fn();
const handleDeleteClotheMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, refresh: refreshMock }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: any) => (
    <a href={typeof href === "string" ? href : "#"} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("@/lib/actions/admin/clothes-action", () => ({
  handleDeleteClothe: (...args: unknown[]) => handleDeleteClotheMock(...args),
}));

beforeEach(() => {
  pushMock.mockClear();
  refreshMock.mockClear();
  handleDeleteClotheMock.mockReset();
});

const pagination: PaginationMeta = { page: 1, limit: 10, total: 1, totalPages: 1 };

function buildItem(overrides: Partial<AdminClothe> = {}): AdminClothe {
  return {
    _id: "clothe-1",
    name: "Silk Blazer",
    category: "outerwear",
    size: "M",
    color: "Beige",
    price: 89.99,
    stock: 12,
    status: "active",
    description: "",
    imageUrl: "",
    ...overrides,
  } as AdminClothe;
}

describe("ClotheTable", () => {
  test("renders a row for each item", () => {
    render(
      <ClotheTable data={[buildItem()]} pagination={pagination} search="" category="" status="" />
    );

    expect(screen.getByText("Silk Blazer")).toBeInTheDocument();
    expect(screen.getByText("Beige")).toBeInTheDocument();
    expect(screen.getByText("$89.99")).toBeInTheDocument();
  });

  test("shows an empty state when there are no items", () => {
    render(
      <ClotheTable
        data={[]}
        pagination={{ page: 1, limit: 10, total: 0, totalPages: 1 }}
        search=""
        category=""
        status=""
      />
    );

    expect(screen.getByText(/no clothes found/i)).toBeInTheDocument();
  });

  test("searching updates the URL query with the search term", async () => {
    const user = userEvent.setup();
    render(<ClotheTable data={[buildItem()]} pagination={pagination} search="" category="" status="" />);

    await user.type(screen.getByPlaceholderText(/search clothes by name/i), "Blazer");
    await user.click(screen.getByRole("button", { name: /^search$/i }));

    expect(pushMock).toHaveBeenCalledTimes(1);
    const url = pushMock.mock.calls[0][0] as string;
    expect(url).toContain("/dashboard/admin/clothes?");
    expect(url).toContain("search=Blazer");
    expect(url).toContain("page=1");
  });

  test("deleting an item asks for confirmation, then calls the delete action", async () => {
    handleDeleteClotheMock.mockResolvedValue({ success: true });
    const user = userEvent.setup();
    const item = buildItem();
    render(<ClotheTable data={[item]} pagination={pagination} search="" category="" status="" />);

    await user.click(screen.getByRole("button", { name: `Delete ${item.name}` }));
    expect(screen.getByRole("dialog", { name: /delete clothes item/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^delete$/i }));

    await vi.waitFor(() => expect(handleDeleteClotheMock).toHaveBeenCalledWith(item._id));
    await vi.waitFor(() => expect(refreshMock).toHaveBeenCalled());
  });
});
