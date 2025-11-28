-- 1. Crear tabla de administradores
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 2. Habilitar RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 3. Política: Solo los admins pueden ver la lista de admins (o nadie, si usamos solo RPC)
-- Por seguridad, restringiremos el acceso directo y usaremos una función.
CREATE POLICY "Admins can view admin list" ON admin_users
  FOR SELECT
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

-- 4. Función segura para verificar si el usuario actual es admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM admin_users
    WHERE email = auth.jwt() ->> 'email'
  );
END;
$$;

-- 5. Permisos de ejecución
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin() TO anon;

-- 6. Insertar un admin inicial (REEMPLAZA CON TU EMAIL REAL)
-- INSERT INTO admin_users (email) VALUES ('tu_email@ejemplo.com');
