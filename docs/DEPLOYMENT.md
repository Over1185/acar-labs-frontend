+# Despliegue en Vercel

Esta guía te ayudará a desplegar ACAR Labs en Vercel.

## 🚀 Pasos para Desplegar

### 1. Preparar el Proyecto

Asegúrate de que todo funciona localmente:

\`\`\`bash
pnpm build
pnpm start
\`\`\`

### 2. Conectar con Vercel

#### Opción A: Desde el Dashboard de Vercel

1. Ve a <https://vercel.com>
2. Click en "Add New Project"
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente Next.js

#### Opción B: Desde la CLI

\`\`\`bash

# Instalar Vercel CLI

npm i -g vercel

# Login

vercel login

# Desplegar

vercel
\`\`\`

### 3. Configurar Variables de Entorno

En el dashboard de Vercel:

1. Ve a tu proyecto → Settings → Environment Variables
2. Agrega las siguientes variables:

| Variable | Valor | Tipo |
|----------|-------|------|
| DATABASE_URL | libsql://tu-db.turso.io | Secret |
| DATABASE_AUTH_TOKEN | tu-token-turso | Secret |
| UPSTASH_REDIS_REST_URL | <https://tu-redis.upstash.io> | Secret |
| UPSTASH_REDIS_REST_TOKEN | tu-token-upstash | Secret |
| JWT_SECRET | tu-clave-super-segura | Secret |
| JWT_EXPIRES_IN | 7d | Plain Text |
| NODE_ENV | production | Plain Text |
| NEXT_PUBLIC_APP_URL | <https://tu-app.vercel.app> | Plain Text |

**⚠️ IMPORTANTE:** Genera un nuevo `JWT_SECRET` para producción:

\`\`\`bash

# En Node.js

node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# O en línea de comandos (Linux/Mac)

openssl rand -hex 32
\`\`\`

### 4. Configurar Turso para Producción

Si usas Turso, asegúrate de que tu base de datos esté en la región más cercana a tus usuarios:

\`\`\`bash

# Ver regiones disponibles

turso db locations

# Crear réplica en otra región (opcional)

turso db replicate acar-labs-db --location mad  # Madrid
turso db replicate acar-labs-db --location gru  # São Paulo
\`\`\`

### 5. Inicializar Base de Datos en Producción

Después del primer despliegue, necesitas inicializar la base de datos:

#### Opción A: Localmente con las credenciales de producción

\`\`\`bash

# Crear un archivo .env.production con las credenciales

DATABASE_URL=libsql://tu-db-produccion.turso.io
DATABASE_AUTH_TOKEN=tu-token-produccion

# Ejecutar el setup

NODE_ENV=production pnpm db:seed
\`\`\`

#### Opción B: Usando Turso CLI

\`\`\`bash

# Conectarse a la base de datos

turso db shell acar-labs-db

# Copiar y pegar el SQL desde lib/schema.ts

# (Desde DATABASE_SCHEMA y SEED_DATA)

\`\`\`

### 6. Re-desplegar

Después de configurar las variables de entorno:

\`\`\`bash

# Desde la CLI

vercel --prod

# O haz push a tu rama main/master en GitHub

git push origin main
\`\`\`

## ⚙️ Configuración Avanzada

### Build Settings

Vercel detecta automáticamente, pero puedes especificar:

| Setting | Value |
|---------|-------|
| Framework Preset | Next.js |
| Build Command | pnpm build |
| Output Directory | .next |
| Install Command | pnpm install |
| Development Command | pnpm dev |

### Dominios Personalizados

1. Ve a Settings → Domains
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones
4. Actualiza `NEXT_PUBLIC_APP_URL` con tu nuevo dominio

### Monitoreo

Vercel proporciona:

- **Analytics**: Métricas de rendimiento y uso
- **Logs**: Logs de build y runtime
- **Speed Insights**: Core Web Vitals
- **Functions**: Estadísticas de API routes

Accede desde tu dashboard de Vercel.

## 🔒 Seguridad en Producción

### 1. Variables de Entorno

✅ **Buenas prácticas:**

- Usa valores diferentes en producción vs desarrollo
- Nunca commits archivos `.env` al repositorio
- Usa el tipo "Secret" para datos sensibles en Vercel

### 2. JWT Secret

✅ **Recomendaciones:**

- Mínimo 32 caracteres aleatorios
- Genera una nueva clave para producción
- No reutilices claves de desarrollo

### 3. Rate Limiting

Considera agregar rate limiting para proteger tus APIs:

\`\`\`bash
pnpm add @upstash/ratelimit
\`\`\`

Implementa en tus API routes:

\`\`\`typescript
import { Ratelimit } from '@upstash/ratelimit';
import { getRedis } from '@/lib/cache';

const ratelimit = new Ratelimit({
  redis: getRedis(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests por 10 segundos
});

// En tu API route:
const { success } = await ratelimit.limit(ip);
if (!success) {
  return ApiResponse.error('Too many requests', 429);
}
\`\`\`

### 4. CORS

Si necesitas CORS para APIs externas, configura en `next.config.ts`:

\`\`\`typescript
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://tu-frontend.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
        ],
      },
    ];
  },
};
\`\`\`

## 🐛 Solución de Problemas

### Error: Cannot connect to database

**Solución:**

1. Verifica que `DATABASE_URL` y `DATABASE_AUTH_TOKEN` estén correctamente configurados
2. Asegúrate de que la base de datos existe en Turso
3. Revisa los logs de Vercel para más detalles

### Error: Redis connection failed

**Solución:**

1. Verifica las credenciales de Upstash
2. Asegúrate de usar la URL REST (no la de conexión directa)
3. Verifica que la instancia de Redis esté activa

### Build fails

**Solución:**

1. Asegúrate de que `pnpm build` funciona localmente
2. Revisa los logs de build en Vercel
3. Verifica que todas las dependencias estén en `package.json`

### API routes returning 500

**Solución:**

1. Revisa los logs de funciones en Vercel
2. Asegúrate de que las variables de entorno estén configuradas
3. Verifica que la base de datos esté inicializada

## 📊 Monitoreo y Mantenimiento

### Backups de Base de Datos

Con Turso:

\`\`\`bash

# Exportar base de datos

turso db shell acar-labs-db .dump > backup.sql

# Importar backup

turso db shell acar-labs-db < backup.sql
\`\`\`

### Logs

Ver logs en tiempo real:

\`\`\`bash
vercel logs --follow
\`\`\`

### Métricas

Monitorea en el dashboard de Vercel:

- Requests por minuto
- Tiempo de respuesta
- Errores
- Uso de funciones

## 🚀 Optimizaciones

### 1. Edge Runtime (Opcional)

Para APIs más rápidas, considera usar Edge Runtime:

\`\`\`typescript
// En tu API route
export const runtime = 'edge';
\`\`\`

**⚠️ Nota:** No todas las librerías son compatibles con Edge Runtime.

### 2. ISR (Incremental Static Regeneration)

Para páginas que no cambian frecuentemente:

\`\`\`typescript
export const revalidate = 300; // Regenerar cada 5 minutos
\`\`\`

### 3. Image Optimization

Next.js optimiza imágenes automáticamente. Usa el componente `Image`:

\`\`\`typescript
import Image from 'next/image';

<Image src="/logo.png" alt="Logo" width={200} height={100} />
\`\`\`

## 🌍 Réplicas Globales

### Turso

Crea réplicas en múltiples regiones:

\`\`\`bash
turso db replicate acar-labs-db --location iad  # Virginia
turso db replicate acar-labs-db --location gru  # São Paulo
turso db replicate acar-labs-db --location fra  # Frankfurt
\`\`\`

### Upstash

Upstash soporta réplicas globales en el plan Pro.

## 📈 Escalabilidad

Vercel escala automáticamente:

- **Serverless Functions**: Escalan con la demanda
- **Edge Network**: CDN global
- **Zero Config**: No necesitas configurar nada

Para aplicaciones grandes:

- Considera el plan Pro de Vercel
- Monitorea el uso de funciones
- Optimiza queries pesadas
- Usa caché agresivamente

## 📚 Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Turso](https://docs.turso.tech)
- [Documentación de Upstash](https://docs.upstash.com)

---

¡Tu aplicación está lista para producción! 🎉
