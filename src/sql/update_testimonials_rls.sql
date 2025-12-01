-- Habilitar RLS en la tabla testimonials
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Política para permitir a los administradores actualizar testimonios (incluyendo visibilidad)
-- Esta política utiliza la función is_admin() que ya existe en tu base de datos
CREATE POLICY "Admins can update testimonials"
ON testimonials
FOR UPDATE
USING (
  is_admin()
);

-- Política para permitir a los administradores eliminar testimonios
CREATE POLICY "Admins can delete testimonials"
ON testimonials
FOR DELETE
USING (
  is_admin()
);

-- Política para permitir a los administradores ver TODOS los testimonios
-- Esto es necesario para que el panel de administración pueda cargar las reseñas ocultas
CREATE POLICY "Admins can view all testimonials"
ON testimonials
FOR SELECT
USING (
  is_admin()
);
