"use client";

import { Project } from "@/entity/Project";
import tokenService from "@/entity/Token";
import { useAppDispatch } from "@/shared/hooks/reduxHooks";
import { CONSTS } from "@/shared/lib/consts";
import { ReactNode, useEffect, useRef, useState } from "react";
import { addTask } from "../Pipeline/slice";

export function WSProvider({
    children,
    projectId,
}: {
    children: ReactNode;
    projectId: Project["id"];
}) {
    const wsRef = useRef<WebSocket | null>(null);
    const dispatch = useAppDispatch();
    useEffect(() => {
        // Инициализация только на клиенте
        const ws = new WebSocket(CONSTS.API_WS_URL + `/ws/${projectId}`);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket connected");
            const token = tokenService.getToken();
            if (token) {
                ws.send(token);
            }
        };

        ws.onmessage = (event) => {
            console.log("Received:", event.data, event.type);
            switch (event.type) {
                case "task_created":
                    const task = event.data;
                    dispatch(addTask(task));
                    break;

                default:
                    break;
            }
        };

        ws.onclose = () => {
            console.log("WebSocket disconnected");
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            ws.close();
        };
    }, []);

    return children;
}
