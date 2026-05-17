"use client";

import { Project } from "@/entity/Project";
import tokenService from "@/entity/Token";
import { useAppDispatch } from "@/shared/hooks/reduxHooks";
import { CONSTS } from "@/shared/lib/consts";
import { ReactNode, useEffect, useRef, useState } from "react";
import { addTask, modifyTask, removeTask } from "../Pipeline/slice";
import { Task } from "@/entity/Task";
import { Column } from "@/entity/Column";

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
            const body = JSON.parse(event.data);
            const type = body.event;
            const data = body.data;
            console.log("Received:", event);
            switch (type) {
                case "task_created": {
                    const task = data;
                    console.log("создание", task);
                    dispatch(addTask(task));
                    break;
                }

                case "task_updated": {
                    const task = data;
                    dispatch(modifyTask(task));
                    break;
                }

                case "task_deleted": {
                    const {
                        task_id,
                        column_id,
                    }: {
                        task_id: Task["id"];
                        column_id: Column["id"];
                        project_id: Project["id"];
                    } = data;
                    dispatch(
                        removeTask({
                            taskId: task_id,
                            columnId: column_id,
                        }),
                    );
                    break;
                }

                default:
                    console.warn("Необузданный event", type);
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
