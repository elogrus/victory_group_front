"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { Search, Plus, Trash2, Edit2, ShieldAlert, X } from "lucide-react";
import { ConfirmModal } from "@/shared/ui/confirm-modal";

export function AdminUsers({ users, setUsers, setProjects }: any) {
    const [searchQuery, setSearchQuery] = useState("");
    
    // Модалка формы (Создание / Редактирование)
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ id: "", login: "", name: "", password: "", isSuper: false });

    // Модалка удаления
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    const filteredUsers = users.filter((u: any) => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.login.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openCreate = () => {
        setEditingUserId(null);
        setFormData({ id: "", login: "", name: "", password: "", isSuper: false });
        setUserModalOpen(true);
    };

    const openEdit = (user: any) => {
        setEditingUserId(user.id);
        setFormData({ id: user.id, login: user.login, name: user.name, password: "", isSuper: user.is_super_user });
        setUserModalOpen(true);
    };

    const handleSaveUser = () => {
        if (!formData.id || !formData.login || !formData.name) return;

        if (editingUserId) {
            // Обновление
            setUsers(users.map((u: any) => u.id === editingUserId ? { ...u, id: formData.id, login: formData.login, name: formData.name, is_super_user: formData.isSuper } : u));
        } else {
            // Создание
            setUsers([...users, { id: formData.id, login: formData.login, name: formData.name, password: formData.password, is_super_user: formData.isSuper }]);
        }
        setUserModalOpen(false);
    };

    const handleDeleteUser = () => {
        if (!userToDelete) return;
        setUsers(users.filter((u: any) => u.id !== userToDelete));
        setProjects((prev: any) => prev.map((p: any) => ({ ...p, assignments: p.assignments?.filter((a: any) => a.userId !== userToDelete) })));
        setUserToDelete(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-foreground">Пользователи</h1>
                <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={openCreate}>
                    <Plus className="w-4 h-4 mr-2"/> Добавить
                </Button>
            </div>

            <div className="relative w-full max-w-md mb-6">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Поиск по имени или логину..." 
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9 bg-muted/30 focus:bg-background"
                />
            </div>

            <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Пользователь (Имя / Логин)</th>
                            <th className="px-6 py-4">Роль системы</th>
                            <th className="px-6 py-4 text-right">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {filteredUsers.map((user: any) => (
                            <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                                <td className="px-6 py-4 text-muted-foreground font-mono">{user.id}</td>
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-foreground">{user.name}</div>
                                    <div className="text-xs text-muted-foreground">@{user.login}</div>
                                </td>
                                <td className="px-6 py-4">
                                    {user.is_super_user ? (
                                        <span className="flex items-center gap-1 text-purple-600 bg-purple-100 w-fit px-2 py-1 rounded text-xs font-bold"><ShieldAlert className="w-3 h-3"/> Админ</span>
                                    ) : (
                                        <span className="text-muted-foreground">Пользователь</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button variant="ghost" size="icon" onClick={() => openEdit(user)} className="text-blue-500 hover:bg-blue-500/10 mr-1">
                                        <Edit2 className="w-4 h-4"/>
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-500/10" onClick={() => { setUserToDelete(user.id); setDeleteModalOpen(true); }}>
                                        <Trash2 className="w-4 h-4"/>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Форма Создания/Редактирования */}
            <Dialog open={userModalOpen} onOpenChange={(open) => { if(!open) return; }}>
                <DialogContent className="!max-w-[500px] w-full p-0 overflow-hidden [&>button]:hidden">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-foreground">{editingUserId ? "Редактировать" : "Новый пользователь"}</h2>
                            <Button variant="ghost" size="icon" onClick={() => setUserModalOpen(false)} className="text-muted-foreground"><X className="w-5 h-5"/></Button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold mb-2 block">User ID (Number)</label>
                                    <Input value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} placeholder="Напр. 123" />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold mb-2 block">Login</label>
                                    <Input value={formData.login} onChange={e => setFormData({...formData, login: e.target.value.toLowerCase()})} placeholder="username" />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Имя и Фамилия</label>
                                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Иван Иванов" />
                            </div>
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Пароль {editingUserId && <span className="text-xs font-normal text-muted-foreground">(оставьте пустым, чтобы не менять)</span>}</label>
                                <Input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="********" />
                            </div>
                            <label className="flex items-center gap-2 text-sm mt-4 cursor-pointer text-foreground">
                                <input type="checkbox" checked={formData.isSuper} onChange={e => setFormData({...formData, isSuper: e.target.checked})} className="rounded" />
                                Является администратором (Super User)
                            </label>
                            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                                <Button variant="ghost" onClick={() => setUserModalOpen(false)}>Отмена</Button>
                                <Button onClick={handleSaveUser} className="bg-blue-600 text-white hover:bg-blue-700">Сохранить</Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <ConfirmModal 
                isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleDeleteUser}
                title="Удаление пользователя" description="Вы уверены? Этот пользователь будет удален из всех проектов системы."
            />
        </div>
    );
}