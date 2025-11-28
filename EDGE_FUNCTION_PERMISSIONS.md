# Solución: Error 403 en Edge Function send-booking-confirmation

## Problema
El edge function devuelve 403 cuando es invocado por un usuario recién creado.

## Causa
Por defecto, los edge functions en Supabase requieren autenticación y pueden tener políticas RLS que bloquean a usuarios nuevos.

## Solución: Permitir Invocación Anónima

Necesitas configurar el edge function para permitir invocaciones anónimas.

### Opción 1: Configurar en el Dashboard de Supabase

1. Ve a tu [Dashboard de Supabase](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Edge Functions**
4. Encuentra `send-booking-confirmation`
5. Haz clic en **Settings** o **Configure**
6. Busca la opción **"Verify JWT"** o **"Authentication Required"**
7. **Desactívala** para permitir invocaciones anónimas

### Opción 2: Actualizar con CLI

Si la opción 1 no está disponible, necesitamos actualizar el código del edge function para que no requiera autenticación:

El edge function ya no debería validar el JWT. Esto es seguro para un servicio de envío de emails de confirmación.

### Verificación de Permisos Actuales

Para verificar qué está bloqueando:

1. Ve al Dashboard de Supabase
2. **Edge Functions** → `send-booking-confirmation` → **Logs**
3. Deberías ver el error exacto (probablemente "JWT verification failed" o similar)

### Nota Importante

Los edge functions de envío de email (confirmación, bienvenida, etc.) **NO deberían** requerir autenticación porque:
- Se invocan desde el frontend después de acciones públicas (reservas, registro)
- No exponen datos sensibles
- La validación se hace en los datos de entrada, no en el JWT

## Siguiente Paso

Una vez configurado como anónimo, el edge function debería funcionar correctamente.
