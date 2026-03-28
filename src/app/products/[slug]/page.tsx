import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/store/footer";
import { Header } from "@/components/store/header";
import { CartDrawer } from "@/components/store/cart-drawer";
import { WhatsAppFloat } from "@/components/store/whatsapp-float";
import { ProductDetailShell } from "@/components/store/product-detail-shell";
import { getStorefrontData } from "@/lib/store-service";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { products } = await getStorefrontData();
  const product = products.find((entry) => entry.slug === slug);

  if (!product) {
    return {
      title: "Producto"
    };
  }

  return {
    title: product.name,
    description: product.longDescription ?? product.description,
    alternates: {
      canonical: `${siteConfig.siteUrl}/products/${product.slug}`
    },
    openGraph: {
      title: `${product.name} | Shine Bijou`,
      description: product.longDescription ?? product.description,
      url: `${siteConfig.siteUrl}/products/${product.slug}`,
      type: "website"
    }
  };
}

export default async function ProductPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { categories, products } = await getStorefrontData();
  const product = products.find((entry) => entry.slug === slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter(
      (entry) =>
        entry.id !== product.id &&
        (entry.categorySlug === product.categorySlug ||
          entry.tags?.some((tag: string) => product.tags?.includes(tag)))
    )
    .slice(0, 3);

  return (
    <>
      <Header categories={categories} />
      <ProductDetailShell product={product} relatedProducts={relatedProducts} />
      <Footer />
      <CartDrawer />
      <WhatsAppFloat />
    </>
  );
}
