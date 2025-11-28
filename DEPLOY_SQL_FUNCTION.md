# Instrucciones para Crear la Función SQL en Supabase

## 🎯 Objetivo
Crear una función RPC en Supabase que devuelva TODAS las reservas sin filtros RLS para verificar disponibilidad global.

## 📝 Pasos a Seguir

### 1. Acceder al SQL Editor de Supabase
1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. En el menú lateral, haz clic en **SQL Editor**

### 2. Crear la Función RPC
1. Haz clic en **"New Query"**
2. Copia y pega el siguiente código SQL:

```sql
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
```

3. Haz clic en **"Run"** (o presiona Ctrl+Enter)
4. Verifica que aparezca el mensaje: **"Success. No rows returned"**

### 3. Verificar la Función
Para verificar que la función funciona correctamente, ejecuta:

```sql
SELECT * FROM get_global_availability(
  '2025-11-01'::DATE,
  '2025-11-30'::DATE
);
```

Deberías ver todas las reservas del mes de noviembre 2025 (si existen).

## ✅ Qué Hace Esta Función

- **`SECURITY DEFINER`**: Ejecuta la función con los permisos del creador (generalmente admin), lo que le permite ignorar las políticas RLS
- **Parámetros**: `start_date` y `end_date` para filtrar por rango de fechas
- **Filtro de estado**: Excluye reservas canceladas
- **Permisos**: Permite que tanto usuarios autenticados como anónimos ejecuten la función

## 🔒 Seguridad

Esta función es segura porque:
- Solo devuelve información de disponibilidad (fecha y hora)
- NO expone datos sensibles como nombres, emails, teléfonos, etc.
- Es necesaria para que el sistema de reservas funcione correctamente
- Permite a cualquier usuario ver qué horarios están ocupados (comportamiento esperado)

## 🧪 Probar el Sistema

Después de crear la función:
1. Abre la aplicación en el navegador
2. Ve a la página de reservas
3. Intenta reservar con diferentes cuentas
4. Verifica que los horarios reservados por otros usuarios aparezcan como no disponibles

---

**Archivo SQL**: `supabase-functions/get_global_availability.sql`
