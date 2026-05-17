"use client";

import { useAppSelector } from "@/shared/hooks/reduxHooks";
import { AdminRoles } from "@/features/Admin/ui/AdminRoles";

export default function AdminRolesPage() {
    const roles = useAppSelector((state) => state.admin.roles);
    const isLoading = useAppSelector((state) => state.admin.isLoading);

    return (
        <div className="animate-in fade-in duration-500">
            <AdminRoles 
                roles={roles || []} 
                isLoading={isLoading} 
            />
        </div>
    );
}