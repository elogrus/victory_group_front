"use client";

import { useAppDispatch } from "@/shared/hooks/reduxHooks";
import createAccurateContext from "@/shared/lib/createAccurateContext";
import { ReactNode, useLayoutEffect } from "react";
import { fetchProjects } from "./slice";

export function ProjectsProvider({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();
    useLayoutEffect(() => {
        console.log("dispatch fetchProjects");
        dispatch(fetchProjects());
    }, [dispatch]);
    return children;
}
