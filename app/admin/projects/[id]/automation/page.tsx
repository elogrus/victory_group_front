'use client'

import { AutomationRules } from "@/features/Admin/ui/Automation/AutomationRules";
import { useParams } from "next/navigation";

function AutomationProjects() {
    const params = useParams();
    return (<AutomationRules projectId={params.id} />);
}

export default AutomationProjects;