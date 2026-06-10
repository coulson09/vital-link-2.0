-- Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "profiles_public_read" ON profiles;
DROP POLICY IF EXISTS "profiles_public_delete" ON profiles;
DROP POLICY IF EXISTS "profiles_public_insert" ON profiles;
DROP POLICY IF EXISTS "profiles_public_update" ON profiles;

-- Política SELECT: Público (necesario para escaneo de QR en emergencias)
CREATE POLICY "profiles_public_read" ON profiles
    FOR SELECT USING (true);

-- Política INSERT: Solo permitir crear perfiles nuevos
CREATE POLICY "profiles_insert_new" ON profiles
    FOR INSERT WITH CHECK (true);

-- Política UPDATE: Solo usuarios autenticados
CREATE POLICY "profiles_update_authenticated" ON profiles
    FOR UPDATE TO authenticated
    USING (true) WITH CHECK (true);

-- Política DELETE: Solo usuarios autenticados
CREATE POLICY "profiles_delete_authenticated" ON profiles
    FOR DELETE TO authenticated
    USING (true);

-- Revocar permisos de anon para UPDATE y DELETE
REVOKE UPDATE, DELETE ON profiles FROM anon;
GRANT SELECT, INSERT ON profiles TO anon;
GRANT ALL ON profiles TO authenticated;
