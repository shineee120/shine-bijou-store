import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-row">
        <div>
          <strong>{siteConfig.shortName}</strong>
          <p>Accesorios minimalistas para brillar todos los dias.</p>
        </div>
        <div className="footer-links">
          <Link href={siteConfig.instagramUrl}>Instagram</Link>
          <Link href={`https://wa.me/${siteConfig.whatsappNumber}`}>WhatsApp</Link>
        </div>
      </div>
    </footer>
  );
}
