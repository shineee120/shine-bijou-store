"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CartItem,
  Coupon,
  FAQItem,
  HeroBanner,
  Product,
  ProductCategory
} from "@/types/store";
import { siteConfig } from "@/lib/site-config";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/components/store/cart-context";
import { useWishlist } from "@/components/store/wishlist-context";

function ProductVisual({ product }: { product: Product }) {
  if (product.images[0]) {
    return (
      <Image
        src={product.images[0]}
        alt={product.name}
        fill
        sizes="(max-width: 960px) 100vw, 33vw"
        className="product-photo"
      />
    );
  }

  return <div className="store-visual-fallback" aria-hidden="true" />;
}

function CategoryVisual({ category }: { category: ProductCategory }) {
  if (category.image) {
    return (
      <Image
        src={category.image}
        alt={category.name}
        fill
        sizes="(max-width: 960px) 100vw, 20vw"
        className="category-image"
      />
    );
  }

  return <div className="store-visual-fallback category-fallback" aria-hidden="true" />;
}

function ProductBadges({ product }: { product: Product }) {
  return (
    <div className="store-badge-row">
      {product.newArrival ? <span className="store-badge">Nuevo</span> : null}
      {product.featured ? <span className="store-badge">Destacado</span> : null}
      {product.bestSeller ? <span className="store-badge">Mas vendido</span> : null}
      {product.stock <= 5 ? <span className="store-badge">Ultimas unidades</span> : null}
    </div>
  );
}

function StoreProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toggleItem, hasItem } = useWishlist();

  const defaultVariant = product.variants?.[0]
    ? `${product.variants[0].name}: ${product.variants[0].value}`
    : undefined;

  const item: CartItem = {
    productId: product.id,
    productName: product.name,
    productSlug: product.slug,
    image: product.images[0] ?? "",
    quantity: 1,
    price: product.price,
    variantLabel: defaultVariant,
    categorySlug: product.categorySlug,
    weightGrams: product.weightGrams
  };

  return (
    <article className="store-product-card" id={product.categorySlug}>
      <Link href={`/products/${product.slug}`} className="store-product-media">
        <ProductVisual product={product} />
      </Link>
      <div className="store-product-content">
        <div className="store-product-topline">
          <span>{product.categorySlug}</span>
          <button
            type="button"
            className={`wishlist-chip ${hasItem(product.id) ? "active" : ""}`}
            onClick={() => toggleItem(product.id)}
          >
            {hasItem(product.id) ? "Guardado" : "Favorito"}
          </button>
        </div>
        <ProductBadges product={product} />
        <div className="store-product-copy">
          <Link href={`/products/${product.slug}`}>
            <h3>{product.name}</h3>
          </Link>
          <p>{product.description}</p>
        </div>
        <div className="store-product-bottom">
          <div className="product-prices">
            <span>{formatCurrency(product.price)}</span>
            {product.compareAtPrice ? (
              <small>{formatCurrency(product.compareAtPrice)}</small>
            ) : null}
          </div>
          <button className="button-primary" onClick={() => addItem(item)}>
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}

