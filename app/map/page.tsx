"use client";

import { Header } from "@/widgets/Header/Header";
import { ProjectMap } from "@/widgets/ProjectMap/ProjectMap";
import { CreateTaskModal } from "@/features/Task/CreateTaskModal";
import { useState } from "react";

export default function MapPage() {
    // Состояние модалки создания задачи для Хедера
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">
            <Header onCreateClick={() => setCreateModalOpen(true)} />
            
            <main className="flex-1 overflow-hidden relative">
                <ProjectMap />
            </main>

            <CreateTaskModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} />
        </div>
    );
}