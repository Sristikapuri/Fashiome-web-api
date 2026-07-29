import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm";

const pushMock = vi.fn();
const setUserMock = vi.fn();
const handleLoginUserMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: { alt: string; src: string }) => <img alt={props.alt} src={props.src} />,
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: any) => (
    <a href={typeof href === "string" ? href : "#"} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("@/lib/actions/auth-action", () => ({
  handleLoginUser: (...args: unknown[]) => handleLoginUserMock(...args),
}));

vi.mock("@/lib/contexts/AuthContext", () => ({
  useAuth: () => ({ setUser: setUserMock }),
}));

beforeEach(() => {
  pushMock.mockClear();
  setUserMock.mockClear();
  handleLoginUserMock.mockReset();
  localStorage.clear();
});

describe("LoginForm", () => {
  test("renders the email, password fields and submit button", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login to my wardrobe/i })).toBeInTheDocument();
  });

  test("shows a client-side validation message for an invalid email and does not call the login action", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email address/i), "not-an-email");
    await user.type(screen.getByLabelText(/^password$/i), "Passw0rd!");
    await user.click(screen.getByRole("button", { name: /login to my wardrobe/i }));

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
    expect(handleLoginUserMock).not.toHaveBeenCalled();
  });

  test("on a successful admin login, stores the token and redirects to the admin area", async () => {
    handleLoginUserMock.mockResolvedValue({
      success: true,
      data: { token: "fake-jwt", user: { role: "admin", email: "admin@fashiome.com" } },
    });
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email address/i), "admin@fashiome.com");
    await user.type(screen.getByLabelText(/^password$/i), "admin123");
    await user.click(screen.getByRole("button", { name: /login to my wardrobe/i }));

    await vi.waitFor(() => expect(pushMock).toHaveBeenCalledWith("/dashboard/admin"));
    expect(localStorage.getItem("token")).toBe("fake-jwt");
    expect(setUserMock).toHaveBeenCalledWith({ role: "admin", email: "admin@fashiome.com" });
  });

  test("on a successful regular-user login, redirects to the normal dashboard", async () => {
    handleLoginUserMock.mockResolvedValue({
      success: true,
      data: { token: "fake-jwt", user: { role: "user" } },
    });
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email address/i), "user@fashiome.com");
    await user.type(screen.getByLabelText(/^password$/i), "Passw0rd!");
    await user.click(screen.getByRole("button", { name: /login to my wardrobe/i }));

    await vi.waitFor(() => expect(pushMock).toHaveBeenCalledWith("/dashboard"));
  });

  test("shows the API error message when the login action fails", async () => {
    handleLoginUserMock.mockResolvedValue({ success: false, message: "Invalid credentials provided" });
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email address/i), "user@fashiome.com");
    await user.type(screen.getByLabelText(/^password$/i), "wrong-password");
    await user.click(screen.getByRole("button", { name: /login to my wardrobe/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/invalid credentials provided/i);
    expect(pushMock).not.toHaveBeenCalled();
  });
});
