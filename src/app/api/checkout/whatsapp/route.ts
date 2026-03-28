import { NextResponse } from "next/server";
import { createWhatsAppMessage } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const message = createWhatsAppMessage({
    items: body.items ?? [],
    total: body.total ?? 0
  });

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    try {
      const supabase = createAdminClient();
      await supabase.from("checkout_orders").insert({
        customer_name: body.customer?.fullName ?? null,
        customer_email: body.customer?.email ?? null,
        channel: "whatsapp",
        status: "pending",
        total: body.total ?? 0,
        items: body.items ?? [],
        shipping_data: body.shippingQuote ?? null,
        customer_data: body.customer ?? {}
      });
    } catch {
      // Keeping WhatsApp link generation resilient.
    }
  }

  return NextResponse.json({
    url: `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`
  });
}
