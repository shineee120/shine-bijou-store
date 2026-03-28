import { Header } from "@/components/store/header";
import { Footer } from "@/components/store/footer";
import { CartDrawer } from "@/components/store/cart-drawer";
import { getStorefrontData } from "@/lib/store-service";
import { HomeShell } from "@/components/store/home-shell";
import { WhatsAppFloat } from "@/components/store/whatsapp-float";

export default async function Home() {
  const { categories, products, banners, faqItems, coupons } = await getStorefrontData();

  return (
    <>
      <Header categories={categories} />
      <main>
        <HomeShell
          banners={banners}
          categories={categories}
          coupons={coupons}
          faqItems={faqItems}
          products={products}
        />
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppFloat />
    </>
  );
}
