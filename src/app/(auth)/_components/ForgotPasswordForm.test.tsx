import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ForgotPasswordForm from "./ForgotPasswordForm";

const handleForgotPasswordMock = vi.fn();

vi.mock("next/image", () => ({
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
  handleForgotPassword: (...args: unknown[]) => handleForgotPasswordMock(...args),
}));

beforeEach(() => {
  handleForgotPasswordMock.mockReset();
});

describe("ForgotPasswordForm", () => {
  test("renders the email field and submit button", () => {
    render(<ForgotPasswordForm />);

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
  });

  test("requires an email before submitting", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(handleForgotPasswordMock).not.toHaveBeenCalled();
  });

  test("shows the success message returned by the action", async () => {
    handleForgotPasswordMock.mockResolvedValue({
      success: true,
      message: "If the email is registered, a password reset link has been sent",
    });
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText(/email address/i), "user@fashiome.test");
    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    expect(await screen.findByText(/reset link has been sent/i)).toBeInTheDocument();
  });

  test("shows the error message when the action fails", async () => {
    handleForgotPasswordMock.mockResolvedValue({ success: false, message: "Failed to send password reset instructions" });
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText(/email address/i), "user@fashiome.test");
    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    expect(await screen.findByText(/failed to send password reset instructions/i)).toBeInTheDocument();
  });
});
