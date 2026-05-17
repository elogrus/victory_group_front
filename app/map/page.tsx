"use client";

import { Header } from "@/features/Header/ui/Header";
import { ProjectMap } from "@/widgets/ProjectMap/ProjectMap";
import { CreateTaskModal } from "@/features/Dashboard/ui/CreateTaskModal";
import { useState } from "react";

export default function MapPage() {
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">
            <Header/>

            <main className="flex-1 overflow-hidden relative">
                <ProjectMap />
            </main>
        </div>
    );
}
