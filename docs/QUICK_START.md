# 🚀 Inicio Rápido - ACAR Labs

Guía de inicio rápido para poner en marcha el sistema en 5 minutos.

## ⚡ Setup Express

### 1. Instalar dependencias

\`\`\`bash
pnpm install
\`\`\`

### 2. Configurar Turso (Base de datos)

#### Opción A: Usar Turso Cloud (Recomendado)

\`\`\`bash

# Instalar CLI de Turso

brew install tursodatabase/tap/turso  # macOS

# O visita: <https://docs.turso.tech/cli/installation>

# Login

turso auth login

# Crear base de datos

turso db create acar-labs-db

# Obtener URL

turso db show acar-labs-db --url

# Crear token

turso db tokens create acar-labs-db
\`\`\`

#### Opción B: Usar SQLite local (Para desarrollo)

\`\`\`env
DATABASE_URL=file:local.db

# No necesitas DATABASE_AUTH_TOKEN

\`\`\`

### 3. Configurar Upstash Redis (Cache)

1. Visita <https://console.upstash.com>
2. Crea una cuenta (gratis)
3. Click en "Create Database"
4. Elige región y plan Free
5. Copia las credenciales de la pestaña "REST API"

### 4. Crear archivo .env

\`\`\`bash
cp .env.example .env
\`\`\`

Edita `.env` con tus credenciales:

\`\`\`env

# Turso

DATABASE_URL=libsql://tu-database.turso.io
DATABASE_AUTH_TOKEN=tu-token-aqui

# Upstash

UPSTASH_REDIS_REST_URL=<https://tu-redis.upstash.io>
UPSTASH_REDIS_REST_TOKEN=tu-token-aqui

# JWT (genera una clave segura)

JWT_SECRET=tu-clave-super-secreta-aqui-cambiar-en-produccion
JWT_EXPIRES_IN=7d

# App

NODE_ENV=development
NEXT_PUBLIC_APP_URL=<http://localhost:3000>
\`\`\`

### 5. Inicializar base de datos

\`\`\`bash

# Crear tablas e insertar datos de prueba

pnpm db:seed
\`\`\`

### 6. Iniciar servidor

\`\`\`bash
pnpm dev
\`\`\`

¡Listo! Abre <http://localhost:3000>

## 🔐 Credenciales de Prueba

Después de ejecutar \`pnpm db:seed\`:

**Usuario Admin:**

- Email: \`<admin@demo.com>\`
- Password: \`admin123\`

## 📚 Documentación Completa

- **[BACKEND_README.md](../BACKEND_README.md)** - Documentación completa del backend
- **[docs/API_GUIDE.md](./API_GUIDE.md)** - Guía de uso de la API con ejemplos
- **[docs/TURSO_SETUP.md](./TURSO_SETUP.md)** - Configuración detallada de Turso
- **[docs/UPSTASH_SETUP.md](./UPSTASH_SETUP.md)** - Configuración detallada de Upstash

## 🗂️ Estructura del Proyecto

\`\`\`
acar-labs-frontend/
├── app/
│   ├── api/                    # API Routes (Backend)
│   │   ├── login/             # Autenticación
│   │   ├── register-customer/ # Registro
│   │   ├── clinics/           # Gestión de clínicas
│   │   ├── services/          # Gestión de servicios
│   │   ├── appointments/      # Gestión de citas
│   │   └── customers/         # Gestión de clientes
│   ├── layout.tsx             # Layout principal
│   └── page.tsx               # Página de inicio
├── components/
│   ├── layout/                # Componentes de layout
│   └── ui/                    # Componentes de UI
├── lib/
│   ├── api.ts                 # Cliente API (Frontend)
│   ├── db.ts                  # Conexión a base de datos
│   ├── cache.ts               # Cliente Redis para cache
│   ├── auth.ts                # Utilidades de autenticación
│   ├── middleware.ts          # Middlewares de API
│   └── schema.ts              # Schema de base de datos
├── scripts/
│   └── setup-db.js            # Script de inicialización
├── docs/                      # Documentación
└── .env.example               # Plantilla de variables de entorno
\`\`\`

## 🧪 Comandos Disponibles

\`\`\`bash
pnpm dev          # Desarrollo
pnpm build        # Build para producción
pnpm start        # Iniciar en producción
pnpm db:setup     # Solo crear tablas
pnpm db:seed      # Crear tablas + datos de prueba
pnpm db:reset     # Resetear todo
\`\`\`

## 🔧 Testing de la API

### Con cURL

\`\`\`bash

# Login

curl -X POST <http://localhost:3000/api/login> \\
  -H "Content-Type: application/json" \\
  -d '{"email":"<admin@demo.com>","password":"admin123"}'

# Listar clínicas

curl <http://localhost:3000/api/clinics>
\`\`\`

### Con el navegador

Abre: <http://localhost:3000/api/clinics>

## ❓ Solución de Problemas

### Error: DATABASE_URL no definida

- Asegúrate de tener un archivo `.env` con las credenciales correctas
- Verifica que el archivo `.env` esté en la raíz del proyecto

### Error: Cannot connect to Turso

- Verifica que el `DATABASE_URL` sea correcto
- Verifica que el `DATABASE_AUTH_TOKEN` esté configurado
- Prueba usar SQLite local primero: \`DATABASE_URL=file:local.db\`

### Error: Upstash Redis connection failed

- Verifica las credenciales de Upstash
- Asegúrate de usar la URL de REST API (no la de conexión directa)

### El frontend no se conecta con el backend

- Las API routes están en `/api/*`, no necesitan configuración especial
- Verifica que el servidor esté corriendo en el puerto correcto

## 🚀 Próximos Pasos

1. **Explora la API**: Lee [docs/API_GUIDE.md](./API_GUIDE.md)
2. **Personaliza el schema**: Edita [lib/schema.ts](../lib/schema.ts)
3. **Agrega nuevas rutas**: Crea archivos en `app/api/`
4. **Modifica el frontend**: Edita componentes en `components/`

## 📞 Soporte

Si tienes problemas:

1. Revisa la documentación completa
2. Verifica los logs de la consola
3. Abre un issue en GitHub

---

¡Feliz desarrollo! 🎉
