"use client";

import { Button } from "@/shared/ui/button";
import { Search, Bell, Settings, HelpCircle, Grid3X3, User, LogOut, Moon, Sun, Map } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Header({ onCreateClick }: { onCreateClick?: () => void }) {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(true);

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <header className="h-14 border-b flex items-center justify-between px-4 bg-background shrink-0 relative z-50 shadow-sm">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground"><Grid3X3 className="w-5 h-5" /></Button>
                
                <div 
                    onClick={() => router.push('/')}
                    className="font-bold text-xl text-blue-600 tracking-tight flex items-center gap-1 cursor-pointer"
                >
                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">J</div> Jira
                </div>

                <nav className="hidden xl:flex gap-5 ml-6 text-sm font-medium text-muted-foreground">
                    <button onClick={() => router.push('/')} className="hover:text-foreground transition-colors">Ваша работа</button>
                    <button onClick={() => router.push('/')} className="hover:text-foreground transition-colors">Проекты</button>
                    <button className="hover:text-foreground transition-colors">Фильтры</button>
                    <button className="hover:text-foreground transition-colors">Дашборды</button>
                    
                    {/* Переход на Карту Проектов */}
                    <button 
                        onClick={() => router.push('/map')} 
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 bg-blue-600/10 px-3 py-1.5 rounded-md transition-colors"
                    >
                        <Map className="w-4 h-4"/> Карта проектов
                    </button>
                    
                    <Button size="sm" className="ml-2 bg-blue-600 hover:bg-blue-700 text-white" onClick={onCreateClick}>Создать</Button>
                </nav>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="relative w-48 hidden md:block">
                    <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
                    <input placeholder="Поиск" className="w-full bg-muted/50 border border-transparent focus:border-blue-500 rounded-md pl-8 h-8 outline-none text-sm transition-all" />
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground w-8 h-8"><Bell className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground w-8 h-8"><HelpCircle className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground w-8 h-8"><Settings className="w-5 h-5" /></Button>
                
                <div className="relative">
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
                            <button className="flex items-center gap-3 px-4 py-2 hover:bg-muted text-left text-foreground"><User className="w-4 h-4"/> Профиль</button>
                            <button className="flex items-center gap-3 px-4 py-2 hover:bg-muted text-left text-foreground"><Settings className="w-4 h-4"/> Настройки аккаунта</button>
                            <button onClick={toggleTheme} className="flex items-center justify-between px-4 py-2 hover:bg-muted text-left text-foreground">
                                <div className="flex items-center gap-3">{isDark ? <Moon className="w-4 h-4"/> : <Sun className="w-4 h-4"/>} Тема</div>
                                <span className="text-xs text-muted-foreground">{isDark ? 'Темная' : 'Светлая'}</span>
                            </button>
                            <div className="border-t mt-2 pt-2">
                                <button onClick={() => router.push('/login')} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted text-left text-foreground"><LogOut className="w-4 h-4"/> Выйти</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}