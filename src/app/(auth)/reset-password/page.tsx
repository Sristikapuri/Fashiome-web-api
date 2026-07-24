import type { Metadata } from "next";
import ResetPasswordForm from "../_components/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password — FashioMe",
  description: "Reset your FashioMe account password with a secure reset link",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
