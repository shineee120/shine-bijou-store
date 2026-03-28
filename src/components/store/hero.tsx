import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div>
          <p className="eyebrow">Nueva temporada Shine</p>
          <h1>{siteConfig.description}</h1>
          <p className="hero-copy">
            Descubri accesorios minimalistas inspirados en un estilo fresco,
            canchero y facil de combinar todos los dias.
          </p>
          <div className="hero-actions">
            <Link href="#productos" className="button-primary">
              Ver catalogo
            </Link>
            <Link href={siteConfig.instagramUrl} className="button-secondary">
              Ir a Instagram
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <p>Favoritos de la semana</p>
          <ul>
            <li>Collares con dijes</li>
            <li>Argollas mini y medium</li>
            <li>Sets listos para regalar</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
