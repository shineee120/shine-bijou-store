import { NextResponse } from "next/server";
import { estimateMockShipping } from "@/lib/utils";

async function getCorreoToken() {
  const user = process.env.CORREO_ARGENTINO_BASIC_USER;
  const password = process.env.CORREO_ARGENTINO_BASIC_PASSWORD;

  if (!user || !password) {
    return null;
  }

  const credentials = Buffer.from(`${user}:${password}`).toString("base64");
  const response = await fetch(`${process.env.CORREO_ARGENTINO_BASE_URL}/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("No se pudo autenticar con Correo Argentino.");
  }

  const data = await response.json();
  return data.token as string;
}

export async function POST(request: Request) {
  const body = await request.json();
  const postalCode = String(body.postalCode || "");
  const weightGrams = Number(body.weightGrams || 0);
  const deliveryType = body.deliveryType === "S" ? "S" : "D";

  if (!postalCode) {
    return NextResponse.json({ error: "Falta codigo postal." }, { status: 400 });
  }

  const baseUrl = process.env.CORREO_ARGENTINO_BASE_URL;
  const customerId = process.env.CORREO_ARGENTINO_CUSTOMER_ID;
  const originPostalCode = process.env.CORREO_ARGENTINO_ORIGIN_POSTAL_CODE;
  const hasSomeCorreoConfig = Boolean(
    baseUrl ||
      customerId ||
      originPostalCode ||
      process.env.CORREO_ARGENTINO_BASIC_USER ||
      process.env.CORREO_ARGENTINO_BASIC_PASSWORD
  );

  if (!hasSomeCorreoConfig) {
    const price = estimateMockShipping(postalCode, weightGrams);
    return NextResponse.json({
      quote: {
        serviceName: "Correo Argentino (estimado demo)",
        deliveredType: deliveryType,
        price,
        deliveryTimeMin: "3",
        deliveryTimeMax: "6"
      }
    });
  }

  if (!baseUrl || !customerId || !originPostalCode) {
    return NextResponse.json(
      { error: "Faltan variables de Correo Argentino para cotizar en modo real." },
      { status: 500 }
    );
  }

  try {
    const token = await getCorreoToken();
    if (!token) {
      throw new Error("Faltan credenciales de Correo Argentino.");
    }

    const response = await fetch(`${baseUrl}/rates`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        customerId,
        originZipCode: originPostalCode,
        destinationZipCode: postalCode,
        packageWeight: Math.max(weightGrams / 1000, 0.1),
        deliveredType: deliveryType
      }),
      cache: "no-store"
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(errorBody || "No se pudo cotizar con Correo Argentino.");
    }

    const data = await response.json();
    const firstRate = Array.isArray(data) ? data[0] : data?.rates?.[0] ?? data;

    return NextResponse.json({
      quote: {
        serviceName: firstRate?.productName ?? "Correo Argentino",
        deliveredType: firstRate?.deliveredType ?? deliveryType,
        price: Number(firstRate?.price ?? firstRate?.total ?? 0),
        deliveryTimeMin: firstRate?.deliveryTimeMin ?? firstRate?.minDeliveryTime ?? "",
        deliveryTimeMax: firstRate?.deliveryTimeMax ?? firstRate?.maxDeliveryTime ?? ""
      }
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: detail }, { status: 500 });
  }
}
