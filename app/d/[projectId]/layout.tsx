"use client";
import { ProjectProvider } from "@/features/Dashboard/providers/Project/ProjectProvider";
import { Header } from "@/features/Dashboard/ui/Header";
import { Links } from "@/features/Dashboard/ui/Links";
import { Tabs } from "@/features/Dashboard/ui/Tabs";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ReactNode } from "react";

export default function ProjectLayout({ children }: { children: ReactNode }) {
    const params = useParams();
    const projectId = +params.projectId!;
    return (
        <ProjectProvider projectId={projectId}>
            {/* <Tabs /> */}
            <Header />
            <Tabs />
            <Links />
            {children}
        </ProjectProvider>
    );
}
