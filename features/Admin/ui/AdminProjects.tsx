"use client";

import { AiAnalyticsDashboard } from "@/features/Analytics/AiAnalyticsDashboard";
import { Project, Role, User } from "@/shared/lib/data";
import { MOCK_ANALYTICS_DATA } from "@/shared/lib/mock-analytics";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { ConfirmModal } from "@/shared/ui/confirm-modal";
import { Dialog, DialogContent } from "@/shared/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select";
import { BrainCircuit, Loader2, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "@/shared/ui/confirm-modal";
import { Project, Role, User } from "@/shared/lib/data";
import { Badge } from "@/shared/ui/badge";
import { AiAnalyticsDashboard } from "@/features/Analytics/AiAnalyticsDashboard";
import { MOCK_ANALYTICS_DATA } from "@/shared/lib/mock-analytics";
import { myFetch } from "@/shared/lib/myFetch";

export function AdminProjects({ projects, setProjects, users, roles }: any) {
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(
        null,
    );
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedRole, setSelectedRole] = useState("");

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [projToDelete, setProjToDelete] = useState<string | null>(null);

    // Состояния для AI Аналитики
    const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false);

    // Функция получения аналитики
    const handleOpenAnalytics = async (project: Project) => {
        setSelectedProject(project);
        setAnalyticsModalOpen(true);
        setIsAnalyticsLoading(true);

        try {
            // Имитация запроса: GET /projects/{id}/analytics
            // const res = await myFetch(`/projects/${project.id}/analytics`);
            // if (res?.ok) setAnalyticsData(res.body);

            // Пока используем мок, но подставляем нужный ID
            setTimeout(() => {
                setAnalyticsData({
                    ...MOCK_ANALYTICS_DATA,
                    projectId: project.id,
                });
                setIsAnalyticsLoading(false);
            }, 800);
        } catch (e) {
            console.error(e);
            setIsAnalyticsLoading(false);
        }
    };

    const handleAssignUser = () => {
        if (!selectedProject || !selectedUser || !selectedRole) return;
        setProjects((prev: Project[]) =>
            prev.map((p: Project) => {
                if (p.id !== selectedProject.id) return p;
                const newAssignment = {
                    userId: selectedUser,
                    roleId: selectedRole,
                };
                const filtered = (p.assignments || []).filter(
                    (a) => a.userId !== selectedUser,
                );
                return { ...p, assignments: [...filtered, newAssignment] };
            }),
        );
        setAssignModalOpen(false);
    };

    const handleRemoveAssignment = (projId: string, userId: string) => {
        setProjects((prev: Project[]) =>
            prev.map((p) =>
                p.id === projId
                    ? {
                          ...p,
                          assignments: p.assignments?.filter(
                              (a) => a.userId !== userId,
                          ),
                      }
                    : p,
            ),
        );
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-foreground mb-6">
                Управление проектами
            </h1>
            {projects.map((proj: Project) => (
                <div
                    key={proj.id}
                    className="border rounded-xl bg-card shadow-sm overflow-hidden mb-6"
                >
                    <div className="p-5 flex items-center justify-between border-b bg-muted/10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-blue-600/20 text-blue-600 flex items-center justify-center font-bold">
                                {proj.name.charAt(0)}
                            </div>
                            <h3 className="font-semibold text-lg">
                                {proj.name}
                            </h3>
                        </div>
                        <div className="flex gap-2">
                            {/* КНОПКА AI АНАЛИТИКИ */}
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-purple-200 text-purple-600 hover:bg-purple-50"
                                onClick={() => handleOpenAnalytics(proj)}
                            >
                                <BrainCircuit className="w-4 h-4 mr-2" /> AI
                                Аналитика
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSelectedProject(proj);
                                    setAssignModalOpen(true);
                                }}
                            >
                                <Plus className="w-4 h-4 mr-2" /> Добавить
                                участника
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setProjToDelete(proj.id);
                                    setDeleteModalOpen(true);
                                }}
                                className="text-red-500 hover:bg-red-50"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="p-5">
                        <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider text-[10px]">
                            Команда проекта:
                        </h4>
                        {!proj.assignments || proj.assignments.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic">
                                Участники не назначены.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {proj.assignments.map((assign) => {
                                    const u = users.find(
                                        (x: User) =>
                                            x.id === String(assign.userId),
                                    );
                                    const r = roles.find(
                                        (x: Role) => x.id === assign.roleId,
                                    );
                                    if (!u || !r) return null;
                                    return (
                                        <div
                                            key={u.id}
                                            className="flex items-center justify-between p-3 border rounded-lg bg-background hover:border-blue-500/30 transition-all"
                                        >
                                            <div>
                                                <div className="font-medium text-sm text-foreground">
                                                    {u.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    @{u.login}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge
                                                    variant="outline"
                                                    className="bg-blue-50 text-blue-700 border-blue-100 text-[10px] uppercase font-bold"
                                                >
                                                    {r.name}
                                                </Badge>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="w-7 h-7 text-red-400 hover:text-red-500"
                                                    onClick={() =>
                                                        handleRemoveAssignment(
                                                            proj.id,
                                                            u.id,
                                                        )
                                                    }
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {/* --- МОДАЛКА AI АНАЛИТИКИ (ШИРОКАЯ) --- */}
            <Dialog
                open={analyticsModalOpen}
                onOpenChange={(open) => {
                    if (!open) setAnalyticsModalOpen(false);
                }}
            >
                <DialogContent className="!max-w-[1200px] w-[90vw] h-[90vh] flex flex-col p-0 overflow-hidden [&>button]:hidden">
                    <div className="p-6 border-b flex justify-between items-center bg-background shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <BrainCircuit className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-foreground">
                                    Аналитический отчет AI
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Проект: {selectedProject?.name}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setAnalyticsModalOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 bg-muted/5">
                        {isAnalyticsLoading ? (
                            <div className="h-full flex flex-col items-center justify-center gap-4">
                                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
                                <p className="text-muted-foreground font-medium animate-pulse">
                                    Анализируем данные проекта и генерируем
                                    отчет...
                                </p>
                            </div>
                        ) : (
                            <AiAnalyticsDashboard data={analyticsData} />
                        )}
                    </div>

                    <div className="p-4 border-t bg-background flex justify-end shrink-0">
                        <Button
                            onClick={() => setAnalyticsModalOpen(false)}
                            className="bg-blue-600 text-white"
                        >
                            Понятно
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Модалка назначения участника */}
            <Dialog
                open={assignModalOpen}
                onOpenChange={(open) => {
                    if (!open) setAssignModalOpen(false);
                }}
            >
                <DialogContent className="!max-w-[500px] w-full p-0 overflow-hidden [&>button]:hidden">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-foreground">
                                Добавить участника
                            </h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setAssignModalOpen(false)}
                                className="text-muted-foreground"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                        <div className="space-y-5">
                            <div>
                                <label className="text-sm font-semibold mb-2 block">
                                    Пользователь системы
                                </label>
                                <Select onValueChange={setSelectedUser}>
                                    <SelectTrigger className="w-full h-11">
                                        <SelectValue placeholder="Выберите из списка..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((u: User) => (
                                            <SelectItem key={u.id} value={u.id}>
                                                {u.name} (@{u.login})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold mb-2 block">
                                    Роль в этом проекте
                                </label>
                                <Select onValueChange={setSelectedRole}>
                                    <SelectTrigger className="w-full h-11">
                                        <SelectValue placeholder="Выберите права доступа..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((r: Role) => (
                                            <SelectItem key={r.id} value={r.id}>
                                                {r.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                                <Button
                                    variant="ghost"
                                    onClick={() => setAssignModalOpen(false)}
                                >
                                    Отмена
                                </Button>
                                <Button
                                    onClick={handleAssignUser}
                                    className="bg-blue-600 text-white hover:bg-blue-700 px-8"
                                >
                                    Назначить
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() =>
                    setProjects(
                        projects.filter((p: any) => p.id !== projToDelete),
                    )
                }
                title="Удаление проекта"
                description="Все данные проекта будут стерты навсегда."
            />
        </div>
    );
}
