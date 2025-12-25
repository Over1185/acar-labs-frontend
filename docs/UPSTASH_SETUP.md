# Configuración de Upstash Redis

## Crear una instancia de Redis en Upstash

### 1. Crear cuenta en Upstash

Visita <https://console.upstash.com> y crea una cuenta (puedes usar GitHub, Google, etc.)

### 2. Crear base de datos Redis

1. En el dashboard, haz clic en **"Create Database"**
2. Elige un nombre para tu base de datos: `acar-labs-cache`
3. Selecciona una región cercana a tus usuarios
4. Elige el plan **Free** (incluye 10,000 comandos/día)
5. Haz clic en **"Create"**

### 3. Obtener credenciales

Una vez creada la base de datos:

1. Ve a la pestaña **"REST API"**
2. Copia los valores:
   - **UPSTASH_REDIS_REST_URL**: `https://your-database.upstash.io`
   - **UPSTASH_REDIS_REST_TOKEN**: Tu token de acceso

### 4. Configurar variables de entorno

Agrega las credenciales a tu archivo `.env`:

\`\`\`env
UPSTASH_REDIS_REST_URL=<https://your-redis-name-12345.upstash.io>
UPSTASH_REDIS_REST_TOKEN=AXXXabcdefghijklmnopqrstuvwxyz1234567890
\`\`\`

### 5. Verificar configuración

Puedes probar la conexión desde el dashboard de Upstash:

1. Ve a la pestaña **"CLI"** o **"Data Browser"**
2. Ejecuta comandos de prueba:
   \`\`\`redis
   SET test "Hello from Upstash"
   GET test
   \`\`\`

## Características de Upstash Redis

- **Serverless**: Solo pagas por lo que usas
- **Edge-compatible**: Funciona perfecto con Vercel y otros edge runtimes
- **REST API**: No necesita conexiones persistentes
- **Global**: Puedes crear réplicas en múltiples regiones
- **Durable**: Persistencia automática de datos

## Comandos útiles

### Desde el dashboard CLI

\`\`\`redis

# Ver todas las claves

KEYS *

# Ver claves con patrón

KEYS user:*

# Ver valor de una clave

GET user:customer:1

# Ver TTL de una clave

TTL clinics:all

# Eliminar una clave

DEL test

# Eliminar todas las claves (¡CUIDADO!)

FLUSHALL
\`\`\`

## Uso en la aplicación

El caché se usa automáticamente para:

- **Clínicas**: 5 minutos de caché
- **Servicios**: 5 minutos de caché
- **Usuarios**: 1 hora de caché
- **Direcciones**: 10 minutos de caché

Puedes ajustar los tiempos de caché editando los archivos en `app/api/`.

## Plan Free vs Pro

| Característica | Free | Pro |
|----------------|------|-----|
| Comandos/día | 10,000 | Ilimitado |
| Almacenamiento | 256 MB | Desde 1 GB |
| Conexiones | 100 | Ilimitado |
| Regiones | 1 | Múltiples |
| Soporte | Comunidad | Email |

Para la mayoría de aplicaciones en desarrollo, el plan **Free** es suficiente.
