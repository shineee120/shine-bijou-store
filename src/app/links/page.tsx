import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { getStorefrontData } from "@/lib/store-service";

export const metadata: Metadata = {
  title: "Links",
  description: "Acceso rapido a categorias de Shine Bijou para compartir por WhatsApp.",
  alternates: {
    canonical: `${siteConfig.siteUrl}/links`
  }
};

export default async function LinksPage() {
  const { categories } = await getStorefrontData();

  return (
    <main className="links-page">
      <div className="container links-wrapper">
        <div className="links-header">
          <p className="eyebrow">Shine</p>
          <h1>Elegi una categoria</h1>
          <p>
            Una version rapida para compartir por WhatsApp y llevar directo a la
            seccion que quieras mostrar.
          </p>
        </div>

        <div className="links-grid">
          {categories.map((category) => (
            <Link key={category.id} href={`/#${category.slug}`} className="links-card">
              <span>{category.name}</span>
            </Link>
          ))}
        </div>

        <div className="links-actions">
          <Link href="/" className="button-primary">
            Ir a la tienda completa
          </Link>
          <Link href="/#destacados" className="button-secondary">
            Ver destacados
          </Link>
          <Link
            href={`https://wa.me/${siteConfig.whatsappNumber}`}
            className="button-secondary"
          >
            Hablar por WhatsApp
          </Link>
        </div>
      </div>
    </main>
  );
}
