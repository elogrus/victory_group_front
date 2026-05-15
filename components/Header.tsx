"use client";

import { Button } from "@/components/ui/button";
import { Search, Bell, Settings, LogOut, User, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function Header({ onCreateClick }: { onCreateClick: () => void }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Переключение темы
  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) document.documentElement.classList.remove('dark');
    else document.documentElement.classList.add('dark');
  };

  useEffect(() => {
    // Устанавливаем тему при загрузке (по умолчанию dark, как мы задали)
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <header className="h-14 border-b flex items-center justify-between px-4 bg-background shrink-0 relative z-50">
      <div className="flex items-center gap-4">
        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold">J</div>
        <div className="font-bold text-lg text-foreground tracking-tight">Jira</div>
        <nav className="hidden md:flex gap-4 ml-4 text-sm font-medium text-muted-foreground">
          <a href="#" className="hover:text-foreground">Разделы</a>
          <a href="#" className="hover:text-foreground">Фильтры</a>
          <a href="#" className="hover:text-foreground">Дашборды</a>
          <Button size="sm" className="ml-2 bg-blue-600 hover:bg-blue-700 text-white" onClick={onCreateClick}>Создать</Button>
        </nav>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative w-64 hidden sm:block">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input placeholder="Поиск" className="w-full bg-muted/50 border border-transparent focus:border-blue-500 rounded-md pl-8 h-9 outline-none text-sm" />
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground"><Bell className="w-5 h-5" /></Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground"><Settings className="w-5 h-5" /></Button>
        
        {/* Аватар и выпадающее меню */}
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="w-8 h-8 rounded-full bg-blue-800 text-white text-xs font-bold flex items-center justify-center ring-2 ring-transparent hover:ring-blue-500">
            DK
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 top-10 w-64 bg-popover border border-border rounded-md shadow-lg py-2 flex flex-col text-sm text-popover-foreground">
              <div className="px-4 py-3 border-b border-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold">DK</div>
                <div>
                  <div className="font-semibold">Diniar Karimov</div>
                  <div className="text-xs text-muted-foreground">mr.dinyar@gmail.com</div>
                </div>
              </div>
              
              <button className="flex items-center gap-3 px-4 py-2 hover:bg-muted text-left"><User className="w-4 h-4"/> Profile</button>
              <button className="flex items-center gap-3 px-4 py-2 hover:bg-muted text-left"><Settings className="w-4 h-4"/> Account settings</button>
              
              <button onClick={toggleTheme} className="flex items-center justify-between px-4 py-2 hover:bg-muted text-left">
                <div className="flex items-center gap-3">{isDark ? <Moon className="w-4 h-4"/> : <Sun className="w-4 h-4"/>} Theme</div>
                <span className="text-xs text-muted-foreground">{isDark ? 'Dark' : 'Light'}</span>
              </button>
              
              <div className="border-t border-border mt-2 pt-2">
                <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted text-left">Сменить аккаунт</button>
                <button onClick={() => router.push('/login')} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted text-left"><LogOut className="w-4 h-4"/> Выйти</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}