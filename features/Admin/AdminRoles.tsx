"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { Plus, Trash2, X, Shield, CheckCircle2 } from "lucide-react";
import { ConfirmModal } from "@/shared/ui/confirm-modal";
import { Role } from "@/shared/lib/data";

export function AdminRoles({ roles, setRoles }: any) {
    const [roleModalOpen, setRoleModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    
    // Дефолтное состояние разрешений
    const initialPermissions = {
        can_create_task: false, can_update_task: false, can_delete_task: false,
        can_manage_members: false, can_manage_pipelines: false, can_update_project: false,
        can_delete_project: false, can_manage_tags: false, can_manage_automation: false,
        can_view_analytics: false, can_assign_task: false
    };

    const [formData, setFormData] = useState({ name: "", ...initialPermissions });
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

    const openCreate = () => {
        setEditingRole(null);
        setFormData({ name: "", ...initialPermissions });
        setRoleModalOpen(true);
    };

    const openEdit = (role: Role) => {
        setEditingRole(role);
        setFormData({ ...role });
        setRoleModalOpen(true);
    };

    const handleSaveRole = () => {
        if (!formData.name) return;

        if (editingRole) {
            setRoles(roles.map((r: Role) => r.id === editingRole.id ? { ...formData, id: r.id } : r));
        } else {
            const newRole: Role = { ...formData, id: `role-${Date.now()}` };
            setRoles([...roles, newRole]);
        }
        setRoleModalOpen(false);
    };

    const handleDeleteRole = () => {
        if (!roleToDelete) return;
        setRoles(roles.filter((r: Role) => r.id !== roleToDelete));
        setRoleToDelete(null);
    };

    const permissionLabels: Record<string, string> = {
        can_create_task: "Создание задач",
        can_update_task: "Редактирование задач",
        can_delete_task: "Удаление задач",
        can_assign_task: "Назначение исполнителей",
        can_manage_members: "Управление участниками",
        can_manage_pipelines: "Управление досками/этапами",
        can_update_project: "Редактирование проекта",
        can_delete_project: "Удаление проекта",
        can_manage_tags: "Управление тегами",
        can_manage_automation: "Настройка автоматизации",
        can_view_analytics: "Просмотр аналитики"
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-foreground">Роли проекта</h1>
                <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={openCreate}>
                    <Plus className="w-4 h-4 mr-2"/> Создать роль
                </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((role: Role) => (
                    <div 
                        key={role.id} 
                        className="border rounded-xl bg-card p-6 shadow-sm flex flex-col gap-4 relative group hover:border-blue-500/50 transition-all cursor-pointer"
                        onClick={() => openEdit(role)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                <Shield className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="font-bold text-lg text-foreground capitalize">{role.name}</div>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                            {Object.entries(role).map(([key, value]) => (
                                value === true && permissionLabels[key] && (
                                    <span key={key} className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground border border-border/50">
                                        {permissionLabels[key]}
                                    </span>
                                )
                            ))}
                        </div>

                        <button 
                            onClick={(e) => { e.stopPropagation(); setRoleToDelete(role.id); setDeleteModalOpen(true); }}
                            className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-4 h-4"/>
                        </button>
                    </div>
                ))}
            </div>

            {/* Модалка Создания/Редактирования */}
            <Dialog open={roleModalOpen} onOpenChange={(open) => { if(!open) return; }}>
                <DialogContent 
                    className="!max-w-[700px] w-full p-0 overflow-hidden [&>button]:hidden">
                    <div className="flex flex-col h-[85vh]">
                        <div className="p-6 border-b flex justify-between items-center bg-background shrink-0">
                            <h2 className="text-xl font-bold text-foreground">
                                {editingRole ? `Настройка роли: ${editingRole.name}` : "Создание новой роли"}
                            </h2>
                            <Button variant="ghost" size="icon" onClick={() => setRoleModalOpen(false)}><X className="w-5 h-5"/></Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            <div>
                                <label className="text-sm font-bold text-foreground mb-2 block">Название роли (Slug)</label>
                                <Input 
                                    value={formData.name} 
                                    onChange={e => setFormData({...formData, name: e.target.value.toLowerCase()})} 
                                    placeholder="Напр. manager"
                                    className="bg-muted/30 focus:bg-background h-12 text-lg font-medium"
                                />
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Разрешения (Permissions)</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                    {Object.keys(initialPermissions).map((permKey) => (
                                        <label 
                                            key={permKey} 
                                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors border border-transparent hover:border-border"
                                        >
                                            <div className="relative flex items-center h-5 mt-0.5">
                                                <input 
                                                    type="checkbox" 
                                                    checked={(formData as any)[permKey]}
                                                    onChange={e => setFormData({...formData, [permKey]: e.target.checked})}
                                                    className="w-5 h-5 rounded border-border text-blue-600 focus:ring-blue-500 cursor-pointer shadow-sm" 
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-foreground">
                                                    {permissionLabels[permKey]}
                                                </span>
                                                <span className="text-[11px] text-muted-foreground uppercase font-mono">
                                                    {permKey}
                                                </span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t flex justify-end gap-3 bg-muted/10 shrink-0">
                            <Button variant="ghost" onClick={() => setRoleModalOpen(false)}>Отмена</Button>
                            <Button onClick={handleSaveRole} className="bg-blue-600 text-white hover:bg-blue-700 px-8">
                                {editingRole ? "Сохранить изменения" : "Создать роль"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <ConfirmModal 
                isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleDeleteRole}
                title="Удаление роли" description="Внимание! Эта роль будет безвозвратно удалена из системы." 
            />
        </div>
    );
}