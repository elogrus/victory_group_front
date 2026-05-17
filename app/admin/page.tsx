"use client";

import { useState } from "react";
import { Header } from "@/features/Header/ui/Header";
import { FolderDot, Users, Shield, BrainCircuit } from "lucide-react";
import { INITIAL_PROJECTS, MOCK_USERS, MOCK_ROLES, Project } from "@/shared/lib/data";
import { MOCK_ANALYTICS_DATA } from "@/shared/lib/mock-analytics";

import { AdminProjects } from "@/features/Admin/AdminProjects";
import { AdminUsers } from "@/features/Admin/AdminUsers";
import { AdminRoles } from "@/features/Admin/AdminRoles";
import { AiAnalyticsDashboard } from "@/features/Analytics/AiAnalyticsDashboard"; 

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<"projects" | "users" | "roles" | "analytics">("projects");
    
    const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
    const [users, setUsers] = useState(MOCK_USERS);
    const [roles, setRoles] = useState(MOCK_ROLES);

    return (
        <div className="flex flex-col h-screen bg-background overflow-hidden">
            <Header />

            <div className="flex flex-1 overflow-hidden max-w-7xl mx-auto w-full">
                <aside className="w-64 border-r border-border/50 py-8 pr-6 flex flex-col gap-2 shrink-0">
                    <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 px-3">Панель управления</h2>
                    <button 
                        onClick={() => setActiveTab("projects")} 
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "projects" ? 'bg-blue-600/10 text-blue-600' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                    >
                        <FolderDot className="w-5 h-5"/> Проекты
                    </button>
                    <button 
                        onClick={() => setActiveTab("users")} 
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "users" ? 'bg-blue-600/10 text-blue-600' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                    >
                        <Users className="w-5 h-5"/> Пользователи
                    </button>
                    <button 
                        onClick={() => setActiveTab("roles")} 
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "roles" ? 'bg-blue-600/10 text-blue-600' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                    >
                        <Shield className="w-5 h-5"/> Роли системы
                    </button>
                    
                    {/* НОВАЯ КНОПКА АНАЛИТИКИ */}
                    <div className="my-2 border-t border-border/50"></div>
                    <button 
                        onClick={() => setActiveTab("analytics")} 
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "analytics" ? 'bg-purple-600/10 text-purple-600' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                    >
                        <BrainCircuit className="w-5 h-5"/> AI Аналитика
                    </button>
                </aside>

                <main className="flex-1 p-8 overflow-y-auto no-scrollbar">
                    {activeTab === "projects" && <AdminProjects projects={projects} setProjects={setProjects} users={users} roles={roles} />}
                    {activeTab === "users" && <AdminUsers users={users} setUsers={setUsers} setProjects={setProjects} />}
                    {activeTab === "roles" && <AdminRoles roles={roles} setRoles={setRoles} />}
                    
                    {/* ВЫЗОВ КОМПОНЕНТА АНАЛИТИКИ С МОК ДАННЫМИ */}
                    {activeTab === "analytics" && (
                        <div className="max-w-5xl">
                            <h1 className="text-2xl font-bold text-foreground mb-6">Аналитика проекта</h1>
                            <AiAnalyticsDashboard data={MOCK_ANALYTICS_DATA} />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}