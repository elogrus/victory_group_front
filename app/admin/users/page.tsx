"use client";

import { useState } from "react";
import { AdminUsers } from "@/features/Admin/AdminUsers";
import { MOCK_USERS, INITIAL_PROJECTS } from "@/shared/lib/data";

export default function AdminUsersPage() {
    const [users, setUsers] = useState(MOCK_USERS);
    const [projects, setProjects] = useState(INITIAL_PROJECTS);

    return (
        <div className="animate-in fade-in duration-500">
            <AdminUsers 
                users={users} 
                setUsers={setUsers} 
                setProjects={setProjects} 
            />
        </div>
    );
}