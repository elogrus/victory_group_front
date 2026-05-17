"use client";

import { Project } from "@/entity/Project";
import { useAppDispatch } from "@/shared/hooks/reduxHooks";
import { ReactNode, useEffect, useMemo } from "react";
import { clear, fetchProjects } from "./slice";
import { WSProvider } from "./WSProvider";

export function ProjectProvider({
    projectId,
    children,
}: {
    projectId: Project["id"];
    children: ReactNode;
}) {
    console.log("rerender ProjectProvider");
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchProjects(projectId));
        return () => {
            dispatch(clear());
        };
    }, []);
    return <WSProvider projectId={projectId}>{children}</WSProvider>;
}
