# Guía de Creación de Nuevos Tenants (Clientes)

Este documento describe los pasos necesarios para aprovisionar un nuevo tenant (empresa/cliente) en la plataforma de Facturación Electrónica.

## Requisitos Previos

Antes de intentar crear un tenant, asegúrate de que el backend tenga configurada la clave secreta de administrador.

1. Abre el archivo `backend/.env`.
2. Asegúrate de que existe la variable `ADMIN_SECRET`:
   ```env
   ADMIN_SECRET=TuClaveSecretaSuperSegura
   ```
3. El backend debe estar en ejecución (`npm run dev`).

## Pasos para Crear un Tenant

La forma más sencilla de crear un tenant es utilizar el script automatizado incluido en el backend.

### 1. Ejecutar el Script de Creación

Desde la carpeta `backend`, ejecuta el siguiente comando:

```bash
npm run create-tenant "<Nombre del Negocio>" "<email_administrador>" "<RNC_opcional>"
```

**Ejemplo:**
```bash
npm run create-tenant "Repuestos El Primo" "administrador@elprimo.com" "101010101"
```

### 2. ¿Qué hace este comando?

Cuando ejecutas este comando, el sistema realiza automáticamente lo siguiente:

1. **Base de Datos Local**: Crea un registro en la tabla `tenants`.
2. **Supabase Auth**: Invita al usuario especificado via email (`inviteUserByEmail`). Esto le enviará un correo de confirmación.
3. **Usuario Local**: Crea un registro en la tabla `users` vinculado al nuevo tenant y al ID de Supabase.
4. **Configuración Inicial**: Inserta configuraciones básicas como el nombre y RNC en la tabla `company_settings`.

## Verificación

Si el comando tiene éxito, verás un mensaje de confirmación:
`✅ Tenant Created Successfully!`

El administrador recibirá un correo para establecer su contraseña. Una vez establecida, podrá iniciar sesión en la plataforma y verá únicamente los datos (facturas, clientes, productos) correspondientes a su tenant.

## Solución de Problemas

- **Error: Forbidden**: Verifica que el `ADMIN_SECRET` en `backend/.env` coincida con el que está usando el script (puedes revisarlo en `backend/src/scripts/create-tenant.ts`).
- **Error: Supabase Failed**: Asegúrate de que las credenciales de Supabase (`SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`) estén configuradas correctamente en el `.env` del backend.
