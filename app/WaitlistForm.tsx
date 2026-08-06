"use client";

import { FormEvent, useId, useState } from "react";
import { track } from "./analytics";
import { getEarlyAccessPresentation } from "./early-access-copy.mjs";

type WaitlistFormProps = {
  intent?: "early-access" | "listing";
  onSuccess?: () => void;
  variant?: "inline" | "modal";
};

export function WaitlistForm({ intent = "early-access", onSuccess, variant = "inline" }: WaitlistFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const formId = useId();
  const presentation = getEarlyAccessPresentation(intent);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();

    if (!email) {
      track("early_access_submit_failed", { intent, reason: "missing_email", placement: variant });
      setStatus("error");
      setMessage("Enter an email address to get early access.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      track("early_access_submit_failed", { intent, reason: "invalid_email", placement: variant });
      setStatus("error");
      setMessage("Enter a valid email address to get early access.");
      return;
    }

    setStatus("sending");
    setMessage("");
    track("early_access_submit_attempted", { intent, placement: variant });
    try {
      const response = await fetch("/api/early-access", { method: "POST", body: formData });
      if (!response.ok) {
        const payload: unknown = await response.json().catch(() => null);
        const error = typeof payload === "object" && payload && "error" in payload && typeof payload.error === "string"
          ? payload.error.trim()
          : "";
        if (error) {
          setStatus("error");
          setMessage(error);
          track("early_access_submit_failed", { intent, reason: "server_error", placement: variant });
          return;
        }
        throw new Error("Malformed early-access response");
      }
      setStatus("success");
      setMessage(presentation.success);
      form.reset();
      onSuccess?.();
      track("early_access_submit_succeeded", { intent, placement: variant });
    } catch {
      setStatus("error");
      setMessage("We couldn’t add you yet. Please try again, or buy directly from the pricing section.");
      track("early_access_submit_failed", { intent, reason: "server_error", placement: variant });
    }
  }

  return (
    <form
      className={`waitlist-form waitlist-form-${variant}`}
      onSubmit={submit}
      noValidate
      data-success-message={presentation.success}
      aria-describedby={`${formId}-status`}
    >
      <label className="sr-only" htmlFor={`${formId}-email`}>Email address</label>
      <input id={`${formId}-email`} name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@agency.com" required />
      <input className="honeypot" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : presentation.submit}
      </button>
      <p id={`${formId}-status`} className={`form-status ${status}`} aria-live="polite">
        {message}
      </p>
    </form>
  );
}
