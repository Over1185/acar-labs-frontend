# ACAR Labs - Sistema de Gestión de Citas Médicas

Sistema completo de gestión de citas médicas tipo booking con Next.js, incluyendo frontend y backend integrado.

## 🏗️ Arquitectura

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Backend**: Next.js API Routes
- **Base de datos**: SQLite con Turso (edge database)
- **Cache**: Upstash Redis
- **Autenticación**: JWT con Jose
- **Seguridad**: bcryptjs para hash de contraseñas

## 📋 Requisitos Previos

1. **Node.js** 18+ y **pnpm**
2. **Cuenta en Turso** (<https://turso.tech>)
   - Crear una base de datos
   - Obtener `DATABASE_URL` y `DATABASE_AUTH_TOKEN`
3. **Cuenta en Upstash** (<https://upstash.com>)
   - Crear una instancia de Redis
   - Obtener `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`

## 🚀 Instalación

### 1. Clonar e instalar dependencias

\`\`\`bash
git clone <repository-url>
cd acar-labs-frontend
pnpm install
\`\`\`

### 2. Configurar variables de entorno

Copia el archivo de ejemplo y configura tus credenciales:

\`\`\`bash
cp .env.example .env
\`\`\`

Edita `.env` con tus credenciales:

\`\`\`env

# Database - Turso (SQLite)

DATABASE_URL=libsql://your-database-name.turso.io
DATABASE_AUTH_TOKEN=eyJhbGciOiJFZER...

# Redis Cache - Upstash

UPSTASH_REDIS_REST_URL=<https://your-redis.upstash.io>
UPSTASH_REDIS_REST_TOKEN=AXXXabc...

# JWT Secret (Genera una clave segura)

JWT_SECRET=tu-clave-super-secreta-cambiar-en-produccion
JWT_EXPIRES_IN=7d

# Application

NODE_ENV=development
NEXT_PUBLIC_APP_URL=<http://localhost:3000>
\`\`\`

### 3. Configurar la base de datos

Ejecuta el script de setup para crear las tablas:

\`\`\`bash

# Solo crear las tablas

pnpm db:setup

# Crear tablas e insertar datos de prueba

pnpm db:seed

# Resetear todo y empezar de cero

pnpm db:reset
\`\`\`

### 4. Iniciar el servidor de desarrollo

\`\`\`bash
pnpm dev
\`\`\`

La aplicación estará disponible en <http://localhost:3000>

## 📊 Estructura de la Base de Datos

### Tablas Principales

#### 1. **addresses**

- Almacena direcciones físicas
- Campos: province, canton, parish, street, reference, country, city

#### 2. **clinics**

- Información de clínicas, hospitales y laboratorios
- Campos: name, ruc, address_id
- Relación: 1 dirección por clínica

#### 3. **roles**

- Roles del sistema para empleados
- Valores predefinidos: admin, doctor, nurse, receptionist, lab_technician

#### 4. **employees**

- Empleados del sistema (médicos, enfermeras, etc.)
- Campos: name, email, password, phone, gender, verified_email, role_id, clinic_id
- Autenticación: provider = 'employee'

#### 5. **customers**

- Pacientes/clientes del sistema
- Campos: name, email, password, phone, date_of_birth, identification_number, gender, clinic_id, address_id
- Autenticación: provider = 'customer'

#### 6. **services**

- Servicios médicos ofrecidos por las clínicas
- Campos: name, description, price, estimated_time, clinic_id, is_active

#### 7. **appointments**

- Citas médicas
- Campos: scheduled_date, status, notes, clinic_id, customer_id, employee_id, service_id
- Estados: pending, process, completed, canceled

#### 8. **laboratory_results**

- Resultados de laboratorio asociados a citas
- Campos: appointment_id, result_type, result_data, file_url, notes

## 🔐 API Endpoints

### Autenticación

#### `POST /api/login`

Login para customers y employees
\`\`\`json
{
  "email": "<usuario@email.com>",
  "password": "contraseña"
}
\`\`\`

#### `POST /api/register-customer`

Registro de nuevo cliente
\`\`\`json
{
  "name": "Juan Pérez",
  "email": "<juan@email.com>",
  "password": "contraseña123",
  "phone": "0999999999",
  "date_of_birth": "1990-01-01",
  "identification_number": "1234567890",
  "gender": "male",
  "clinic_id": 1
}
\`\`\`

#### `POST /api/logout`

Cerrar sesión (requiere autenticación)

#### `GET /api/me`

Obtener perfil del usuario actual (requiere autenticación)

### Clínicas

#### `GET /api/clinics`

Listar todas las clínicas

#### `GET /api/clinics/[id]`

Obtener clínica por ID

### Servicios

#### `GET /api/services`

Listar todos los servicios
Query params: `?clinic_id=1` (opcional)

#### `GET /api/services/[id]`

Obtener servicio por ID

### Citas

#### `GET /api/appointments`

Listar citas del usuario (requiere autenticación)

- Customers: ven sus propias citas
- Employees: ven citas de su clínica

#### `POST /api/appointments`

Crear nueva cita (solo customers)
\`\`\`json
{
  "scheduled_date": "2024-12-30T10:00:00",
  "clinic_id": 1,
  "employee_id": 1,
  "service_id": 1,
  "notes": "Notas adicionales"
}
\`\`\`

#### `GET /api/appointments/[id]`

Obtener cita por ID (requiere autenticación)

#### `PUT /api/appointments/[id]`

Actualizar cita (requiere autenticación)

- Customers: solo pueden modificar citas pendientes
- Employees: pueden cambiar estado y otros campos

### Clientes

#### `GET /api/customers`

Listar clientes (solo employees)

#### `GET /api/customers/[id]`

Obtener cliente por ID (requiere autenticación)

#### `PUT /api/customers/[id]`

Actualizar perfil de cliente (solo el propio cliente)

### Direcciones

#### `GET /api/addresses`

Listar todas las direcciones

#### `GET /api/addresses/[id]`

Obtener dirección por ID

## 🔒 Seguridad Implementada

### 1. **Autenticación JWT**

- Tokens firmados con HS256
- Expiración configurable (default: 7 días)
- Payload incluye: userId, email, provider, clinicId

### 2. **Hash de Contraseñas**

- bcryptjs con salt rounds = 10
- Contraseñas nunca almacenadas en texto plano

### 3. **Middleware de Autorización**

- `withAuth`: Verifica token válido
- `withCustomerAuth`: Solo clientes
- `withEmployeeAuth`: Solo empleados

### 4. **Validaciones**

- Email formato válido
- Contraseñas mínimo 6 caracteres
- IDs numéricos válidos
- Campos requeridos verificados

### 5. **Control de Acceso**

- Customers solo ven/modifican sus propios datos
- Employees solo acceden a datos de su clínica
- Verificación de permisos en cada endpoint

### 6. **Caché con Redis**

- Datos sensibles no se cachean permanentemente
- Invalidación automática al modificar datos
- TTL configurado por tipo de dato

## 🎨 Frontend

El frontend incluye:

- **Landing page** con búsqueda de clínicas
- **Sistema de navegación** con Header y Footer
- **Componentes reutilizables**: SearchBar, ClinicCard, ServiceCard, FeatureCard
- **Estilos modernos** con Tailwind CSS
- **Diseño responsive**

## 📝 Scripts Disponibles

\`\`\`bash
pnpm dev          # Iniciar servidor de desarrollo
pnpm build        # Compilar para producción
pnpm start        # Iniciar servidor de producción
pnpm lint         # Ejecutar linter
pnpm db:setup     # Crear tablas de base de datos
pnpm db:seed      # Crear tablas e insertar datos de prueba
pnpm db:reset     # Resetear base de datos completamente
\`\`\`

## 🧪 Datos de Prueba

Al ejecutar `pnpm db:seed`, se crean:

### Usuario Admin

- **Email**: <admin@demo.com>
- **Password**: admin123
- **Tipo**: Employee (Admin)

### Clínica Demo

- **Nombre**: Hospital Metropolitano Demo
- **RUC**: 1790123456001
- **Ubicación**: Quito, Ecuador

## 🚀 Despliegue

### Vercel (Recomendado para Next.js)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en Vercel Dashboard
3. Despliega

### Consideraciones de Producción

1. **Variables de Entorno**
   - Cambiar `JWT_SECRET` por una clave segura aleatoria
   - Configurar `NODE_ENV=production`
   - Actualizar `NEXT_PUBLIC_APP_URL`

2. **Base de Datos**
   - Turso escala automáticamente
   - Configurar backups regulares

3. **Caché**
   - Upstash Redis está optimizado para edge
   - Ajustar TTLs según necesidad

4. **Seguridad**
   - Habilitar HTTPS
   - Configurar CORS si es necesario
   - Implementar rate limiting

## 📚 Tecnologías Utilizadas

- **Next.js 16** - Framework React con SSR y API Routes
- **TypeScript** - Tipado estático
- **Turso** - SQLite distribuido en edge
- **Upstash Redis** - Caché distribuido
- **Jose** - JWT para autenticación
- **bcryptjs** - Hash de contraseñas
- **Tailwind CSS** - Estilos utility-first

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 💬 Soporte

Para preguntas o problemas, abre un issue en GitHub.