function HeroSection({ banners }: { banners: HeroBanner[] }) {
  const [index, setIndex] = useState(0);
  const banner = banners[index] ?? banners[0];

  return (
    <section className="store-hero">
      <div className="container store-hero-grid">
        <div className="store-hero-copy">
          <p className="eyebrow">Shine Bijou</p>
          <h1>{banner.title}</h1>
          <p className="store-hero-text">{banner.subtitle}</p>
          <div className="store-hero-actions">
            <Link href={banner.ctaHref} className="button-primary">
              {banner.ctaLabel}
            </Link>
            {banner.secondaryHref && banner.secondaryLabel ? (
              <Link href={banner.secondaryHref} className="button-secondary">
                {banner.secondaryLabel}
              </Link>
            ) : null}
          </div>
          <div className="store-hero-switches">
            {banners.map((entry, currentIndex) => (
              <button
                key={entry.id}
                type="button"
                className={currentIndex === index ? "active" : ""}
                onClick={() => setIndex(currentIndex)}
              >
                0{currentIndex + 1}
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

function CategorySection({ categories }: { categories: ProductCategory[] }) {
  return (
    <section className="section store-section-shell">
      <div className="container">
        <div className="store-section-heading">
          <div>
            <p className="eyebrow">Categorias</p>
            <h2>Una tienda simple para navegar, elegir y combinar</h2>
          </div>
          <p className="store-section-copy">
            Cada categoria esta pensada para entrar rapido desde la home, desde `/links`
            o desde WhatsApp.
          </p>
        </div>
        <div className="store-category-grid">
          {categories.map((category) => (
            <Link key={category.id} href={`/#${category.slug}`} className="store-category-card">
              <div className="store-category-media">
                <CategoryVisual category={category} />
              </div>
              <div className="store-category-copy">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <strong>{category.linkLabel ?? "Ver todo"}</strong>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function EditorialSection({ products }: { products: Product[] }) {
  const featured = products.filter((product) => product.featured).slice(0, 4);
  const arrivals = products.filter((product) => product.newArrival).slice(0, 4);

  return (
    <section className="section store-editorial-band">
      <div className="container store-editorial-grid">
        <div className="store-editorial-copy">
          <p className="eyebrow">Seleccion Shine</p>
          <h2>Joyeria y accesorios para regalar, combinar y volver a usar</h2>
          <p>
            Una curaduria de piezas faciles de comprar, faciles de recomendar y faciles
            de sumar al carrito.
          </p>
          <div className="store-editorial-points">
            <span>Mercado Pago</span>
            <span>WhatsApp</span>
            <span>Envios</span>
          </div>
        </div>

        <div className="store-editorial-lists">
          <div className="store-mini-panel">
            <p className="eyebrow">Destacados</p>
            {featured.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="store-mini-row">
                <span>{product.name}</span>
                <small>{formatCurrency(product.price)}</small>
              </Link>
            ))}
          </div>
          <div className="store-mini-panel" id="nuevos">
            <p className="eyebrow">Nuevos ingresos</p>
            {arrivals.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="store-mini-row">
                <span>{product.name}</span>
                <small>{formatCurrency(product.price)}</small>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CatalogSection({
  categories,
  products
}: {
  categories: ProductCategory[];
  products: Product[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    const term = search.toLowerCase().trim();

    return products.filter((product) => {
      const byCategory =
        activeCategory === "all" || product.categorySlug === activeCategory;
      const bySearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.variants?.some((variant) => variant.value.toLowerCase().includes(term));

      return byCategory && bySearch;
    });
  }, [activeCategory, products, search]);

  return (
    <section className="section store-section-shell" id="productos">
      <div className="container">
        <div className="store-section-heading align-start">
          <div>
            <p className="eyebrow">Catalogo</p>
            <h2>Explora toda la tienda desde un solo lugar</h2>
          </div>
          <div className="store-catalog-controls">
            <input
              aria-label="Buscar productos"
              placeholder="Buscar por nombre o variante"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <div className="store-filter-row">
              <button
                className={activeCategory === "all" ? "active" : ""}
                onClick={() => setActiveCategory("all")}
              >
                Todos
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={activeCategory === category.slug ? "active" : ""}
                  onClick={() => setActiveCategory(category.slug)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="store-product-grid">
          {filteredProducts.map((product) => (
            <StoreProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  const items = [
    {
      title: "Compra simple",
      copy: "Carrito persistente, pedido por WhatsApp y pago online."
    },
    {
      title: "Envios y retiro",
      copy: "Calcula envio con tu codigo postal y coordina tu entrega."
    },
    {
      title: "Regalos y sets",
      copy: "La tienda esta pensada para elegir facil y regalar mejor."
    }
  ];

  return (
    <section className="section store-trust-section">
      <div className="container store-trust-grid">
        {items.map((item) => (
          <article key={item.title} className="store-trust-card">
            <p className="eyebrow">{item.title}</p>
            <span>{item.copy}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function SocialSection({ products }: { products: Product[] }) {
  const reviews = products.flatMap((product) =>
    (product.reviews ?? []).map((review) => ({
      ...review,
      productName: product.name
    }))
  );

  return (
    <section className="section store-social-shell">
      <div className="container store-social-grid">
        <div>
          <div className="store-section-heading compact">
            <div>
              <p className="eyebrow">Instagram</p>
              <h2>Lookbook, novedades y favoritos del momento</h2>
            </div>
            <Link href={siteConfig.instagramUrl} className="button-secondary">
              Abrir perfil
            </Link>
          </div>
          <div className="store-instagram-grid" id="instagram">
            <div className="store-instagram-tile large">Drop semanal</div>
            <div className="store-instagram-tile">Aros y collares</div>
            <div className="store-instagram-tile">Regalos</div>
          </div>
        </div>

        <div className="store-review-panel">
          <p className="eyebrow">Resenas</p>
          <h3>Lo que dicen las clientas</h3>
          <div className="store-review-list">
            {reviews.slice(0, 4).map((review) => (
              <article key={review.id} className="store-review-card">
                <strong>{review.author}</strong>
                <span>{review.comment}</span>
                <small>{review.productName}</small>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection({ items }: { items: FAQItem[] }) {
  return (
    <section className="section store-section-shell" id="faq">
      <div className="container">
        <div className="store-section-heading compact">
          <div>
            <p className="eyebrow">FAQ</p>
            <h2>Pagos, envios y compras sin vueltas</h2>
          </div>
        </div>
        <div className="store-faq-grid">
          {items.map((item) => (
            <details key={item.id} className="store-faq-item">
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CouponSection({ coupons }: { coupons: Coupon[] }) {
  const activeCoupons = coupons.filter((coupon) => coupon.active);

  if (!activeCoupons.length) {
    return null;
  }

  return (
    <section className="section store-coupon-section">
      <div className="container store-coupon-grid">
        {activeCoupons.map((coupon) => (
          <article key={coupon.id} className="store-coupon-card">
            <span>{coupon.code}</span>
            <p>{coupon.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="section store-final-cta">
      <div className="container store-final-cta-grid">
        <div>
          <p className="eyebrow">Shine</p>
          <h2>Elegir, comprar y compartir la tienda deberia sentirse facil</h2>
        </div>
        <div className="store-final-actions">
          <Link href="#productos" className="button-primary">
            Ver catalogo
          </Link>
          <Link href={`https://wa.me/${siteConfig.whatsappNumber}`} className="button-secondary">
            Ir a WhatsApp
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HomeShell({
  banners,
  categories,
  coupons,
  faqItems,
  products
}: {
  banners: HeroBanner[];
  categories: ProductCategory[];
  coupons: Coupon[];
  faqItems: FAQItem[];
  products: Product[];
}) {
  return (
    <>
      <HeroSection banners={banners} />
      <CouponSection coupons={coupons} />
      <CategorySection categories={categories} />
      <EditorialSection products={products} />
      <CatalogSection categories={categories} products={products} />
      <TrustSection />
      <SocialSection products={products} />
      <FAQSection items={faqItems} />
      <FinalCTA />
    </>
  );
}
