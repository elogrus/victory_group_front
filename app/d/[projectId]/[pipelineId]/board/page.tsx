"use client";

import {
    fetchModifyTask,
    fetchRemoveTask,
    modifyColumn,
    modifyTask,
    removeTask,
    fetchCreateTask,
    addTask,
} from "@/features/Dashboard/providers/Pipeline/slice";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks";
import { Button } from "@/shared/ui/button";
import { useParams } from "next/navigation";

export default function Board() {
    const columns = useAppSelector(
        (state) => state.pipeline.pipelineInfo?.columns,
    );
    const dispatch = useAppDispatch();
    const params = useParams();
    return (
        <div className="flex flex-col gap-2">
            {params.projectId &&
                params.pipelineId &&
                columns &&
                columns.length > 0 && (
                    <Button
                        onClick={async () => {
                            console.log("start loading");
                            await dispatch(
                                fetchCreateTask({
                                    columnId: columns[0].id,
                                    projectId: +params.projectId!,
                                    pipelineId: +params.pipelineId!,
                                    taskFields: {
                                        pipeline_id: +params.pipelineId!,
                                        external_id:
                                            String(Date.now()) +
                                            String(Date.now()),
                                        column_id: columns[0].id,
                                        description: "пельмени описание",
                                        order: 0,
                                        priority: 1,
                                        title: "пельмени заголовок",
                                    },
                                }),
                            );
                            console.log("end loading");
                        }}
                    >
                        добавить задачу "пельмени"
                    </Button>
                )}
            {columns &&
                columns.length > 0 &&
                columns[0].tasks.map((t) => (
                    <span key={t.id}>
                        {t.id} - {t.title}
                        <Button
                            onClick={async () => {
                                console.log("start loading");
                                await dispatch(
                                    fetchModifyTask({
                                        columnId: t.column_id,
                                        projectId: t.project_id,
                                        taskId: t.id,
                                        taskFields: {
                                            title: "aboba333",
                                        },
                                    }),
                                );
                                console.log("end loading");
                            }}
                        >
                            modify title to aboba333
                        </Button>
                        <Button
                            onClick={async () => {
                                console.log("start loading");
                                await dispatch(
                                    fetchRemoveTask({
                                        columnId: t.column_id,
                                        projectId: t.project_id,
                                        taskId: t.id,
                                    }),
                                );
                                console.log("end loading");
                            }}
                        >
                            удалить задачу
                        </Button>
                    </span>
                ))}
        </div>
    );
}
