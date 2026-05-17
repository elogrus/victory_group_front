"use client";

import { Plus, FolderDot, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useState } from "react";
import { useAppSelector } from "@/shared/hooks/reduxHooks";
import {
    selectErrors,
    selectIsLoading,
    selectProjects,
} from "@/entity/Project/slice";
import { Spinner } from "@/shared/ui/spinner";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/shared/lib/utils";

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const projects = useAppSelector(selectProjects);
    const isLoading = useAppSelector(selectIsLoading);
    const errors = useAppSelector(selectErrors);

    const params = useParams();

    return (
        <aside
            className={cn(
                "relative border-r bg-muted/5 transition-all duration-300 flex flex-col shrink-0 min-h-screen",
                isOpen ? "w-64" : "w-16"
            )}
        >
            {/* Шапка сайдбара */}
            <div className="p-4 flex items-center justify-between border-b h-14 shrink-0">
                {isOpen && (
                    <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                        Проекты
                    </span>
                )}
                {isOpen && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 hover:bg-muted"
                        onClick={() => console.log("newProject")}
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                )}
            </div>

            {/* Список проектов */}
            <nav className="p-2 flex-1 flex flex-col gap-1 overflow-y-auto overflow-x-hidden no-scrollbar">
                {isLoading && (
                    <div className="flex justify-center p-4">
                        <Spinner />
                    </div>
                )}
                
                {errors && errors.length !== 0 && (
                    <div className="p-2 text-xs text-red-500 bg-red-50 rounded">
                        Ошибка загрузки
                    </div>
                )}

                {projects &&
                    projects.map((p) => {
                        // Сравнение ID (приводим к числу, так как в URL это строка)
                        const isActive = Number(params.projectId) === p.id;

                        return (
                            <Link 
                                key={p.id} 
                                href={`/d/${p.id}`}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group",
                                    isActive 
                                        ? "bg-blue-600/10 text-blue-600 shadow-[inset_3px_0_0_0_#2563eb]" // Синяя полоска слева при активе
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <FolderDot
                                    className={cn(
                                        "w-5 h-5 shrink-0 transition-colors",
                                        isActive ? "text-blue-600" : "text-muted-foreground group-hover:text-foreground"
                                    )}
                                />
                                {isOpen && (
                                    <span className="truncate flex-1">
                                        {p.name}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
            </nav>

            {/* Кнопка сворачивания */}
            <button
                onClick={() => setIsOpen((x) => !x)}
                className="absolute -right-3 top-6 w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center shadow-sm z-10 hover:bg-muted text-muted-foreground transition-transform active:scale-90"
            >
                {isOpen ? (
                    <ChevronLeft className="w-3 h-3" />
                ) : (
                    <ChevronRight className="w-3 h-3" />
                )}
            </button>
        </aside>
    );
}