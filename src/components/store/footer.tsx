import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="site-footer store-footer">
      <div className="container store-footer-grid">
        <div>
          <p className="eyebrow">Shine Bijou</p>
          <strong>{siteConfig.shortName}</strong>
          <p>Accesorios, joyeria y regalos para todos los dias.</p>
        </div>
        <div className="footer-links">
          <Link href="/links">Links</Link>
          <Link href={siteConfig.instagramUrl}>Instagram</Link>
          <Link href={`https://wa.me/${siteConfig.whatsappNumber}`}>WhatsApp</Link>
        </div>
      </div>
    </footer>
  );
}
