import { Coupon } from "@/types/store";

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(value);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createWhatsAppMessage(input: {
  items: Array<{ name: string; quantity: number; price: number; variantLabel?: string }>;
  total: number;
  shipping?: number;
  customer?: {
    fullName?: string;
    postalCode?: string;
    address?: string;
    notes?: string;
  };
}) {
  const lines = input.items.map((item) => {
    const variant = item.variantLabel ? ` (${item.variantLabel})` : "";
    return `- ${item.name}${variant} x${item.quantity} - ${formatCurrency(item.price * item.quantity)}`;
  });

  const customerLines = input.customer
    ? [
        input.customer.fullName ? `Nombre: ${input.customer.fullName}` : "",
        input.customer.postalCode ? `CP: ${input.customer.postalCode}` : "",
        input.customer.address ? `Direccion: ${input.customer.address}` : "",
        input.customer.notes ? `Notas: ${input.customer.notes}` : ""
      ].filter(Boolean)
    : [];

  return [
    "Hola Shine, quiero hacer este pedido:",
    "",
    ...lines,
    "",
    input.shipping ? `Envio estimado: ${formatCurrency(input.shipping)}` : "",
    `Total estimado: ${formatCurrency(input.total)}`,
    customerLines.length ? "" : "",
    ...customerLines
  ]
    .filter(Boolean)
    .join("\n");
}

export function applyCoupon(total: number, coupon: Coupon | null) {
  if (!coupon || !coupon.active) {
    return { discount: 0, total };
  }

  const discount =
    coupon.type === "percentage"
      ? Math.round(total * (coupon.value / 100))
      : Math.min(coupon.value, total);

  return {
    discount,
    total: Math.max(total - discount, 0)
  };
}

export function estimateMockShipping(postalCode: string, weightGrams: number) {
  const base = postalCode.trim().length >= 4 ? 6900 : 0;
  return base + Math.round(weightGrams / 10);
}
