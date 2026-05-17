"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { Search, Plus, Trash2, Edit2, ShieldAlert, X, Power, PowerOff, UserCheck, UserMinus } from "lucide-react";
import { ConfirmModal } from "@/shared/ui/confirm-modal";
import { User } from "@/shared/lib/data";
import { Badge } from "@/shared/ui/badge";

export function AdminUsers({ users, setUsers }: any) {
    const [searchQuery, setSearchQuery] = useState("");
    
    // Модалка формы Создания
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [formData, setFormData] = useState({ login: "", name: "", password: "", is_superuser: false });

    // Модалка подтверждения удаления
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    const openCreate = () => {
        setFormData({ login: "", name: "", password: "", is_superuser: false });
        setUserModalOpen(true);
    };

    const handleCreateUser = () => {
        if (!formData.login || !formData.name || !formData.password) return;

        const newUser: User = { 
            id: Date.now().toString(),
            login: formData.login, 
            name: formData.name, 
            is_active: true,
            is_superuser: formData.is_superuser,
            tg_id: 0
        };
        setUsers([...users, newUser]);
        setUserModalOpen(false);
    };

    // --- Действия по API (имитация ручек) ---
    const toggleActive = (userId: string, currentStatus: boolean) => {
        setUsers(users.map((u: User) => u.id === userId ? { ...u, is_active: !currentStatus } : u));
    };

    const toggleSuperuser = (userId: string, currentStatus: boolean) => {
        setUsers(users.map((u: User) => u.id === userId ? { ...u, is_superuser: !currentStatus } : u));
    };

    const handleDeleteUser = () => {
        if (!userToDelete) return;
        setUsers(users.filter((u: User) => u.id !== userToDelete));
        setUserToDelete(null);
    };

    const filteredUsers = users.filter((u: User) => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.login.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-foreground">Глобальные пользователи</h1>
                <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={openCreate}>
                    <Plus className="w-4 h-4 mr-2"/> Создать пользователя
                </Button>
            </div>

            <div className="relative w-full max-w-md mb-6">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Поиск по логину или имени..." 
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9 bg-muted/30 focus:bg-background h-10"
                />
            </div>

            <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                        <tr>
                            <th className="px-6 py-4 w-16">ID</th>
                            <th className="px-6 py-4">Имя / Логин</th>
                            <th className="px-6 py-4">Статус</th>
                            <th className="px-6 py-4">Права</th>
                            <th className="px-6 py-4 text-right">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {filteredUsers.map((user: User) => (
                            <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                                <td className="px-6 py-4 font-mono text-muted-foreground">{user.id}</td>
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-foreground">{user.name}</div>
                                    <div className="text-xs text-muted-foreground">@{user.login}</div>
                                </td>
                                <td className="px-6 py-4">
                                    {user.is_active ? (
                                        <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">Активен</Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-muted-foreground">Деактивирован</Badge>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {user.is_superuser ? (
                                        <Badge className="bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100 flex w-fit items-center gap-1">
                                            <ShieldAlert className="w-3 h-3"/> Superuser
                                        </Badge>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">User</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-1">
                                        {/* Кнопка Активности */}
                                        <Button 
                                            variant="ghost" size="icon" 
                                            title={user.is_active ? "Деактивировать" : "Активировать"}
                                            className={user.is_active ? "text-orange-500 hover:bg-orange-50" : "text-green-500 hover:bg-green-50"}
                                            onClick={() => toggleActive(user.id, user.is_active)}
                                        >
                                            {user.is_active ? <UserMinus className="w-4 h-4"/> : <UserCheck className="w-4 h-4"/>}
                                        </Button>

                                        {/* Кнопка Суперюзера */}
                                        <Button 
                                            variant="ghost" size="icon" 
                                            title="Изменить статус администратора"
                                            className={user.is_superuser ? "text-purple-600 hover:bg-purple-50" : "text-muted-foreground hover:bg-muted"}
                                            onClick={() => toggleSuperuser(user.id, user.is_superuser)}
                                        >
                                            <ShieldAlert className="w-4 h-4"/>
                                        </Button>

                                        {/* Удаление */}
                                        <Button 
                                            variant="ghost" size="icon" 
                                            className="text-red-500 hover:bg-red-50"
                                            onClick={() => { setUserToDelete(user.id); setDeleteModalOpen(true); }}
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Модалка Создания */}
            <Dialog open={userModalOpen} onOpenChange={(open) => { if(!open) return; }}>
                <DialogContent className="!max-w-[500px] w-full p-0 overflow-hidden [&>button]:hidden">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-8 border-b pb-4">
                            <h2 className="text-xl font-bold text-foreground">Новый пользователь</h2>
                            <Button variant="ghost" size="icon" onClick={() => setUserModalOpen(false)} className="text-muted-foreground"><X className="w-5 h-5"/></Button>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase">Логин</label>
                                <Input 
                                    value={formData.login} 
                                    onChange={e => setFormData({...formData, login: e.target.value.toLowerCase()})} 
                                    placeholder="ivanov" className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase">Имя Фамилия</label>
                                <Input 
                                    value={formData.name} 
                                    onChange={e => setFormData({...formData, name: e.target.value})} 
                                    placeholder="Иван Иванов" className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase">Пароль</label>
                                <Input 
                                    type="password" 
                                    value={formData.password} 
                                    onChange={e => setFormData({...formData, password: e.target.value})} 
                                    placeholder="••••••••" className="h-11"
                                />
                            </div>

                            <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.is_superuser} 
                                        onChange={e => setFormData({...formData, is_superuser: e.target.checked})} 
                                        className="w-5 h-5 rounded border-border text-blue-600 focus:ring-blue-500" 
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-foreground group-hover:text-blue-600 transition-colors">Суперпользователь (Global Admin)</span>
                                        <span className="text-[11px] text-muted-foreground">Будет иметь доступ ко всем проектам и системным настройкам</span>
                                    </div>
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t">
                                <Button variant="ghost" onClick={() => setUserModalOpen(false)}>Отмена</Button>
                                <Button onClick={handleCreateUser} className="bg-blue-600 text-white hover:bg-blue-700 px-8 h-11">
                                    Создать аккаунт
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <ConfirmModal 
                isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleDeleteUser}
                title="Удаление аккаунта" 
                description="Пользователь будет полностью удален из базы данных."
            />
        </div>
    );
}