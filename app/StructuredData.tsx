import { productTiers } from "./product-data.mjs";

// FAQ answers must match the rendered FAQ section in app/page.tsx exactly
// (decoded from HTML entities where present). Do not paraphrase — the guardrails
// require copy to trace back to the canonical implementation.

const faqItems = [
  {
    question: "Will this look fake or gimmicky?",
    answer:
      "No. The real listing images remain the source. Cinema Estate adds motion, narration, and a complete marketing package.",
  },
  {
    question: "Who approves what goes live?",
    answer: "You do. Agents approve their assets before anything is published or shared.",
  },
  {
    question: "What happens after I pay?",
    answer:
      "You get an order confirmation, then I personally follow up to collect your approved photos and the listing details required to build your package.",
  },
  {
    question: "What do I need to send you?",
    answer:
      "Your approved listing photos, up to your package's limit, plus the listing details required to build the package. No reshoot and no property visit.",
  },
  {
    question: "When does the 24-hour turnaround begin?",
    answer:
      "Once we have your approved photos and the listing details required to build the package—not when you place the order. If something's missing, we'll tell you what's outstanding before the 24 hours starts.",
  },
  {
    question: "How do revisions work?",
    answer:
      "Proof and Story include one round of revisions, Signature includes two. Revisions address accuracy and delivery issues within your original order, and nothing publishes until you approve the final assets.",
  },
  {
    question: "Will AI-enhanced visualization cause MLS or disclosure trouble?",
    answer:
      "AI-enhanced visualization is disclosed. Local MLS and brokerage rules apply, and agents remain responsible for their listing requirements.",
  },
  {
    question: "What if I can get this for $10–$40 with a cheaper AI tool?",
    answer:
      "Those tools generate a clip from your photos and hand it over. Cinema Estate builds a defined package around your real, already-approved photos—nothing invented or altered—and nothing publishes until you’ve reviewed and approved it yourself. If it doesn’t match your approved photos, you get a full refund within 7 days.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Cinema Estate",
      url: "https://cinema-estate.vercel.app",
      description:
        "Cinema Estate turns approved listing photography into a cinematic marketing package for real-estate agents.",
    },
    ...productTiers.map((tier) => ({
      "@type": "Product",
      name: `Cinema Estate — ${tier.name}`,
      description: "A cinematic marketing package built from your already-approved listing photos.",
      offers: {
        "@type": "Offer",
        price: tier.price,
        priceCurrency: tier.currency,
        availability: "https://schema.org/InStock",
        url: "https://cinema-estate.vercel.app/#pricing",
      },
    })),
    {
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
};

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
    />
  );
}
