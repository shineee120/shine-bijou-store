import { NextResponse } from "next/server";
import MercadoPagoConfig, { Preference } from "mercadopago";
import { createAdminClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site-config";

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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.siteUrl;
  let checkoutOrderId: string | null = null;

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    try {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("checkout_orders")
        .insert({
        customer_name: customerData.fullName ?? null,
        customer_email: customerData.email ?? null,
        channel: "mercadopago",
        status: "pending",
        total: total + shipping,
        items,
        shipping_data: customerData.shippingQuote ?? null,
        customer_data: customerData
        })
        .select("id")
        .single();

      checkoutOrderId = data?.id ?? null;
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
      external_reference: checkoutOrderId ?? undefined,
      metadata: {
        checkout_order_id: checkoutOrderId ?? "",
        customer_email: customerData.email ?? "",
        channel: "mercadopago"
      },
      back_urls: {
        success: `${siteUrl}/?status=success`,
        failure: `${siteUrl}/?status=failure`,
        pending: `${siteUrl}/?status=pending`
      },
      notification_url: `${siteUrl}/api/checkout/mercadopago/webhook`,
      auto_return: "approved"
    }
  });

  return NextResponse.redirect(result.init_point ?? siteUrl ?? "/");
}
