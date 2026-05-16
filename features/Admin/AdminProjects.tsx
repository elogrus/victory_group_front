"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Users, Trash2, X, Plus } from "lucide-react";
import { ConfirmModal } from "@/shared/ui/confirm-modal";
import { Project, Role, User } from "@/shared/lib/data";
import { Badge } from "@/shared/ui/badge";

export function AdminProjects({ projects, setProjects, users, roles }: any) {
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedRole, setSelectedRole] = useState("");

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [projToDelete, setProjToDelete] = useState<string | null>(null);

    const handleAssignUser = () => {
        if(!selectedProject || !selectedUser || !selectedRole) return;
        setProjects((prev: Project[]) => prev.map((p: Project) => {
            if (p.id !== selectedProject.id) return p;
            const newAssignment = { userId: selectedUser, roleId: selectedRole };
            const filtered = (p.assignments || []).filter(a => a.userId !== selectedUser);
            return { ...p, assignments: [...filtered, newAssignment] };
        }));
        setAssignModalOpen(false);
    };

    const handleRemoveAssignment = (projId: string, userId: string) => {
        setProjects((prev: Project[]) => prev.map(p => p.id === projId ? {
            ...p, assignments: p.assignments?.filter(a => a.userId !== userId)
        } : p));
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-foreground mb-6">Управление проектами</h1>
            {projects.map((proj: Project) => (
                <div key={proj.id} className="border rounded-xl bg-card shadow-sm overflow-hidden mb-6">
                    <div className="p-5 flex items-center justify-between border-b bg-muted/10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-blue-600/20 text-blue-600 flex items-center justify-center font-bold">{proj.name.charAt(0)}</div>
                            <h3 className="font-semibold text-lg">{proj.name}</h3>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => { setSelectedProject(proj); setAssignModalOpen(true); }}>
                                <Plus className="w-4 h-4 mr-2"/> Добавить участника
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => { setProjToDelete(proj.id); setDeleteModalOpen(true); }} className="text-red-500 hover:bg-red-50">
                                <Trash2 className="w-4 h-4"/>
                            </Button>
                        </div>
                    </div>
                    <div className="p-5">
                        <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider text-[10px]">Команда проекта:</h4>
                        {(!proj.assignments || proj.assignments.length === 0) ? (
                            <p className="text-sm text-muted-foreground italic">Участники не назначены.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {proj.assignments.map(assign => {
                                    const u = users.find((x: User) => x.id === assign.userId);
                                    const r = roles.find((x: Role) => x.id === assign.roleId);
                                    if(!u || !r) return null;
                                    return (
                                        <div key={u.id} className="flex items-center justify-between p-3 border rounded-lg bg-background hover:border-blue-500/30 transition-all">
                                            <div>
                                                <div className="font-medium text-sm text-foreground">{u.name}</div>
                                                <div className="text-xs text-muted-foreground">@{u.login}</div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 text-[10px] uppercase">{r.name}</Badge>
                                                <Button variant="ghost" size="icon" className="w-7 h-7 text-red-400 hover:text-red-500" onClick={() => handleRemoveAssignment(proj.id, u.id)}>
                                                    <X className="w-4 h-4"/>
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {/* Модалка назначения участника */}
            <Dialog open={assignModalOpen} onOpenChange={(open) => { if(!open) return; }}>
                <DialogContent className="!max-w-[500px] w-full p-0 overflow-hidden [&>button]:hidden">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-foreground">Добавить участника</h2>
                            <Button variant="ghost" size="icon" onClick={() => setAssignModalOpen(false)} className="text-muted-foreground"><X className="w-5 h-5"/></Button>
                        </div>
                        <div className="space-y-5">
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Пользователь системы</label>
                                <Select onValueChange={setSelectedUser}>
                                    <SelectTrigger className="w-full h-11"><SelectValue placeholder="Выберите из списка..." /></SelectTrigger>
                                    <SelectContent>
                                        {users.map((u: User) => <SelectItem key={u.id} value={u.id}>{u.name} (@{u.login})</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Роль в этом проекте</label>
                                <Select onValueChange={setSelectedRole}>
                                    <SelectTrigger className="w-full h-11"><SelectValue placeholder="Выберите права доступа..." /></SelectTrigger>
                                    <SelectContent>
                                        {roles.map((r: Role) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                                <Button variant="ghost" onClick={() => setAssignModalOpen(false)}>Отмена</Button>
                                <Button onClick={handleAssignUser} className="bg-blue-600 text-white hover:bg-blue-700 px-8">Назначить</Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <ConfirmModal 
                isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} 
                onConfirm={() => setProjects(projects.filter((p:Project)=>p.id !== projToDelete))}
                title="Удаление проекта" description="Все данные проекта будут стерты навсегда." 
            />
        </div>
    );
}