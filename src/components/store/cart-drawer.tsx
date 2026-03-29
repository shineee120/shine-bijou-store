"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { coupons } from "@/data/mock-store";
import { useCart } from "@/components/store/cart-context";
import { applyCoupon, createWhatsAppMessage, formatCurrency } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import { Coupon, ShippingQuote } from "@/types/store";

export function CartDrawer() {
  const { items, isOpen, closeCart, total, updateQuantity, removeItem, clearCart } =
    useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [shippingPostalCode, setShippingPostalCode] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingDeliveryType, setShippingDeliveryType] = useState<"D" | "S">("D");
  const [shippingQuote, setShippingQuote] = useState<ShippingQuote | null>(null);
  const [shippingMessage, setShippingMessage] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const weightGrams = items.reduce(
    (acc, item) => acc + (item.weightGrams ?? 80) * item.quantity,
    0
  );

  const pricing = useMemo(() => {
    const { discount, total: totalWithCoupon } = applyCoupon(total, appliedCoupon);
    const shipping = shippingQuote?.price ?? 0;
    return {
      discount,
      subtotal: total,
      shipping,
      finalTotal: totalWithCoupon + shipping
    };
  }, [appliedCoupon, shippingQuote, total]);

  const whatsappHref = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    createWhatsAppMessage({
      items: items.map((item) => ({
        name: item.productName,
        quantity: item.quantity,
        price: item.price,
        variantLabel: item.variantLabel
      })),
      total: pricing.finalTotal,
      shipping: pricing.shipping,
      customer: {
        fullName,
        postalCode: shippingPostalCode,
        address: shippingAddress,
        deliveryType: shippingDeliveryType,
        notes
      }
    })
  )}`;

  async function handleShippingQuote() {
    setShippingMessage("Calculando envio...");
    setShippingQuote(null);

    const response = await fetch("/api/shipping/correo-argentino/quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        postalCode: shippingPostalCode,
        address: shippingAddress,
        deliveryType: shippingDeliveryType,
        weightGrams
      })
    });

    const data = await response.json();

    if (!response.ok) {
      setShippingMessage(data.error || "No se pudo calcular el envio.");
      return;
    }

    setShippingQuote(data.quote);
    setShippingMessage(
      `${data.quote.serviceName} - ${formatCurrency(data.quote.price)}${
        data.quote.deliveryTimeMin && data.quote.deliveryTimeMax
          ? ` - ${data.quote.deliveryTimeMin} a ${data.quote.deliveryTimeMax} dias`
          : ""
      }`
    );
  }

  function handleCoupon() {
    const coupon =
      coupons.find(
        (entry) => entry.code.toLowerCase() === couponCode.trim().toLowerCase()
      ) ?? null;
    setAppliedCoupon(coupon?.active ? coupon : null);
  }

  return (
    <aside className={`cart-drawer ${isOpen ? "open" : ""}`}>
      <div className="cart-header">
        <div>
          <p className="eyebrow">Tu carrito</p>
          <h3>{items.length} productos</h3>
        </div>
        <button onClick={closeCart}>Cerrar</button>
      </div>

      <div className="cart-items">
        {items.length === 0 ? (
          <p className="empty-state">Todavia no agregaste productos.</p>
        ) : (
          <>
            {items.map((item) => (
              <div key={`${item.productId}-${item.variantLabel}`} className="cart-item">
                <div>
                  <strong>{item.productName}</strong>
                  {item.variantLabel ? <small>{item.variantLabel}</small> : null}
                </div>
                <div className="cart-item-actions">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1, item.variantLabel)
                    }
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1, item.variantLabel)
                    }
                  >
                    +
                  </button>
                  <button
                    className="remove-link"
                    onClick={() => removeItem(item.productId, item.variantLabel)}
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))}

            <div className="checkout-card">
              <strong>Datos para el pedido</strong>
              <input
                placeholder="Nombre y apellido"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />
              <input
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <input
                placeholder="Telefono"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
              <input
                placeholder="Codigo postal"
                value={shippingPostalCode}
                onChange={(event) => setShippingPostalCode(event.target.value)}
              />
              <input
                placeholder="Direccion"
                value={shippingAddress}
                onChange={(event) => setShippingAddress(event.target.value)}
              />
              <select
                value={shippingDeliveryType}
                onChange={(event) =>
                  setShippingDeliveryType(event.target.value === "S" ? "S" : "D")
                }
              >
                <option value="D">Entrega a domicilio</option>
                <option value="S">Retiro en sucursal</option>
              </select>
              <textarea
                placeholder="Notas del pedido"
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
              <div className="inline-row">
                <input
                  placeholder="Cupon"
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value)}
                />
                <button className="ghost-button" type="button" onClick={handleCoupon}>
                  Aplicar
                </button>
              </div>
              <button className="button-secondary" type="button" onClick={handleShippingQuote}>
                Calcular envio
              </button>
              {shippingMessage ? <small>{shippingMessage}</small> : null}
            </div>
          </>
        )}
      </div>

      <div className="cart-footer">
        <div className="pricing-stack">
          <div className="total-row">
            <span>Subtotal</span>
            <strong>{formatCurrency(pricing.subtotal)}</strong>
          </div>
          <div className="total-row">
            <span>Ahorro</span>
            <strong>- {formatCurrency(pricing.discount)}</strong>
          </div>
          <div className="total-row">
            <span>Envio</span>
            <strong>{formatCurrency(pricing.shipping)}</strong>
          </div>
          <div className="total-row">
            <span>Total</span>
            <strong>{formatCurrency(pricing.finalTotal)}</strong>
          </div>
        </div>
        <form action="/api/checkout/mercadopago" method="post">
          <input type="hidden" name="payload" value={JSON.stringify(items)} />
          <input
            type="hidden"
            name="customer"
            value={JSON.stringify({
              fullName,
              email,
              phone,
              postalCode: shippingPostalCode,
              address: shippingAddress,
              deliveryType: shippingDeliveryType,
              notes,
              couponCode: appliedCoupon?.code ?? "",
              shippingQuote
            })}
          />
          <button className="button-primary" disabled={items.length === 0}>
            Pagar con Mercado Pago
          </button>
        </form>
        <Link className="button-secondary" href={whatsappHref}>
          Enviar pedido por WhatsApp
        </Link>
        <button className="ghost-button" onClick={clearCart}>
          Vaciar carrito
        </button>
      </div>
    </aside>
  );
}
