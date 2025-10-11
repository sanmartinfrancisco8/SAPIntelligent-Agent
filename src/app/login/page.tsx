import { LoginForm } from "@/components/auth/LoginForm";
import { AppLogo } from "@/components/icons";
import { SetupAdmin } from "@/components/admin/SetupAdmin";
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center p-4 bg-transparent">
      <div className="relative z-10 w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center text-foreground">
          <AppLogo className="mb-4 h-14 w-14" />
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary">
            SAP Intelligent Agent
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Su asistente inteligente para SAP Business One
          </p>
        </div>
        <LoginForm />
         <p className="text-center text-sm text-muted-foreground">
            ¿No tienes una cuenta?{' '}
            <Link
              href="/register"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Regístrate aquí
            </Link>
          </p>
        <SetupAdmin />
      </div>
    </main>
  );
}
