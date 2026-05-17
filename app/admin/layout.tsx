"use client";

import { AdminProvider } from "@/features/Admin/AdminProvider";
import { RouteProtector } from "@/features/Auth/client/RouteProtector";
import { Header } from "@/features/Header/ui/Header";
import { cn } from "@/shared/lib/utils";
import { FolderDot, Shield, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [
        { name: "Проекты", href: "/admin/projects", icon: FolderDot },
        { name: "Пользователи", href: "/admin/users", icon: Users },
        { name: "Роли системы", href: "/admin/roles", icon: Shield },
    ];
    return (
        <RouteProtector>
            <AdminProvider>
                <div className="flex flex-col h-screen bg-background overflow-hidden">
                    <Header />

                    <div className="flex flex-1 overflow-hidden max-w-7xl mx-auto w-full">
                        {/* Сайдбар админки */}
                        <aside className="w-64 border-r border-border/50 py-8 pr-6 flex flex-col gap-2 shrink-0">
                            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 px-3 text-[10px]">
                                Панель управления
                            </h2>
                            <nav className="flex flex-col gap-1">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                                isActive
                                                    ? "bg-blue-600/10 text-blue-600 shadow-[inset_3px_0_0_0_#2563eb]"
                                                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                            )}
                                        >
                                            <item.icon
                                                className={cn(
                                                    "w-5 h-5",
                                                    isActive
                                                        ? "text-blue-600"
                                                        : "",
                                                )}
                                            />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </aside>

                        <main className="flex-1 p-8 overflow-y-auto no-scrollbar">
                            {children}
                        </main>
                    </div>
                </div>
            </AdminProvider>
        </RouteProtector>
    );
}
