"use client";

import { useState } from "react";
import { AdminProjects } from "@/features/Admin/ui/AdminProjects";
import { INITIAL_PROJECTS, MOCK_USERS, MOCK_ROLES } from "@/shared/lib/data";
import { useAppSelector } from "@/shared/hooks/reduxHooks";
import { Spinner } from "@/shared/ui/spinner";

export default function AdminProjectsPage() {
    const isLoading = useAppSelector((state) => state.admin.isLoading);

    const [projects, setProjects] = useState(INITIAL_PROJECTS);
    const [users] = useState(MOCK_USERS);
    const [roles] = useState(MOCK_ROLES);

    if (isLoading.projects || isLoading.users) return <Spinner />;
    return (
        <div className="animate-in fade-in duration-500">
            <AdminProjects
                projects={projects}
                setProjects={setProjects}
                users={users}
                roles={roles}
            />
        </div>
    );
}
