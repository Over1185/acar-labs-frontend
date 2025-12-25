// Database types and interfaces
export interface Address {
    id: number;
    province: string;
    canton: string;
    parish: string;
    street: string;
    reference: string;
    country: string;
    city: string;
    created_at: string;
    updated_at: string;
}

export interface Clinic {
    id: number;
    name: string;
    ruc: string;
    address_id: number;
    created_at: string;
    updated_at: string;
    address?: Address;
}

export interface Role {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface Employee {
    id: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    gender: string;
    verified_email: 'verified' | 'process' | 'not_verified';
    role_id: number;
    clinic_id: number;
    created_at: string;
    updated_at: string;
    role?: Role;
    clinic?: Clinic;
}

export interface Customer {
    id: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    date_of_birth: string;
    identification_number: string;
    gender: string;
    verified_email: 'verified' | 'process' | 'not_verified';
    clinic_id: number;
    address_id?: number;
    created_at: string;
    updated_at: string;
    clinic?: Clinic;
    address?: Address;
}

export interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
    estimated_time: string;
    clinic_id: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    clinic?: Clinic;
}

export interface Appointment {
    id: number;
    scheduled_date: string;
    status: 'pending' | 'process' | 'completed' | 'canceled';
    notes?: string;
    clinic_id: number;
    customer_id: number;
    employee_id: number;
    service_id: number;
    created_at: string;
    updated_at: string;
    clinic?: Clinic;
    customer?: Customer;
    employee?: Employee;
    service?: Service;
}

export interface LaboratoryResult {
    id: number;
    appointment_id: number;
    result_type: string;
    result_data: string;
    file_url?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
    appointment?: Appointment;
}

// Database schema SQL
export const DATABASE_SCHEMA = `
-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  province TEXT NOT NULL,
  canton TEXT NOT NULL,
  parish TEXT NOT NULL,
  street TEXT NOT NULL,
  reference TEXT,
  country TEXT NOT NULL DEFAULT 'Ecuador',
  city TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Clinics table
CREATE TABLE IF NOT EXISTS clinics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  ruc TEXT NOT NULL UNIQUE,
  address_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE RESTRICT
);

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  phone TEXT,
  gender TEXT CHECK(gender IN ('male', 'female', 'other')),
  verified_email TEXT DEFAULT 'process' CHECK(verified_email IN ('verified', 'process', 'not_verified')),
  role_id INTEGER NOT NULL,
  clinic_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE RESTRICT
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  identification_number TEXT NOT NULL UNIQUE,
  gender TEXT CHECK(gender IN ('male', 'female', 'other')),
  verified_email TEXT DEFAULT 'process' CHECK(verified_email IN ('verified', 'process', 'not_verified')),
  clinic_id INTEGER NOT NULL,
  address_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE RESTRICT,
  FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE SET NULL
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  estimated_time TEXT NOT NULL,
  clinic_id INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scheduled_date DATETIME NOT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'process', 'completed', 'canceled')),
  notes TEXT,
  clinic_id INTEGER NOT NULL,
  customer_id INTEGER NOT NULL,
  employee_id INTEGER NOT NULL,
  service_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE RESTRICT,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE RESTRICT,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT
);

-- Laboratory Results table
CREATE TABLE IF NOT EXISTS laboratory_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  appointment_id INTEGER NOT NULL,
  result_type TEXT NOT NULL,
  result_data TEXT,
  file_url TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clinics_ruc ON clinics(ruc);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_employees_clinic ON employees(clinic_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_clinic ON customers(clinic_id);
CREATE INDEX IF NOT EXISTS idx_customers_identification ON customers(identification_number);
CREATE INDEX IF NOT EXISTS idx_services_clinic ON services(clinic_id);
CREATE INDEX IF NOT EXISTS idx_appointments_customer ON appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_employee ON appointments(employee_id);
CREATE INDEX IF NOT EXISTS idx_appointments_clinic ON appointments(clinic_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_date ON appointments(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_laboratory_results_appointment ON laboratory_results(appointment_id);

-- Insert default roles
INSERT OR IGNORE INTO roles (id, name, description) VALUES
  (1, 'admin', 'Administrador del sistema'),
  (2, 'doctor', 'Médico profesional'),
  (3, 'nurse', 'Enfermero/a'),
  (4, 'receptionist', 'Recepcionista'),
  (5, 'lab_technician', 'Técnico de laboratorio');
`;

// Seed data for development
export const SEED_DATA = `
-- Sample address
INSERT OR IGNORE INTO addresses (id, province, canton, parish, street, reference, country, city)
VALUES (1, 'Pichincha', 'Quito', 'Iñaquito', 'Av. 6 de Diciembre N34-120', 'Frente al parque La Carolina', 'Ecuador', 'Quito');

-- Sample clinic
INSERT OR IGNORE INTO clinics (id, name, ruc, address_id)
VALUES (1, 'Hospital Metropolitano Demo', '1790123456001', 1);

-- Sample employee (admin) - password: admin123
INSERT OR IGNORE INTO employees (id, name, email, password, phone, gender, verified_email, role_id, clinic_id)
VALUES (1, 'Admin Demo', 'admin@demo.com', '$2a$10$rMw1VCVxYYFEcGLXBN5EzOK3VZbH9z8b8u2l2jYVKUY3ZxFqDlK3e', '0999999999', 'other', 'verified', 1, 1);
`;
