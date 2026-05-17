"use client";

import { useAppSelector } from "@/shared/hooks/reduxHooks";
import { AdminUsers } from "@/features/Admin/ui/AdminUsers";

export default function AdminUsersPage() {
    // Берем данные из Redux (слайс называется "admin")
    const users = useAppSelector((state) => state.admin.users);
    const isLoading = useAppSelector((state) => state.admin.isLoading);

    return (
        <div className="animate-in fade-in duration-500">
            <AdminUsers
                users={users || []}
                isLoading={isLoading}
            />
        </div>
    );
}