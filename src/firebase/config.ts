type FirebaseClientConfig = {
  projectId: string;
  appId: string;
  apiKey: string;
  authDomain: string;
  measurementId: string;
  messagingSenderId: string;
};

const fallbackConfig: FirebaseClientConfig = {
  projectId: 'studio-3193836505-da060',
  appId: '1:179665586409:web:d0d3990e9e4e4f8cd40878',
  apiKey: 'AIzaSyButI8QW6xrzvc9O4J_pPLs3azMmB-I0t0',
  authDomain: 'studio-3193836505-da060.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '179665586409',
};

const requiredEnvVars: Array<keyof FirebaseClientConfig> = [
  'projectId',
  'appId',
  'apiKey',
  'authDomain',
  'messagingSenderId',
];

function getEnvConfig(): Partial<FirebaseClientConfig> {
  return {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  } satisfies Partial<FirebaseClientConfig>;
}

function hasAllRequiredValues(config: Partial<FirebaseClientConfig>): config is FirebaseClientConfig {
  return requiredEnvVars.every(key => typeof config[key] === 'string' && config[key]);
}

function buildFirebaseConfig(): FirebaseClientConfig {
  const envConfig = getEnvConfig();

  if (hasAllRequiredValues(envConfig)) {
    return {
      ...envConfig,
      measurementId: envConfig.measurementId ?? '',
    };
  }

  if (process.env.NODE_ENV === 'production') {
    const missing = requiredEnvVars.filter(key => !envConfig[key]);
    console.warn(
      `Faltan variables de entorno para la configuración de Firebase (${missing.join(', ')}). ` +
        'Se utilizará la configuración predeterminada del repositorio. ' +
        'Configura las variables NEXT_PUBLIC_FIREBASE_* para evitar este mensaje.'
    );
  }

  return fallbackConfig;
}

export const firebaseConfig = buildFirebaseConfig();

export function isUsingFallbackFirebaseConfig() {
  return firebaseConfig === fallbackConfig;
}
