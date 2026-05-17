"use client";

import { useAppDispatch } from "@/shared/hooks/reduxHooks";
import { ReactNode, useEffect } from "react";
import { fetchProjects } from "./slice";

export function ProjectsProvider({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();
    useEffect(() => {
        console.log("dispatch fetchProjects");
        dispatch(fetchProjects());
    }, []);
    return children;
}
