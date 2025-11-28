-- Eliminar políticas existentes que puedan estar causando conflicto
DROP POLICY IF EXISTS "Users can insert their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON bookings;
DROP POLICY IF EXISTS "Allow authenticated users to create bookings" ON bookings;

-- Habilitar RLS en la tabla bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Política para INSERT: Permite a usuarios autenticados crear reservas
-- Esto incluye a los usuarios recién creados
CREATE POLICY "Allow authenticated users to create bookings" 
ON bookings
FOR INSERT
TO authenticated
WITH CHECK (
    -- El usuario puede crear reservas para sí mismo
    auth.uid() = user_id
    OR
    -- O puede crear reservas sin user_id (para usuarios anónimos que luego se convierten en autenticados)
    user_id IS NULL
);

-- Política para SELECT: Los usuarios pueden ver sus propias reservas
CREATE POLICY "Users can view their own bookings" 
ON bookings
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Política para UPDATE: Los usuarios pueden actualizar sus propias reservas
CREATE POLICY "Users can update their own bookings" 
ON bookings
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política para que el sistema pueda actualizar cualquier reserva (para auto_update_booking_status)
CREATE POLICY "System can update booking status" 
ON bookings
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- Política adicional para permitir SELECT anónimo si es necesario para disponibilidad
-- Comentada por defecto, descomenta si necesitas que usuarios no autenticados vean disponibilidad
-- CREATE POLICY "Allow public read for availability check" 
-- ON bookings
-- FOR SELECT
-- TO anon
-- USING (true);
