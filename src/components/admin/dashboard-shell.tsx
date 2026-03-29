"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, slugify } from "@/lib/utils";
import {
  AdminTaskOrder,
  Coupon,
  FAQItem,
  HeroBanner,
  Product,
  ProductCategory
} from "@/types/store";

type DashboardProps = {
  products: Product[];
  categories: ProductCategory[];
  orders: AdminTaskOrder[];
  banners: HeroBanner[];
  faqItems: FAQItem[];
  coupons: Coupon[];
};

type AdminTab = "overview" | "products" | "content" | "orders";

export function DashboardShell({
  products: initialProducts,
  categories: initialCategories,
  orders: initialOrders,
  banners: initialBanners,
  faqItems: initialFaqItems,
  coupons: initialCoupons
}: DashboardProps) {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [orders, setOrders] = useState(initialOrders);
  const [banners, setBanners] = useState<HeroBanner[]>(initialBanners);
  const [faqList, setFaqList] = useState<FAQItem[]>(initialFaqItems);
  const [couponList, setCouponList] = useState(initialCoupons);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [contentSearch, setContentSearch] = useState("");

  const lowStock = products.filter((product) => product.stock <= 5);
  const featuredCount = products.filter((product) => product.featured).length;
  const newArrivalCount = products.filter((product) => product.newArrival).length;
  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const pendingOrders = orders.filter((order) => order.status === "pending").length;

  const stats = useMemo(
    () => [
      { label: "Productos", value: products.length },
      { label: "Categorias", value: categories.length },
      { label: "Pedidos", value: orders.length },
      { label: "Facturacion", value: formatCurrency(totalRevenue) }
    ],
    [categories.length, orders.length, products.length, totalRevenue]
  );

  const editingProduct = products.find((product) => product.id === editingProductId) ?? null;
  const editingCategory =
    categories.find((category) => category.id === editingCategoryId) ?? null;
  const editingBanner = banners.find((banner) => banner.id === editingBannerId) ?? null;
  const editingFaq = faqList.find((item) => item.id === editingFaqId) ?? null;
  const editingCoupon =
    couponList.find((coupon) => coupon.id === editingCouponId) ?? null;

  const filteredProducts = useMemo(() => {
    const term = productSearch.toLowerCase().trim();
    if (!term) {
      return products;
    }

    return products.filter((product) =>
      [product.name, product.categorySlug, product.sku ?? "", ...(product.tags ?? [])]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [productSearch, products]);

  const filteredOrders = useMemo(() => {
    const term = orderSearch.toLowerCase().trim();
    if (!term) {
      return orders;
    }

    return orders.filter((order) =>
      [order.clientName, order.channel, order.status, order.notes ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [orderSearch, orders]);

  const filteredCategories = useMemo(() => {
    const term = contentSearch.toLowerCase().trim();
    if (!term) {
      return categories;
    }

    return categories.filter((category) =>
      [category.name, category.slug, category.description].join(" ").toLowerCase().includes(term)
    );
  }, [categories, contentSearch]);

  const filteredFaqs = useMemo(() => {
    const term = contentSearch.toLowerCase().trim();
    if (!term) {
      return faqList;
    }

    return faqList.filter((item) =>
      [item.question, item.answer].join(" ").toLowerCase().includes(term)
    );
  }, [contentSearch, faqList]);

  const filteredBanners = useMemo(() => {
    const term = contentSearch.toLowerCase().trim();
    if (!term) {
      return banners;
    }

    return banners.filter((banner) =>
      [banner.title, banner.subtitle, banner.ctaLabel].join(" ").toLowerCase().includes(term)
    );
  }, [banners, contentSearch]);

  const filteredCoupons = useMemo(() => {
    const term = contentSearch.toLowerCase().trim();
    if (!term) {
      return couponList;
    }

    return couponList.filter((coupon) =>
      [coupon.code, coupon.description].join(" ").toLowerCase().includes(term)
    );
  }, [contentSearch, couponList]);

  async function uploadImage(file: File, folder = "products") {
    const path = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "shine-products";
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) {
      throw error;
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async function upsertProduct(formData: FormData) {
    setSaving("product");
    setMessage(null);
    try {
      const id = String(formData.get("id") || "");
      const name = String(formData.get("name") || "");
      const slug = String(formData.get("slug") || slugify(name));
      const uploadedFiles = formData.getAll("images") as File[];
      const imageUrls = (
        await Promise.all(
          uploadedFiles.filter((file) => file.size > 0).map((file) => uploadImage(file, "products"))
        )
      ).filter(Boolean);

      const variantsRaw = String(formData.get("variants") || "");
      const variants = variantsRaw
        .split(",")
        .map((variant) => variant.trim())
        .filter(Boolean)
        .map((variant, index) => ({
          id: `${Date.now()}-${index}`,
          name: "Variante",
          value: variant,
          stock: Number(formData.get("stock") || 0)
        }));

      const payload = {
        name,
        slug,
        description: String(formData.get("description") || ""),
        long_description: String(formData.get("long_description") || ""),
        price: Number(formData.get("price") || 0),
        compare_at_price: Number(formData.get("compare_at_price") || 0) || null,
        stock: Number(formData.get("stock") || 0),
        category_slug: String(formData.get("category_slug") || ""),
        featured: Boolean(formData.get("featured")),
        new_arrival: Boolean(formData.get("new_arrival")),
        best_seller: Boolean(formData.get("best_seller")),
        show_tags_on_home: Boolean(formData.get("show_tags_on_home")),
        sku: String(formData.get("sku") || ""),
        variants,
        tags: String(formData.get("tags") || "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        weight_grams: Number(formData.get("weight_grams") || 0)
      };

      const finalPayload = {
        ...payload,
        ...(imageUrls.length ? { images: imageUrls } : {})
      };

      const query = id
        ? supabase.from("products").update(finalPayload).eq("id", id).select().single()
        : supabase.from("products").insert(finalPayload).select().single();

      const { data, error } = await query;
      if (error) {
        throw error;
      }

      const mappedProduct = {
          id: data.id,
          name: data.name,
          slug: data.slug,
          description: data.description ?? "",
          longDescription: data.long_description ?? "",
          price: data.price,
          compareAtPrice: data.compare_at_price,
          stock: data.stock ?? 0,
          categorySlug: data.category_slug,
          featured: data.featured ?? false,
          newArrival: data.new_arrival ?? false,
          bestSeller: data.best_seller ?? false,
          showTagsOnHome: data.show_tags_on_home ?? false,
          images: data.images ?? [],
          variants: data.variants ?? [],
          tags: data.tags ?? [],
          sku: data.sku ?? "",
          weightGrams: data.weight_grams ?? 0
        };

      setProducts((current) =>
        id
          ? current.map((product) => (product.id === id ? mappedProduct : product))
          : [mappedProduct, ...current]
      );
      setEditingProductId(null);
      setMessage(id ? "Producto actualizado." : "Producto guardado.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar el producto.");
    } finally {
      setSaving(null);
    }
  }

  async function deleteProduct(id: string) {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      setMessage(error.message);
      return;
    }

    setProducts((current) => current.filter((product) => product.id !== id));
    if (editingProductId === id) {
      setEditingProductId(null);
    }
    setMessage("Producto eliminado.");
  }

  async function duplicateProduct(product: Product) {
    setSaving("duplicate");
    setMessage(null);

    const payload = {
      name: `${product.name} copia`,
      slug: `${slugify(product.name)}-copy-${Date.now().toString().slice(-4)}`,
      description: product.description,
      long_description: product.longDescription ?? "",
      price: product.price,
      compare_at_price: product.compareAtPrice ?? null,
      stock: product.stock,
      category_slug: product.categorySlug,
      featured: false,
      new_arrival: product.newArrival ?? false,
      best_seller: product.bestSeller ?? false,
      show_tags_on_home: product.showTagsOnHome ?? false,
      sku: product.sku ? `${product.sku}-COPY` : "",
      variants: product.variants ?? [],
      tags: product.tags ?? [],
      weight_grams: product.weightGrams ?? 0,
      images: product.images ?? []
    };

    const { data, error } = await supabase.from("products").insert(payload).select().single();
    if (error) {
      setMessage(error.message);
      setSaving(null);
      return;
    }

    setProducts((current) => [
      {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description: data.description ?? "",
        longDescription: data.long_description ?? "",
        price: data.price,
        compareAtPrice: data.compare_at_price,
        stock: data.stock ?? 0,
        categorySlug: data.category_slug,
        featured: data.featured ?? false,
        newArrival: data.new_arrival ?? false,
        bestSeller: data.best_seller ?? false,
        showTagsOnHome: data.show_tags_on_home ?? false,
        images: data.images ?? [],
        variants: data.variants ?? [],
        tags: data.tags ?? [],
        sku: data.sku ?? "",
        weightGrams: data.weight_grams ?? 0
      },
      ...current
    ]);
    setSaving(null);
    setMessage("Producto duplicado.");
  }

  async function createCategory(formData: FormData) {
    setSaving("category");
    setMessage(null);
    const id = String(formData.get("id") || "");
    const name = String(formData.get("name") || "");
    const categoryImage = formData.get("category_image");
    const uploadedImage =
      categoryImage instanceof File && categoryImage.size > 0
        ? await uploadImage(categoryImage, "categories")
        : "";
    const payload = {
      name,
      slug: String(formData.get("slug") || slugify(name)),
      description: String(formData.get("description") || ""),
      featured: Boolean(formData.get("featured")),
      sort_order: Number(formData.get("sort_order") || categories.length + 1),
      link_label: String(formData.get("link_label") || "Ver todo"),
      ...(uploadedImage ? { image_url: uploadedImage } : {})
    };

    const query = id
      ? supabase.from("categories").update(payload).eq("id", id).select().single()
      : supabase.from("categories").insert(payload).select().single();

    const { data, error } = await query;
    if (error) {
      setMessage(error.message);
      setSaving(null);
      return;
    }

    setCategories((current) =>
      id
        ? current.map((category) =>
            category.id === id
              ? {
                  id: data.id,
                  name: data.name,
                  slug: data.slug,
                  description: data.description ?? "",
                  image: data.image_url ?? "",
                  featured: data.featured ?? false,
                  sortOrder: data.sort_order ?? 0,
                  linkLabel: data.link_label ?? "Ver todo"
                }
              : category
          )
        : [
            ...current,
            {
              id: data.id,
              name: data.name,
              slug: data.slug,
              description: data.description ?? "",
              image: data.image_url ?? "",
              featured: data.featured ?? false,
              sortOrder: data.sort_order ?? 0,
              linkLabel: data.link_label ?? "Ver todo"
            }
          ]
    );
    setEditingCategoryId(null);
    setMessage(id ? "Categoria actualizada." : "Categoria creada.");
    setSaving(null);
  }

  async function deleteCategory(id: string) {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      setMessage(error.message);
      return;
    }
    setCategories((current) => current.filter((category) => category.id !== id));
    if (editingCategoryId === id) {
      setEditingCategoryId(null);
    }
    setMessage("Categoria eliminada.");
  }

  async function createManualOrder(formData: FormData) {
    setSaving("order");
    setMessage(null);
    const payload = {
      client_name: String(formData.get("client_name") || ""),
      channel: String(formData.get("channel") || "manual"),
      status: String(formData.get("status") || "pending"),
      total: Number(formData.get("total") || 0),
      notes: String(formData.get("notes") || "")
    };
    const { data, error } = await supabase.from("manual_orders").insert(payload).select().single();
    if (error) {
      setMessage(error.message);
      setSaving(null);
      return;
    }
    setOrders((current) => [
      {
        id: data.id,
        clientName: data.client_name,
        channel: data.channel,
        status: data.status,
        total: data.total,
        notes: data.notes ?? "",
        createdAt: data.created_at
      },
      ...current
    ]);
    setMessage("Pedido guardado.");
    setSaving(null);
  }

  async function updateOrderStatus(order: AdminTaskOrder, status: AdminTaskOrder["status"]) {
    setSaving(`order-${order.id}`);
    setMessage(null);

    const table = order.channel === "manual" ? "manual_orders" : "checkout_orders";
    const { error } = await supabase.from(table).update({ status }).eq("id", order.id);

    if (error) {
      setMessage(error.message);
      setSaving(null);
      return;
    }

    setOrders((current) =>
      current.map((entry) => (entry.id === order.id ? { ...entry, status } : entry))
    );
    setSaving(null);
    setMessage("Estado del pedido actualizado.");
  }

  async function saveFaq(formData: FormData) {
    const id = String(formData.get("id") || "");
    const payload = {
      question: String(formData.get("question") || ""),
      answer: String(formData.get("answer") || ""),
      sort_order: Number(formData.get("sort_order") || faqList.length + 1)
    };
    const query = id
      ? supabase.from("faq_items").update(payload).eq("id", id).select().single()
      : supabase.from("faq_items").insert(payload).select().single();
    const { data, error } = await query;
    if (error) {
      setMessage(error.message);
      return;
    }
    const mapped = { id: data.id, question: data.question, answer: data.answer };
    setFaqList((current) =>
      id ? current.map((item) => (item.id === id ? mapped : item)) : [mapped, ...current]
    );
    setEditingFaqId(null);
    setMessage(id ? "FAQ actualizada." : "FAQ creada.");
  }

  async function deleteFaq(id: string) {
    const { error } = await supabase.from("faq_items").delete().eq("id", id);
    if (error) {
      setMessage(error.message);
      return;
    }
    setFaqList((current) => current.filter((item) => item.id !== id));
    if (editingFaqId === id) setEditingFaqId(null);
    setMessage("FAQ eliminada.");
  }

  async function saveBanner(formData: FormData) {
    const id = String(formData.get("id") || "");
    const bannerImage = formData.get("banner_image");
    const uploadedImage =
      bannerImage instanceof File && bannerImage.size > 0
        ? await uploadImage(bannerImage, "banners")
        : "";
    const payload = {
      title: String(formData.get("title") || ""),
      subtitle: String(formData.get("subtitle") || ""),
      cta_label: String(formData.get("cta_label") || ""),
      cta_href: String(formData.get("cta_href") || "#productos"),
      secondary_label: String(formData.get("secondary_label") || ""),
      secondary_href: String(formData.get("secondary_href") || "#instagram"),
      active: true,
      ...(uploadedImage ? { image_url: uploadedImage } : {})
    };
    const query = id
      ? supabase.from("home_banners").update(payload).eq("id", id).select().single()
      : supabase.from("home_banners").insert(payload).select().single();
    const { data, error } = await query;
    if (error) {
      setMessage(error.message);
      return;
    }
    const mapped = {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle ?? "",
      ctaLabel: data.cta_label ?? "",
      ctaHref: data.cta_href ?? "#productos",
      secondaryLabel: data.secondary_label ?? "",
      secondaryHref: data.secondary_href ?? "#instagram",
      image: data.image_url ?? "",
      active: data.active ?? true
    };
    setBanners((current) =>
      id ? current.map((banner) => (banner.id === id ? mapped : banner)) : [mapped, ...current]
    );
    setEditingBannerId(null);
    setMessage(id ? "Banner actualizado." : "Banner creado.");
  }

  async function deleteBanner(id: string) {
    const { error } = await supabase.from("home_banners").delete().eq("id", id);
    if (error) {
      setMessage(error.message);
      return;
    }
    setBanners((current) => current.filter((banner) => banner.id !== id));
    if (editingBannerId === id) setEditingBannerId(null);
    setMessage("Banner eliminado.");
  }

  async function saveCoupon(formData: FormData) {
    const id = String(formData.get("id") || "");
    const payload = {
      code: String(formData.get("code") || "").toUpperCase(),
      description: String(formData.get("description") || ""),
      type: String(formData.get("type") || "percentage"),
      value: Number(formData.get("value") || 0),
      active: true
    };
    const query = id
      ? supabase.from("coupons").update(payload).eq("id", id).select().single()
      : supabase.from("coupons").insert(payload).select().single();
    const { data, error } = await query;
    if (error) {
      setMessage(error.message);
      return;
    }
    const mapped = {
      id: data.id,
      code: data.code,
      description: data.description,
      type: data.type,
      value: data.value,
      active: data.active
    };
    setCouponList((current) =>
      id ? current.map((coupon) => (coupon.id === id ? mapped : coupon)) : [mapped, ...current]
    );
    setEditingCouponId(null);
    setMessage(id ? "Cupon actualizado." : "Cupon creado.");
  }

  async function deleteCoupon(id: string) {
    const { error } = await supabase.from("coupons").delete().eq("id", id);
    if (error) {
      setMessage(error.message);
      return;
    }
    setCouponList((current) => current.filter((coupon) => coupon.id !== id));
    if (editingCouponId === id) setEditingCouponId(null);
    setMessage("Cupon eliminado.");
  }

  function importBulkProducts(formData: FormData) {
    const csv = String(formData.get("csv") || "");
    const rows = csv
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const created = rows.slice(1).map((row, index) => {
      const [name, price, categorySlug, stock] = row.split(",").map((entry) => entry.trim());
      return {
        id: `bulk-${Date.now()}-${index}`,
        name,
        slug: slugify(name),
        description: "Producto importado por carga masiva.",
        price: Number(price || 0),
        stock: Number(stock || 0),
        categorySlug: categorySlug || "otros",
        images: [],
        variants: []
      } as Product;
    });

    setProducts((current) => [...created, ...current]);
    setMessage(`Se importaron ${created.length} productos en modo local.`);
  }

  return (
    <div className="admin-shell admin-shell-polished">
      <section className="admin-hero-panel">
        <div>
          <p className="eyebrow">Panel privado</p>
          <h2>Gestion diaria de Shine</h2>
          <p className="admin-hero-copy">
            Una vista mas clara para productos, contenido, pedidos y acciones rapidas.
          </p>
        </div>
        <div className="admin-quick-grid">
          <button className="admin-quick-card" onClick={() => setActiveTab("products")}>
            <strong>Agregar producto</strong>
            <span>Cargar novedades, stock y variantes</span>
          </button>
          <button className="admin-quick-card" onClick={() => setActiveTab("orders")}>
            <strong>Revisar pedidos</strong>
            <span>Seguir WhatsApp, Mercado Pago y manuales</span>
          </button>
          <button className="admin-quick-card" onClick={() => setActiveTab("content")}>
            <strong>Editar contenido</strong>
            <span>Banners, FAQs y promociones</span>
          </button>
        </div>
      </section>

      <div className="admin-tabs">
        <button className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}>
          Resumen
        </button>
        <button className={activeTab === "products" ? "active" : ""} onClick={() => setActiveTab("products")}>
          Productos
        </button>
        <button className={activeTab === "content" ? "active" : ""} onClick={() => setActiveTab("content")}>
          Contenido
        </button>
        <button className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>
          Pedidos
        </button>
      </div>

      <section className="admin-overview admin-overview-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="admin-stat">
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            <small>
              {stat.label === "Pedidos"
                ? `${pendingOrders} pendientes`
                : stat.label === "Productos"
                  ? `${featuredCount} destacados`
                  : stat.label === "Categorias"
                    ? "Navegacion activa"
                    : "Total historico"}
            </small>
          </div>
        ))}
      </section>

      {message ? <p className="admin-message">{message}</p> : null}

      {activeTab === "overview" ? (
        <section className="admin-section two-col">
          <div className="admin-panel-card">
            <div className="admin-section-header">
              <div>
                <p className="eyebrow">Metricas</p>
                <h2>Vista rapida del negocio</h2>
              </div>
            </div>
            <div className="metric-list">
              <div className="metric-row">
                <span>Destacados</span>
                <strong>{featuredCount}</strong>
              </div>
              <div className="metric-row">
                <span>Nuevos ingresos</span>
                <strong>{newArrivalCount}</strong>
              </div>
              <div className="metric-row">
                <span>Cupones activos</span>
                <strong>{couponList.filter((coupon) => coupon.active).length}</strong>
              </div>
            </div>
          </div>
          <div className="admin-panel-card">
            <div className="admin-section-header">
              <div>
                <p className="eyebrow">Stock bajo</p>
                <h2>Productos a reponer</h2>
              </div>
            </div>
            <div className="admin-table compact">
              {lowStock.map((product) => (
                <div key={product.id} className="admin-row">
                  <div>
                    <strong>{product.name}</strong>
                    <span>{product.categorySlug}</span>
                  </div>
                  <strong>{product.stock}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === "products" ? (
        <section className="admin-section two-col">
          <form className="admin-panel-card" action={upsertProduct}>
            <div className="admin-section-header">
              <div>
                <p className="eyebrow">{editingProduct ? "Editar producto" : "Nuevo producto"}</p>
                <h2>Producto completo con variantes</h2>
              </div>
            </div>
            {editingProduct ? <input type="hidden" name="id" value={editingProduct.id} /> : null}
            <div className="form-grid">
              <input name="name" placeholder="Nombre" required defaultValue={editingProduct?.name ?? ""} />
              <input name="slug" placeholder="Slug" defaultValue={editingProduct?.slug ?? ""} />
              <input name="sku" placeholder="SKU" defaultValue={editingProduct?.sku ?? ""} />
              <input name="price" placeholder="Precio" type="number" required defaultValue={editingProduct?.price ?? ""} />
              <input name="compare_at_price" placeholder="Precio tachado" type="number" defaultValue={editingProduct?.compareAtPrice ?? ""} />
              <input name="stock" placeholder="Stock" type="number" required defaultValue={editingProduct?.stock ?? ""} />
              <input name="weight_grams" placeholder="Peso en gramos" type="number" defaultValue={editingProduct?.weightGrams ?? ""} />
              <select name="category_slug" required defaultValue={editingProduct?.categorySlug ?? ""}>
                <option value="" disabled>Categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>{category.name}</option>
                ))}
              </select>
              <textarea name="description" placeholder="Descripcion corta" rows={3} required defaultValue={editingProduct?.description ?? ""} />
              <textarea name="long_description" placeholder="Descripcion larga" rows={4} defaultValue={editingProduct?.longDescription ?? ""} />
              <input name="tags" placeholder="Tags separados por coma" defaultValue={editingProduct?.tags?.join(", ") ?? ""} />
              <input name="variants" placeholder="Variantes separadas por coma" />
              <label className="file-input">
                Fotos
                <input type="file" name="images" multiple accept="image/*" />
              </label>
              <label className="check-input"><input type="checkbox" name="featured" defaultChecked={editingProduct?.featured ?? false} />Destacado</label>
              <label className="check-input"><input type="checkbox" name="new_arrival" defaultChecked={editingProduct?.newArrival ?? false} />Nuevo ingreso</label>
              <label className="check-input"><input type="checkbox" name="best_seller" defaultChecked={editingProduct?.bestSeller ?? false} />Mas vendido</label>
              <label className="check-input"><input type="checkbox" name="show_tags_on_home" defaultChecked={editingProduct?.showTagsOnHome ?? false} />Mostrar tags en home</label>
            </div>
            <button className="button-primary" disabled={saving === "product"}>
              {saving === "product" ? "Guardando..." : editingProduct ? "Actualizar producto" : "Guardar producto"}
            </button>
          </form>

          <div className="admin-stack">
            <form className="admin-panel-card" action={createCategory}>
              <div className="admin-section-header">
                <div>
                  <p className="eyebrow">{editingCategory ? "Editar categoria" : "Categorias"}</p>
                  <h2>Crear o editar navegacion</h2>
                </div>
              </div>
              {editingCategory ? <input type="hidden" name="id" value={editingCategory.id} /> : null}
              <div className="form-grid">
                <input name="name" placeholder="Nombre" required defaultValue={editingCategory?.name ?? ""} />
                <input name="slug" placeholder="Slug" defaultValue={editingCategory?.slug ?? ""} />
                <input name="link_label" placeholder="Texto del link" defaultValue={editingCategory?.linkLabel ?? ""} />
                <input name="sort_order" placeholder="Orden" type="number" defaultValue={editingCategory?.sortOrder ?? ""} />
                <textarea name="description" placeholder="Descripcion" rows={3} defaultValue={editingCategory?.description ?? ""} />
                <label className="file-input">
                  Foto de categoria
                  <input type="file" name="category_image" accept="image/*" />
                </label>
                {editingCategory?.image ? (
                  <div className="admin-media-preview">
                    <span>Imagen actual</span>
                    <a href={editingCategory.image} target="_blank" rel="noreferrer">
                      Ver foto cargada
                    </a>
                  </div>
                ) : null}
                <label className="check-input"><input type="checkbox" name="featured" defaultChecked={editingCategory?.featured ?? false} />Mostrar destacada</label>
              </div>
              <button className="button-primary" disabled={saving === "category"}>
                {saving === "category" ? "Guardando..." : editingCategory ? "Actualizar categoria" : "Guardar categoria"}
              </button>
            </form>

            <form className="admin-panel-card" action={importBulkProducts}>
              <div className="admin-section-header">
                <div>
                  <p className="eyebrow">Carga masiva</p>
                  <h2>Pegar CSV simple</h2>
                </div>
              </div>
              <textarea
                name="csv"
                rows={7}
                defaultValue={"name,price,categorySlug,stock\nCollar Sol,17990,collares,8\nAros Gala,12990,aros,12"}
              />
              <button className="button-primary">Importar productos</button>
            </form>

            <div className="admin-panel-card">
              <div className="admin-section-header">
                <div>
                  <p className="eyebrow">Catalogo</p>
                  <h2>Productos actuales</h2>
                </div>
              </div>
              <input
                className="admin-search"
                placeholder="Buscar por nombre, categoria, SKU o tag"
                value={productSearch}
                onChange={(event) => setProductSearch(event.target.value)}
              />
              <div className="admin-table compact">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="admin-row">
                    <div>
                      <strong>{product.name}</strong>
                      <span>{product.categorySlug} - {formatCurrency(product.price)}</span>
                    </div>
                    <div className="inline-row">
                      <button className="ghost-button" type="button" onClick={() => setEditingProductId(product.id)}>Editar</button>
                      <button className="ghost-button" type="button" onClick={() => void duplicateProduct(product)}>Duplicar</button>
                      <button className="ghost-button" type="button" onClick={() => void deleteProduct(product.id)}>Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-panel-card">
              <div className="admin-section-header">
                <div>
                  <p className="eyebrow">Categorias</p>
                  <h2>Categorias actuales</h2>
                </div>
              </div>
              <div className="admin-table compact">
                {filteredCategories.map((category) => (
                  <div key={category.id} className="admin-row">
                    <div className="admin-row-with-media">
                      <div className="admin-thumb">
                        {category.image ? (
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            sizes="72px"
                            className="thumb-photo"
                          />
                        ) : (
                          <div className="admin-thumb-fallback">Sin foto</div>
                        )}
                      </div>
                      <div>
                        <strong>{category.name}</strong>
                        <span>/{category.slug}</span>
                        {category.linkLabel ? <span>{category.linkLabel}</span> : null}
                      </div>
                    </div>
                    <div className="inline-row">
                      <button className="ghost-button" type="button" onClick={() => setEditingCategoryId(category.id)}>Editar</button>
                      <button className="ghost-button" type="button" onClick={() => void deleteCategory(category.id)}>Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === "content" ? (
        <section className="admin-section two-col">
          <div className="admin-stack">
            <form className="admin-panel-card" action={saveBanner}>
              <div className="admin-section-header">
                <div>
                  <p className="eyebrow">{editingBanner ? "Editar banner" : "Banners"}</p>
                  <h2>Homepage editable</h2>
                </div>
              </div>
              {editingBanner ? <input type="hidden" name="id" value={editingBanner.id} /> : null}
              <div className="form-grid">
                <input name="title" placeholder="Titulo" required defaultValue={editingBanner?.title ?? ""} />
                <textarea name="subtitle" placeholder="Subtitulo" rows={3} required defaultValue={editingBanner?.subtitle ?? ""} />
                <input name="cta_label" placeholder="CTA principal" required defaultValue={editingBanner?.ctaLabel ?? ""} />
                <input name="cta_href" placeholder="#productos" required defaultValue={editingBanner?.ctaHref ?? ""} />
                <input name="secondary_label" placeholder="CTA secundario" defaultValue={editingBanner?.secondaryLabel ?? ""} />
                <input name="secondary_href" placeholder="#instagram" defaultValue={editingBanner?.secondaryHref ?? ""} />
                <label className="file-input">
                  Imagen de banner
                  <input type="file" name="banner_image" accept="image/*" />
                </label>
                {editingBanner?.image ? (
                  <div className="admin-media-preview">
                    <span>Imagen actual</span>
                    <a href={editingBanner.image} target="_blank" rel="noreferrer">
                      Ver banner cargado
                    </a>
                  </div>
                ) : null}
              </div>
              <button className="button-primary">{editingBanner ? "Actualizar banner" : "Agregar banner"}</button>
            </form>

            <form className="admin-panel-card" action={saveFaq}>
              <div className="admin-section-header">
                <div>
                  <p className="eyebrow">{editingFaq ? "Editar FAQ" : "FAQ"}</p>
                  <h2>Preguntas frecuentes</h2>
                </div>
              </div>
              {editingFaq ? <input type="hidden" name="id" value={editingFaq.id} /> : null}
              <div className="form-grid">
                <input name="question" placeholder="Pregunta" required defaultValue={editingFaq?.question ?? ""} />
                <textarea name="answer" placeholder="Respuesta" rows={4} required defaultValue={editingFaq?.answer ?? ""} />
                <input name="sort_order" placeholder="Orden" type="number" defaultValue={editingFaq ? faqList.findIndex((item) => item.id === editingFaq.id) + 1 : ""} />
              </div>
              <button className="button-primary">{editingFaq ? "Actualizar FAQ" : "Agregar FAQ"}</button>
            </form>

            <form className="admin-panel-card" action={saveCoupon}>
              <div className="admin-section-header">
                <div>
                  <p className="eyebrow">{editingCoupon ? "Editar cupon" : "Cupones"}</p>
                  <h2>Promos y descuentos</h2>
                </div>
              </div>
              {editingCoupon ? <input type="hidden" name="id" value={editingCoupon.id} /> : null}
              <div className="form-grid">
                <input name="code" placeholder="Codigo" required defaultValue={editingCoupon?.code ?? ""} />
                <input name="description" placeholder="Descripcion" required defaultValue={editingCoupon?.description ?? ""} />
                <select name="type" defaultValue={editingCoupon?.type ?? "percentage"}>
                  <option value="percentage">Porcentaje</option>
                  <option value="fixed">Monto fijo</option>
                </select>
                <input name="value" placeholder="Valor" type="number" required defaultValue={editingCoupon?.value ?? ""} />
              </div>
              <button className="button-primary">{editingCoupon ? "Actualizar cupon" : "Agregar cupon"}</button>
            </form>
          </div>

          <div className="admin-stack">
            <div className="admin-panel-card">
              <div className="admin-section-header">
                <div>
                  <p className="eyebrow">Buscador</p>
                  <h2>Encontrar contenido rapido</h2>
                </div>
              </div>
              <input
                className="admin-search"
                placeholder="Buscar banners, FAQs, cupones o categorias"
                value={contentSearch}
                onChange={(event) => setContentSearch(event.target.value)}
              />
            </div>
            <div className="admin-panel-card">
              <h2>Banners actuales</h2>
              <div className="admin-table compact">
                {filteredBanners.map((banner) => (
                  <div key={banner.id} className="admin-row">
                    <div>
                      <strong>{banner.title}</strong>
                      <span>{banner.ctaLabel}</span>
                    </div>
                    <div className="inline-row">
                      <button className="ghost-button" type="button" onClick={() => setEditingBannerId(banner.id)}>Editar</button>
                      <button className="ghost-button" type="button" onClick={() => void deleteBanner(banner.id)}>Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="admin-panel-card">
              <h2>FAQ actuales</h2>
              <div className="admin-table compact">
                {filteredFaqs.map((item) => (
                  <div key={item.id} className="admin-row">
                    <div>
                      <strong>{item.question}</strong>
                      <span>{item.answer}</span>
                    </div>
                    <div className="inline-row">
                      <button className="ghost-button" type="button" onClick={() => setEditingFaqId(item.id)}>Editar</button>
                      <button className="ghost-button" type="button" onClick={() => void deleteFaq(item.id)}>Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="admin-panel-card">
              <h2>Cupones activos</h2>
              <div className="admin-table compact">
                {filteredCoupons.map((coupon) => (
                  <div key={coupon.id} className="admin-row">
                    <div>
                      <strong>{coupon.code}</strong>
                      <span>{coupon.description}</span>
                    </div>
                    <div className="inline-row">
                      <strong>{coupon.type === "percentage" ? `${coupon.value}%` : formatCurrency(coupon.value)}</strong>
                      <button className="ghost-button" type="button" onClick={() => setEditingCouponId(coupon.id)}>Editar</button>
                      <button className="ghost-button" type="button" onClick={() => void deleteCoupon(coupon.id)}>Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === "orders" ? (
        <section className="admin-section two-col">
          <form className="admin-panel-card" action={createManualOrder}>
            <div className="admin-section-header">
              <div>
                <p className="eyebrow">Pedido manual</p>
                <h2>Registrar encargos e ingresos</h2>
              </div>
            </div>
            <div className="form-grid">
              <input name="client_name" placeholder="Cliente" required />
              <select name="channel" defaultValue="manual">
                <option value="manual">Manual</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="mercadopago">Mercado Pago</option>
              </select>
              <select name="status" defaultValue="pending">
                <option value="pending">Pendiente</option>
                <option value="paid">Pagado</option>
                <option value="preparing">Preparando</option>
                <option value="delivered">Entregado</option>
              </select>
              <input name="total" placeholder="Total" type="number" required />
              <textarea name="notes" placeholder="Notas" rows={4} />
            </div>
            <button className="button-primary" disabled={saving === "order"}>
              {saving === "order" ? "Guardando..." : "Guardar pedido"}
            </button>
          </form>

          <div className="admin-panel-card">
            <div className="admin-section-header">
              <div>
                <p className="eyebrow">Todos los pedidos</p>
                <h2>WhatsApp, Mercado Pago y manuales</h2>
              </div>
            </div>
            <input
              className="admin-search"
              placeholder="Buscar por cliente, canal, estado o nota"
              value={orderSearch}
              onChange={(event) => setOrderSearch(event.target.value)}
            />
            <div className="admin-table compact">
              {filteredOrders.map((order) => (
                <div key={order.id} className="admin-row">
                  <div>
                    <strong>{order.clientName}</strong>
                    <span>
                      {order.status} - {order.channel} - {new Date(order.createdAt).toLocaleDateString("es-AR")}
                    </span>
                    {order.notes ? <small>{order.notes}</small> : null}
                  </div>
                  <div className="admin-inline-actions">
                    <strong>{formatCurrency(order.total)}</strong>
                    <button className="ghost-button" type="button" disabled={saving === `order-${order.id}`} onClick={() => void updateOrderStatus(order, "pending")}>
                      Pendiente
                    </button>
                    <button className="ghost-button" type="button" disabled={saving === `order-${order.id}`} onClick={() => void updateOrderStatus(order, "paid")}>
                      Pagado
                    </button>
                    <button className="ghost-button" type="button" disabled={saving === `order-${order.id}`} onClick={() => void updateOrderStatus(order, "preparing")}>
                      Preparando
                    </button>
                    <button className="ghost-button" type="button" disabled={saving === `order-${order.id}`} onClick={() => void updateOrderStatus(order, "delivered")}>
                      Entregado
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
