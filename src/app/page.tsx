import type { Metadata } from "next";
import Welcome from "@/components/Welcome";

export const metadata: Metadata = {
  title: "FashioMe Web Project",
  description:
    "Discover personalized outfit recommendations powered by AI.",
};

export default function HomePage() {
  return <Welcome />;
}
