"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/store/cart-context";
import { createWhatsAppMessage, formatCurrency } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

export function CartDrawer() {
  const { items, isOpen, closeCart, total, updateQuantity, removeItem, clearCart } =
    useCart();
  const [fullName, setFullName] = useState("");
  const [notes, setNotes] = useState("");

  const whatsappHref = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    createWhatsAppMessage({
      items: items.map((item) => ({
        name: item.productName,
        quantity: item.quantity,
        price: item.price,
        variantLabel: item.variantLabel
      })),
      total,
      customer: {
        fullName,
        notes
      }
    })
  )}`;

  return (
    <aside className={`cart-drawer ${isOpen ? "open" : ""}`}>
      <div className="cart-header">
        <h3>Mi carrito</h3>
        <button className="cart-close" onClick={closeCart}>
          ×
        </button>
      </div>

      <div className="cart-items">
        {items.length === 0 ? (
          <p className="empty-state">Todavia no agregaste productos.</p>
        ) : (
          <>
            {items.map((item) => (
              <div key={`${item.productId}-${item.variantLabel}`} className="cart-item">
                <div className="cart-item-main">
                  <div className="cart-thumb">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        sizes="80px"
                        className="thumb-photo"
                      />
                    ) : (
                      <div className="store-visual-fallback" aria-hidden="true" />
                    )}
                  </div>

                  <div className="cart-item-copy">
                    <strong>{item.productName}</strong>
                    {item.variantLabel ? <small>{item.variantLabel}</small> : null}

                    <div className="cart-stepper">
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
                    </div>
                  </div>
                </div>

                <div className="cart-side">
                  <button
                    className="remove-link"
                    onClick={() => removeItem(item.productId, item.variantLabel)}
                  >
                    Quitar
                  </button>
                  <strong>{formatCurrency(item.price * item.quantity)}</strong>
                </div>
              </div>
            ))}

            <div className="checkout-card cart-order-card">
              <strong>Datos para el pedido</strong>
              <input
                placeholder="Tu nombre"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />
              <textarea
                placeholder="Notas del pedido"
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </div>
          </>
        )}
      </div>

      <div className="cart-footer">
        <div className="pricing-stack">
          <div className="total-row">
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
        </div>

        <Link className="button-primary" href={whatsappHref}>
          Realizar compra
        </Link>
        <Link className="button-secondary" href="/#productos" onClick={closeCart}>
          Ver mas productos
        </Link>
        <button className="ghost-button" onClick={clearCart}>
          Vaciar carrito
        </button>
      </div>
    </aside>
  );
}
