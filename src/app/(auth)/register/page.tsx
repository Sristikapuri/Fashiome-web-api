import type { Metadata } from "next";
import RegisterForm from "@/components/RegisterForm";

export const metadata: Metadata = {
  title: "Register — FashioMe",
  description: "Create your FashioMe account",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
