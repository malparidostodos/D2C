-- Script para activar Realtime en la tabla bookings de forma segura
-- Ejecuta esto en el SQL Editor de Supabase

DO $$
BEGIN
  -- Verificamos si la tabla ya está en la publicación de realtime
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
    AND schemaname = 'public'
    AND tablename = 'bookings'
  ) THEN
    -- Si no está, la añadimos
    ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
  END IF;
END
$$;
