-- Eliminamos la función anterior
DROP FUNCTION IF EXISTS get_admin_bookings();

-- Creamos una versión simplificada que devuelve JSON
-- Esto evita problemas de tipos estrictos de PostgreSQL
CREATE OR REPLACE FUNCTION get_admin_bookings()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT json_agg(t)
    FROM (
      SELECT 
        b.id,
        b.created_at,
        b.user_id,
        b.vehicle_plate,
        b.vehicle_type,
        b.service_id,
        s.name as service_name,
        b.client_name,
        b.client_email,
        b.client_phone,
        b.booking_date,
        b.booking_time,
        b.status,
        b.total_price,
        b.updated_at
      FROM bookings b
      LEFT JOIN services s ON b.service_id = s.id
      ORDER BY b.booking_date DESC, b.booking_time DESC
    ) t
  );
END;
$$;

-- Permisos
GRANT EXECUTE ON FUNCTION get_admin_bookings() TO authenticated;
GRANT EXECUTE ON FUNCTION get_admin_bookings() TO anon;

-- Nueva función para actualizar estados (Bypass RLS)
CREATE OR REPLACE FUNCTION admin_update_booking_status(
  p_booking_id uuid,
  p_status text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE bookings
  SET status = p_status,
      updated_at = NOW()
  WHERE id = p_booking_id;
END;
$$;

GRANT EXECUTE ON FUNCTION admin_update_booking_status(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_update_booking_status(uuid, text) TO anon;
