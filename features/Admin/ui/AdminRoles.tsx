"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { Plus, Trash2, X, Shield, Loader2 } from "lucide-react";
import { useAppDispatch } from "@/shared/hooks/reduxHooks";
import { fetchCreateRole, fetchUpdateRole, fetchDeleteRole } from "../slice";
import { Role } from "@/shared/lib/data";

const PERMISSIONS = [
    "can_create_task", "can_update_task", "can_delete_task", "can_manage_members",
    "can_manage_pipelines", "can_update_project", "can_delete_project", 
    "can_manage_tags", "can_manage_automation", "can_view_analytics", "can_assign_task"
];

export function AdminRoles({ roles, isLoading }: { roles: Role[], isLoading: boolean }) {
    const dispatch = useAppDispatch();
    const [roleModalOpen, setRoleModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [formData, setFormData] = useState<any>({ name: "" });

    const openEdit = (role: Role) => {
        setEditingRole(role);
        setFormData({ ...role });
        setRoleModalOpen(true);
    };

    const openCreate = () => {
        setEditingRole(null);
        const initial: any = { name: "" };
        PERMISSIONS.forEach(p => initial[p] = false);
        setFormData(initial);
        setRoleModalOpen(true);
    };

    const handleSave = () => {
        if (editingRole) {
            dispatch(fetchUpdateRole({ id: editingRole.id, data: formData }));
        } else {
            dispatch(fetchCreateRole(formData));
        }
        setRoleModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-foreground">Роли системы</h1>
                <Button className="bg-blue-600 text-white" onClick={openCreate}>
                    <Plus className="w-4 h-4 mr-2"/> Создать роль
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-blue-600"/></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roles.map((role: Role) => (
                        <div 
                            key={role.id} 
                            onClick={() => openEdit(role)} 
                            className="border rounded-xl bg-card p-6 shadow-sm relative group cursor-pointer hover:border-blue-500/50 transition-all"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <Shield className="w-5 h-5 text-blue-600" />
                                <span className="font-bold text-lg">{role.name}</span>
                            </div>
                            <Button 
                                variant="ghost" size="icon" 
                                className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100" 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    if(confirm("Удалить роль?")) dispatch(fetchDeleteRole(role.id)); 
                                }}
                            >
                                <Trash2 className="w-4 h-4"/>
                            </Button>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {PERMISSIONS.filter(p => (role as any)[p]).slice(0, 3).map(p => (
                                    <span key={p} className="text-[9px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground uppercase font-bold">
                                        {p.replace('can_', '').replace('_', ' ')}
                                    </span>
                                ))}
                                {PERMISSIONS.filter(p => (role as any)[p]).length > 3 && (
                                    <span className="text-[9px] text-muted-foreground font-bold">...</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Модалка та же, что была в прошлом ответе */}
            <Dialog open={roleModalOpen} onOpenChange={setRoleModalOpen}>
                 <DialogContent className="!max-w-[700px] w-full p-0 overflow-hidden [&>button]:hidden">
                    <div className="p-6 border-b flex justify-between items-center bg-background">
                        <h2 className="text-xl font-bold">{editingRole ? "Редактирование роли" : "Новая роль"}</h2>
                        <Button variant="ghost" size="icon" onClick={() => setRoleModalOpen(false)}><X className="w-5 h-5"/></Button>
                    </div>
                    <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground">Название роли</label>
                            <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Напр. developer" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {PERMISSIONS.map(p => (
                                <label key={p} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={formData[p]} 
                                        onChange={e => setFormData({...formData, [p]: e.target.checked})} 
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500" 
                                    />
                                    <span className="text-xs font-medium text-foreground uppercase tracking-tight">{p.replace(/_/g, ' ')}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="p-6 border-t flex justify-end gap-3 bg-muted/10">
                        <Button variant="ghost" onClick={() => setRoleModalOpen(false)}>Отмена</Button>
                        <Button onClick={handleSave} className="bg-blue-600 text-white px-8">Сохранить</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}