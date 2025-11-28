-- Función para obtener disponibilidad global (todas las reservas)
-- Esta función ignora las políticas RLS para mostrar disponibilidad real

CREATE OR REPLACE FUNCTION get_global_availability(
  start_date DATE,
  end_date DATE
)
RETURNS TABLE (
  booking_date DATE,
  booking_time TIME
) 
SECURITY DEFINER -- Ejecuta con permisos del creador, ignora RLS
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.booking_date,
    b.booking_time
  FROM bookings b
  WHERE b.booking_date >= start_date
    AND b.booking_date <= end_date
    AND b.status != 'cancelled'
  ORDER BY b.booking_date, b.booking_time;
END;
$$;

-- Dar permisos de ejecución a usuarios autenticados y anónimos
GRANT EXECUTE ON FUNCTION get_global_availability(DATE, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION get_global_availability(DATE, DATE) TO anon;
