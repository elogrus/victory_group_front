"use client";

import { Button } from "@/shared/ui/button";
import { Search, Bell, Settings, HelpCircle, User, LogOut, Moon, Sun } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { MOCK_NOTIFICATIONS } from "@/shared/lib/data";

export function Header({ onCreateClick }: { onCreateClick?: () => void }) {
    const router = useRouter();
    const pathname = usePathname();
    
    const [menuOpen, setMenuOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [isDark, setIsDark] = useState(true);

    const userMenuRef = useRef<HTMLDivElement>(null);
    const notifMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
            if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
    };

    const unreadNotifications = MOCK_NOTIFICATIONS.filter(n => !n.isRead);

    return (
        <header className="h-14 border-b flex items-center justify-between px-4 bg-background shrink-0 relative z-50 shadow-sm">
            <div className="flex items-center gap-4">
                <svg 
                    onClick={() => router.push('/')} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 56 42" 
                    fill="none" 
                    className="w-9 h-auto cursor-pointer shrink-0 ml-2"
                >
                    <path d="M56.3462 14.7422L26.9231 42V27.2578L56.3462 0V14.7422Z" className="symbol" fill="currentColor"></path>
                    <path d="M0 16.5398L11.0789 27.1327H26.9231V16.5398H0Z" className="symbol" fill="currentColor"></path>
                </svg>

                <nav className="hidden xl:flex gap-5 ml-6 text-sm font-medium items-center">
                    <button
                        onClick={() => router.push('/')}
                        className={`whitespace-nowrap transition-colors ${pathname === '/' ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Проекты
                    </button>

                    <button
                        onClick={() => router.push('/map')}
                        className={`whitespace-nowrap transition-colors ${pathname === '/map' ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Карта проектов
                    </button>

                    {/* ССЫЛКА НА ПАНЕЛЬ АДМИНИСТРАТОРА */}
                    <button
                        onClick={() => router.push('/admin')}
                        className={`whitespace-nowrap transition-colors ${pathname === '/admin' ? 'text-blue-600 font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Админ-панель
                    </button>

                    <Button size="sm" className="ml-2 bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap" onClick={onCreateClick}>
                        Создать
                    </Button>
                </nav>
            </div>

            <div className="flex items-center gap-3">
                <div className="relative w-48 hidden md:block">
                    <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
                    <input placeholder="Поиск" className="w-full bg-muted/50 border border-transparent focus:border-blue-500 rounded-md pl-8 h-8 outline-none text-sm transition-all" />
                </div>

                <div className="relative" ref={notifMenuRef}>
                    <Button variant="ghost" size="icon" className="text-muted-foreground w-8 h-8 relative" onClick={() => setNotifOpen(!notifOpen)}>
                        <Bell className="w-5 h-5" />
                        {unreadNotifications.length > 0 && (
                            <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-background"></span>
                        )}
                    </Button>
                    
                    {notifOpen && (
                        <div className="absolute right-0 top-10 w-80 bg-popover border rounded-md shadow-lg py-2 flex flex-col z-50">
                            <div className="px-4 py-2 border-b flex justify-between items-center">
                                <span className="font-semibold text-foreground text-sm">Уведомления</span>
                                <span className="text-xs text-blue-500 cursor-pointer hover:underline">Прочитать все</span>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                                {unreadNotifications.length === 0 ? (
                                    <div className="p-4 text-sm text-muted-foreground text-center">Нет новых уведомлений</div>
                                ) : (
                                    unreadNotifications.map(notif => (
                                        <div key={notif.id} className="px-4 py-3 border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer flex flex-col gap-1">
                                            <div className="text-sm text-foreground">{notif.text}</div>
                                            <div className="text-xs text-muted-foreground">{notif.date}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <Button variant="ghost" size="icon" className="text-muted-foreground w-8 h-8"><HelpCircle className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground w-8 h-8"><Settings className="w-5 h-5" /></Button>

                <div className="relative" ref={userMenuRef}>
                    <button onClick={() => setMenuOpen(!menuOpen)} className="w-8 h-8 rounded-full bg-blue-800 text-white text-xs font-bold flex items-center justify-center ml-1 ring-2 ring-transparent hover:ring-blue-500 transition-all">
                        DK
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 top-10 w-64 bg-popover border rounded-md shadow-lg py-2 flex flex-col text-sm z-50">
                            <div className="px-4 py-3 border-b flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold">DK</div>
                                <div>
                                    <div className="font-semibold text-foreground">Diniar Karimov</div>
                                    <div className="text-xs text-muted-foreground">mr.dinyar@gmail.com</div>
                                </div>
                            </div>
                            <button onClick={() => { setMenuOpen(false); router.push('/profile'); }} className="flex items-center gap-3 px-4 py-2 hover:bg-muted text-left text-foreground"><User className="w-4 h-4" /> Профиль</button>
                            <button className="flex items-center gap-3 px-4 py-2 hover:bg-muted text-left text-foreground"><Settings className="w-4 h-4" /> Настройки аккаунта</button>
                            <button onClick={toggleTheme} className="flex items-center justify-between px-4 py-2 hover:bg-muted text-left text-foreground">
                                <div className="flex items-center gap-3">{isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />} Тема</div>
                                <span className="text-xs text-muted-foreground">{isDark ? 'Темная' : 'Светлая'}</span>
                            </button>
                            <div className="border-t mt-2 pt-2">
                                <button onClick={() => router.push('/auth')} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted text-left text-foreground"><LogOut className="w-4 h-4" /> Выйти</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}