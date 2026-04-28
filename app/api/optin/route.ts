import { NextRequest, NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

function validate(email: unknown, phone: unknown): { ok: true } | { ok: false; field: "email" | "phone"; message: string } {
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return { ok: false, field: "email", message: "Невалиден имейл адрес." };
  }
  if (typeof phone !== "string") {
    return { ok: false, field: "phone", message: "Невалиден телефонен номер." };
  }
  const digits = phone.replace(/\D/g, "").replace(/^359/, "").replace(/^0+/, "");
  // Must be exactly 9 digits (after +359 prefix). First digit usually 8 or 9 for mobile.
  if (digits.length !== 9) {
    return { ok: false, field: "phone", message: "Телефонът трябва да е 9 цифри след +359." };
  }
  if (!/^[2-9]/.test(digits)) {
    return { ok: false, field: "phone", message: "Невалиден български телефонен номер." };
  }
  return { ok: true };
}

export async function POST(req: NextRequest) {
  let body: { email?: unknown; phone?: unknown; hp?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Невалидна заявка." }, { status: 400 });
  }

  // honeypot
  if (typeof body.hp === "string" && body.hp.length > 0) {
    return NextResponse.json({ ok: true }); // pretend success
  }

  const result = validate(body.email, body.phone);
  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  // TODO: persist / forward to CRM here.
  return NextResponse.json({ ok: true });
}
