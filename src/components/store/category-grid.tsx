import Link from "next/link";
import { ProductCategory } from "@/types/store";

export function CategoryGrid({ categories }: { categories: ProductCategory[] }) {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">Categorias</p>
          <h2>Explora Shine</h2>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <Link key={category.id} href={`/#${category.slug}`} className="category-card">
              <span>{category.name}</span>
              <small>{category.description}</small>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
