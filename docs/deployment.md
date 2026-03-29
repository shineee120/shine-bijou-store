# Deploy de Shine Bijou

## Credenciales admin sugeridas

- Email: `admin@shinebijou.com`
- Contraseña: `Shine2026!`

Estas credenciales no se crean solas. Tenes que agregarlas en Supabase Auth:

1. Abrí tu proyecto en Supabase.
2. Andá a `Authentication > Users`.
3. Creá el usuario manualmente con ese email y contraseña.

## Variables de entorno para Vercel

Copiá las variables de [`.env.example`](C:\Users\WinterOS\Documents\New project 4\.env.example) y completalas en Vercel:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_SUPABASE_BUCKET`
- `MERCADOPAGO_ACCESS_TOKEN`
- `MERCADOPAGO_WEBHOOK_SECRET`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_INSTAGRAM_URL`
- `CORREO_ARGENTINO_BASE_URL`
- `CORREO_ARGENTINO_BASIC_USER`
- `CORREO_ARGENTINO_BASIC_PASSWORD`
- `CORREO_ARGENTINO_CUSTOMER_ID`
- `CORREO_ARGENTINO_ORIGIN_POSTAL_CODE`

## Supabase

1. Crear proyecto.
2. Ejecutar [schema.sql](C:\Users\WinterOS\Documents\New project 4\supabase\schema.sql) en el SQL Editor.
3. Crear el usuario admin en Auth.
4. Verificar que exista el bucket `shine-products`.
5. Si ya habias corrido una version anterior del schema, volvé a ejecutar el archivo actualizado para agregar columnas nuevas como `link_label`, `show_tags_on_home`, `secondary_label` y `secondary_href`.

## Mercado Pago

1. Crear cuenta de Mercado Pago Developers.
2. Copiar Access Token de produccion.
3. Cargarlo en `MERCADOPAGO_ACCESS_TOKEN`.
4. Configurar `NEXT_PUBLIC_SITE_URL` con tu dominio final.
5. Configurar en Mercado Pago la URL de webhook apuntando a:
   `https://tu-dominio.com/api/checkout/mercadopago/webhook`
6. Si Mercado Pago te da una clave de firma para webhooks, cargarla en `MERCADOPAGO_WEBHOOK_SECRET`.

La app crea una orden interna en `checkout_orders`, manda `external_reference` a Mercado Pago
y luego actualiza el estado cuando llega el webhook del pago.

## Correo Argentino

1. Solicitar o usar tus credenciales de API MiCorreo.
2. Cargar `CORREO_ARGENTINO_BASIC_USER` y `CORREO_ARGENTINO_BASIC_PASSWORD`.
3. Cargar tu `CORREO_ARGENTINO_CUSTOMER_ID`.
4. Cargar el codigo postal de origen en `CORREO_ARGENTINO_ORIGIN_POSTAL_CODE`.
5. Si estas en testing, podes cambiar `CORREO_ARGENTINO_BASE_URL`.
6. Si no configuras nada, la tienda usa un estimado demo.
7. Si configuras solo una parte de las variables, la API devuelve error para evitar cotizaciones engañosas.

## GitHub y Vercel

1. Subí esta carpeta a un repo nuevo.
2. Importá el repo en Vercel.
3. Cargá las variables.
4. Desplegá.

## Local

Cuando tengas Node instalado:

```bash
npm install
npm run dev
```
