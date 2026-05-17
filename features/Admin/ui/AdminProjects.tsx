"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { Trash2, X, Plus, BrainCircuit, Loader2, UserMinus } from "lucide-react";
import { Project, ProjectMember } from "@/shared/lib/data";
import { Badge } from "@/shared/ui/badge";
import { AiAnalyticsDashboard } from "@/features/Analytics/AiAnalyticsDashboard";
import adminService from "@/entity/Admin"; // Импортируем сервис
import { toast } from "sonner";

export function AdminProjects({ projects, isLoading }: { projects: Project[], isLoading: boolean }) {
    const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false);

    // Функция получения реальной аналитики с бэкенда
    const handleOpenAnalytics = async (project: Project) => {
        setSelectedProject(project);
        setAnalyticsModalOpen(true);
        setIsAnalyticsLoading(true);
        setAnalyticsData(null); // Сбрасываем старые данные
        
        try {
            const res = await adminService.getProjectAnalytics(project.id);
            if (res?.ok) {
                setAnalyticsData(res.body);
            } else {
                toast.error("Не удалось загрузить аналитику проекта");
                setAnalyticsModalOpen(false);
            }
        } catch (e) {
            console.error(e);
            toast.error("Ошибка при запросе к AI сервису");
            setAnalyticsModalOpen(false);
        } finally {
            setIsAnalyticsLoading(false);
        }
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-foreground">Управление проектами</h1>
                <Button className="bg-blue-600 text-white"><Plus className="w-4 h-4 mr-2"/> Создать проект</Button>
            </div>
            
            {isLoading ? (
                <div className="flex justify-center p-12"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>
            ) : projects.map((proj: Project) => (
                <div key={proj.id} className="border rounded-xl bg-card shadow-sm overflow-hidden mb-6 hover:border-blue-500/30 transition-colors">
                    <div className="p-5 flex items-center justify-between border-b bg-muted/10">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded bg-blue-600/20 text-blue-600 flex items-center justify-center font-bold text-lg uppercase shadow-sm">
                                {proj.name?.charAt(0) || "P"}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{proj.name}</h3>
                                <div className="flex gap-3 text-xs text-muted-foreground mt-0.5">
                                    <span>ID: {proj.id}</span>
                                    {proj.created_at && <span>Создан: {new Date(proj.created_at).toLocaleDateString('ru-RU')}</span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-purple-200 text-purple-600 hover:bg-purple-50" 
                                onClick={() => handleOpenAnalytics(proj)}
                            >
                                <BrainCircuit className="w-4 h-4 mr-2"/> Аналитика AI
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4"/></Button>
                        </div>
                    </div>

                    <div className="p-5">
                        <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider text-[10px]">Команда проекта:</h4>
                        {(!proj.members || proj.members.length === 0) ? (
                            <p className="text-sm text-muted-foreground italic">Участники не назначены.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {proj.members.map((member: ProjectMember) => (
                                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg bg-background hover:border-blue-500/30 transition-all">
                                        <div>
                                            <div className="font-medium text-sm text-foreground">{member.name}</div>
                                            <div className="text-xs text-muted-foreground">@{member.login}</div>
                                        </div>
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 text-[10px] uppercase font-bold">
                                            {member.role?.name || "Member"}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {/* --- МОДАЛКА АНАЛИТИКИ --- */}
            <Dialog open={analyticsModalOpen} onOpenChange={setAnalyticsModalOpen}>
                <DialogContent className="!max-w-[1200px] w-[90vw] h-[90vh] flex flex-col p-0 overflow-hidden [&>button]:hidden">
                    <div className="p-6 border-b flex justify-between items-center bg-background shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg"><BrainCircuit className="w-6 h-6 text-purple-600" /></div>
                            <div>
                                <h2 className="text-xl font-bold">Аналитический отчет AI</h2>
                                <p className="text-sm text-muted-foreground">Проект: {selectedProject?.name}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setAnalyticsModalOpen(false)}><X className="w-5 h-5"/></Button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-8 bg-muted/5">
                        {isAnalyticsLoading ? (
                            <div className="flex flex-col items-center justify-center h-full gap-4 mt-20">
                                <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
                                <p className="text-muted-foreground font-medium animate-pulse">Искусственный интеллект анализирует задачи проекта...</p>
                            </div>
                        ) : (
                            <AiAnalyticsDashboard data={analyticsData} />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}