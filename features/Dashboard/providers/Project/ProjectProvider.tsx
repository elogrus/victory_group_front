"use client";

import { Project } from "@/entity/Project";
import { useAppDispatch } from "@/shared/hooks/reduxHooks";
import { ReactNode, useEffect } from "react";
import { clear, fetchProjects } from "./slice";

export function ProjectProvider({
    projectId,
    children,
}: {
    projectId: Project["id"];
    children: ReactNode;
}) {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchProjects(projectId));
        return () => {
            dispatch(clear());
        };
    }, []);
    return children;
}
