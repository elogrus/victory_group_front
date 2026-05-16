"use client";

import { Plus, FolderDot, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useState } from "react";
import { useAppSelector } from "@/shared/hooks/reduxHooks";
import { selectProjects } from "@/entity/Project/slice";

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const projects = useAppSelector(selectProjects);

    return (
        <aside
            className={`relative border-r bg-muted/10 transition-all duration-300 flex flex-col shrink-0 ${isOpen ? "w-64" : "w-16"}`}
        >
            <div className="p-4 flex items-center justify-between border-b h-14 shrink-0">
                {isOpen && (
                    <span className="font-semibold text-sm text-muted-foreground uppercase tracking-wider text-[10px]">
                        Проекты
                    </span>
                )}
                {isOpen && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            console.log("newProject");
                        }}
                        className="w-6 h-6 hover:bg-muted/50"
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                )}
            </div>

            <nav className="p-2 flex-1 flex flex-col gap-1 overflow-y-auto overflow-x-hidden no-scrollbar">
                {projects.map((p: any) => {
                    const isActive = p.id === activeProjId;
                    return (
                        <button
                            key={p.id}
                            onClick={() => onSelect(p.id)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap overflow-hidden ${isActive ? "bg-blue-600/10 text-blue-600" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                        >
                            <FolderDot
                                className={`w-5 h-5 shrink-0 ${isActive ? "text-blue-600" : ""}`}
                            />
                            {isOpen && (
                                <span className="truncate">{p.name}</span>
                            )}
                        </button>
                    );
                })}
            </nav>

            <button
                onClick={() => setIsOpen((x) => !x)}
                className="absolute -right-3 top-6 w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center shadow-sm z-10 hover:bg-muted text-muted-foreground"
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
