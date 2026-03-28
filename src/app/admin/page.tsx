import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminEntryPage() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    redirect("/admin/login");
  }

  const supabase = await createClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/admin/dashboard");
  }

  redirect("/admin/login");
}
