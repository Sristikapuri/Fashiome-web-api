import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterForm from "./RegisterForm";

const pushMock = vi.fn();
const handleRegisterUserMock = vi.fn();

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
  handleRegisterUser: (...args: unknown[]) => handleRegisterUserMock(...args),
}));

beforeEach(() => {
  pushMock.mockClear();
  handleRegisterUserMock.mockReset();
});

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/first name/i), "Ava");
  await user.type(screen.getByLabelText(/last name/i), "Stylist");
  await user.type(screen.getByLabelText(/username/i), "avastylist");
  await user.type(screen.getByLabelText(/email address/i), "ava@fashiome.test");
  await user.selectOptions(screen.getByLabelText(/gender/i), "female");
  await user.type(screen.getByLabelText(/^age$/i), "27");
  await user.type(screen.getByLabelText(/^password$/i), "Passw0rd!");
  await user.type(screen.getByLabelText(/confirm password/i), "Passw0rd!");
}

describe("RegisterForm", () => {
  test("renders all the required fields", () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  test("blocks submission with a client-side error until Terms are accepted", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/accept the terms/i);
    expect(handleRegisterUserMock).not.toHaveBeenCalled();
  });

  test("flags an invalid email address", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await fillValidForm(user);
    await user.clear(screen.getByLabelText(/email address/i));
    await user.type(screen.getByLabelText(/email address/i), "not-an-email");
    await user.click(screen.getByLabelText(/agree to the/i));
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
  });

  test("flags a too-short password", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await fillValidForm(user);
    await user.clear(screen.getByLabelText(/^password$/i));
    await user.type(screen.getByLabelText(/^password$/i), "123");
    await user.click(screen.getByLabelText(/agree to the/i));
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText("Password must be at least 6 characters long")).toBeInTheDocument();
  });

  test("flags mismatched confirm password", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await fillValidForm(user);
    await user.clear(screen.getByLabelText(/confirm password/i));
    await user.type(screen.getByLabelText(/confirm password/i), "Different1!");
    await user.click(screen.getByLabelText(/agree to the/i));
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  test("flags an age outside the 1-100 range", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await fillValidForm(user);
    await user.clear(screen.getByLabelText(/^age$/i));
    await user.type(screen.getByLabelText(/^age$/i), "150");
    await user.click(screen.getByLabelText(/agree to the/i));
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText(/age must be between 1 and 100/i)).toBeInTheDocument();
  });

  test("shows the success panel after a successful registration", async () => {
    handleRegisterUserMock.mockResolvedValue({ success: true });
    const user = userEvent.setup();
    render(<RegisterForm />);

    await fillValidForm(user);
    await user.click(screen.getByLabelText(/agree to the/i));
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByRole("status")).toHaveTextContent(/account created successfully/i);
  });

  test("shows the API error message when registration fails", async () => {
    handleRegisterUserMock.mockResolvedValue({ success: false, message: "Email address is already registered" });
    const user = userEvent.setup();
    render(<RegisterForm />);

    await fillValidForm(user);
    await user.click(screen.getByLabelText(/agree to the/i));
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/already registered/i);
  });
});
