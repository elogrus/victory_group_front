"use client";

import { useAppSelector } from "@/shared/hooks/reduxHooks";
import { AdminProjects } from "@/features/Admin/ui/AdminProjects";

export default function AdminProjectsPage() {
    const projects = useAppSelector((state) => state.admin.projects);
    const users = useAppSelector((state) => state.admin.users);
    const isLoading = useAppSelector((state) => state.admin.isLoading);

    // Роли пока мокаем, так как для них нет отдельного эндпоинта в слайсе
    const mockRoles = [
        { id: 1, name: "admin" },
        { id: 15, name: "member" },
        { id: 16, name: "developer" }
    ];

    return (
        <div className="animate-in fade-in duration-500">
            <AdminProjects
                projects={projects || []}
                users={users || []}
                roles={mockRoles}
                isLoading={isLoading}
            />
        </div>
    );
}