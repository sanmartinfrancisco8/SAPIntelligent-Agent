"use client";

import { useState } from "react";
import { useCollection } from "@/firebase/firestore/use-collection";
import { collection, doc, updateDoc, writeBatch } from "firebase/firestore";
import { useFirestore, useUser } from "@/firebase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, UserCheck, UserX } from "lucide-react";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { useMemoFirebase } from "@/firebase/provider";

type UserProfile = {
  uid: string;
  displayName: string;
  email: string;
  role: 'admin' | 'user' | 'pending';
  approved: boolean;
  createdAt: { seconds: number, nanoseconds: number };
};

export function UserManagementTable() {
  const firestore = useFirestore();
  const { user: adminUser } = useUser();
  const { toast } = useToast();

  const usersQuery = useMemoFirebase(() => 
    collection(firestore, "users")
  , [firestore]);
  
  const { data: users, isLoading } = useCollection<UserProfile>(usersQuery);
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});

  const handleUpdateUser = async (uid: string, updates: Partial<UserProfile>) => {
    if (uid === adminUser?.uid && (updates.role !== 'admin' || updates.approved === false)) {
        toast({ variant: 'destructive', title: 'Acción no permitida', description: 'No puedes revocar tus propios privilegios de administrador.' });
        return;
    }

    setIsUpdating(prev => ({ ...prev, [uid]: true }));
    try {
        const userDocRef = doc(firestore, "users", uid);
        const batch = writeBatch(firestore);

        batch.update(userDocRef, { ...updates, updatedAt: new Date() });

        // If making admin, ensure approved is true
        if (updates.role === 'admin') {
            batch.update(userDocRef, { approved: true });
        }

        await batch.commit();

        toast({ title: 'Usuario actualizado', description: 'Los cambios se han guardado correctamente.' });
    } catch (error) {
        console.error("Error updating user:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo actualizar el usuario.' });
    } finally {
        setIsUpdating(prev => ({ ...prev, [uid]: false }));
    }
  };

  const renderBadge = (value: string) => {
    switch (value) {
      case 'admin':
        return <Badge variant="default" className="bg-primary/80 text-primary-foreground">Admin</Badge>;
      case 'user':
        return <Badge variant="secondary">Usuario</Badge>;
      case 'pending':
        return <Badge variant="outline">Pendiente</Badge>;
      case 'true':
        return <Badge variant="default" className="bg-green-600 text-white">Aprobado</Badge>;
      case 'false':
        return <Badge variant="destructive">No Aprobado</Badge>;
      default:
        return <Badge>{value}</Badge>;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner size={32} /></div>;
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha de Registro</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users && users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.uid}>
                <TableCell className="font-medium">{user.displayName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{renderBadge(user.role)}</TableCell>
                <TableCell>{renderBadge(String(user.approved))}</TableCell>
                <TableCell>
                  {user.createdAt ? format(new Date(user.createdAt.seconds * 1000), 'dd/MM/yyyy HH:mm') : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  {isUpdating[user.uid] ? <LoadingSpinner size={16} /> : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Acciones</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!user.approved && user.role === 'pending' && (
                          <DropdownMenuItem
                            onClick={() => handleUpdateUser(user.uid, { approved: true, role: 'user' })}
                            className="cursor-pointer"
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Aprobar Usuario
                          </DropdownMenuItem>
                        )}
                        {user.role !== 'admin' && (
                          <DropdownMenuItem
                            onClick={() => handleUpdateUser(user.uid, { role: 'admin' })}
                            className="cursor-pointer"
                          >
                            Hacer Admin
                          </DropdownMenuItem>
                        )}
                        {user.role === 'admin' && (
                           <DropdownMenuItem
                             onClick={() => handleUpdateUser(user.uid, { role: 'user' })}
                             className="cursor-pointer text-destructive focus:text-destructive"
                           >
                            <UserX className="mr-2 h-4 w-4" />
                             Revocar Admin
                           </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-24">
                No hay usuarios para mostrar.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}