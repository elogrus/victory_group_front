"use client";
import { ProjectProvider } from "@/features/Dashboard/providers/ProjectProvider";
import { useParams } from "next/navigation";
import { ReactNode } from "react";

export default function ProjectLayout({ children }: { children: ReactNode }) {
    const params = useParams();
    const projectId = +params.projectId! as number;
    return <ProjectProvider projectId={projectId}>{children}</ProjectProvider>;
}
