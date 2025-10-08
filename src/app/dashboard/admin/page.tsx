import { PendingApprovalsCard } from "@/components/admin/PendingApprovalsCard";
import { PendingRequestsList } from "@/components/admin/PendingRequestsList";
import { UserManagementTable } from "@/components/admin/UserManagementTable";

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-headline text-4xl font-bold text-primary">Gestión de Usuarios</h1>
        <p className="text-lg text-muted-foreground">
          Aprueba, rechaza y gestiona los roles de los usuarios de la aplicación.
        </p>
      </header>
      <PendingApprovalsCard />
      <PendingRequestsList />
      <UserManagementTable />
    </div>
  );
}
