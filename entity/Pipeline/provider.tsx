"use client";

import { useAppDispatch } from "@/shared/hooks/reduxHooks";
import { ReactNode, useLayoutEffect } from "react";
import { Project } from "../Project";

export function PipelinesProvider({
    projectId,
    children,
}: {
    projectId: Project["id"];
    children: ReactNode;
}) {
    if (!projectId) throw new Error("No projectId in PipelinesProvider!");
    useLayoutEffect(() => {}, [dispatch]);
    return children;
}
