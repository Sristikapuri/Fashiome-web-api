import type { Metadata } from "next";
import LoginForm from "../_components/LoginForm";

export const metadata: Metadata = {
  title: "Login — FashioMe",
  description: "Sign in to your FashioMe account",
};

export default function LoginPage() {
  return <LoginForm />;
}
