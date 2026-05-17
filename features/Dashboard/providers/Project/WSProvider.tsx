"use client";

import { Project } from "@/entity/Project";
import tokenService from "@/entity/Token";
import { useAppDispatch } from "@/shared/hooks/reduxHooks";
import { CONSTS } from "@/shared/lib/consts";
import { ReactNode, useEffect, useRef } from "react";
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
        // Защита: не запускаем WS, если нет projectId
        if (!projectId) return;

        const token = tokenService.getToken();
        // Если токена нет, WS не подключаем
        if (!token) return;

        const ws = new WebSocket(CONSTS.API_WS_URL + `/ws/${projectId}`);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket connected");
            // Отправляем токен для аутентификации в WS
            ws.send(token);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("WS Received:", data);
                
                // В зависимости от формата твоего бэкенда
                if (data.type === "task_created") {
                    dispatch(addTask({ 
                        columnId: data.task.column_id, 
                        newTask: data.task 
                    }));
                }
            } catch (e) {
                console.error("WS message parse error:", e);
            }
        };

        ws.onclose = () => console.log("WebSocket disconnected");
        ws.onerror = (error) => console.error("WebSocket error:", error);

        return () => {
            ws.close();
        };
    }, [projectId, dispatch]);

    return children;
}