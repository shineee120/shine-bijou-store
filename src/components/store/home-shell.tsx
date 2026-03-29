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

function ProductBadges({ product }: { product: Product }) {
  return (
    <div className="badge-row">
      {product.newArrival ? <span className="product-badge">Nuevo</span> : null}
      {product.featured ? <span className="product-badge">Destacado</span> : null}
      {product.bestSeller ? <span className="product-badge">Mas vendido</span> : null}
      {product.stock <= 5 ? <span className="product-badge">Ultimas unidades</span> : null}
    </div>
  );
}

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

  return (
    <div className="visual-fallback product-visual-fallback">
      <span>Shine selection</span>
    </div>
  );
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

  return (
    <div className="visual-fallback category-visual-fallback">
      <span>Categoria Shine</span>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
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
    <article className="product-card" id={product.categorySlug}>
      <div className="product-image product-image-link">
        <ProductVisual product={product} />
        <span>{product.categorySlug}</span>
        <button
          type="button"
          className={`wishlist-chip ${hasItem(product.id) ? "active" : ""}`}
          onClick={() => toggleItem(product.id)}
        >
          {hasItem(product.id) ? "Guardado" : "Favorito"}
        </button>
      </div>
      <div className="product-body">
        <ProductBadges product={product} />
        <div className="product-copy">
          <Link href={`/products/${product.slug}`}>
            <h3>{product.name}</h3>
          </Link>
          <p>{product.description}</p>
        </div>
        <div className="product-prices">
          <span>{formatCurrency(product.price)}</span>
          {product.compareAtPrice ? (
            <small>{formatCurrency(product.compareAtPrice)}</small>
          ) : null}
        </div>
        <div className="product-actions">
          <button className="button-primary" onClick={() => addItem(item)}>
            Agregar al carrito
          </button>
          <Link href={`/products/${product.slug}`} className="button-secondary">
            Ver detalle
          </Link>
        </div>
      </div>
    </article>
  );
}

