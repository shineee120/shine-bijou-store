"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Product } from "@/types/store";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/components/store/cart-context";
import { useWishlist } from "@/components/store/wishlist-context";

export function ProductDetailShell({
  product,
  relatedProducts
}: {
  product: Product;
  relatedProducts: Product[];
}) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0] ? `${product.variants[0].name}: ${product.variants[0].value}` : ""
  );
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { hasItem, toggleItem } = useWishlist();

  return (
    <main className="product-page">
      <div className="container">
        <div className="breadcrumb-row">
          <Link href="/">Inicio</Link>
          <span>/</span>
          <Link href={`/#${product.categorySlug}`}>{product.categorySlug}</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <section className="product-detail-grid">
          <div className="gallery-panel">
            <div className="main-preview">
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 960px) 100vw, 50vw"
                  className="detail-photo"
                />
              ) : null}
            </div>
            <div className="thumb-row">
              {product.images.map((image) => (
                <button
                  key={image}
                  className={selectedImage === image ? "active" : ""}
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={image}
                    alt={product.name}
                    fill
                    sizes="120px"
                    className="thumb-photo"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="detail-panel">
            <div className="badge-row">
              {product.newArrival ? <span className="product-badge">Nuevo</span> : null}
              {product.featured ? <span className="product-badge">Destacado</span> : null}
              {product.bestSeller ? <span className="product-badge">Mas vendido</span> : null}
            </div>
            <h1>{product.name}</h1>
            <p className="detail-copy">{product.longDescription ?? product.description}</p>
            <div className="product-prices large">
              <span>{formatCurrency(product.price)}</span>
              {product.compareAtPrice ? (
                <small>{formatCurrency(product.compareAtPrice)}</small>
              ) : null}
            </div>
            <div className="detail-meta-grid">
              <div>
                <strong>Stock</strong>
                <span>{product.stock} unidades</span>
              </div>
              <div>
                <strong>SKU</strong>
                <span>{product.sku ?? "Sin SKU"}</span>
              </div>
            </div>

            {product.variants?.length ? (
              <label className="detail-field">
                Variante
                <select
                  value={selectedVariant}
                  onChange={(event) => setSelectedVariant(event.target.value)}
                >
                  {product.variants.map((variant) => (
                    <option key={variant.id} value={`${variant.name}: ${variant.value}`}>
                      {variant.name}: {variant.value}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            <label className="detail-field">
              Cantidad
              <input
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
              />
            </label>

            <div className="detail-actions">
              <button
                className="button-primary"
                onClick={() =>
                  addItem({
                    productId: product.id,
                    productName: product.name,
                    productSlug: product.slug,
                    image: product.images[0],
                    quantity,
                    price: product.price,
                    variantLabel: selectedVariant || undefined,
                    categorySlug: product.categorySlug,
                    weightGrams: product.weightGrams
                  })
                }
              >
                Agregar al carrito
              </button>
              <button
                className={`button-secondary ${hasItem(product.id) ? "is-active" : ""}`}
                onClick={() => toggleItem(product.id)}
              >
                {hasItem(product.id) ? "Guardado en favoritos" : "Guardar"}
              </button>
            </div>

            <div className="tag-row">
              {product.tags?.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          </div>
        </section>

        {product.reviews?.length ? (
          <section className="section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Reseñas</p>
                <h2>Opiniones reales</h2>
              </div>
            </div>
            <div className="review-grid">
              {product.reviews.map((review) => (
                <article key={review.id} className="review-card">
                  <strong>{review.author}</strong>
                  <span>{"★".repeat(review.rating)}</span>
                  <p>{review.comment}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Relacionados</p>
              <h2>Tambien te puede gustar</h2>
            </div>
          </div>
          <div className="product-grid">
            {relatedProducts.map((related) => (
              <Link key={related.id} href={`/products/${related.slug}`} className="related-card">
                <span>{related.name}</span>
                <small>{formatCurrency(related.price)}</small>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
