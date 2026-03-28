import { NextResponse } from "next/server";
import MercadoPagoConfig, { Preference } from "mercadopago";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const payload = formData.get("payload");
  const customer = formData.get("customer");

  if (!payload || typeof payload !== "string") {
    return NextResponse.json({ error: "Payload invalido" }, { status: 400 });
  }

  const items = JSON.parse(payload) as Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;

  const customerData =
    customer && typeof customer === "string" ? JSON.parse(customer) : {};
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = Number(customerData?.shippingQuote?.price ?? 0);

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    try {
      const supabase = createAdminClient();
      await supabase.from("checkout_orders").insert({
        customer_name: customerData.fullName ?? null,
        customer_email: customerData.email ?? null,
        channel: "mercadopago",
        status: "pending",
        total: total + shipping,
        items,
        shipping_data: customerData.shippingQuote ?? null,
        customer_data: customerData
      });
    } catch {
      // Order persistence should not block checkout.
    }
  }

  if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Falta configurar MERCADOPAGO_ACCESS_TOKEN en Vercel para habilitar pagos reales."
      },
      { status: 500 }
    );
  }

  const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
  });

  const preference = new Preference(client);

  const result = await preference.create({
    body: {
      items: [
        ...items.map((item, index) => ({
          id: `product-${index + 1}`,
          title: item.productName,
          quantity: item.quantity,
          unit_price: item.price,
          currency_id: "ARS"
        })),
        ...(shipping > 0
          ? [
              {
                id: "shipping-1",
                title: "Envio Correo Argentino",
                quantity: 1,
                unit_price: shipping,
                currency_id: "ARS"
              }
            ]
          : [])
      ],
      payer: {
        name: customerData.fullName,
        email: customerData.email
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_SITE_URL}/?status=success`,
        failure: `${process.env.NEXT_PUBLIC_SITE_URL}/?status=failure`,
        pending: `${process.env.NEXT_PUBLIC_SITE_URL}/?status=pending`
      },
      auto_return: "approved"
    }
  });

  return NextResponse.redirect(result.init_point ?? process.env.NEXT_PUBLIC_SITE_URL ?? "/");
}
