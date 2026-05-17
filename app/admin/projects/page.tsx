"use client";

import { useAppSelector } from "@/shared/hooks/reduxHooks";
import { AdminProjects } from "@/features/Admin/ui/AdminProjects";

export default function AdminProjectsPage() {
    const projects = useAppSelector((state) => state.project.projects);
    const isLoading = useAppSelector((state) => state.project.isLoading);

    return (
        <div className="animate-in fade-in duration-500">
            <AdminProjects
                projects={projects || []}
                isLoading={isLoading}
            />
        </div>
    );
}