import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/store/cart-context";
import { WishlistProvider } from "@/components/store/wishlist-context";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "Shine Bijou",
    template: "%s | Shine Bijou"
  },
  description: "Accesorios que hacen brillar tu estilo.",
  alternates: {
    canonical: siteConfig.siteUrl
  },
  openGraph: {
    title: "Shine Bijou",
    description: "Accesorios que hacen brillar tu estilo.",
    url: siteConfig.siteUrl,
    siteName: "Shine Bijou",
    locale: "es_AR",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Shine Bijou",
    description: "Accesorios que hacen brillar tu estilo."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <WishlistProvider>
          <CartProvider>{children}</CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
