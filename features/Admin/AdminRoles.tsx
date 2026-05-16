"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Plus, Trash2, X } from "lucide-react";
import { ConfirmModal } from "@/shared/ui/confirm-modal";

export function AdminRoles({ roles, setRoles }: any) {
    const [roleModalOpen, setRoleModalOpen] = useState(false);
    const [newRole, setNewRole] = useState({ name: "", color: "bg-gray-100 text-gray-700 border-gray-200" });
    
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

    const handleCreateRole = () => {
        if(!newRole.name) return;
        setRoles([...roles, { id: `role-${Date.now()}`, name: newRole.name, color: newRole.color }]);
        setNewRole({ name: "", color: "bg-gray-100 text-gray-700 border-gray-200" });
        setRoleModalOpen(false);
    };

    const handleDeleteRole = () => {
        if (!roleToDelete) return;
        setRoles(roles.filter((r: any) => r.id !== roleToDelete));
        setRoleToDelete(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-foreground">Роли и Права</h1>
                <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => setRoleModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2"/> Создать роль
                </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
                {roles.map((role: any) => (
                    <div key={role.id} className="border rounded-xl bg-card p-5 shadow-sm flex flex-col items-center justify-center gap-3 relative group transition-all hover:shadow-md">
                        <div className={`px-4 py-2 rounded-full font-bold border ${role.color}`}>{role.name}</div>
                        <p className="text-xs text-muted-foreground text-center">Доступно для назначения в проектах</p>
                        <button 
                            onClick={() => { setRoleToDelete(role.id); setDeleteModalOpen(true); }}
                            className="absolute top-2 right-2 p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-4 h-4"/>
                        </button>
                    </div>
                ))}
            </div>

            <Dialog open={roleModalOpen} onOpenChange={(open) => { if(!open) return; }}>
                <DialogContent className="!max-w-[400px] w-full p-0 overflow-hidden [&>button]:hidden">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-foreground">Новая роль</h2>
                            <Button variant="ghost" size="icon" onClick={() => setRoleModalOpen(false)} className="text-muted-foreground"><X className="w-5 h-5"/></Button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Название роли</label>
                                <Input value={newRole.name} onChange={e => setNewRole({...newRole, name: e.target.value})} placeholder="Напр. Developer" />
                            </div>
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Цвет бейджа</label>
                                <Select value={newRole.color} onValueChange={val => setNewRole({...newRole, color: val})}>
                                    <SelectTrigger className="w-full bg-muted/30 focus:ring-blue-500"><SelectValue placeholder="Выберите цвет" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bg-gray-100 text-gray-700 border-gray-200">Серый</SelectItem>
                                        <SelectItem value="bg-blue-100 text-blue-700 border-blue-200">Синий</SelectItem>
                                        <SelectItem value="bg-green-100 text-green-700 border-green-200">Зеленый</SelectItem>
                                        <SelectItem value="bg-red-100 text-red-700 border-red-200">Красный</SelectItem>
                                        <SelectItem value="bg-yellow-100 text-yellow-700 border-yellow-200">Желтый</SelectItem>
                                        <SelectItem value="bg-purple-100 text-purple-700 border-purple-200">Фиолетовый</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                                <Button variant="ghost" onClick={() => setRoleModalOpen(false)}>Отмена</Button>
                                <Button onClick={handleCreateRole} className="bg-blue-600 text-white hover:bg-blue-700">Сохранить</Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <ConfirmModal 
                isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleDeleteRole}
                title="Удаление роли" description="Внимание! Эта роль будет удалена, и пользователи с ней в проектах потеряют этот статус." 
            />
        </div>
    );
}