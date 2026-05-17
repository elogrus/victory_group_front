"use client";

import { useState } from "react";
import { AdminRoles } from "@/features/Admin/AdminRoles";
import { MOCK_ROLES } from "@/shared/lib/data";

export default function AdminRolesPage() {
    const [roles, setRoles] = useState(MOCK_ROLES);

    return (
        <div className="animate-in fade-in duration-500">
            <AdminRoles 
                roles={roles} 
                setRoles={setRoles} 
            />
        </div>
    );
}