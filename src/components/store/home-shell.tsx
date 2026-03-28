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
    image: product.images[0],
    quantity: 1,
    price: product.price,
    variantLabel: defaultVariant,
    categorySlug: product.categorySlug,
    weightGrams: product.weightGrams
  };

  return (
    <article className="product-card" id={product.categorySlug}>
      <div className="product-image product-image-link">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 960px) 100vw, 33vw"
            className="product-photo"
          />
        ) : null}
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
          {product.showTagsOnHome && product.tags?.length ? (
            <div className="product-meta">
              {product.tags.slice(0, 3).map((tag) => (
                <small key={tag}>#{tag}</small>
              ))}
            </div>
          ) : null}
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

function HeroRotator({ banners }: { banners: HeroBanner[] }) {
  const [index, setIndex] = useState(0);
  const banner = banners[index] ?? banners[0];

  return (
    <section className="hero">
      <div className="container editorial-grid">
        <div className="hero-panel">
          <p className="eyebrow">Editorial Shine</p>
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
                className={currentIndex === index ? "active" : ""}
                onClick={() => setIndex(currentIndex)}
              >
                0{currentIndex + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="lookbook-panel">
          <div className="lookbook-card tall">
            <span>Joyeria cotidiana</span>
          </div>
          <div className="lookbook-card">
            <span>Sets para regalo</span>
          </div>
          <div className="lookbook-card">
            <span>Nuevos ingresos</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedCollections({ products }: { products: Product[] }) {
  const featured = products.filter((product) => product.featured);
  const newArrivals = products.filter((product) => product.newArrival);

  return (
    <section className="section subtle-section" id="destacados">
      <div className="container editorial-split">
        <div>
          <p className="eyebrow">Destacados</p>
          <h2>Favoritos de la semana</h2>
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
          <h2>Recien llegados</h2>
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
            <h2>Explora por estilo</h2>
          </div>
          <p className="section-copy">
            Cuadrados rapidos, pensados para navegar como catalogo y tambien para tu
            pagina `/links`.
          </p>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link key={category.id} href={`/#${category.slug}`} className="category-card">
              {category.image ? (
                <div className="category-image-wrap">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 960px) 100vw, 20vw"
                    className="category-image"
                  />
                </div>
              ) : null}
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
            <p className="eyebrow">Reseñas</p>
            <h2>Lo que dicen las clientas</h2>
          </div>
        </div>
        <div className="review-grid">
          {reviews.map((review) => (
            <article key={review.id} className="review-card">
              <strong>{review.author}</strong>
              <span>{"★".repeat(review.rating)}</span>
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
            <h2>Inspiracion visual y lanzamientos</h2>
          </div>
          <Link href={siteConfig.instagramUrl} className="button-secondary">
            Abrir perfil
          </Link>
        </div>
        <div className="instagram-grid">
          <div className="instagram-tile large">Drop semanal</div>
          <div className="instagram-tile">Mix de aros</div>
          <div className="instagram-tile">Regalos</div>
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
      <HeroRotator banners={banners} />
      <CouponStrip coupons={coupons} />
      <CategoryMenu categories={categories} />
      <FeaturedCollections products={products} />
      <Catalog categories={categories} products={products} />
      <ReviewStrip products={products} />
      <InstagramLookbook />
      <FAQSection items={faqItems} />
    </>
  );
}
