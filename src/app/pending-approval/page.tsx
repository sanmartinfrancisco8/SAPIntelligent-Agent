"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/firebase";

export default function PendingApprovalPage() {
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted px-4 text-center">
      <div className="max-w-lg space-y-6 rounded-xl border border-border bg-card/70 p-8 shadow-lg backdrop-blur">
        <h1 className="font-headline text-3xl font-bold text-primary">Cuenta pendiente de aprobación</h1>
        <p className="text-muted-foreground">
          Gracias por registrarte en <span className="font-semibold text-foreground">SAP Intelligent Agent</span>. Tu cuenta se encuentra en proceso de revisión.
          Recibirás acceso en cuanto un administrador autorice tu solicitud.
        </p>
        <p className="text-sm text-muted-foreground">
          Si necesitas acceso urgente, comunícate con tu administrador e indícale el correo con el que te registraste.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Button onClick={() => router.push("/dashboard")} variant="outline">
            Volver al panel
          </Button>
          <Button onClick={handleSignOut}>
            Cerrar sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
