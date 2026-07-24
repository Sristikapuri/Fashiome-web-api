import type { Metadata } from "next";
import ForgotPasswordForm from "../_components/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password — FashioMe",
  description: "Request a password reset link for your FashioMe account",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
