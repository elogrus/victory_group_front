"use client";

import { useEffect, useState } from "react";
import { Header } from "@/features/Header/ui/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";
import { Camera, Lock, FolderDot, Bell, ExternalLink, AtSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { MOCK_NOTIFICATIONS } from "@/shared/lib/data";
import { myFetch } from "@/shared/lib/myFetch";
import { CONSTS } from "@/shared/lib/consts";

interface User {
    id: number;
    name: string;
    email: string;
    tg_id?: number | null;
}

interface Project {
    id: number;
    name: string;
    description: string;
    created_at: string;
}

// Простейшая функция декодирования JWT без проверки подписи
function decodeJWT<T = Record<string, any>>(token: string): T | null {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Ошибка декодирования JWT:', error);
        return null;
    }
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // 1. Достаём токен из localStorage (можно заменить на свой способ)
                const token = localStorage.getItem("access_token");
                if (!token) {
                    setError("Токен не найден. Пожалуйста, авторизуйтесь.");
                    return;
                }

                // 2. Декодируем токен, чтобы получить id пользователя
                const decoded = decodeJWT<{ id: number; sub: string; name: string }>(token);
                if (!decoded || !decoded.id) {
                    setError("Не удалось извлечь ID из токена.");
                    return;
                }

                const userId = decoded.id;

                // 3. Запрашиваем данные пользователя по его id
                const userRes = await myFetch<User>(`${CONSTS.API_URL}/users/${userId}`);
                if (!userRes.ok || !userRes.body) {
                    setError("Ошибка загрузки данных пользователя");
                    return;
                }
                setUser(userRes.body);

                // 4. Запрашиваем список проектов (этот эндпоинт не требует id)
                const projectsRes = await myFetch<Project[]>(`${CONSTS.API_URL}/projects`);
                if (!projectsRes.ok || !projectsRes.body) {
                    setError("Ошибка загрузки проектов");
                    return;
                }
                setProjects(projectsRes.body);
            } catch (err) {
                setError("Ошибка при загрузке данных");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col h-screen bg-background overflow-hidden">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <Spinner />
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col h-screen bg-background overflow-hidden">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-500 font-medium">{error}</p>
                        <Button onClick={() => window.location.reload()} className="mt-4">
                            Попробовать снова
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col h-screen bg-background overflow-hidden">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <p className="text-muted-foreground">Данные пользователя не найдены</p>
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-background overflow-hidden">
            <Header />

            <main className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full">
                <h1 className="text-2xl font-semibold text-foreground mb-8">
                    Профиль пользователя
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">
                    {/* ЛЕВАЯ КОЛОНКА: Данные профиля */}
                    <div className="flex flex-col gap-6">
                        <Card className="bg-card border-border shadow-sm">
                            <CardContent className="p-8 flex flex-col items-center text-center">
                                <div className="relative mb-6">
                                    <div className="w-32 h-32 rounded-full bg-blue-800 text-white flex items-center justify-center text-4xl font-bold shadow-inner">
                                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                    </div>
                                    <button className="absolute bottom-0 right-0 w-10 h-10 bg-background border border-border rounded-full flex items-center justify-center shadow-md hover:bg-muted transition-colors text-foreground">
                                        <Camera className="w-5 h-5" />
                                    </button>
                                </div>

                                <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1 justify-center">
                                    <AtSign className="w-3 h-3" /> {user.email}
                                </p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    {user.tg_id ? `TG: ${user.tg_id}` : "Нет контактов"}
                                </p>

                                <div className="w-full mt-8 space-y-3">
                                    <Button
                                        variant="outline"
                                        className="w-full bg-transparent border-border hover:bg-muted flex items-center justify-center gap-2"
                                    >
                                        <Camera className="w-4 h-4" /> Изменить фото
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full bg-transparent border-border hover:bg-muted flex items-center justify-center gap-2"
                                    >
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
                                    {projects.length > 0 ? (
                                        projects.map(project => (
                                            <div
                                                key={project.id}
                                                onClick={() => router.push(`/d/${project.id}`)}
                                                className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center font-bold text-foreground border border-border/50 group-hover:border-blue-500/50 transition-colors">
                                                        {project.name?.charAt(0) || "P"}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-foreground group-hover:text-blue-500 transition-colors">
                                                            {project.name}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground mt-0.5">
                                                            {project.description || "Перейти к доске"}
                                                        </div>
                                                    </div>
                                                </div>
                                                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-muted-foreground">
                                            Нет доступных проектов
                                        </div>
                                    )}
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
                                        <div
                                            key={notif.id}
                                            className={`p-4 flex gap-4 transition-colors hover:bg-muted/30 ${
                                                !notif.isRead ? 'bg-blue-500/5' : ''
                                            }`}
                                        >
                                            <div className="mt-1">
                                                {!notif.isRead ? (
                                                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                                                ) : (
                                                    <div className="w-2.5 h-2.5 bg-border rounded-full" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p
                                                    className={`text-sm ${
                                                        !notif.isRead
                                                            ? 'text-foreground font-medium'
                                                            : 'text-muted-foreground'
                                                    }`}
                                                >
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