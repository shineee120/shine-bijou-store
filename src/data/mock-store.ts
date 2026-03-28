import {
  AdminTaskOrder,
  Coupon,
  FAQItem,
  HeroBanner,
  Product,
  ProductCategory
} from "@/types/store";

export const categories: ProductCategory[] = [
  {
    id: "cat-collares",
    name: "Collares",
    slug: "collares",
    description: "Cadenas delicadas, chokers y collares para todos los dias.",
    image: "",
    featured: true,
    sortOrder: 1,
    linkLabel: "Ver collares"
  },
  {
    id: "cat-aros",
    name: "Aros",
    slug: "aros",
    description: "Aros pequenos, argollas y modelos protagonistas.",
    image: "",
    featured: true,
    sortOrder: 2,
    linkLabel: "Ver aros"
  },
  {
    id: "cat-pulseras",
    name: "Pulseras",
    slug: "pulseras",
    description: "Pulseras minimalistas para combinar entre si.",
    image: "",
    sortOrder: 3,
    linkLabel: "Ver pulseras"
  },
  {
    id: "cat-conjuntos",
    name: "Conjuntos",
    slug: "conjuntos",
    description: "Sets listos para regalar o completar tu look.",
    image: "",
    sortOrder: 4,
    linkLabel: "Ver conjuntos"
  },
  {
    id: "cat-otros",
    name: "Otros",
    slug: "otros",
    description: "Nuevos hallazgos, accesorios especiales y mas.",
    image: "",
    sortOrder: 5,
    linkLabel: "Descubrir mas"
  }
];

export const heroBanners: HeroBanner[] = [
  {
    id: "banner-main",
    title: "Accesorios que hacen brillar tu estilo",
    subtitle:
      "Joyeria minimalista con aire editorial para adolescentes, jovenes y adultas.",
    ctaLabel: "Comprar ahora",
    ctaHref: "#productos",
    secondaryLabel: "Ver nuevos ingresos",
    secondaryHref: "#nuevos"
  },
  {
    id: "banner-weekend",
    title: "Looks para regalar y usar todos los dias",
    subtitle:
      "Combos, aros, collares y pulseras con una estetica limpia y femenina.",
    ctaLabel: "Ver destacados",
    ctaHref: "#destacados",
    secondaryLabel: "Ir a Instagram",
    secondaryHref: "#instagram"
  }
];

export const coupons: Coupon[] = [
  {
    id: "coupon-shine10",
    code: "SHINE10",
    type: "percentage",
    value: 10,
    description: "10% off en tu primera compra",
    active: true
  },
  {
    id: "coupon-regalo5000",
    code: "REGALO5000",
    type: "fixed",
    value: 5000,
    description: "Descuento fijo para compras regalo",
    active: true
  }
];

