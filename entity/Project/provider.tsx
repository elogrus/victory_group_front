"use client";

import { useAppDispatch } from "@/shared/hooks/reduxHooks";
import { ReactNode, useLayoutEffect } from "react";
import { fetchProjects } from "./slice";
import createAccurateContext from "@/shared/lib/createAccurateContext";
import { Project } from ".";

const ProjectContext = createAccurateContext<{
    projects: Project[] | null;
    isLoading: boolean;
    errors: string[];
}>();
export function ProjectsProvider({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();
    useLayoutEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);
    return (
        <ProjectContext.Provider
            value={{
                projects: null,
                isLoading: false,
                errors: [],
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
}
