"use client";

import { useAppSelector } from "@/shared/hooks/reduxHooks";
import { AdminUsers } from "@/features/Admin/ui/AdminUsers";

export default function AdminUsersPage() {
    // В твоем slice name: "project", поэтому обращаемся к state.project
    const users = useAppSelector((state) => state.project.users);
    const isLoading = useAppSelector((state) => state.project.isLoading);

    return (
        <div className="animate-in fade-in duration-500">
            <AdminUsers
                users={users || []}
                isLoading={isLoading}
            />
        </div>
    );
}