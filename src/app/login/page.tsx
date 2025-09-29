import { LoginForm } from "@/components/auth/LoginForm";
import { AppLogo } from "@/components/icons";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center p-4 bg-background">
      <div className="relative z-10 w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center text-foreground">
          <AppLogo className="mb-4 h-14 w-14" />
          <h1 className="font-headline text-4xl font-bold tracking-tight">
            SAP Intelligent Agent
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Su asistente inteligente para SAP Business One
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
