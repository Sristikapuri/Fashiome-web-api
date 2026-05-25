import type { Metadata } from "next";
import Welcome from "@/components/Welcome";

export const metadata: Metadata = {
  title: "Welcome — FashioMe",
  description:
    "Discover personalized outfit recommendations powered by AI.",
};

export default function WelcomePage() {
  return <Welcome />;
}
