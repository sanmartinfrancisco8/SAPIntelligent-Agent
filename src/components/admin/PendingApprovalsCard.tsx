"use client";

import { collection, query, where } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase/provider";
import { useFirestore } from "@/firebase";
import { useCollection } from "@/firebase/firestore/use-collection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/loading-spinner";

interface PendingUser {
  displayName?: string;
  email?: string;
  createdAt?: { seconds: number; nanoseconds: number };
}

export function PendingApprovalsCard() {
  const firestore = useFirestore();

  const pendingUsersQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collection(firestore, "users"), where("approved", "==", false))
        : null,
    [firestore],
  );

  const { data: pendingUsers, isLoading } = useCollection<PendingUser>(pendingUsersQuery);

  return (
    <Card className="border-primary/20 bg-card/60 backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-headline text-xl">Solicitudes pendientes</CardTitle>
        <Badge variant={pendingUsers && pendingUsers.length > 0 ? "default" : "secondary"}>
          {pendingUsers?.length ?? 0}
        </Badge>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <LoadingSpinner size={24} />
          </div>
        ) : !pendingUsers || pendingUsers.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay solicitudes de aprobación en espera.
          </p>
        ) : (
          <ul className="space-y-3">
            {[...(pendingUsers ?? [])]
              .sort((a, b) => {
                const aTime = a.createdAt?.seconds ?? 0;
                const bTime = b.createdAt?.seconds ?? 0;
                return bTime - aTime;
              })
              .slice(0, 5)
              .map((user) => (
                <li key={user.id} className="rounded-md border border-border/60 bg-background/60 p-3">
                  <p className="font-medium text-foreground">{user.displayName ?? user.email ?? "Usuario"}</p>
                  {user.email ? (
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  ) : null}
                </li>
              ))}
            {pendingUsers.length > 5 ? (
              <p className="text-xs text-muted-foreground">
                Mostrando los 5 registros más recientes. Consulta la tabla completa para más detalles.
              </p>
            ) : null}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
