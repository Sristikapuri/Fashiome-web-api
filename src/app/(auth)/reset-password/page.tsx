import type { Metadata } from "next";
import ResetPasswordForm from "../_components/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password — FashioMe",
  description: "Reset your FashioMe account password with an OTP",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
