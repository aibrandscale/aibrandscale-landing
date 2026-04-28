import { NextRequest, NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

type Field = "name" | "email" | "phone";
type Result = { ok: true; name: string; email: string; phone: string } | { ok: false; field: Field; message: string };

function validate(name: unknown, email: unknown, phone: unknown): Result {
  if (typeof name !== "string" || name.trim().length < 2) {
    return { ok: false, field: "name", message: "Моля, въведи името си." };
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return { ok: false, field: "email", message: "Невалиден имейл адрес." };
  }
  if (typeof phone !== "string") {
    return { ok: false, field: "phone", message: "Невалиден телефонен номер." };
  }
  const digits = phone.replace(/\D/g, "").replace(/^359/, "").replace(/^0+/, "");
  if (digits.length !== 9) {
    return { ok: false, field: "phone", message: "Телефонът трябва да е 9 цифри след +359." };
  }
  if (!/^[2-9]/.test(digits)) {
    return { ok: false, field: "phone", message: "Невалиден български телефонен номер." };
  }
  return { ok: true, name: name.trim(), email: email.trim(), phone: `+359${digits}` };
}

export async function POST(req: NextRequest) {
  let body: { name?: unknown; email?: unknown; phone?: unknown; hp?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Невалидна заявка." }, { status: 400 });
  }

  // honeypot
  if (typeof body.hp === "string" && body.hp.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const result = validate(body.name, body.email, body.phone);
  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  // TODO: persist / forward to CRM here.
  // Available fields: result.name, result.email, result.phone
  return NextResponse.json({ ok: true });
}
