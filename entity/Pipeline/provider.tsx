"use client";

import { useAppDispatch } from "@/shared/hooks/reduxHooks";
import { ReactNode, useLayoutEffect } from "react";
import { fetchPipelines } from "./slice";
import { Project } from "../Project";

export function PipelinesProvider({
    projectId,
    children,
}: {
    projectId: Project["id"];
    children: ReactNode;
}) {
    if (!projectId) throw new Error("No projectId in PipelinesProvider!");
    const dispatch = useAppDispatch();
    useLayoutEffect(() => {
        dispatch(fetchPipelines(projectId));
    }, [dispatch]);
    return children;
}
