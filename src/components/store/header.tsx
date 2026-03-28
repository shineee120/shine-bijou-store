"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ProductCategory } from "@/types/store";
import { siteConfig } from "@/lib/site-config";
import { useCart } from "@/components/store/cart-context";

export function Header({ categories }: { categories: ProductCategory[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { items, openCart } = useCart();

  return (
    <header className="site-header">
      <div className="container header-row">
        <Link href="/" className="brand">
          {siteConfig.shortName}
        </Link>

        <nav className="desktop-nav">
          <Link href="/">Inicio</Link>
          <button
            className="nav-button"
            onMouseEnter={() => setMenuOpen(true)}
            onClick={() => setMenuOpen((current) => !current)}
          >
            Productos
          </button>
          <Link href="#instagram">Instagram</Link>
          <Link href="#faq">FAQ</Link>
          <Link href="/links">Links</Link>
        </nav>

        <div className="header-actions">
          <button className="cart-button" onClick={openCart}>
            Carrito <span>{items.reduce((acc, item) => acc + item.quantity, 0)}</span>
          </button>
        </div>
      </div>

      <div
        className={`mega-menu ${menuOpen ? "open" : ""}`}
        onMouseLeave={() => setMenuOpen(false)}
      >
        <div className="container mega-grid">
          {categories.map((category) => (
            <div key={category.id} className="mega-column">
              <div className="mega-image-wrap">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="200px"
                    className="mega-image"
                  />
                ) : null}
              </div>
              <p>{category.name}</p>
              <Link href={`/#${category.slug}`}>Ver todo</Link>
              <span>{category.description}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
