import {
  adminTaskOrders,
  categories,
  coupons,
  faqItems,
  heroBanners,
  products
} from "@/data/mock-store";
import { createClient } from "@/lib/supabase/server";

export async function getStorefrontData() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return {
      categories,
      products,
      banners: heroBanners,
      faqItems,
      coupons
    };
  }

  try {
    const supabase = await createClient();
    const [
      { data: categoryRows },
      { data: productRows },
      { data: bannerRows },
      { data: faqRows },
      { data: couponRows }
    ] = await Promise.all([
      supabase.from("categories").select("*").order("sort_order"),
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("home_banners").select("*").eq("active", true).order("created_at", { ascending: false }),
      supabase.from("faq_items").select("*").order("sort_order"),
      supabase.from("coupons").select("*").eq("active", true).order("created_at", { ascending: false })
    ]);

    return {
      categories: categoryRows?.length
        ? categoryRows.map((row) => ({
            id: row.id,
            name: row.name,
            slug: row.slug,
            description: row.description ?? "",
            image: row.image_url ?? "",
            featured: row.featured ?? false,
            sortOrder: row.sort_order ?? 0,
            linkLabel: row.link_label ?? "Ver todo"
          }))
        : categories,
      products: productRows?.length
        ? productRows.map((row) => ({
            id: row.id,
            name: row.name,
            slug: row.slug,
            description: row.description ?? "",
            longDescription: row.long_description ?? "",
            price: row.price,
            compareAtPrice: row.compare_at_price,
            stock: row.stock ?? 0,
            categorySlug: row.category_slug,
            featured: row.featured ?? false,
            newArrival: row.new_arrival ?? false,
            bestSeller: row.best_seller ?? false,
            images: row.images ?? [],
            variants: row.variants ?? [],
            tags: row.tags ?? [],
            showTagsOnHome: row.show_tags_on_home ?? false,
            sku: row.sku ?? "",
            weightGrams: row.weight_grams ?? 0
          }))
        : products,
      banners: bannerRows?.length
        ? bannerRows.map((row) => ({
            id: row.id,
            title: row.title,
            subtitle: row.subtitle ?? "",
            ctaLabel: row.cta_label ?? "Comprar ahora",
            ctaHref: row.cta_href ?? "#productos",
            secondaryLabel: row.secondary_label ?? "",
            secondaryHref: row.secondary_href ?? "",
            image: row.image_url ?? "",
            active: row.active ?? true
          }))
        : heroBanners,
      faqItems: faqRows?.length
        ? faqRows.map((row) => ({
            id: row.id,
            question: row.question,
            answer: row.answer
          }))
        : faqItems,
      coupons: couponRows?.length
        ? couponRows.map((row) => ({
            id: row.id,
            code: row.code,
            type: row.type,
            value: row.value,
            description: row.description,
            active: row.active
          }))
        : coupons
    };
  } catch {
    return {
      categories,
      products,
      banners: heroBanners,
      faqItems,
      coupons
    };
  }
}

export async function getAdminData() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return {
      categories,
      products,
      orders: adminTaskOrders,
      banners: heroBanners,
      faqItems,
      coupons
    };
  }

  try {
    const supabase = await createClient();
    const [
      { data: categoryRows },
      { data: productRows },
      { data: orderRows },
      { data: checkoutRows },
      { data: bannerRows },
      { data: faqRows },
      { data: couponRows }
    ] =
      await Promise.all([
        supabase.from("categories").select("*").order("sort_order"),
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("manual_orders").select("*").order("created_at", { ascending: false }),
        supabase.from("checkout_orders").select("*").order("created_at", { ascending: false }),
        supabase.from("home_banners").select("*").order("created_at", { ascending: false }),
        supabase.from("faq_items").select("*").order("sort_order"),
        supabase.from("coupons").select("*").order("created_at", { ascending: false })
      ]);

    return {
      categories: categoryRows?.length
        ? categoryRows.map((row) => ({
            id: row.id,
            name: row.name,
            slug: row.slug,
            description: row.description ?? "",
            image: row.image_url ?? "",
            featured: row.featured ?? false,
            sortOrder: row.sort_order ?? 0,
            linkLabel: row.link_label ?? "Ver todo"
          }))
        : categories,
      products: productRows?.length
        ? productRows.map((row) => ({
            id: row.id,
            name: row.name,
            slug: row.slug,
            description: row.description ?? "",
            longDescription: row.long_description ?? "",
            price: row.price,
            compareAtPrice: row.compare_at_price,
            stock: row.stock ?? 0,
            categorySlug: row.category_slug,
            featured: row.featured ?? false,
            newArrival: row.new_arrival ?? false,
            bestSeller: row.best_seller ?? false,
            images: row.images ?? [],
            variants: row.variants ?? [],
            tags: row.tags ?? [],
            showTagsOnHome: row.show_tags_on_home ?? false,
            sku: row.sku ?? "",
            weightGrams: row.weight_grams ?? 0
          }))
        : products,
      orders:
        orderRows?.length || checkoutRows?.length
          ? [
              ...(checkoutRows ?? []).map((row) => ({
                id: row.id,
                clientName: row.customer_name ?? "Pedido web",
                channel: row.channel,
                status: row.status,
                total: row.total,
                notes: row.customer_email ?? "",
                createdAt: row.created_at
              })),
              ...(orderRows ?? []).map((row) => ({
                id: row.id,
                clientName: row.client_name,
                channel: row.channel,
                status: row.status,
                total: row.total,
                notes: row.notes ?? "",
                createdAt: row.created_at
              }))
            ]
          : adminTaskOrders,
      banners: bannerRows?.length
        ? bannerRows.map((row) => ({
            id: row.id,
            title: row.title,
            subtitle: row.subtitle ?? "",
            ctaLabel: row.cta_label ?? "Comprar ahora",
            ctaHref: row.cta_href ?? "#productos",
            secondaryLabel: row.secondary_label ?? "",
            secondaryHref: row.secondary_href ?? "",
            image: row.image_url ?? "",
            active: row.active ?? true
          }))
        : heroBanners,
      faqItems: faqRows?.length
        ? faqRows.map((row) => ({
            id: row.id,
            question: row.question,
            answer: row.answer
          }))
        : faqItems,
      coupons: couponRows?.length
        ? couponRows.map((row) => ({
            id: row.id,
            code: row.code,
            type: row.type,
            value: row.value,
            description: row.description,
            active: row.active
          }))
        : coupons
    };
  } catch {
    return {
      categories,
      products,
      orders: adminTaskOrders,
      banners: heroBanners,
      faqItems,
      coupons
    };
  }
}
