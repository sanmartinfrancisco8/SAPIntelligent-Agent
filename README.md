# Firebase Studio

Este proyecto es una aplicación Next.js que integra Firebase para autenticación y Firestore, además de flujos de IA. El repositorio se ha actualizado para facilitar el despliegue en servicios como Hostinger, donde la aplicación se ejecuta como un servidor Node.js tradicional.

## Requisitos previos

- Node.js 18.17 o superior (Hostinger soporta esta versión en sus planes de hosting con Node).
- Una cuenta de Firebase con un proyecto configurado y un servicio de cuenta (service account) con permisos de administrador.
- Variables de entorno configuradas para el cliente (SDK web) y para el administrador (Firebase Admin SDK).

## Variables de entorno

Crea un archivo `.env.local` para desarrollo y `.env.production` para el despliegue en Hostinger. Utiliza el archivo [`\.env.example`](./.env.example) como referencia.

Variables de entorno para el SDK de cliente (deben comenzar con `NEXT_PUBLIC_` para que Next.js las exponga en el navegador):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="" # opcional
```

Variables de entorno para el SDK de administrador (se utilizan en las Server Actions y rutas protegidas):

```env
# Opción 1: variables desglosadas
FIREBASE_ADMIN_PROJECT_ID=""
FIREBASE_ADMIN_CLIENT_EMAIL=""
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Opción 2: JSON completo
FIREBASE_ADMIN_SERVICE_ACCOUNT='{"project_id":"","client_email":"","private_key":"-----BEGIN PRIVATE KEY-----\n..."}'

# Opción 3: JSON codificado en Base64
FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64=""

# Credenciales iniciales del administrador creadas por la acción setupInitialAdmin
INITIAL_ADMIN_EMAIL="admin@tudominio.com"
INITIAL_ADMIN_PASSWORD="contraseña-segura"
INITIAL_ADMIN_NAME="Nombre del Admin"
```

> El código detecta automáticamente la opción disponible en el orden Base64 → JSON → variables desglosadas. Asegúrate de definir al menos una de ellas en Hostinger.

## Scripts disponibles

- `npm run dev`: Ejecuta el servidor de desarrollo en el puerto 9002.
- `npm run build`: Genera el build de producción.
- `npm run start`: Arranca el servidor de producción (`next start`) respetando la variable `PORT` que define Hostinger.
- `npm run export`: Copia los artefactos estáticos disponibles a la carpeta `out`. Si alguna página no puede prerenderizarse, el script genera un `index.html` informativo para evitar errores 403 en proveedores de hosting estático.

## Despliegue en Hostinger

1. **Conecta tu repositorio de GitHub** desde el panel de Hostinger y selecciona la rama que deseas desplegar.
2. Configura las variables de entorno en el apartado de *Environment Variables* del panel, copiando los valores descritos anteriormente.
3. Establece los comandos de *Build* y *Start*:
   - Build: `npm install && npm run build`
   - Start: `npm run start`
4. Guarda la configuración y ejecuta el despliegue. Hostinger instalará dependencias, construirá la aplicación y levantará el servidor Next.js.

> Gracias a la nueva configuración, ya no es necesario depender de las credenciales automáticas de Firebase Hosting. El despliegue funciona en cualquier plataforma Node.js que permita definir variables de entorno.

## Desarrollo local

1. Clona el repositorio y crea el archivo `.env.local` siguiendo el ejemplo proporcionado.
2. Ejecuta `npm install` para instalar las dependencias.
3. Inicia el entorno de desarrollo con `npm run dev`.

Para entender el flujo principal de la aplicación comienza explorando `src/app/page.tsx` y los componentes en `src/components`.
