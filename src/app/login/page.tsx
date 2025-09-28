import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { LoginForm } from "@/components/auth/LoginForm";
import { AppLogo } from "@/components/icons";

export default function LoginPage() {
  const loginImage = PlaceHolderImages.find(
    (img) => img.id === "login-background"
  );

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      {loginImage && (
        <Image
          src={loginImage.imageUrl}
          alt={loginImage.description}
          fill
          className="object-cover -z-10 brightness-[.2]"
          data-ai-hint={loginImage.imageHint}
          priority
        />
      )}
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center text-primary-foreground">
          <AppLogo className="mb-4 h-14 w-14" />
          <h1 className="font-headline text-4xl font-bold tracking-tight">
            SAP B1 Companion
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
