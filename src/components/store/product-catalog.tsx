"use client";

import { useMemo, useState } from "react";
import { Product, ProductCategory } from "@/types/store";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/components/store/cart-context";

export function ProductCatalog({
  categories,
  products
}: {
  categories: ProductCategory[];
  products: Product[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const { addItem } = useCart();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const byCategory =
        activeCategory === "all" || product.categorySlug === activeCategory;
      const bySearch =
        search.trim().length === 0 ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());

      return byCategory && bySearch;
    });
  }, [activeCategory, products, search]);

  return (
    <section className="section" id="productos">
      <div className="container">
        <div className="catalog-toolbar">
          <div>
            <p className="eyebrow">Tienda</p>
            <h2>Productos para todos tus looks</h2>
          </div>

          <div className="catalog-controls">
            <input
              aria-label="Buscar productos"
              placeholder="Buscar accesorios"
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
            <article
              key={product.id}
              className="product-card"
              id={product.categorySlug}
            >
              <div className="product-image">
                <span>{product.categorySlug}</span>
                {product.featured ? <strong>Destacado</strong> : null}
              </div>
              <div className="product-body">
                <div className="product-copy">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                </div>
                <div className="product-prices">
                  <span>{formatCurrency(product.price)}</span>
                  {product.compareAtPrice ? (
                    <small>{formatCurrency(product.compareAtPrice)}</small>
                  ) : null}
                </div>
                <button
                  className="button-primary"
                  onClick={() =>
                    addItem({
                      productId: product.id,
                      productName: product.name,
                      productSlug: product.slug,
                      image: product.images[0],
                      quantity: 1,
                      price: product.price,
                      variantLabel: product.variants?.[0]
                        ? `${product.variants[0].name}: ${product.variants[0].value}`
                        : undefined
                    })
                  }
                >
                  Agregar al carrito
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
