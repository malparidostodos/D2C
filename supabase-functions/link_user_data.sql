-- Función para vincular datos (reservas y vehículos) al usuario actual basado en su email
-- Esta función debe ejecutarse cuando el usuario carga el dashboard
create or replace function link_user_data(user_email text)
returns void
language plpgsql
security definer -- Se ejecuta con permisos de superusuario para poder ver/editar filas que RLS ocultaría
set search_path = public
as $$
declare
  current_uid uuid;
begin
  -- Obtener el ID del usuario autenticado actual
  current_uid := auth.uid();
  
  -- Si no hay usuario autenticado, salir
  if current_uid is null then
    return;
  end if;

  -- 1. Vincular reservas anónimas existentes a este usuario
  -- Busca reservas con el mismo email pero sin user_id y les asigna el ID actual
  update bookings
  set user_id = current_uid
  where client_email = user_email
  and user_id is null;

  -- 2. Crear automáticamente vehículos basados en el historial de reservas
  -- Inserta en user_vehicles las placas que están en bookings (del usuario) pero no en user_vehicles
  insert into user_vehicles (user_id, plate, vehicle_type, created_at)
  select distinct 
    current_uid, 
    b.vehicle_plate, 
    coalesce(b.vehicle_type, 'car'), -- Fallback si vehicle_type es null
    now()
  from bookings b
  where b.user_id = current_uid
  and b.vehicle_plate is not null
  and not exists (
    select 1 from user_vehicles uv 
    where uv.user_id = current_uid 
    and uv.plate = b.vehicle_plate
  );
  
end;
$$;
