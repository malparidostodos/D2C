# Guía de Despliegue - Edge Functions de Supabase

Esta guía te ayudará a desplegar las edge functions `send-welcome-email` y `send-password-reset-email` en tu proyecto de Supabase.

## Prerrequisitos

- Tener acceso al dashboard de tu proyecto en Supabase
- Tener una API key de Resend (https://resend.com)
- Node.js instalado (ya lo tienes)

## Paso 1: Configurar Secrets en Supabase

Antes de desplegar las functions, necesitas configurar las variables de entorno en Supabase:

1. Ve al [Dashboard de Supabase](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a **Settings** → **Edge Functions** → **Secrets**
4. Agrega los siguientes secrets:

| Secret Name | Descripción | Dónde obtenerlo |
|-------------|-------------|-----------------|
| `RESEND_API_KEY` | Tu API key de Resend | Dashboard de Resend → API Keys |
| `SUPABASE_URL` | URL de tu proyecto | Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key | Settings → API → Service Role Key (secret) |

> **⚠️ IMPORTANTE:** El `SUPABASE_SERVICE_ROLE_KEY` es una clave sensible. Nunca la compartas públicamente.

## Paso 2: Autenticarse con Supabase CLI

Ejecuta el siguiente comando para autenticarte:

```bash
npx supabase login
```

Esto abrirá tu navegador para que te autentiques con tu cuenta de Supabase.

## Paso 3: Linkear tu Proyecto

Necesitas vincular este repositorio local con tu proyecto de Supabase:

```bash
npx supabase link --project-ref TU_PROJECT_REF
```

> **📝 Nota:** Encuentra tu `project-ref` en el dashboard de Supabase en Settings → General → Reference ID

Cuando te pregunte por la database password, usa la contraseña de tu base de datos de Supabase.

## Paso 4: Desplegar las Edge Functions

Tienes dos opciones:

### Opción A: Desplegar ambas functions a la vez

```bash
npm run deploy:functions
```

### Opción B: Desplegar individualmente

```bash
# Solo welcome email
npm run deploy:welcome

# Solo password reset
npm run deploy:password-reset
```

## Paso 5: Verificar el Despliegue

1. Ve a tu [Dashboard de Supabase](https://app.supabase.com)
2. Navega a **Edge Functions**
3. Deberías ver ambas functions listadas:
   - `send-welcome-email`
   - `send-password-reset-email`
4. Cada una debe mostrar el estado "Deployed" con un indicador verde

## Paso 6: Probar las Functions

### Probar Welcome Email

1. Desde tu aplicación, registra un nuevo usuario
2. Deberías recibir un email de bienvenida en la bandeja de entrada
3. Verifica que el diseño se vea correctamente y que el botón funcione

### Probar Password Reset

1. Ve a la página de "Olvidé mi contraseña" en tu app
2. Ingresa un email válido de un usuario existente
3. Deberías recibir un email con el link de recuperación
4. Haz clic en el link para verificar que redirige a `/reset-password`
5. Cambia la contraseña y verifica que funciona el inicio de sesión

## Comandos Útiles

```bash
# Ver logs de una function específica
npx supabase functions logs send-welcome-email

# Listar todas las functions desplegadas
npx supabase functions list

# Actualizar una function (después de hacer cambios)
npx supabase functions deploy send-welcome-email
```

## Troubleshooting

### Error: "Missing RESEND_API_KEY"

- Verifica que configuraste el secret en el dashboard de Supabase
- El nombre debe ser exactamente `RESEND_API_KEY` (case-sensitive)

### No recibo emails

1. Verifica los logs de la function: `npx supabase functions logs send-welcome-email`
2. Confirma que tu API key de Resend es válida
3. En Resend, verifica que el dominio `onboarding@resend.dev` esté disponible (o usa tu propio dominio verificado)

### Error: "Supabase CLI not found"

Si `npx supabase` no funciona, instala el CLI globalmente:

```bash
npm install -g supabase
```

### La function se despliega pero no se ejecuta

- Verifica que los secrets estén configurados correctamente
- Revisa los logs en el dashboard: Edge Functions → [Nombre de la function] → Logs
- Asegúrate de que tu plan de Supabase incluye Edge Functions

## Actualizar el Email de Envío

Por defecto, los emails se envían desde `onboarding@resend.dev`. Para usar tu propio dominio:

1. Verifica tu dominio en Resend
2. Actualiza el campo `from` en ambos archivos:
   - `supabase/functions/send-welcome-email/index.ts` (línea 33)
   - `supabase/functions/send-password-reset-email/index.ts` (línea 55)
3. Redespliega las functions

## Recursos Adicionales

- [Documentación de Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Documentación de Resend](https://resend.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
