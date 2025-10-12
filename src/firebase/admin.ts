import { initializeApp, getApps, App, cert, applicationDefault } from 'firebase-admin/app';
import { Buffer } from 'node:buffer';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

type ServiceAccountConfig = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

function normalizeServiceAccountConfig(input: Record<string, unknown> | null | undefined): ServiceAccountConfig | undefined {
  if (!input || typeof input !== 'object') {
    return undefined;
  }

  const projectId = (input['projectId'] ?? input['project_id']) as string | undefined;
  const clientEmail = (input['clientEmail'] ?? input['client_email']) as string | undefined;
  const privateKey = (input['privateKey'] ?? input['private_key']) as string | undefined;

  if (!projectId || !clientEmail || !privateKey) {
    return undefined;
  }

  return {
    projectId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, '\n'),
  };
}

function getServiceAccountFromEnv(): ServiceAccountConfig | undefined {
  const base64ServiceAccount = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64;
  if (base64ServiceAccount) {
    try {
      const decoded = Buffer.from(base64ServiceAccount, 'base64').toString('utf8');
      const parsed = JSON.parse(decoded) as Record<string, unknown>;
      const config = normalizeServiceAccountConfig(parsed);
      if (config) {
        return config;
      }
    } catch (error) {
      console.warn('No se pudo analizar FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64. Se intentarán otras opciones.', error);
    }
  }

  const jsonServiceAccount = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT;
  if (jsonServiceAccount) {
    try {
      const parsed = JSON.parse(jsonServiceAccount) as Record<string, unknown>;
      const config = normalizeServiceAccountConfig(parsed);
      if (config) {
        return config;
      }
    } catch (error) {
      console.warn('No se pudo analizar FIREBASE_ADMIN_SERVICE_ACCOUNT. Se intentarán otras opciones.', error);
    }
  }

  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    return {
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    };
  }

  return undefined;
}

function initializeAdminApp(): App {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0];
  }

  const serviceAccount = getServiceAccountFromEnv();

  if (serviceAccount) {
    return initializeApp({
      credential: cert({
        projectId: serviceAccount.projectId,
        clientEmail: serviceAccount.clientEmail,
        privateKey: serviceAccount.privateKey,
      }),
      projectId: serviceAccount.projectId,
    });
  }

  try {
    return initializeApp({
      credential: applicationDefault(),
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.warn(
        'No se encontraron credenciales de servicio para Firebase Admin. ' +
          'Configura las variables FIREBASE_ADMIN_* para ejecutar acciones administrativas en producción.',
        error
      );
    }
  }

  return initializeApp();
}

const adminApp = initializeAdminApp();
export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
