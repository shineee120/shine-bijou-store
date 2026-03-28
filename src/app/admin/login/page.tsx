import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  const missingSupabase =
    !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <main className="admin-page">
      <div className="admin-auth-card">
        <p className="eyebrow">Panel Shine</p>
        <h1>Ingresar al admin</h1>
        <p className="form-error">
          Acceso privado solo para la administracion de la tienda.
        </p>
        {missingSupabase ? (
          <p className="form-error">
            Primero completa `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
            para habilitar el login real.
          </p>
        ) : (
          <LoginForm />
        )}
      </div>
    </main>
  );
}
