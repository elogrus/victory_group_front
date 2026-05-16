"use client";

import { selectProjectById } from "@/entity/Project/slice";
import { useAppSelector } from "@/shared/hooks/reduxHooks";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { Settings } from "lucide-react";
import { useParams } from "next/navigation";

export function Header() {
    const params = useParams();
    const project = useAppSelector((state) =>
        selectProjectById(state, params.projectId ? +params.projectId : -1),
    );
    return (
        <>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                {project ? (
                    <>
                        <span>Проекты</span> / <span>{project?.name}</span>{" "}
                    </>
                ) : (
                    <Skeleton className="w-[250px] h-[1em] " />
                )}
            </div>
            <div className="flex items-center gap-4 mb-4">
                {project ? (
                    <div className="w-10 h-10 bg-blue-600/10 rounded flex items-center justify-center text-xl font-bold text-blue-600 border border-blue-600/20">
                        {project?.name[0].toUpperCase()}
                    </div>
                ) : (
                    <Skeleton className="text-xl w-[300px] h-10" />
                )}

                <h1 className="text-2xl font-semibold text-foreground">
                    {project?.name}
                </h1>
                <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto text-muted-foreground hover:text-foreground"
                >
                    <Settings className="w-4 h-4 mr-2" /> Настройки проекта
                </Button>
            </div>
        </>
    );
}
