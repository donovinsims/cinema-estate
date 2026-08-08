import type { Metadata } from "next";
import ListingPlanClient from "./ListingPlanClient";

export const metadata: Metadata = {
  title: "Free Listing Marketing Plan for Real Estate Agents | Cinema Estate",
  description:
    "Answer a few questions about a listing and get a free, practical marketing readiness score plus a seller-ready launch plan — no account required.",
  alternates: { canonical: "/listing-plan" },
  openGraph: {
    title: "Free Listing Marketing Plan | Cinema Estate",
    description: "Get a free, practical marketing readiness score plus a seller-ready launch plan — no account required.",
  },
  twitter: {
    card: "summary",
    title: "Free Listing Marketing Plan | Cinema Estate",
    description: "Get a free, practical marketing readiness score plus a seller-ready launch plan — no account required.",
  },
};

export default function ListingPlanPage() {
  return <ListingPlanClient />;
}
