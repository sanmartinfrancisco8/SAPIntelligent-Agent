"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import type { UserCredential } from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useAuth, useFirestore } from "@/firebase";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/loading-spinner";

const ADMIN_EMAILS = new Set([
  "sanmartinfrancisco8@gmail.com",
]);

type UserProfile = {
  approved?: boolean;
  role?: "admin" | "user" | "pending";
};

const formSchema = z.object({
  email: z.string().email("Por favor, introduce un email válido."),
  password: z.string().min(1, "La contraseña es obligatoria."),
});

export function LoginForm() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const trimmedEmail = values.email.trim();
      const normalizedEmail = trimmedEmail.toLowerCase();
      const password = values.password;
      const isKnownAdminEmail = ADMIN_EMAILS.has(normalizedEmail);

      let userCredential: UserCredential;

      try {
        userCredential = await signInWithEmailAndPassword(
          auth,
          trimmedEmail,
          password,
        );
      } catch (authError: any) {
        const errorCode = authError?.code as string | undefined;
        const isMissingAccount =
          errorCode === "auth/user-not-found" ||
          errorCode === "auth/invalid-credential" ||
          errorCode === "auth/invalid-login-credentials";

        if (isKnownAdminEmail && isMissingAccount) {
          userCredential = await createUserWithEmailAndPassword(
            auth,
            trimmedEmail,
            password,
          );
        } else {
          throw authError;
        }
      }

      const userDocRef = doc(firestore, "users", userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      const canonicalEmail = userCredential.user.email?.trim() ?? trimmedEmail;
      const email = canonicalEmail.toLowerCase();
      const isAdminEmail = ADMIN_EMAILS.has(email);

      let userData = userDoc.data() as UserProfile | undefined;

      if (!userDoc.exists()) {
        const defaultProfile = {
          uid: userCredential.user.uid,
          displayName:
            userCredential.user.displayName ||
            canonicalEmail.split("@")[0] ||
            trimmedEmail,
          email: canonicalEmail,
          role: isAdminEmail ? "admin" : "pending",
          approved: isAdminEmail,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        await setDoc(userDocRef, defaultProfile);
        userData = { approved: defaultProfile.approved, role: defaultProfile.role };
      }

      if (userData) {
        const updates: Partial<UserProfile> = {};

        if (isAdminEmail && userData.role !== "admin") {
          updates.role = "admin";
        }

        if (isAdminEmail && userData.approved !== true) {
          updates.approved = true;
        }

        if (Object.keys(updates).length > 0) {
          await updateDoc(userDocRef, {
            ...updates,
            updatedAt: serverTimestamp(),
          });
          userData = { ...userData, ...updates };
        }
      }

      if (!userData) {
        await auth.signOut();
        toast({
          variant: "destructive",
          title: "Cuenta no encontrada",
          description: "No se pudo encontrar la información de tu cuenta. Por favor, contacta al administrador.",
        });
        return;
      }

      const normalizedUserData = {
        approved: userData.approved ?? false,
        role:
          userData.role ??
          (userData.approved
            ? "user"
            : isAdminEmail
              ? "admin"
              : "pending"),
      };

      if (!normalizedUserData.approved) {
        toast({
          title: "Cuenta pendiente de aprobación",
          description: "Un administrador revisará tu solicitud. Te notificaremos cuando tu cuenta esté activa.",
        });
        router.push("/pending-approval");
        return;
      }

      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido a SAP Intelligent Agent.",
      });

      if (normalizedUserData.role === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard");
      }

    } catch (error: any) {
      console.error("Login Error:", error);
      let description = "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        description = "Usuario o contraseña incorrectos.";
      }
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-center text-primary">Iniciar Sesión</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="tu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Ingrese su contraseña"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <LoadingSpinner /> : "Ingresar"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