function HeroRotator({
  banners,
  featuredProducts
}: {
  banners: HeroBanner[];
  featuredProducts: Product[];
}) {
  const [index, setIndex] = useState(0);
  const banner = banners[index] ?? banners[0];
  const spotlight = featuredProducts.slice(0, 3);

  return (
    <section className="hero hero-premium">
      <div className="hero-bleed">
        <div className="container hero-premium-grid">
          <div className="hero-premium-copy">
            <p className="eyebrow">Shine</p>
            <h1>{banner.title}</h1>
            <p className="hero-copy">{banner.subtitle}</p>
            <div className="hero-actions">
              <Link href={banner.ctaHref} className="button-primary">
                {banner.ctaLabel}
              </Link>
              {banner.secondaryHref && banner.secondaryLabel ? (
                <Link href={banner.secondaryHref} className="button-secondary">
                  {banner.secondaryLabel}
                </Link>
              ) : null}
            </div>
            <div className="hero-switches">
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

          <div className="hero-editorial-panel">
            <div className="hero-editorial-lead">
              <span>Drop actual</span>
              <p>Joyeria minimalista para todos los dias, regalos y nuevos ingresos.</p>
            </div>
            <div className="hero-spotlight-list">
              {spotlight.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="hero-spotlight-item"
                >
                  <div>
                    <strong>{product.name}</strong>
                    <small>{product.categorySlug}</small>
                  </div>
                  <span>{formatCurrency(product.price)}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SupportRail() {
  return (
    <section className="section support-rail-section">
      <div className="container support-rail">
        <div>
          <p className="eyebrow">Shine studio</p>
          <strong>Curaduria de piezas para looks cotidianos, regalo y salida.</strong>
        </div>
        <div className="support-points">
          <span>Catalogo con carrito persistente</span>
          <span>Pedido por WhatsApp o Mercado Pago</span>
          <span>Envios y retiro coordinado</span>
        </div>
      </div>
    </section>
  );
}

function FeaturedCollections({ products }: { products: Product[] }) {
  const featured = products.filter((product) => product.featured).slice(0, 4);
  const newArrivals = products.filter((product) => product.newArrival).slice(0, 4);
  const spotlight = featured[0] ?? products[0];

  return (
    <section className="section subtle-section" id="destacados">
      <div className="container editorial-feature-grid">
        <div className="editorial-feature-copy">
          <p className="eyebrow">Destacados</p>
          <h2>Piezas para usar ahora y volver a comprar despues</h2>
          <p className="section-copy">
            Una seleccion pensada para clientas que buscan algo facil de combinar,
            delicado y listo para regalar.
          </p>
          {spotlight ? (
            <Link href={`/products/${spotlight.slug}`} className="editorial-feature-link">
              <span>{spotlight.name}</span>
              <strong>{formatCurrency(spotlight.price)}</strong>
            </Link>
          ) : null}
        </div>

        <div className="editorial-feature-columns">
          <div>
            <p className="eyebrow">Favoritos</p>
            <div className="mini-list">
              {featured.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="mini-product">
                  <span>{product.name}</span>
                  <small>{formatCurrency(product.price)}</small>
                </Link>
              ))}
            </div>
          </div>
          <div id="nuevos">
            <p className="eyebrow">Nuevos ingresos</p>
            <div className="mini-list">
              {newArrivals.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="mini-product">
                  <span>{product.name}</span>
                  <small>{formatCurrency(product.price)}</small>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryMenu({ categories }: { categories: ProductCategory[] }) {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Categorias</p>
            <h2>Explora la tienda por familia de producto</h2>
          </div>
          <p className="section-copy">
            Cuadros rapidos para navegar, compartir por WhatsApp y descubrir nuevas
            combinaciones.
          </p>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link key={category.id} href={`/#${category.slug}`} className="category-card">
              <div className="category-image-wrap">
                <CategoryVisual category={category} />
              </div>
              <span>{category.name}</span>
              <small>{category.description}</small>
              <strong>{category.linkLabel ?? "Ver todo"}</strong>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Catalog({
  categories,
  products
}: {
  categories: ProductCategory[];
  products: Product[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const byCategory =
        activeCategory === "all" || product.categorySlug === activeCategory;
      const term = search.toLowerCase();
      const bySearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.variants?.some((variant) => variant.value.toLowerCase().includes(term));

      return byCategory && bySearch;
    });
  }, [activeCategory, products, search]);

  return (
    <section className="section" id="productos">
      <div className="container">
        <div className="catalog-toolbar">
          <div>
            <p className="eyebrow">Catalogo</p>
            <h2>Descubri accesorios, conjuntos y regalos</h2>
          </div>
          <div className="catalog-controls full">
            <input
              aria-label="Buscar productos"
              placeholder="Buscar por nombre o variante"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <div className="chips">
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
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StorySection() {
  return (
    <section className="section subtle-section" id="sobre">
      <div className="container story-grid">
        <div>
          <p className="eyebrow">Sobre Shine</p>
          <h2>Una tienda pensada para elegir facil y regalar mejor</h2>
        </div>
        <div className="story-copy">
          <p>
            Shine mezcla accesorios cotidianos, sets delicados y detalles que
            levantan un look sin complicarlo.
          </p>
          <p>
            La idea es que entrar a la tienda se sienta rapido, claro y visual: ver,
            elegir, sumar al carrito o mandar el pedido por WhatsApp.
          </p>
        </div>
      </div>
    </section>
  );
}

function HowToBuySection() {
  const steps = [
    "Elegis productos, variantes y cantidades.",
    "Calculas envio, aplicas cupon si corresponde y revisas total.",
    "Pagas por Mercado Pago o mandas el pedido completo por WhatsApp."
  ];

  return (
    <section className="section" id="como-comprar">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Como comprar</p>
            <h2>Un recorrido corto para comprar sin vueltas</h2>
          </div>
          <Link href={`https://wa.me/${siteConfig.whatsappNumber}`} className="button-secondary">
            Consultar por WhatsApp
          </Link>
        </div>
        <div className="process-grid">
          {steps.map((step, index) => (
            <article key={step} className="process-step">
              <strong>0{index + 1}</strong>
              <p>{step}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewStrip({ products }: { products: Product[] }) {
  const reviews = products.flatMap((product) =>
    (product.reviews ?? []).map((review) => ({
      ...review,
      productName: product.name
    }))
  );

  return (
    <section className="section subtle-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Resenas</p>
            <h2>Lo que dicen las clientas</h2>
          </div>
        </div>
        <div className="review-grid">
          {reviews.map((review) => (
            <article key={review.id} className="review-card">
              <strong>{review.author}</strong>
              <span>{"*".repeat(review.rating)}</span>
              <p>{review.comment}</p>
              <small>{review.productName}</small>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function InstagramLookbook() {
  return (
    <section className="section" id="instagram">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Instagram</p>
            <h2>Lookbook, nuevos ingresos y regalos</h2>
          </div>
          <Link href={siteConfig.instagramUrl} className="button-secondary">
            Abrir perfil
          </Link>
        </div>
        <div className="instagram-grid">
          <div className="instagram-tile large">Drop semanal</div>
          <div className="instagram-tile">Mix de aros</div>
          <div className="instagram-tile">Regalos listos</div>
          <div className="instagram-tile">Collares en capas</div>
        </div>
      </div>
    </section>
  );
}

function FAQSection({ items }: { items: FAQItem[] }) {
  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FAQ</p>
            <h2>Pagos, envios, cambios y compras</h2>
          </div>
        </div>
        <div className="faq-list">
          {items.map((item) => (
            <details key={item.id} className="faq-item">
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CouponStrip({ coupons }: { coupons: Coupon[] }) {
  return (
    <section className="section coupon-section">
      <div className="container coupon-grid">
        {coupons.filter((coupon) => coupon.active).map((coupon) => (
          <article key={coupon.id} className="coupon-card">
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
    <section className="section final-cta-section">
      <div className="container final-cta">
        <div>
          <p className="eyebrow">Contacto</p>
          <h2>Lista para elegir, comprar o pedir ayuda con el regalo</h2>
        </div>
        <div className="final-cta-actions">
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
  const featuredProducts = products.filter((product) => product.featured || product.newArrival);

  return (
    <>
      <HeroRotator banners={banners} featuredProducts={featuredProducts} />
      <SupportRail />
      <CouponStrip coupons={coupons} />
      <CategoryMenu categories={categories} />
      <FeaturedCollections products={products} />
      <Catalog categories={categories} products={products} />
      <StorySection />
      <HowToBuySection />
      <ReviewStrip products={products} />
      <InstagramLookbook />
      <FAQSection items={faqItems} />
      <FinalCTA />
    </>
  );
}
