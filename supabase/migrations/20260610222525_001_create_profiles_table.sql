-- Crear tabla de perfiles para códigos QR de emergencia
CREATE TABLE profiles (
    id TEXT PRIMARY KEY,
    name TEXT DEFAULT 'Código Vacío',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active')),
    type TEXT DEFAULT 'person' CHECK (type IN ('person', 'pet')),
    plan TEXT DEFAULT 'premium' CHECK (plan IN ('basic', 'premium')),
    photo TEXT,
    phone TEXT,
    emergency_contact TEXT,
    emergency_phone TEXT,
    medical_notes TEXT,
    allergies TEXT,
    blood_type TEXT,
    address TEXT,
    owner_name TEXT,
    breed TEXT,
    color TEXT,
    weight TEXT,
    birth_date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    created_by TEXT
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política para que cualquiera pueda leer perfiles (necesario para escaneo público de QR)
CREATE POLICY "profiles_public_read" ON profiles
    FOR SELECT USING (true);

-- Política para insertar (usuarios anónimos pueden crear perfiles)
CREATE POLICY "profiles_public_insert" ON profiles
    FOR INSERT WITH CHECK (true);

-- Política para actualizar (usuarios anónimos pueden actualizar)
CREATE POLICY "profiles_public_update" ON profiles
    FOR UPDATE USING (true) WITH CHECK (true);

-- Política para eliminar (usuarios anónimos pueden eliminar)
CREATE POLICY "profiles_public_delete" ON profiles
    FOR DELETE USING (true);

-- Índice para búsquedas por status
CREATE INDEX idx_profiles_status ON profiles(status);
CREATE INDEX idx_profiles_plan ON profiles(plan);
