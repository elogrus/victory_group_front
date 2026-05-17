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
import { fetchSetActivation, fetchSetSuperuser } from "../../Admin/slice";

export function AdminUsers({ users, isLoading }: { users: User[], isLoading: boolean }) {
    const dispatch = useAppDispatch();
    const [searchQuery, setSearchQuery] = useState("");
    
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [formData, setFormData] = useState({ login: "", name: "", password: "", is_superuser: false });

    const filteredUsers = (users || []).filter((u: User) => 
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.login?.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                <Input placeholder="Поиск..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 bg-muted/30 h-10"/>
            </div>

            <div className="border rounded-xl bg-card shadow-sm overflow-hidden relative min-h-[200px]">
                {isLoading && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
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
                        {filteredUsers.map((user: User) => (
                            <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                                <td className="px-6 py-4 font-mono text-muted-foreground">{user.id}</td>
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-foreground">{user.name}</div>
                                    <div className="text-xs text-muted-foreground">@{user.login}</div>
                                </td>
                                <td className="px-6 py-4">
                                    {user.is_active ? <Badge className="bg-green-100 text-green-700 border-green-200">Активен</Badge> : <Badge variant="outline">Отключен</Badge>}
                                </td>
                                <td className="px-6 py-4">
                                    {user.is_superuser ? <Badge className="bg-purple-100 text-purple-700 border-purple-200 gap-1"><ShieldAlert className="w-3 h-3"/> Superuser</Badge> : <span className="text-xs text-muted-foreground">User</span>}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => dispatch(fetchSetActivation({ user_id: Number(user.id), activation: !user.is_active }))}>
                                            {user.is_active ? <UserMinus className="w-4 h-4 text-orange-500"/> : <UserCheck className="w-4 h-4 text-green-500"/>}
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => dispatch(fetchSetSuperuser({ user_id: Number(user.id), activation: !user.is_superuser }))}>
                                            <ShieldAlert className={`w-4 h-4 ${user.is_superuser ? 'text-purple-600' : 'text-muted-foreground'}`}/>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="w-4 h-4"/></Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}