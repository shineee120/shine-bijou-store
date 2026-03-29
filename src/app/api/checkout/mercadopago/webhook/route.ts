import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

function isSignatureValid(input: {
  body: { data?: { id?: string | number } };
  signature: string | null;
  requestId: string | null;
  secret: string;
}) {
  const dataId = String(input.body.data?.id ?? "");
  if (!dataId || !input.signature || !input.requestId) {
    return false;
  }

  const parts = Object.fromEntries(
    input.signature.split(",").map((entry) => {
      const [key, value] = entry.split("=");
      return [key, value];
    })
  );

  const ts = parts.ts;
  const v1 = parts.v1;

  if (!ts || !v1) {
    return false;
  }

  const manifest = `id:${dataId};request-id:${input.requestId};ts:${ts};`;
  const expected = crypto
    .createHmac("sha256", input.secret)
    .update(manifest)
    .digest("hex");

  if (expected.length !== v1.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
}

async function fetchPayment(paymentId: string) {
  if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    throw new Error("Falta MERCADOPAGO_ACCESS_TOKEN.");
  }

  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("No se pudo consultar el pago en Mercado Pago.");
  }

  return response.json() as Promise<{
    id: number | string;
    status?: string;
    external_reference?: string;
  }>;
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const body = rawBody ? JSON.parse(rawBody) : {};
  const topic = String(body.type ?? body.topic ?? "");
  const paymentId = String(body.data?.id ?? "");

  if (!paymentId || topic !== "payment") {
    return NextResponse.json({ ok: true });
  }

  const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (webhookSecret) {
    const isValid = isSignatureValid({
      body,
      signature: request.headers.get("x-signature"),
      requestId: request.headers.get("x-request-id"),
      secret: webhookSecret
    });

    if (!isValid) {
      return NextResponse.json({ error: "Firma invalida." }, { status: 401 });
    }
  }

  try {
    const payment = await fetchPayment(paymentId);
    const externalReference = String(payment.external_reference ?? "");

    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      externalReference
    ) {
      const supabase = createAdminClient();
      await supabase
        .from("checkout_orders")
        .update({
          status: payment.status ?? "pending",
          payment_id: String(payment.id)
        })
        .eq("id", externalReference);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: detail }, { status: 500 });
  }
}
