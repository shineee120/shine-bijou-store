# Shine Bijou

Tienda online completa para `Shine Bijou`, pensada para deploy en GitHub + Vercel con:

- storefront minimalista estilo accesorios
- mega menu de categorias
- carrito persistente
- wishlist / favoritos
- pagina individual por producto
- reseñas, relacionados y badges de oferta
- checkout por WhatsApp
- pago real por Mercado Pago
- calculo de envio por codigo postal con Correo Argentino
- panel admin con login
- gestion de categorias, productos, banners, FAQ, cupones y pedidos
- subida de imagenes desde PC a Supabase Storage
- pagina `/links` para compartir categorias por WhatsApp

## Stack

- Next.js App Router
- TypeScript
- Supabase Auth + Database + Storage
- Mercado Pago
- Correo Argentino MiCorreo API

## Usuario admin sugerido

- Email: `admin@shinebijou.com`
- Contraseña: `Shine2026!`

Tenes que crearlo manualmente en Supabase Auth.

## Archivos clave

- [src/app/page.tsx](C:\Users\WinterOS\Documents\New project 4\src\app\page.tsx)
- [src/app/links/page.tsx](C:\Users\WinterOS\Documents\New project 4\src\app\links\page.tsx)
- [src/app/admin/dashboard/page.tsx](C:\Users\WinterOS\Documents\New project 4\src\app\admin\dashboard\page.tsx)
- [src/components/admin/dashboard-shell.tsx](C:\Users\WinterOS\Documents\New project 4\src\components\admin\dashboard-shell.tsx)
- [supabase/schema.sql](C:\Users\WinterOS\Documents\New project 4\supabase\schema.sql)

## Puesta en marcha

1. Instalar Node.js.
2. Ejecutar `npm install`.
3. Copiar `.env.example` a `.env.local`.
4. Crear proyecto en Supabase.
5. Ejecutar el SQL de [schema.sql](C:\Users\WinterOS\Documents\New project 4\supabase\schema.sql).
6. Crear el usuario admin en Supabase Auth.
7. Cargar credenciales de Mercado Pago.
8. Ejecutar `npm run dev`.

## Si ya tenias Supabase configurado

Si ejecutaste una version anterior del SQL, volvé a correr [schema.sql](C:\Users\WinterOS\Documents\New project 4\supabase\schema.sql) para agregar las columnas nuevas del admin editable y de la home.

## Nota

En este entorno no habia `node`, `npm` ni `git`, asi que deje el proyecto armado pero no pude instalar dependencias, correrlo ni verificar build.