export const products: Product[] = [
  {
    id: "prod-aurora",
    name: "Collar Aurora",
    slug: "collar-aurora",
    description: "Cadena dorada fina con dije brillante para looks diarios.",
    longDescription:
      "Un collar delicado para usar solo o en capas. Favorece looks casuales, salidas y regalos. Tiene terminacion brillante y presencia sutil.",
    price: 18990,
    compareAtPrice: 22990,
    stock: 14,
    categorySlug: "collares",
    featured: true,
    newArrival: true,
    bestSeller: true,
    sku: "SH-CO-001",
    weightGrams: 120,
    dimensions: { height: 4, width: 12, length: 16 },
    images: [],
    variants: [
      {
        id: "v1",
        name: "Color",
        value: "Dorado",
        stock: 8,
        options: [
          { label: "Dorado", value: "Dorado" },
          { label: "Plateado", value: "Plateado" }
        ]
      },
      {
        id: "v2",
        name: "Largo",
        value: "40 cm",
        stock: 6,
        options: [
          { label: "40 cm", value: "40 cm" },
          { label: "45 cm", value: "45 cm" }
        ]
      }
    ],
    tags: ["delicado", "regalo", "capas"],
    reviews: [
      { id: "r1", author: "Milagros", rating: 5, comment: "Hermoso y super combinable." },
      { id: "r2", author: "Valentina", rating: 5, comment: "Queda fino y elegante." }
    ]
  },
  {
    id: "prod-luna",
    name: "Aros Luna",
    slug: "aros-luna",
    description: "Argollas livianas con detalle de perla sintetica.",
    longDescription:
      "Pensados para usar tanto de dia como de noche. Su forma limpia y la perla les da un toque actual y delicado.",
    price: 14990,
    compareAtPrice: 17990,
    stock: 20,
    categorySlug: "aros",
    featured: true,
    bestSeller: true,
    sku: "SH-AR-010",
    weightGrams: 80,
    dimensions: { height: 3, width: 3, length: 3 },
    images: [],
    variants: [
      {
        id: "v3",
        name: "Tamano",
        value: "Mini",
        stock: 10,
        options: [
          { label: "Mini", value: "Mini" },
          { label: "Medium", value: "Medium" }
        ]
      }
    ],
    tags: ["tendencia", "argollas"],
    reviews: [
      { id: "r3", author: "Camila", rating: 4, comment: "Muy livianos y quedan lindos." }
    ]
  },
  {
    id: "prod-selene",
    name: "Pulsera Selene",
    slug: "pulsera-selene",
    description: "Pulsera ajustable con micro dijes y acabado brillante.",
    longDescription:
      "Ideal para stacking con otras pulseras o para usar sola. Ajuste comodo y look pulido.",
    price: 12990,
    stock: 12,
    categorySlug: "pulseras",
    newArrival: true,
    sku: "SH-PU-004",
    weightGrams: 90,
    dimensions: { height: 2, width: 12, length: 14 },
    images: [],
    tags: ["stack", "minimal"]
  },
  {
    id: "prod-duo",
    name: "Set Duo Shine",
    slug: "set-duo-shine",
    description: "Conjunto de collar y aros pensado para regalar.",
    longDescription:
      "Un set equilibrado para regalo o para resolver un look completo con una sola compra.",
    price: 25990,
    compareAtPrice: 29990,
    stock: 6,
    categorySlug: "conjuntos",
    featured: true,
    sku: "SH-SE-020",
    weightGrams: 180,
    dimensions: { height: 5, width: 18, length: 22 },
    images: [],
    tags: ["regalo", "combo"]
  },
  {
    id: "prod-charms",
    name: "Charm Crystal",
    slug: "charm-crystal",
    description: "Accesorio especial para sumar a cadenas o pulseras.",
    longDescription:
      "Charm pequeño con brillo sutil para personalizar tu combinacion favorita.",
    price: 8990,
    stock: 10,
    categorySlug: "otros",
    images: [],
    sku: "SH-OT-002",
    weightGrams: 60,
    dimensions: { height: 2, width: 3, length: 3 },
    tags: ["charms", "personalizable"]
  }
];

export const adminTaskOrders: AdminTaskOrder[] = [
  {
    id: "order-001",
    clientName: "Agustina Perez",
    channel: "whatsapp",
    status: "pending",
    total: 33980,
    notes: "Reservado para retirar el viernes.",
    createdAt: "2026-03-27T15:00:00.000Z"
  },
  {
    id: "order-002",
    clientName: "Sofia Lopez",
    channel: "manual",
    status: "preparing",
    total: 25990,
    notes: "Armar bolsita para regalo.",
    createdAt: "2026-03-28T11:30:00.000Z"
  }
];

export const faqItems: FAQItem[] = [
  {
    id: "faq-1",
    question: "¿Como compro en Shine?",
    answer:
      "Podes sumar productos al carrito, pagar por Mercado Pago o enviarnos tu pedido completo por WhatsApp para coordinarlo directo."
  },
  {
    id: "faq-2",
    question: "¿Tienen stock actualizado?",
    answer:
      "Si. El stock se administra desde el panel interno para que veas solo productos disponibles y novedades reales."
  },
  {
    id: "faq-3",
    question: "¿Puedo calcular el envio?",
    answer:
      "Si. En el carrito vas a poder ingresar tu codigo postal para estimar el costo de Correo Argentino."
  },
  {
    id: "faq-4",
    question: "¿Hacen envios y retiros?",
    answer:
      "Si, hacemos envios y tambien coordinamos retiros. La modalidad exacta la definis por WhatsApp segun tu zona."
  },
  {
    id: "faq-5",
    question: "¿Puedo comprar para regalo?",
    answer:
      "Si, muchos de nuestros conjuntos y accesorios son ideales para regalar. Tambien podes aclararlo en el pedido."
  }
];
