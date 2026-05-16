"use client";

import { useState } from "react";
import { Header } from "@/widgets/Header/Header";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { FolderDot, Users, Shield, Search, Plus, Trash2, Edit2, X, ShieldAlert } from "lucide-react";
import { INITIAL_PROJECTS, MOCK_USERS, MOCK_ROLES, Project, ProjectAssignment } from "@/shared/lib/data";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<"projects" | "users" | "roles">("projects");
    
    const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
    const [users, setUsers] = useState(MOCK_USERS);
    const [roles, setRoles] = useState(MOCK_ROLES);
    const [searchQuery, setSearchQuery] = useState("");

    // Состояния модалок
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [selectedUser, setSelectedUser] = useState(users[0]?.id);
    const [selectedRole, setSelectedRole] = useState(roles[0]?.id);

    const [userModalOpen, setUserModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", email: "", isSuper: false });

    const [roleModalOpen, setRoleModalOpen] = useState(false);
    const [newRole, setNewRole] = useState({ name: "", color: "bg-gray-100 text-gray-700" });

    // --- Обработчики Проектов ---
    const handleDeleteProject = (id: string) => {
        if(confirm("Удалить проект и все его доски?")) setProjects(projects.filter(p => p.id !== id));
    };

    const handleAssignUser = () => {
        if(!selectedProject) return;
        setProjects(prev => prev.map(p => {
            if (p.id !== selectedProject.id) return p;
            const newAssignment = { userId: selectedUser, roleId: selectedRole };
            // Избегаем дубликатов
            const filtered = (p.assignments || []).filter(a => a.userId !== selectedUser);
            return { ...p, assignments: [...filtered, newAssignment] };
        }));
        setAssignModalOpen(false);
    };

    const handleRemoveAssignment = (projId: string, userId: string) => {
        setProjects(prev => prev.map(p => p.id === projId ? {
            ...p, assignments: p.assignments?.filter(a => a.userId !== userId)
        } : p));
    };

    // --- Обработчики Пользователей ---
    const handleCreateUser = () => {
        if (!newUser.name || !newUser.email) return;
        setUsers([...users, { id: `user-${Date.now()}`, name: newUser.name, email: newUser.email, is_super_user: newUser.isSuper }]);
        setNewUser({ name: "", email: "", isSuper: false });
        setUserModalOpen(false);
    };

    const handleDeleteUser = (id: string) => {
        if(confirm("Удалить пользователя?")) {
            setUsers(users.filter(u => u.id !== id));
            // Очищаем его из проектов
            setProjects(prev => prev.map(p => ({ ...p, assignments: p.assignments?.filter(a => a.userId !== id) })));
        }
    };

    // --- Обработчики Ролей ---
    const handleCreateRole = () => {
        if(!newRole.name) return;
        setRoles([...roles, { id: `role-${Date.now()}`, name: newRole.name, color: newRole.color }]);
        setNewRole({ name: "", color: "bg-gray-100 text-gray-700" });
        setRoleModalOpen(false);
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-screen bg-background overflow-hidden">
            <Header />

            <div className="flex flex-1 overflow-hidden max-w-7xl mx-auto w-full">
                {/* Боковое меню админки */}
                <aside className="w-64 border-r border-border/50 py-8 pr-6 flex flex-col gap-2">
                    <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 px-3">Панель управления</h2>
                    <button 
                        onClick={() => setActiveTab("projects")} 
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "projects" ? 'bg-blue-600/10 text-blue-600' : 'text-muted-foreground hover:bg-muted'}`}
                    >
                        <FolderDot className="w-5 h-5"/> Проекты
                    </button>
                    <button 
                        onClick={() => setActiveTab("users")} 
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "users" ? 'bg-blue-600/10 text-blue-600' : 'text-muted-foreground hover:bg-muted'}`}
                    >
                        <Users className="w-5 h-5"/> Пользователи
                    </button>
                    <button 
                        onClick={() => setActiveTab("roles")} 
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "roles" ? 'bg-blue-600/10 text-blue-600' : 'text-muted-foreground hover:bg-muted'}`}
                    >
                        <Shield className="w-5 h-5"/> Роли системы
                    </button>
                </aside>

                <main className="flex-1 p-8 overflow-y-auto">
                    {/* ВКЛАДКА: ПРОЕКТЫ */}
                    {activeTab === "projects" && (
                        <div className="space-y-6">
                            <h1 className="text-2xl font-bold text-foreground mb-6">Управление проектами</h1>
                            {projects.map(proj => (
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
                                            <Button variant="outline" size="sm" onClick={() => handleDeleteProject(proj.id)} className="text-red-500 hover:bg-red-500/10">
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
                                                {proj.assignments.map(assign => {
                                                    const u = users.find(x => x.id === assign.userId);
                                                    const r = roles.find(x => x.id === assign.roleId);
                                                    if(!u || !r) return null;
                                                    return (
                                                        <div key={u.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                                            <div>
                                                                <div className="font-medium text-sm">{u.name}</div>
                                                                <div className="text-xs text-muted-foreground">{u.email}</div>
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
                        </div>
                    )}

                    {/* ВКЛАДКА: ПОЛЬЗОВАТЕЛИ */}
                    {activeTab === "users" && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-bold text-foreground">Пользователи</h1>
                                <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => setUserModalOpen(true)}>
                                    <Plus className="w-4 h-4 mr-2"/> Создать пользователя
                                </Button>
                            </div>
                            <div className="relative w-full max-w-md mb-6">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Поиск по имени или email..." 
                                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                    className="pl-9 bg-muted/30 focus:bg-background"
                                />
                            </div>
                            <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                                        <tr>
                                            <th className="px-6 py-4">Пользователь</th>
                                            <th className="px-6 py-4">Роль системы</th>
                                            <th className="px-6 py-4 text-right">Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50">
                                        {filteredUsers.map(user => (
                                            <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-foreground">{user.name}</div>
                                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {user.is_super_user ? (
                                                        <span className="flex items-center gap-1 text-purple-600 bg-purple-100 w-fit px-2 py-1 rounded text-xs font-bold"><ShieldAlert className="w-3 h-3"/> Админ</span>
                                                    ) : (
                                                        <span className="text-muted-foreground">Пользователь</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-500/10" onClick={() => handleDeleteUser(user.id)}>
                                                        <Trash2 className="w-4 h-4"/>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ВКЛАДКА: РОЛИ */}
                    {activeTab === "roles" && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-bold text-foreground">Роли и Права</h1>
                                <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => setRoleModalOpen(true)}>
                                    <Plus className="w-4 h-4 mr-2"/> Создать роль
                                </Button>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                {roles.map(role => (
                                    <div key={role.id} className="border rounded-xl bg-card p-5 shadow-sm flex flex-col items-center justify-center gap-3 relative group">
                                        <div className={`px-4 py-2 rounded-full font-bold border ${role.color}`}>
                                            {role.name}
                                        </div>
                                        <p className="text-xs text-muted-foreground text-center">Роль доступна для назначения в проектах</p>
                                        <button 
                                            onClick={() => setRoles(roles.filter(r => r.id !== role.id))}
                                            className="absolute top-2 right-2 p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* --- МОДАЛКИ (Защищенные от случайного закрытия) --- */}

            {/* Назначение пользователя в проект */}
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
                                <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} className="w-full border rounded-lg p-2.5 bg-muted/30 outline-none focus:border-blue-500">
                                    {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Роль в проекте</label>
                                <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} className="w-full border rounded-lg p-2.5 bg-muted/30 outline-none focus:border-blue-500">
                                    {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="ghost" onClick={() => setAssignModalOpen(false)}>Отмена</Button>
                                <Button onClick={handleAssignUser} className="bg-blue-600 text-white hover:bg-blue-700">Назначить</Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Создание пользователя */}
            <Dialog open={userModalOpen} onOpenChange={(open) => { if(!open) return; }}>
                <DialogContent className="!max-w-[500px] w-full p-0 overflow-hidden [&>button]:hidden">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-foreground">Новый пользователь</h2>
                            <Button variant="ghost" size="icon" onClick={() => setUserModalOpen(false)} className="text-muted-foreground"><X className="w-5 h-5"/></Button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Имя и Фамилия</label>
                                <Input value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} placeholder="Иван Иванов" />
                            </div>
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Email</label>
                                <Input type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} placeholder="example@mail.com" />
                            </div>
                            <label className="flex items-center gap-2 text-sm mt-4 cursor-pointer">
                                <input type="checkbox" checked={newUser.isSuper} onChange={e => setNewUser({...newUser, isSuper: e.target.checked})} className="rounded" />
                                Является администратором (Super User)
                            </label>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="ghost" onClick={() => setUserModalOpen(false)}>Отмена</Button>
                                <Button onClick={handleCreateUser} className="bg-blue-600 text-white hover:bg-blue-700">Создать</Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Создание роли */}
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
                                <select value={newRole.color} onChange={e => setNewRole({...newRole, color: e.target.value})} className="w-full border rounded-lg p-2.5 bg-muted/30 outline-none">
                                    <option value="bg-gray-100 text-gray-700 border-gray-200">Серый</option>
                                    <option value="bg-blue-100 text-blue-700 border-blue-200">Синий</option>
                                    <option value="bg-green-100 text-green-700 border-green-200">Зеленый</option>
                                    <option value="bg-red-100 text-red-700 border-red-200">Красный</option>
                                    <option value="bg-yellow-100 text-yellow-700 border-yellow-200">Желтый</option>
                                    <option value="bg-purple-100 text-purple-700 border-purple-200">Фиолетовый</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="ghost" onClick={() => setRoleModalOpen(false)}>Отмена</Button>
                                <Button onClick={handleCreateRole} className="bg-blue-600 text-white hover:bg-blue-700">Сохранить</Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}