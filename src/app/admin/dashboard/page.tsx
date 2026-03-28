import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { LogoutButton } from "@/components/admin/logout-button";
import { createClient } from "@/lib/supabase/server";
import { getAdminData } from "@/lib/store-service";

export default async function AdminDashboardPage() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return (
      <main className="admin-page">
        <div className="container">
          <div className="admin-auth-card">
            <p className="eyebrow">Panel Shine</p>
            <h1>Falta configurar Supabase</h1>
            <p>
              Completá las variables del archivo `.env.local` para activar login,
              base de datos, storage y pedidos reales.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const supabase = await createClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const { products, categories, orders, banners, faqItems, coupons } = await getAdminData();

  return (
    <main className="admin-page">
      <div className="container">
        <div className="admin-topbar">
          <div>
            <p className="eyebrow">Administracion</p>
            <h1>Shine dashboard</h1>
          </div>
          <div className="inline-row">
            <Link href="/" className="button-secondary">
              Ver tienda
            </Link>
            <LogoutButton />
          </div>
        </div>

        <DashboardShell
          products={products}
          categories={categories}
          orders={orders}
          banners={banners}
          faqItems={faqItems}
          coupons={coupons}
        />
      </div>
    </main>
  );
}
