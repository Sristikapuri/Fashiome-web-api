import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserForm from "./UserForm";

const pushMock = vi.fn();
const handleCreateUserMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/lib/actions/admin/user-action", () => ({
  handleCreateUser: (...args: unknown[]) => handleCreateUserMock(...args),
}));

beforeEach(() => {
  pushMock.mockClear();
  handleCreateUserMock.mockReset();
});

function fields(container: HTMLElement) {
  return {
    email: container.querySelector('input[name="email"]') as HTMLInputElement,
    firstName: container.querySelector('input[name="firstName"]') as HTMLInputElement,
    lastName: container.querySelector('input[name="lastName"]') as HTMLInputElement,
    username: container.querySelector('input[name="username"]') as HTMLInputElement,
    password: container.querySelector('input[name="password"]') as HTMLInputElement,
    gender: container.querySelector('select[name="gender"]') as HTMLSelectElement,
    role: container.querySelector('select[name="role"]') as HTMLSelectElement,
    status: container.querySelector('select[name="status"]') as HTMLSelectElement,
  };
}

describe("UserForm", () => {
  test("renders with the expected defaults", () => {
    const { container } = render(<UserForm />);
    const { gender, role, status } = fields(container);

    expect(gender.value).toBe("female");
    expect(role.value).toBe("user");
    expect(status.value).toBe("active");
  });

  test("shows a validation error for a password shorter than 6 characters", async () => {
    const { container } = render(<UserForm />);
    const user = userEvent.setup();
    const { email, firstName, lastName, username, password } = fields(container);

    await user.type(email, "nina@fashiome.test");
    await user.type(firstName, "Nina");
    await user.type(lastName, "Wardrobe");
    await user.type(username, "ninawardrobe");
    await user.type(password, "123");
    await user.click(screen.getByRole("button", { name: /create user/i }));

    expect(await screen.findByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    expect(handleCreateUserMock).not.toHaveBeenCalled();
  });

  test("submits a valid user and navigates back to the user list", async () => {
    handleCreateUserMock.mockResolvedValue({ success: true });
    const { container } = render(<UserForm />);
    const user = userEvent.setup();
    const { email, firstName, lastName, username, password } = fields(container);

    await user.type(email, "nina@fashiome.test");
    await user.type(firstName, "Nina");
    await user.type(lastName, "Wardrobe");
    await user.type(username, "ninawardrobe");
    await user.type(password, "Passw0rd!");
    await user.click(screen.getByRole("button", { name: /create user/i }));

    await vi.waitFor(() => expect(handleCreateUserMock).toHaveBeenCalledTimes(1));
    const payload = handleCreateUserMock.mock.calls[0][0];
    expect(payload).toMatchObject({ email: "nina@fashiome.test", username: "ninawardrobe", role: "user" });

    await vi.waitFor(() => expect(pushMock).toHaveBeenCalledWith("/dashboard/admin/users"));
  });
});
