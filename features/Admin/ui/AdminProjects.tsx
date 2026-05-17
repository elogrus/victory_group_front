"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { Trash2, X, Plus, BrainCircuit, Loader2 } from "lucide-react";
import { Project } from "@/entity/Project";
import { AiAnalyticsDashboard } from "@/features/Analytics/AiAnalyticsDashboard";
import { MOCK_ANALYTICS_DATA } from "@/shared/lib/mock-analytics";

export function AdminProjects({ projects, isLoading }: { projects: Project[], isLoading: boolean }) {
    const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false);

    const handleOpenAnalytics = (project: Project) => {
        setSelectedProject(project);
        setAnalyticsModalOpen(true);
        setIsAnalyticsLoading(true);
        // Здесь должен быть вызов API для получения аналитики
        setTimeout(() => setIsAnalyticsLoading(false), 800);
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-foreground">Управление проектами</h1>
                <Button className="bg-blue-600 text-white">
                    <Plus className="w-4 h-4 mr-2"/> Создать проект
                </Button>
            </div>
            
            {isLoading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                </div>
            ) : projects.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-xl">
                    Проекты не созданы
                </div>
            ) : (
                projects.map((proj: Project) => (
                    <div key={proj.id} className="border rounded-xl bg-card shadow-sm overflow-hidden mb-6 hover:border-blue-500/30 transition-colors">
                        <div className="p-5 flex items-center justify-between border-b bg-muted/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded bg-blue-600/20 text-blue-600 flex items-center justify-center font-bold">
                                    {proj.name?.charAt(0) || "P"}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{proj.name}</h3>
                                    <p className="text-xs text-muted-foreground">ID: {proj.id}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button 
                                    variant="outline" size="sm" 
                                    className="border-purple-200 text-purple-600 hover:bg-purple-50"
                                    onClick={() => handleOpenAnalytics(proj)}
                                >
                                    <BrainCircuit className="w-4 h-4 mr-2"/> Аналитика
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50">
                                    <Trash2 className="w-4 h-4"/>
                                </Button>
                            </div>
                        </div>
                    </div>
                ))
            )}

            <Dialog open={analyticsModalOpen} onOpenChange={setAnalyticsModalOpen}>
                <DialogContent className="!max-w-[1200px] w-[90vw] h-[90vh] flex flex-col p-0 overflow-hidden [&>button]:hidden">
                    <div className="p-6 border-b flex justify-between items-center bg-background">
                        <div className="flex items-center gap-3">
                            <BrainCircuit className="w-6 h-6 text-purple-600" />
                            <h2 className="text-xl font-bold">AI Аналитика: {selectedProject?.name}</h2>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setAnalyticsModalOpen(false)}><X className="w-5 h-5"/></Button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8">
                        {isAnalyticsLoading ? (
                            <div className="flex flex-col items-center justify-center h-64 gap-4">
                                <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
                                <p className="text-muted-foreground font-medium">Сбор данных для отчета...</p>
                            </div>
                        ) : (
                            <AiAnalyticsDashboard data={MOCK_ANALYTICS_DATA} />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}