"use client";

import { FormEvent, useId, useState } from "react";

const successMessage = "You’re on the early-access list. Look for your launch invite next week.";
const endpoint = process.env.NEXT_PUBLIC_SEQUENZY_FORM_ENDPOINT;

type WaitlistFormProps = {
  onSuccess?: () => void;
  variant?: "inline" | "modal";
};

export function WaitlistForm({ onSuccess, variant = "inline" }: WaitlistFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const formId = useId();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();

    if (!email) {
      setStatus("error");
      setMessage("Enter an email address to get early access.");
      return;
    }

    if (!endpoint) {
      setStatus("error");
      setMessage("Early access is being connected. Please try again shortly.");
      return;
    }

    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch(endpoint, { method: "POST", body: formData });
      if (!response.ok) throw new Error("Sequenzy signup failed");
      setStatus("success");
      setMessage(successMessage);
      form.reset();
      onSuccess?.();
    } catch {
      setStatus("error");
      setMessage("We couldn’t add you yet. Please try again.");
    }
  }

  return (
    <form
      className={`waitlist-form waitlist-form-${variant}`}
      onSubmit={submit}
      noValidate
      data-success-message={successMessage}
      aria-describedby={`${formId}-status`}
    >
      <label className="sr-only" htmlFor={`${formId}-email`}>Email address</label>
      <input id={`${formId}-email`} name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@agency.com" required />
      <input className="honeypot" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Joining…" : variant === "modal" ? "Send my launch invite" : "Get early access"}
      </button>
      <p id={`${formId}-status`} className={`form-status ${status}`} aria-live="polite">
        {message}
      </p>
    </form>
  );
}
