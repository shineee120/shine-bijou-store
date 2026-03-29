"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ProductCategory } from "@/types/store";
import { siteConfig } from "@/lib/site-config";
import { useCart } from "@/components/store/cart-context";

export function Header({ categories }: { categories: ProductCategory[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { items, openCart } = useCart();

  return (
    <header className="site-header store-header">
      <div className="container header-row">
        <div className="store-brand-block">
          <Link href="/" className="brand store-wordmark">
            {siteConfig.shortName}
          </Link>
          <span className="store-brand-tag">bijou & accesorios</span>
        </div>

        <nav className="desktop-nav">
          <Link href="/">Inicio</Link>
          <button
            className="nav-button"
            onMouseEnter={() => setMenuOpen(true)}
            onClick={() => setMenuOpen((current) => !current)}
          >
            Categorias
          </button>
          <Link href="/#instagram">Instagram</Link>
          <Link href="/#faq">FAQ</Link>
          <Link href="/links">Links</Link>
        </nav>

        <div className="header-actions">
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileSidebarOpen((current) => !current)}
          >
            Menu
          </button>
          <button className="cart-button store-cart-button" onClick={openCart}>
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
                ) : (
                  <div className="visual-fallback mega-visual-fallback" aria-hidden="true" />
                )}
              </div>
              <p>{category.name}</p>
              <span>{category.description}</span>
              <Link href={`/#${category.slug}`}>Ver categoria</Link>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`mobile-sidebar-overlay ${mobileSidebarOpen ? "open" : ""}`}
        onClick={() => setMobileSidebarOpen(false)}
      />
      <aside className={`mobile-sidebar ${mobileSidebarOpen ? "open" : ""}`}>
        <div className="mobile-sidebar-header">
          <div className="store-brand-block">
            <Link href="/" className="brand store-wordmark" onClick={() => setMobileSidebarOpen(false)}>
              {siteConfig.shortName}
            </Link>
            <span className="store-brand-tag">bijou & accesorios</span>
          </div>
          <button className="cart-close" onClick={() => setMobileSidebarOpen(false)}>
            ×
          </button>
        </div>

        <nav className="mobile-sidebar-nav">
          <Link href="/" onClick={() => setMobileSidebarOpen(false)}>
            Inicio
          </Link>
          <Link href="/#productos" onClick={() => setMobileSidebarOpen(false)}>
            Catalogo
          </Link>
          <Link href="/#instagram" onClick={() => setMobileSidebarOpen(false)}>
            Instagram
          </Link>
          <Link href="/#faq" onClick={() => setMobileSidebarOpen(false)}>
            FAQ
          </Link>
          <Link href="/links" onClick={() => setMobileSidebarOpen(false)}>
            Links
          </Link>
        </nav>

        <div className="mobile-sidebar-categories">
          <p className="eyebrow">Categorias</p>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/#${category.slug}`}
              onClick={() => setMobileSidebarOpen(false)}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </aside>
    </header>
  );
}
