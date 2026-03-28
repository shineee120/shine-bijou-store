import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function InstagramSection() {
  return (
    <section className="section subtle-section" id="instagram">
      <div className="container instagram-block">
        <div>
          <p className="eyebrow">Instagram</p>
          <h2>Segui las novedades, lanzamientos y combos del dia</h2>
        </div>
        <Link href={siteConfig.instagramUrl} className="button-primary">
          Abrir Instagram
        </Link>
      </div>
    </section>
  );
}
