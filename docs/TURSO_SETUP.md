# Configuración de Turso Database

## Crear una base de datos en Turso

### 1. Instalar Turso CLI

\`\`\`bash

# macOS/Linux

brew install tursodatabase/tap/turso

# Windows (usando Scoop)

scoop bucket add turso <https://github.com/tursodatabase/scoop-turso.git>
scoop install turso

# O descarga desde: <https://docs.turso.tech/cli/installation>

\`\`\`

### 2. Autenticarse

\`\`\`bash
turso auth login
\`\`\`

### 3. Crear base de datos

\`\`\`bash

# Crear una nueva base de datos

turso db create acar-labs-db

# Ver lista de bases de datos

turso db list

# Obtener la URL de conexión

turso db show acar-labs-db --url

# Crear un token de autenticación

turso db tokens create acar-labs-db
\`\`\`

### 4. Configurar variables de entorno

Copia los valores obtenidos a tu archivo `.env`:

\`\`\`env
DATABASE_URL=libsql://acar-labs-db-[your-org].turso.io
DATABASE_AUTH_TOKEN=eyJhbGciOiJFZER...
\`\`\`

### 5. Probar conexión

\`\`\`bash

# Conectarse a la base de datos

turso db shell acar-labs-db

# Una vez conectado, puedes ejecutar SQL

sqlite> .tables
sqlite> .quit
\`\`\`

## Comandos útiles de Turso

\`\`\`bash

# Ver uso de la base de datos

turso db inspect acar-labs-db

# Crear réplica en otra región

turso db replicate acar-labs-db --location mad

# Ver réplicas

turso db show acar-labs-db

# Eliminar base de datos (¡CUIDADO!)

turso db destroy acar-labs-db
\`\`\`

## Alternativa: Usar SQLite local para desarrollo

Si prefieres desarrollar localmente sin Turso:

\`\`\`env
DATABASE_URL=file:local.db

# No necesitas DATABASE_AUTH_TOKEN para SQLite local

\`\`\`

**Nota**: Para producción, se recomienda usar Turso por su capacidad de edge computing y réplicas globales.
