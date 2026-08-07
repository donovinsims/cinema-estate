"use client";

import { SyntheticEvent } from "react";
import { track } from "./analytics";

type AnswerItem = {
  question: string;
  answer: string;
  defaultOpen?: boolean;
};

const items: AnswerItem[] = [
  {
    question: "Will this look fake or gimmicky?",
    answer: "No. The real listing images remain the source. Cinema Estate adds motion, narration, and a complete marketing package.",
    defaultOpen: true,
  },
  {
    question: "Who approves what goes live?",
    answer: "You do. Agents approve their assets before anything is published or shared.",
  },
  {
    question: "What happens after I pay?",
    answer: "You get an order confirmation, then I personally follow up to collect your approved photos and the listing details required to build your package.",
  },
  {
    question: "What do I need to send you?",
    answer: "Your approved listing photos, up to your package's limit, plus the listing details required to build the package. No reshoot and no property visit.",
  },
  {
    question: "When does the 24-hour turnaround begin?",
    answer: "Once we have your approved photos and the listing details required to build the package—not when you place the order. If something's missing, we'll tell you what's outstanding before the 24 hours starts.",
  },
  {
    question: "How do revisions work?",
    answer: "Proof and Story include one round of revisions, Signature includes two. Revisions address accuracy and delivery issues within your original order, and nothing publishes until you approve the final assets.",
  },
  {
    question: "Will AI-enhanced visualization cause MLS or disclosure trouble?",
    answer: "AI-enhanced visualization is disclosed. Local MLS and brokerage rules apply, and agents remain responsible for their listing requirements.",
  },
  {
    question: "What if I can get this for $10–$40 with a cheaper AI tool?",
    answer:
      "Those tools generate a clip from your photos and hand it over. Cinema Estate builds a defined package around your real, already-approved photos—nothing invented or altered—and nothing publishes until you’ve reviewed and approved it yourself. If it doesn’t match your approved photos, you get a full refund within 7 days.",
  },
];

function handleToggle(event: SyntheticEvent<HTMLDetailsElement>, question: string) {
  if (event.currentTarget.open) {
    track("faq_item_opened", { question });
  }
}

export function AnswersAccordion() {
  return (
    <div className="answer-list">
      {items.map((item) => (
        <details key={item.question} open={item.defaultOpen} onToggle={(event) => handleToggle(event, item.question)}>
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
