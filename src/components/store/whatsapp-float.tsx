import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function WhatsAppFloat() {
  return (
    <Link
      href={`https://wa.me/${siteConfig.whatsappNumber}`}
      className="whatsapp-float"
    >
      WhatsApp
    </Link>
  );
}
