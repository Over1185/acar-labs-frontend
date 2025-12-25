# 📊 Esquema de Base de Datos - ACAR Labs

## Diagrama de Relaciones

\`\`\`
┌─────────────┐
│  addresses  │
└──────┬──────┘
       │
       │ 1:N
       │
┌──────▼──────┐      ┌─────────┐
│   clinics   │◄─────┤  roles  │
└──────┬──────┘  N:1 └─────────┘
       │                    │
       │ 1:N                │ 1:N
       │                    │
   ┌───┴────────────────────┴───┐
   │                             │
┌──▼────────┐            ┌──────▼───┐
│ customers │            │employees │
└──┬────────┘            └──────┬───┘
   │                            │
   │                            │
   │      ┌──────────┐          │
   │      │ services │          │
   │      └────┬─────┘          │
   │           │                │
   │           │ 1:N            │
   └───────────┼────────────────┘
               │
        ┌──────▼──────────┐
        │  appointments   │
        └──────┬──────────┘
               │
               │ 1:N
               │
        ┌──────▼──────────────┐
        │ laboratory_results  │
        └─────────────────────┘
\`\`\`

## Tablas Detalladas

### 1. addresses (Direcciones)

Almacena direcciones físicas para clínicas y clientes.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER PK | Identificador único |
| province | TEXT NOT NULL | Provincia (ej: Pichincha) |
| canton | TEXT NOT NULL | Cantón (ej: Quito) |
| parish | TEXT NOT NULL | Parroquia |
| street | TEXT NOT NULL | Calle y número |
| reference | TEXT | Referencias adicionales |
| country | TEXT | País (default: Ecuador) |
| city | TEXT NOT NULL | Ciudad |
| created_at | DATETIME | Fecha de creación |
| updated_at | DATETIME | Última actualización |

**Índices:** Ninguno

---

### 2. clinics (Clínicas)

Información de clínicas, hospitales y laboratorios.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER PK | Identificador único |
| name | TEXT NOT NULL | Nombre de la clínica |
| ruc | TEXT NOT NULL UNIQUE | RUC (identificación tributaria) |
| address_id | INTEGER FK | Referencia a addresses |
| created_at | DATETIME | Fecha de creación |
| updated_at | DATETIME | Última actualización |

**Relaciones:**

- `address_id` → `addresses(id)` (ON DELETE RESTRICT)

**Índices:**

- `idx_clinics_ruc` en `ruc`

---

### 3. roles (Roles de Usuario)

Roles disponibles para empleados.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER PK | Identificador único |
| name | TEXT NOT NULL UNIQUE | Nombre del rol |
| description | TEXT | Descripción del rol |
| created_at | DATETIME | Fecha de creación |
| updated_at | DATETIME | Última actualización |

**Valores predefinidos:**

1. admin - Administrador del sistema
2. doctor - Médico profesional
3. nurse - Enfermero/a
4. receptionist - Recepcionista
5. lab_technician - Técnico de laboratorio

**Índices:** Ninguno (tabla pequeña)

---

### 4. employees (Empleados)

Personal médico y administrativo.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER PK | Identificador único |
| name | TEXT NOT NULL | Nombre completo |
| email | TEXT NOT NULL UNIQUE | Email (usado para login) |
| password | TEXT NOT NULL | Contraseña hasheada (bcrypt) |
| phone | TEXT | Teléfono de contacto |
| gender | TEXT | male, female, other |
| verified_email | TEXT | verified, process, not_verified |
| role_id | INTEGER FK | Referencia a roles |
| clinic_id | INTEGER FK | Referencia a clinics |
| created_at | DATETIME | Fecha de creación |
| updated_at | DATETIME | Última actualización |

**Relaciones:**

- `role_id` → `roles(id)` (ON DELETE RESTRICT)
- `clinic_id` → `clinics(id)` (ON DELETE RESTRICT)

**Índices:**

- `idx_employees_email` en `email`
- `idx_employees_clinic` en `clinic_id`

**Autenticación:** provider = 'employee'

---

### 5. customers (Clientes/Pacientes)

Personas que reservan citas médicas.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER PK | Identificador único |
| name | TEXT NOT NULL | Nombre completo |
| email | TEXT NOT NULL UNIQUE | Email (usado para login) |
| password | TEXT NOT NULL | Contraseña hasheada (bcrypt) |
| phone | TEXT | Teléfono de contacto |
| date_of_birth | DATE | Fecha de nacimiento |
| identification_number | TEXT NOT NULL UNIQUE | Cédula o pasaporte |
| gender | TEXT | male, female, other |
| verified_email | TEXT | verified, process, not_verified |
| clinic_id | INTEGER FK | Clínica principal |
| address_id | INTEGER FK | Referencia a addresses |
| created_at | DATETIME | Fecha de creación |
| updated_at | DATETIME | Última actualización |

**Relaciones:**

- `clinic_id` → `clinics(id)` (ON DELETE RESTRICT)
- `address_id` → `addresses(id)` (ON DELETE SET NULL)

**Índices:**

- `idx_customers_email` en `email`
- `idx_customers_clinic` en `clinic_id`
- `idx_customers_identification` en `identification_number`

**Autenticación:** provider = 'customer'

---

### 6. services (Servicios Médicos)

Servicios ofrecidos por las clínicas.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER PK | Identificador único |
| name | TEXT NOT NULL | Nombre del servicio |
| description | TEXT | Descripción detallada |
| price | REAL NOT NULL | Precio en USD |
| estimated_time | TEXT NOT NULL | Tiempo estimado (ej: "30 minutos") |
| clinic_id | INTEGER FK | Referencia a clinics |
| is_active | BOOLEAN | Servicio activo (default: true) |
| created_at | DATETIME | Fecha de creación |
| updated_at | DATETIME | Última actualización |

**Relaciones:**

- `clinic_id` → `clinics(id)` (ON DELETE CASCADE)

**Índices:**

- `idx_services_clinic` en `clinic_id`

---

### 7. appointments (Citas Médicas)

Citas programadas entre clientes y empleados.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER PK | Identificador único |
| scheduled_date | DATETIME NOT NULL | Fecha y hora de la cita |
| status | TEXT | pending, process, completed, canceled |
| notes | TEXT | Notas adicionales |
| clinic_id | INTEGER FK | Referencia a clinics |
| customer_id | INTEGER FK | Referencia a customers |
| employee_id | INTEGER FK | Referencia a employees |
| service_id | INTEGER FK | Referencia a services |
| created_at | DATETIME | Fecha de creación |
| updated_at | DATETIME | Última actualización |

**Relaciones:**

- `clinic_id` → `clinics(id)` (ON DELETE RESTRICT)
- `customer_id` → `customers(id)` (ON DELETE RESTRICT)
- `employee_id` → `employees(id)` (ON DELETE RESTRICT)
- `service_id` → `services(id)` (ON DELETE RESTRICT)

**Índices:**

- `idx_appointments_customer` en `customer_id`
- `idx_appointments_employee` en `employee_id`
- `idx_appointments_clinic` en `clinic_id`
- `idx_appointments_scheduled_date` en `scheduled_date`

**Estados de Cita:**

- **pending**: Cita agendada, pendiente de confirmación
- **process**: Cita en proceso / confirmada
- **completed**: Cita completada
- **canceled**: Cita cancelada

---

### 8. laboratory_results (Resultados de Laboratorio)

Resultados de análisis asociados a citas.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER PK | Identificador único |
| appointment_id | INTEGER FK | Referencia a appointments |
| result_type | TEXT NOT NULL | Tipo de resultado (ej: "Sangre", "Orina") |
| result_data | TEXT | Datos del resultado (JSON o texto) |
| file_url | TEXT | URL del archivo PDF/imagen |
| notes | TEXT | Notas del técnico |
| created_at | DATETIME | Fecha de creación |
| updated_at | DATETIME | Última actualización |

**Relaciones:**

- `appointment_id` → `appointments(id)` (ON DELETE CASCADE)

**Índices:**

- `idx_laboratory_results_appointment` en `appointment_id`

---

## Consideraciones de Diseño

### 1. **Integridad Referencial**

- **RESTRICT**: No permite eliminar registros si hay dependencias
- **CASCADE**: Elimina registros relacionados automáticamente
- **SET NULL**: Establece NULL en las referencias

### 2. **Timestamps**

Todas las tablas incluyen:

- `created_at`: Timestamp de creación (CURRENT_TIMESTAMP)
- `updated_at`: Timestamp de última modificación

### 3. **Índices**

Se crearon índices en:

- Campos de búsqueda frecuente (email, ruc, etc.)
- Foreign keys para mejorar JOINs
- Campos usados en WHERE clauses

### 4. **Validaciones**

Implementadas a nivel de base de datos:

- CHECK constraints para enums (gender, status, verified_email)
- UNIQUE constraints (email, ruc, identification_number)
- NOT NULL para campos obligatorios

### 5. **Seguridad**

- Las contraseñas se almacenan hasheadas con bcrypt (campo `password`)
- Los emails se usan como identificador único para autenticación
- Separación clara entre employees y customers

---

## Consultas Comunes

### Obtener citas de un cliente con información completa

\`\`\`sql
SELECT
  a.*,
  c.name as clinic_name,
  cust.name as customer_name,
  e.name as employee_name,
  r.name as employee_role,
  s.name as service_name,
  s.price as service_price
FROM appointments a
LEFT JOIN clinics c ON a.clinic_id = c.id
LEFT JOIN customers cust ON a.customer_id = cust.id
LEFT JOIN employees e ON a.employee_id = e.id
LEFT JOIN roles r ON e.role_id = r.id
LEFT JOIN services s ON a.service_id = s.id
WHERE a.customer_id = ?
ORDER BY a.scheduled_date DESC;
\`\`\`

### Listar servicios de una clínica

\`\`\`sql
SELECT s.*, c.name as clinic_name
FROM services s
LEFT JOIN clinics c ON s.clinic_id = c.id
WHERE s.clinic_id = ? AND s.is_active = 1
ORDER BY s.name ASC;
\`\`\`

### Verificar disponibilidad de horario

\`\`\`sql
SELECT id
FROM appointments
WHERE employee_id = ?
  AND scheduled_date = ?
  AND status NOT IN ('canceled', 'completed');
\`\`\`

---

## Migraciones Futuras

Para agregar nuevas funcionalidades, considera:

1. **Pagos**: Tabla `payments` con referencia a `appointments`
2. **Notificaciones**: Tabla `notifications` para alertas de citas
3. **Reseñas**: Tabla `reviews` para calificar servicios
4. **Horarios**: Tabla `schedules` para disponibilidad de empleados
5. **Categorías**: Tabla `service_categories` para organizar servicios

---

## Comandos Útiles

### Ver estructura de una tabla

\`\`\`sql
PRAGMA table_info(appointments);
\`\`\`

### Ver todos los índices

\`\`\`sql
SELECT name, tbl_name, sql
FROM sqlite_master
WHERE type = 'index';
\`\`\`

### Verificar integridad

\`\`\`sql
PRAGMA integrity_check;
\`\`\`

### Ver foreign keys de una tabla

\`\`\`sql
PRAGMA foreign_key_list(appointments);
\`\`\`
