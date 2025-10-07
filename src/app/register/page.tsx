import { RegisterForm } from "@/components/auth/RegisterForm";
import { AppLogo } from "@/components/icons";
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center p-4 bg-transparent">
      <div className="relative z-10 w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center text-foreground">
          <AppLogo className="mb-4 h-14 w-14" />
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary">
            Crear una cuenta
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Regístrate para acceder al asistente inteligente de SAP Business One.
          </p>
        </div>
        <RegisterForm />
         <p className="text-center text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{' '}
            <Link
              href="/login"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Inicia sesión aquí
            </Link>
          </p>
      </div>
    </main>
  );
}
