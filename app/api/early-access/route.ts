import { NextResponse } from "next/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const honeypot = String(formData.get("website") ?? "").trim();

  if (honeypot) return NextResponse.json({ ok: true });
  if (!emailPattern.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });

  const endpoint = process.env.SEQUENZY_FORM_ENDPOINT;
  if (!endpoint) return NextResponse.json({ error: "Early access is not configured." }, { status: 503 });

  const upstreamForm = new FormData();
  upstreamForm.set("email", email);
  upstreamForm.set("website", "");

  try {
    const upstream = await fetch(endpoint, { method: "POST", body: upstreamForm, cache: "no-store" });
    if (!upstream.ok) return NextResponse.json({ error: "Unable to join the early-access list." }, { status: 502 });
  } catch {
    return NextResponse.json({ error: "Unable to join the early-access list." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
