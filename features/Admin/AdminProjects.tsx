"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Users, Trash2, X } from "lucide-react";
import { ConfirmModal } from "@/shared/ui/confirm-modal";

export function AdminProjects({ projects, setProjects, users, roles }: any) {
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [selectedUser, setSelectedUser] = useState(users[0]?.id || "");
    const [selectedRole, setSelectedRole] = useState(roles[0]?.id || "");

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [projToDelete, setProjToDelete] = useState<string | null>(null);

    const handleAssignUser = () => {
        if(!selectedProject || !selectedUser || !selectedRole) return;
        setProjects((prev: any) => prev.map((p: any) => {
            if (p.id !== selectedProject.id) return p;
            const newAssignment = { userId: selectedUser, roleId: selectedRole };
            const filtered = (p.assignments || []).filter((a: any) => a.userId !== selectedUser);
            return { ...p, assignments: [...filtered, newAssignment] };
        }));
        setAssignModalOpen(false);
    };

    const handleRemoveAssignment = (projId: string, userId: string) => {
        setProjects((prev: any) => prev.map((p: any) => p.id === projId ? { ...p, assignments: p.assignments?.filter((a: any) => a.userId !== userId) } : p));
    };

    const handleDeleteProject = () => {
        if (!projToDelete) return;
        setProjects(projects.filter((p: any) => p.id !== projToDelete));
        setProjToDelete(null);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-foreground mb-6">Управление проектами</h1>
            {projects.map((proj: any) => (
                <div key={proj.id} className="border rounded-xl bg-card shadow-sm overflow-hidden">
                    <div className="p-5 flex items-center justify-between border-b bg-muted/10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-blue-600/20 text-blue-600 flex items-center justify-center font-bold">{proj.name.charAt(0)}</div>
                            <h3 className="font-semibold text-lg">{proj.name}</h3>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => { setSelectedProject(proj); setAssignModalOpen(true); }}>
                                <Users className="w-4 h-4 mr-2"/> Назначить
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => { setProjToDelete(proj.id); setDeleteModalOpen(true); }} className="text-red-500 hover:bg-red-500/10">
                                <Trash2 className="w-4 h-4"/>
                            </Button>
                        </div>
                    </div>
                    <div className="p-5">
                        <h4 className="text-sm font-semibold text-muted-foreground mb-3">Команда проекта:</h4>
                        {(!proj.assignments || proj.assignments.length === 0) ? (
                            <p className="text-sm text-muted-foreground">В этом проекте пока нет участников.</p>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                {proj.assignments.map((assign: any) => {
                                    const u = users.find((x: any) => x.id === assign.userId);
                                    const r = roles.find((x: any) => x.id === assign.roleId);
                                    if(!u || !r) return null;
                                    return (
                                        <div key={u.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors bg-background">
                                            <div>
                                                <div className="font-medium text-sm text-foreground">{u.name}</div>
                                                <div className="text-xs text-muted-foreground">@{u.login}</div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[10px] px-2 py-1 rounded font-bold border ${r.color}`}>{r.name}</span>
                                                <Button variant="ghost" size="icon" className="w-6 h-6 text-red-400 hover:text-red-500" onClick={() => handleRemoveAssignment(proj.id, u.id)}>
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

            <Dialog open={assignModalOpen} onOpenChange={(open) => { if(!open) return; }}>
                <DialogContent className="!max-w-[500px] w-full p-0 overflow-hidden [&>button]:hidden">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-foreground">Добавить в {selectedProject?.name}</h2>
                            <Button variant="ghost" size="icon" onClick={() => setAssignModalOpen(false)} className="text-muted-foreground"><X className="w-5 h-5"/></Button>
                        </div>
                        <div className="space-y-5">
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Пользователь</label>
                                <Select value={selectedUser} onValueChange={setSelectedUser}>
                                    <SelectTrigger className="w-full bg-muted/30 focus:ring-blue-500"><SelectValue placeholder="Выберите пользователя" /></SelectTrigger>
                                    <SelectContent>
                                        {users.map((u: any) => <SelectItem key={u.id} value={u.id}>{u.name} (@{u.login})</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Роль в проекте</label>
                                <Select value={selectedRole} onValueChange={setSelectedRole}>
                                    <SelectTrigger className="w-full bg-muted/30 focus:ring-blue-500"><SelectValue placeholder="Выберите роль" /></SelectTrigger>
                                    <SelectContent>
                                        {roles.map((r: any) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button variant="ghost" onClick={() => setAssignModalOpen(false)}>Отмена</Button>
                                <Button onClick={handleAssignUser} className="bg-blue-600 text-white hover:bg-blue-700">Назначить</Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <ConfirmModal 
                isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleDeleteProject}
                title="Удаление проекта" description="Вы уверены? Будут удалены все доски, задачи и настройки доступов этого проекта." 
            />
        </div>
    );
}