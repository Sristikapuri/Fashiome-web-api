import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResetPasswordForm from "./ResetPasswordForm";

const handleResetPasswordMock = vi.fn();

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

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
  handleResetPassword: (...args: unknown[]) => handleResetPasswordMock(...args),
}));

beforeEach(() => {
  handleResetPasswordMock.mockReset();
});

async function fillCodeAndEmail(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/email address/i), "user@fashiome.test");
  await user.type(screen.getByLabelText(/reset code/i), "123456");
}

describe("ResetPasswordForm", () => {
  test("renders email, reset code, and password fields", () => {
    render(<ResetPasswordForm />);

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reset code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  test("requires email, code, and password before submitting", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm />);

    await user.click(screen.getByRole("button", { name: /reset password/i }));

    expect(await screen.findByText(/email, reset code, and new password are required/i)).toBeInTheDocument();
    expect(handleResetPasswordMock).not.toHaveBeenCalled();
  });

  test("rejects a password shorter than 6 characters", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm />);

    await fillCodeAndEmail(user);
    await user.type(screen.getByLabelText(/new password/i), "123");
    await user.type(screen.getByLabelText(/confirm password/i), "123");
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    expect(await screen.findByText(/at least 6 characters/i)).toBeInTheDocument();
    expect(handleResetPasswordMock).not.toHaveBeenCalled();
  });

  test("rejects mismatched passwords", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm />);

    await fillCodeAndEmail(user);
    await user.type(screen.getByLabelText(/new password/i), "Passw0rd!");
    await user.type(screen.getByLabelText(/confirm password/i), "Different1!");
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    expect(handleResetPasswordMock).not.toHaveBeenCalled();
  });

  test("shows the success message on a valid reset", async () => {
    handleResetPasswordMock.mockResolvedValue({ success: true, message: "Password has been reset successfully" });
    const user = userEvent.setup();
    render(<ResetPasswordForm />);

    await fillCodeAndEmail(user);
    await user.type(screen.getByLabelText(/new password/i), "Passw0rd!");
    await user.type(screen.getByLabelText(/confirm password/i), "Passw0rd!");
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    expect(await screen.findByText(/password has been reset successfully/i)).toBeInTheDocument();
  });

  test("shows the backend error for an invalid or expired code", async () => {
    handleResetPasswordMock.mockResolvedValue({ success: false, message: "Invalid or expired reset code" });
    const user = userEvent.setup();
    render(<ResetPasswordForm />);

    await fillCodeAndEmail(user);
    await user.type(screen.getByLabelText(/new password/i), "Passw0rd!");
    await user.type(screen.getByLabelText(/confirm password/i), "Passw0rd!");
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    expect(await screen.findByText(/invalid or expired reset code/i)).toBeInTheDocument();
  });
});
