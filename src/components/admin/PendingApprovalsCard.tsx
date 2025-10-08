"use client";

import { collection, query, where, Timestamp } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase/provider";
import { useFirestore } from "@/firebase";
import { useCollection } from "@/firebase/firestore/use-collection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/loading-spinner";

interface PendingUserData {
  displayName?: string;
  email?: string;
  createdAt?: Timestamp;
}

type PendingUser = PendingUserData & { id: string };

function getCreatedAtMillis(createdAt?: Timestamp) {
  return createdAt?.toMillis() ?? 0;
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

  const { data: pendingUsers, isLoading } = useCollection<PendingUserData>(pendingUsersQuery);

  const safePendingUsers: PendingUser[] = (pendingUsers ?? []) as PendingUser[];
  const totalPending = safePendingUsers.length;

  const recentPendingUsers = safePendingUsers
    .slice()
    .sort((a, b) => getCreatedAtMillis(b.createdAt) - getCreatedAtMillis(a.createdAt))
    .slice(0, 5);

  return (
    <Card className="border-primary/20 bg-card/60 backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-headline text-xl">Solicitudes pendientes</CardTitle>
        <Badge variant={totalPending > 0 ? "default" : "secondary"}>
          {totalPending}
        </Badge>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <LoadingSpinner size={24} />
          </div>
        ) : totalPending === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay solicitudes de aprobación en espera.
          </p>
        ) : (
          <ul className="space-y-3">
            {recentPendingUsers.map((user) => (
              <li key={user.id} className="rounded-md border border-border/60 bg-background/60 p-3">
                <p className="font-medium text-foreground">
                  {user.displayName ?? user.email ?? "Usuario"}
                </p>
                {user.email ? (
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                ) : null}
              </li>
            ))}
            {totalPending > 5 ? (
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
