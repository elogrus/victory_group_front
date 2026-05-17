"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { Search, Plus, Trash2, ShieldAlert, X, UserCheck, UserMinus, Loader2 } from "lucide-react";
import { ConfirmModal } from "@/shared/ui/confirm-modal";
import { User } from "@/shared/lib/data";
import { Badge } from "@/shared/ui/badge";
import { useAppDispatch } from "@/shared/hooks/reduxHooks";
import { fetchSetActivation, fetchSetSuperuser, fetchRegisterUser } from "../slice";

export function AdminUsers({ users, isLoading }: { users: User[], isLoading: boolean }) {
    const dispatch = useAppDispatch();
    const [searchQuery, setSearchQuery] = useState("");
    
    // Модалка создания
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [formData, setFormData] = useState({ login: "", name: "", password: "" });

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);

    // Фильтрация с защитой от undefined
    const filteredUsers = (users || []).filter((u: User) => 
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.login?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleRegister = async () => {
        if (!formData.login || !formData.name || !formData.password) return;
        await dispatch(fetchRegisterUser(formData));
        setUserModalOpen(false);
        setFormData({ login: "", name: "", password: "" });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-foreground">Глобальные пользователи</h1>
                <Button className="bg-blue-600 text-white" onClick={() => setUserModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2"/> Создать пользователя
                </Button>
            </div>

            <div className="relative w-full max-w-md mb-6">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Поиск по логину или имени..." 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9 bg-muted/30 focus:bg-background h-10"
                />
            </div>

            <div className="border rounded-xl bg-card shadow-sm overflow-hidden relative min-h-[300px]">
                {isLoading && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-20">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                )}
                
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium border-b text-[11px] uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 w-16">ID</th>
                            <th className="px-6 py-4">Имя / Логин</th>
                            <th className="px-6 py-4">Статус</th>
                            <th className="px-6 py-4">Права</th>
                            <th className="px-6 py-4 text-right">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {filteredUsers.length === 0 && !isLoading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground italic">
                                    Пользователи не найдены
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user: User) => (
                                <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                                    <td className="px-6 py-4 font-mono text-muted-foreground text-xs">{user.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-foreground leading-none">{user.name}</div>
                                        <div className="text-[11px] text-muted-foreground mt-1.5">@{user.login}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.is_active ? (
                                            <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100 shadow-none text-[10px]">Активен</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-muted-foreground opacity-60 text-[10px]">Отключен</Badge>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.is_superuser ? (
                                            <Badge className="bg-purple-100 text-purple-700 border-purple-200 flex w-fit items-center gap-1 font-bold text-[10px] uppercase shadow-none">
                                                <ShieldAlert className="w-3 h-3"/> Superuser
                                            </Badge>
                                        ) : (
                                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter opacity-50">Regular User</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button 
                                                variant="ghost" size="icon" 
                                                title={user.is_active ? "Деактивировать" : "Активировать"}
                                                className={user.is_active ? "text-orange-500 hover:bg-orange-50" : "text-green-500 hover:bg-green-50"}
                                                onClick={() => dispatch(fetchSetActivation({ user_id: Number(user.id), activation: !user.is_active }))}
                                            >
                                                {user.is_active ? <UserMinus className="w-4 h-4"/> : <UserCheck className="w-4 h-4"/>}
                                            </Button>

                                            <Button 
                                                variant="ghost" size="icon" 
                                                title="Статус администратора"
                                                className={user.is_superuser ? "text-purple-600 hover:bg-purple-50" : "text-muted-foreground hover:bg-muted"}
                                                onClick={() => dispatch(fetchSetSuperuser({ user_id: Number(user.id), activation: !user.is_superuser }))}
                                            >
                                                <ShieldAlert className="w-4 h-4"/>
                                            </Button>

                                            <Button 
                                                variant="ghost" size="icon" 
                                                className="text-red-500 hover:bg-red-50"
                                                onClick={() => { setUserToDelete(Number(user.id)); setDeleteModalOpen(true); }}
                                            >
                                                <Trash2 className="w-4 h-4"/>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Модалка Регистрации (Создания) */}
            <Dialog open={userModalOpen} onOpenChange={setUserModalOpen}>
                <DialogContent className="!max-w-[450px] w-full p-6 [&>button]:hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Новый пользователь</h2>
                        <Button variant="ghost" size="icon" onClick={() => setUserModalOpen(false)}><X className="w-5 h-5"/></Button>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-muted-foreground uppercase">Логин</label>
                            <Input value={formData.login} onChange={e => setFormData({...formData, login: e.target.value})} placeholder="ivanov" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-muted-foreground uppercase">Имя</label>
                            <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Иван Иванов" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-muted-foreground uppercase">Пароль</label>
                            <Input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••••" />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="ghost" onClick={() => setUserModalOpen(false)}>Отмена</Button>
                            <Button onClick={handleRegister} className="bg-blue-600 text-white hover:bg-blue-700">Зарегистрировать</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <ConfirmModal 
                isOpen={deleteModalOpen} 
                onClose={() => setDeleteModalOpen(false)} 
                onConfirm={() => console.log("Delete logic here")} 
                title="Удаление" description="Пользователь будет удален из базы."
            />
        </div>
    );
}