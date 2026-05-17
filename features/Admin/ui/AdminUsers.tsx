"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { Search, Plus, Trash2, ShieldAlert, X, UserCheck, UserMinus, Loader2 } from "lucide-react";
import { ConfirmModal } from "@/shared/ui/confirm-modal";
import { User } from "@/entity/User";
import { Badge } from "@/shared/ui/badge";
import { useAppDispatch } from "@/shared/hooks/reduxHooks";
import { fetchSetActivation, fetchSetSuperuser } from "../slice";

export function AdminUsers({ users, isLoading }: { users: User[], isLoading: boolean }) {
    const dispatch = useAppDispatch();
    const [searchQuery, setSearchQuery] = useState("");
    
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [formData, setFormData] = useState({ login: "", name: "", password: "", is_superuser: false });
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);

    const filteredUsers = (users || []).filter((u: User) => 
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.login?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-foreground">Глобальные пользователи</h1>
                <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => setUserModalOpen(true)}>
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

            <div className="border rounded-xl bg-card shadow-sm overflow-hidden relative min-h-[200px]">
                {isLoading && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-20">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                )}
                
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                        <tr>
                            <th className="px-6 py-4 w-16">ID</th>
                            <th className="px-6 py-4">Имя / Логин</th>
                            <th className="px-6 py-4">Статус</th>
                            <th className="px-6 py-4">Админ</th>
                            <th className="px-6 py-4 text-right">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {!isLoading && filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground italic">
                                    Список пользователей пуст
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user: User) => (
                                <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                                    <td className="px-6 py-4 font-mono text-muted-foreground">{user.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-foreground">{user.name}</div>
                                        <div className="text-xs text-muted-foreground">@{user.login}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.is_active ? (
                                            <Badge className="bg-green-100 text-green-700 border-green-200">Активен</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-muted-foreground">Отключен</Badge>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.is_superuser ? (
                                            <Badge className="bg-purple-100 text-purple-700 border-purple-200 flex w-fit items-center gap-1 font-bold uppercase text-[10px]">
                                                <ShieldAlert className="w-3 h-3"/> Superuser
                                            </Badge>
                                        ) : (
                                            <span className="text-xs text-muted-foreground uppercase font-medium">Обычный</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1">
                                            {/* Переключатель Активности */}
                                            <Button 
                                                variant="ghost" size="icon" 
                                                title={user.is_active ? "Деактивировать" : "Активировать"}
                                                className={user.is_active ? "text-orange-500 hover:bg-orange-50" : "text-green-500 hover:bg-green-50"}
                                                onClick={() => dispatch(fetchSetActivation({ user_id: user.id, activation: !user.is_active }))}
                                            >
                                                {user.is_active ? <UserMinus className="w-4 h-4"/> : <UserCheck className="w-4 h-4"/>}
                                            </Button>

                                            {/* Переключатель Суперюзера */}
                                            <Button 
                                                variant="ghost" size="icon" 
                                                className={user.is_superuser ? "text-purple-600 hover:bg-purple-50" : "text-muted-foreground hover:bg-muted"}
                                                onClick={() => dispatch(fetchSetSuperuser({ user_id: user.id, activation: !user.is_superuser }))}
                                            >
                                                <ShieldAlert className="w-4 h-4"/>
                                            </Button>

                                            <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50">
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
            {/* Модалки создания и удаления */}
        </div>
    );
}