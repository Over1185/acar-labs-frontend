# Guía de API - ACAR Labs

Esta guía proporciona ejemplos de uso de todos los endpoints de la API.

## Base URL

\`\`\`
<http://localhost:3000/api>
\`\`\`

## Autenticación

La mayoría de endpoints requieren un token JWT en el header:

\`\`\`
Authorization: Bearer <tu-token-jwt>
\`\`\`

---

## 📝 Autenticación

### Login

**Endpoint:** \`POST /api/login\`

**Body:**
\`\`\`json
{
  "email": "<admin@demo.com>",
  "password": "admin123"
}
\`\`\`

**Respuesta exitosa (200):**
\`\`\`json
{
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "provider": "employee",
    "user": {
      "id": 1,
      "name": "Admin Demo",
      "email": "<admin@demo.com>",
      "phone": "0999999999",
      "role": "admin"
    }
  },
  "status": 200
}
\`\`\`

### Registro de Cliente

**Endpoint:** \`POST /api/register-customer\`

**Body:**
\`\`\`json
{
  "name": "Juan Pérez",
  "email": "<juan@email.com>",
  "password": "password123",
  "phone": "0987654321",
  "date_of_birth": "1990-05-15",
  "identification_number": "1234567890",
  "gender": "male",
  "clinic_id": 1
}
\`\`\`

**Respuesta exitosa (201):**
\`\`\`json
{
  "data": {
    "id": 2,
    "name": "Juan Pérez",
    "email": "<juan@email.com>",
    "phone": "0987654321",
    "verified_email": "process",
    "clinic_id": 1
  },
  "message": "Cliente registrado exitosamente",
  "status": 201
}
\`\`\`

### Logout

**Endpoint:** \`POST /api/logout\`

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Respuesta exitosa (200):**
\`\`\`json
{
  "data": {
    "message": "Sesión cerrada exitosamente"
  },
  "status": 200
}
\`\`\`

### Obtener Perfil Actual

**Endpoint:** \`GET /api/me\`

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Respuesta exitosa (200):**
\`\`\`json
{
  "data": {
    "id": 1,
    "name": "Admin Demo",
    "email": "<admin@demo.com>",
    "phone": "0999999999",
    "clinic_id": 1,
    "clinic_name": "Hospital Metropolitano Demo",
    "role_name": "admin"
  },
  "status": 200
}
\`\`\`

---

## 🏥 Clínicas

### Listar Clínicas

**Endpoint:** \`GET /api/clinics\`

**Respuesta exitosa (200):**
\`\`\`json
{
  "data": [
    {
      "id": 1,
      "name": "Hospital Metropolitano",
      "ruc": "1790123456001",
      "address_id": 1,
      "province": "Pichincha",
      "canton": "Quito",
      "city": "Quito",
      "street": "Av. 6 de Diciembre N34-120",
      "created_at": "2024-12-25T12:00:00Z"
    }
  ],
  "status": 200
}
\`\`\`

### Obtener Clínica por ID

**Endpoint:** \`GET /api/clinics/1\`

**Respuesta exitosa (200):**
\`\`\`json
{
  "data": {
    "id": 1,
    "name": "Hospital Metropolitano",
    "ruc": "1790123456001",
    "address_id": 1,
    "province": "Pichincha",
    "canton": "Quito",
    "city": "Quito",
    "street": "Av. 6 de Diciembre N34-120"
  },
  "status": 200
}
\`\`\`

---

## 💉 Servicios

### Listar Servicios

**Endpoint:** \`GET /api/services\`

**Query Parameters (opcionales):**

- \`clinic_id\`: Filtrar por clínica

**Ejemplo:** \`GET /api/services?clinic_id=1\`

**Respuesta exitosa (200):**
\`\`\`json
{
  "data": [
    {
      "id": 1,
      "name": "Consulta General",
      "description": "Consulta médica general",
      "price": 25.00,
      "estimated_time": "30 minutos",
      "clinic_id": 1,
      "clinic_name": "Hospital Metropolitano",
      "is_active": true
    }
  ],
  "status": 200
}
\`\`\`

### Obtener Servicio por ID

**Endpoint:** \`GET /api/services/1\`

**Respuesta exitosa (200):**
\`\`\`json
{
  "data": {
    "id": 1,
    "name": "Consulta General",
    "description": "Consulta médica general",
    "price": 25.00,
    "estimated_time": "30 minutos",
    "clinic_id": 1,
    "clinic_name": "Hospital Metropolitano"
  },
  "status": 200
}
\`\`\`

---

## 📅 Citas

### Listar Citas

**Endpoint:** \`GET /api/appointments\`

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Respuesta exitosa (200):**
\`\`\`json
{
  "data": [
    {
      "id": 1,
      "scheduled_date": "2024-12-30T10:00:00Z",
      "status": "pending",
      "notes": "Primera consulta",
      "clinic_name": "Hospital Metropolitano",
      "customer_name": "Juan Pérez",
      "employee_name": "Dr. María García",
      "service_name": "Consulta General",
      "service_price": 25.00
    }
  ],
  "status": 200
}
\`\`\`

### Crear Cita

**Endpoint:** \`POST /api/appointments\`

**Headers:**
\`\`\`
Authorization: Bearer <token-customer>
\`\`\`

**Body:**
\`\`\`json
{
  "scheduled_date": "2024-12-30T10:00:00Z",
  "clinic_id": 1,
  "employee_id": 1,
  "service_id": 1,
  "notes": "Primera consulta"
}
\`\`\`

**Respuesta exitosa (201):**
\`\`\`json
{
  "data": {
    "id": 1,
    "scheduled_date": "2024-12-30T10:00:00Z",
    "status": "pending",
    "clinic_name": "Hospital Metropolitano",
    "service_name": "Consulta General"
  },
  "message": "Cita creada exitosamente",
  "status": 201
}
\`\`\`

### Obtener Cita por ID

**Endpoint:** \`GET /api/appointments/1\`

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Respuesta exitosa (200):**
\`\`\`json
{
  "data": {
    "id": 1,
    "scheduled_date": "2024-12-30T10:00:00Z",
    "status": "pending",
    "notes": "Primera consulta",
    "clinic_name": "Hospital Metropolitano",
    "customer_name": "Juan Pérez",
    "customer_email": "<juan@email.com>",
    "customer_phone": "0987654321",
    "employee_name": "Dr. María García",
    "service_name": "Consulta General",
    "service_price": 25.00,
    "estimated_time": "30 minutos"
  },
  "status": 200
}
\`\`\`

### Actualizar Cita

**Endpoint:** \`PUT /api/appointments/1\`

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Body (Customer):**
\`\`\`json
{
  "scheduled_date": "2024-12-30T15:00:00Z",
  "notes": "Cambio de horario"
}
\`\`\`

**Body (Employee):**
\`\`\`json
{
  "status": "completed",
  "notes": "Consulta realizada exitosamente"
}
\`\`\`

**Respuesta exitosa (200):**
\`\`\`json
{
  "data": {
    "id": 1,
    "scheduled_date": "2024-12-30T15:00:00Z",
    "status": "pending",
    "notes": "Cambio de horario"
  },
  "message": "Cita actualizada exitosamente",
  "status": 200
}
\`\`\`

---

## 👥 Clientes

### Listar Clientes (Solo Employees)

**Endpoint:** \`GET /api/customers\`

**Headers:**
\`\`\`
Authorization: Bearer <token-employee>
\`\`\`

**Respuesta exitosa (200):**
\`\`\`json
{
  "data": [
    {
      "id": 2,
      "name": "Juan Pérez",
      "email": "juan@email.com",
      "phone": "0987654321",
      "identification_number": "1234567890",
      "clinic_name": "Hospital Metropolitano"
    }
  ],
  "status": 200
}
\`\`\`

### Obtener Cliente por ID

**Endpoint:** \`GET /api/customers/2\`

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Respuesta exitosa (200):**
\`\`\`json
{
  "data": {
    "id": 2,
    "name": "Juan Pérez",
    "email": "<juan@email.com>",
    "phone": "0987654321",
    "date_of_birth": "1990-05-15",
    "identification_number": "1234567890",
    "gender": "male",
    "clinic_name": "Hospital Metropolitano"
  },
  "status": 200
}
\`\`\`

### Actualizar Cliente

**Endpoint:** \`PUT /api/customers/2\`

**Headers:**
\`\`\`
Authorization: Bearer <token-customer>
\`\`\`

**Body:**
\`\`\`json
{
  "name": "Juan Carlos Pérez",
  "phone": "0988888888",
  "password": "newpassword123"
}
\`\`\`

**Respuesta exitosa (200):**
\`\`\`json
{
  "data": {
    "id": 2,
    "name": "Juan Carlos Pérez",
    "email": "<juan@email.com>",
    "phone": "0988888888"
  },
  "message": "Perfil actualizado exitosamente",
  "status": 200
}
\`\`\`

---

## 📍 Direcciones

### Listar Direcciones

**Endpoint:** \`GET /api/addresses\`

**Respuesta exitosa (200):**
\`\`\`json
{
  "data": [
    {
      "id": 1,
      "province": "Pichincha",
      "canton": "Quito",
      "parish": "Iñaquito",
      "street": "Av. 6 de Diciembre N34-120",
      "city": "Quito",
      "country": "Ecuador"
    }
  ],
  "status": 200
}
\`\`\`

### Obtener Dirección por ID

**Endpoint:** \`GET /api/addresses/1\`

**Respuesta exitosa (200):**
\`\`\`json
{
  "data": {
    "id": 1,
    "province": "Pichincha",
    "canton": "Quito",
    "parish": "Iñaquito",
    "street": "Av. 6 de Diciembre N34-120",
    "reference": "Frente al parque La Carolina",
    "city": "Quito",
    "country": "Ecuador"
  },
  "status": 200
}
\`\`\`

---

## ⚠️ Códigos de Error Comunes

| Código | Descripción |
|--------|-------------|
| 400 | Solicitud incorrecta (datos inválidos) |
| 401 | No autorizado (token inválido o ausente) |
| 403 | Prohibido (sin permisos) |
| 404 | No encontrado |
| 409 | Conflicto (ej: email ya registrado) |
| 500 | Error interno del servidor |

**Ejemplo de respuesta de error:**
\`\`\`json
{
  "message": "Credenciales inválidas",
  "status": 401
}
\`\`\`

---

## 🔧 Ejemplos con cURL

### Login

\`\`\`bash
curl -X POST <http://localhost:3000/api/login> \\
  -H "Content-Type: application/json" \\
  -d '{"email":"<admin@demo.com>","password":"admin123"}'
\`\`\`

### Crear Cita

\`\`\`bash
curl -X POST <http://localhost:3000/api/appointments> \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{
    "scheduled_date": "2024-12-30T10:00:00Z",
    "clinic_id": 1,
    "employee_id": 1,
    "service_id": 1,
    "notes": "Primera consulta"
  }'
\`\`\`

### Listar Citas

\`\`\`bash
curl -X GET <http://localhost:3000/api/appointments> \\
  -H "Authorization: Bearer YOUR_TOKEN"
\`\`\`
