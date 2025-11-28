-- Trigger para actualizar automáticamente el estado de las reservas pasadas
-- Se ejecuta antes de cada SELECT para asegurar datos actualizados

-- Primero, crear la función que actualiza los estados
CREATE OR REPLACE FUNCTION update_past_bookings_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Actualizar todas las reservas cuya fecha/hora ya pasó
  UPDATE bookings
  SET status = 'completed',
      updated_at = NOW()
  WHERE status = 'pending'
    AND (
      booking_date < CURRENT_DATE
      OR (
        booking_date = CURRENT_DATE 
        AND booking_time < CURRENT_TIME
      )
    );
  
  RETURN NEW;
END;
$$;

-- Crear trigger que se ejecute ANTES de cada operación SELECT
-- Nota: PostgreSQL no soporta triggers BEFORE SELECT, así que usaremos otra estrategia
-- Vamos a crear una función que se pueda llamar manualmente o mediante cron

-- Alternativamente, crear una función que se pueda llamar
CREATE OR REPLACE FUNCTION check_and_update_booking_status()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Actualizar todas las reservas cuya fecha/hora ya pasó
  -- Convertimos fecha y hora a timestamp y comparamos con la hora actual en Colombia (UTC-5)
  UPDATE bookings
  SET status = 'completed',
      updated_at = NOW()
  WHERE status = 'pending'
    AND (
      (booking_date || ' ' || booking_time)::timestamp < (NOW() AT TIME ZONE 'America/Bogota')
    );
END;
$$;

-- Dar permisos
GRANT EXECUTE ON FUNCTION check_and_update_booking_status() TO authenticated;
GRANT EXECUTE ON FUNCTION check_and_update_booking_status() TO anon;

-- Para automatizar, puedes usar Supabase Cron (pg_cron extension)
-- O llamar esta función desde el frontend cuando sea necesario
