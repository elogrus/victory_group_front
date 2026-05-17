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
    const memoProjectId = useMemo(() => projectId, [projectId]);
    // const { sendMessage, lastMessage, connectionStatus } = useWebSocket(
    //     `${CONSTS.API_URL}/ws/${memoProjectId}`,
    //     {
    //         shouldReconnect: false,
    //         // reconnectAttempts: 5,
    //         // reconnectInterval: 3000,
    //         onOpen: () => console.log("Connected!"),
    //         onClose: (event) => {
    //             if (!event.wasClean) {
    //                 console.log("Connection lost, attempting to reconnect...");
    //             }
    //         },
    //     },
    // );
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
