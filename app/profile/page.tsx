"use client";

import { Header } from "@/widgets/Header/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Camera, Lock, FolderDot, Bell, ExternalLink, AtSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { MOCK_USER_PROFILE, MOCK_USER_PROJECTS, MOCK_NOTIFICATIONS } from "@/shared/lib/data";

export default function ProfilePage() {
    const router = useRouter();
    const user = MOCK_USER_PROFILE;

    return (
        <div className="flex flex-col h-screen bg-background overflow-hidden">
            <Header />

            <main className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full">
                <h1 className="text-2xl font-semibold text-foreground mb-8">Профиль пользователя</h1>

                <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">
                    {/* ЛЕВАЯ КОЛОНКА: Данные профиля */}
                    <div className="flex flex-col gap-6">
                        <Card className="bg-card border-border shadow-sm">
                            <CardContent className="p-8 flex flex-col items-center text-center">
                                <div className="relative mb-6">
                                    <div className="w-32 h-32 rounded-full bg-blue-800 text-white flex items-center justify-center text-4xl font-bold shadow-inner">
                                        {user.avatarUrl ? (
                                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            user.initials
                                        )}
                                    </div>
                                    <button className="absolute bottom-0 right-0 w-10 h-10 bg-background border border-border rounded-full flex items-center justify-center shadow-md hover:bg-muted transition-colors text-foreground">
                                        <Camera className="w-5 h-5" />
                                    </button>
                                </div>

                                <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1 justify-center">
                                    <AtSign className="w-3 h-3" /> {user.email}
                                </p>

                                <div className="w-full mt-8 space-y-3">
                                    <Button variant="outline" className="w-full bg-transparent border-border hover:bg-muted flex items-center justify-center gap-2">
                                        <Camera className="w-4 h-4" /> Изменить фото
                                    </Button>
                                    <Button variant="outline" className="w-full bg-transparent border-border hover:bg-muted flex items-center justify-center gap-2">
                                        <Lock className="w-4 h-4" /> Изменить пароль
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* ПРАВАЯ КОЛОНКА: Проекты и Уведомления */}
                    <div className="flex flex-col gap-8">
                        
                        {/* БЛОК ПРОЕКТОВ */}
                        <Card className="bg-card border-border shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <FolderDot className="w-5 h-5 text-blue-500" /> Проекты пользователя
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-border/50">
                                    {MOCK_USER_PROJECTS.map(project => (
                                        <div 
                                            key={project.id} 
                                            onClick={() => router.push('/')} // Перекидывает на дашборд
                                            className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded bg-muted flex items-center justify-center font-bold text-foreground border border-border/50 group-hover:border-blue-500/50 transition-colors">
                                                    {project.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-foreground group-hover:text-blue-500 transition-colors">{project.name}</div>
                                                    <div className="text-xs text-muted-foreground mt-0.5">Перейти к доске</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${project.roleColor}`}>
                                                    {project.role}
                                                </span>
                                                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* БЛОК УВЕДОМЛЕНИЙ */}
                        <Card className="bg-card border-border shadow-sm">
                            <CardHeader className="border-b border-border/50 pb-4 flex flex-row items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-yellow-500" /> Уведомления
                                </CardTitle>
                                <Button variant="ghost" size="sm" className="text-xs text-blue-500 hover:text-blue-600">
                                    Отметить все как прочитанные
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-border/50 max-h-[400px] overflow-y-auto no-scrollbar">
                                    {MOCK_NOTIFICATIONS.map(notif => (
                                        <div key={notif.id} className={`p-4 flex gap-4 transition-colors hover:bg-muted/30 ${!notif.isRead ? 'bg-blue-500/5' : ''}`}>
                                            <div className="mt-1">
                                                {!notif.isRead ? (
                                                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                                                ) : (
                                                    <div className="w-2.5 h-2.5 bg-border rounded-full" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className={`text-sm ${!notif.isRead ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                                                    {notif.text}
                                                </p>
                                                <span className="text-xs text-muted-foreground/70 mt-1.5 block">
                                                    {notif.date}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </main>
        </div>
    );
}