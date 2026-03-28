import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/store/cart-context";
import { WishlistProvider } from "@/components/store/wishlist-context";

export const metadata: Metadata = {
  title: "Shine Bijou",
  description: "Accesorios que hacen brillar tu estilo."
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
