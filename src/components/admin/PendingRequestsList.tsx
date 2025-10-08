"use client";

import { useState } from "react";
import {
  collection,
  doc,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useFirestore, useUser } from "@/firebase";
import { useMemoFirebase } from "@/firebase/provider";
import { useCollection } from "@/firebase/firestore/use-collection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/loading-spinner";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface PendingUserData {
  displayName?: string;
  email?: string;
  createdAt?: Timestamp;
}

type PendingUser = PendingUserData & { id: string };

function formatCreatedAt(createdAt?: Timestamp) {
  return createdAt ? format(createdAt.toDate(), "dd/MM/yyyy HH:mm") : "Sin fecha";
}

export function PendingRequestsList() {
  const firestore = useFirestore();
  const { user: adminUser } = useUser();
  const { toast } = useToast();
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const pendingUsersQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collection(firestore, "users"), where("approved", "==", false))
        : null,
    [firestore],
  );

  const { data: pendingUsers, isLoading } = useCollection<PendingUserData>(pendingUsersQuery);

  const handleApproveUser = async (user: PendingUser) => {
    if (!firestore || !adminUser) return;

    setUpdatingUserId(user.id);
    try {
      await updateDoc(doc(firestore, "users", user.id), {
        approved: true,
        role: "user",
        updatedAt: serverTimestamp(),
      });

      toast({
        title: "Usuario aprobado",
        description: `${user.displayName ?? user.email ?? "El usuario"} ahora puede acceder al panel.`,
      });
    } catch (error) {
      console.error("Error approving user:", error);
      toast({
        variant: "destructive",
        title: "No se pudo aprobar",
        description: "Ocurrió un problema al actualizar la solicitud. Inténtalo nuevamente.",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <Card className="border-primary/20 bg-card/60 backdrop-blur">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Solicitudes en espera</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading || !adminUser ? (
          <div className="flex items-center justify-center py-6">
            <LoadingSpinner size={24} />
          </div>
        ) : !pendingUsers || pendingUsers.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            En este momento no hay cuentas pendientes de aprobación.
          </p>
        ) : (
          <ul className="space-y-3">
            {((pendingUsers ?? []) as PendingUser[])
              .slice()
              .sort((a, b) => {
                const aTime = a.createdAt?.toMillis() ?? 0;
                const bTime = b.createdAt?.toMillis() ?? 0;
                return bTime - aTime;
              })
              .map((user) => (
                <li
                  key={user.id}
                  className="flex flex-col gap-2 rounded-md border border-border/60 bg-background/60 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {user.displayName ?? user.email ?? "Usuario"}
                    </p>
                    <div className="text-sm text-muted-foreground">
                      {user.email ?? "Sin correo registrado"}
                      <span className="mx-2 inline-block h-1 w-1 rounded-full bg-muted-foreground align-middle" />
                      {formatCreatedAt(user.createdAt)}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    disabled={updatingUserId === user.id}
                    onClick={() => handleApproveUser(user)}
                  >
                    {updatingUserId === user.id ? <LoadingSpinner size={16} /> : "Aprobar"}
                  </Button>
                </li>
              ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

