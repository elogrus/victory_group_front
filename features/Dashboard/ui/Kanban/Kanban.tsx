"use client";

import {
    Kanban,
    KanbanBoard,
    KanbanColumn,
    KanbanColumnContent,
    KanbanColumnHandle,
    KanbanItem,
    KanbanItemHandle,
    KanbanOverlay,
} from "@/components/reui/kanban";
import { PipelineInfo } from "@/entity/Pipeline";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { CrossIcon, GripVerticalIcon, X } from "lucide-react";
import { ComponentProps, useEffect, useState } from "react";
import {
    fetchModifyTask,
    fetchMoveTask,
    fetchRemoveTask,
    removeTask,
} from "../../providers/Pipeline/slice";

interface TaskCardProps extends Omit<
    ComponentProps<typeof KanbanItem>,
    "value" | "children"
> {
    task: PipelineInfo["columns"][0]["tasks"][0];
    asHandle?: boolean;
    onDelete: (task: PipelineInfo["columns"][0]["tasks"][0]) => void;
    isOverlay?: boolean;
}
function TaskCard({
    task,
    asHandle,
    isOverlay,
    onDelete,
    ...props
}: TaskCardProps) {
    const dispatch = useAppDispatch();
    const cardContent = (
        <Card>
            <CardContent className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                    <span className="line-clamp-1 text-sm font-medium">
                        {task.title}
                    </span>
                    <X onClick={() => onDelete(task)} />
                </div>
                <div className="text-muted-foreground flex items-center justify-between text-xs">
                    {/* {task.assignee && (
                        <div className="flex items-center gap-1">
                            <Avatar className="size-4">
                                <AvatarImage src={task.assigneeAvatar} />
                                <AvatarFallback>
                                    {task.assignee.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <span className="line-clamp-1">
                                {task.assignee}
                            </span>
                        </div>
                    )} */}
                    {task.deadline && (
                        <time className="text-[10px] whitespace-nowrap tabular-nums">
                            {task.deadline}
                        </time>
                    )}
                </div>
            </CardContent>
        </Card>
    );
    return (
        <KanbanItem value={String(task.id)} {...props}>
            {asHandle && !isOverlay ? (
                <KanbanItemHandle>{cardContent}</KanbanItemHandle>
            ) : (
                cardContent
            )}
        </KanbanItem>
    );
}

interface TaskColumnProps extends Omit<
    ComponentProps<typeof KanbanColumn>,
    "children"
> {
    name: string;
    tasks: PipelineInfo["columns"][0]["tasks"];
    isOverlay?: boolean;
    onDelete: (task: PipelineInfo["columns"][0]["tasks"][0]) => void;
}
function TaskColumn({
    value,
    name,
    tasks,
    isOverlay,
    onDelete,
    ...props
}: TaskColumnProps) {
    return (
        <KanbanColumn value={value} {...props}>
            <Card className="mb-2.5">
                <CardHeader className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <span className="text-sm font-semibold">{name}</span>
                        <Badge variant="outline">{tasks.length}</Badge>
                    </div>
                    <KanbanColumnHandle
                        render={(props) => (
                            <Button {...props} size="icon-xs" variant="ghost">
                                <GripVerticalIcon />
                            </Button>
                        )}
                    />
                </CardHeader>
                <CardContent>
                    <KanbanColumnContent
                        value={value}
                        className="flex flex-col gap-2.5"
                    >
                        {tasks.map((task) => (
                            <TaskCard
                                onDelete={onDelete}
                                key={task.id}
                                task={task}
                                asHandle={!isOverlay}
                                isOverlay={isOverlay}
                            />
                        ))}

                        <Card className="py-2 px-0">
                            <CardContent>
                                <Button
                                    className="block w-full h-full text-center"
                                    variant="ghost"
                                    onClick={() => {}}
                                >
                                    Создать задачу
                                </Button>
                            </CardContent>
                        </Card>
                    </KanbanColumnContent>
                </CardContent>
            </Card>
        </KanbanColumn>
    );
}

export function Board() {
    const origColumns =
        useAppSelector((state) => state.pipeline.pipelineInfo?.columns) || [];
    const [lastColumns, setLastColumns] = useState<Record<
        string,
        PipelineInfo["columns"][0]["tasks"]
    > | null>(null);
    const [columns, setColumns] = useState<
        Record<string, PipelineInfo["columns"][0]["tasks"]>
    >({});
    useEffect(() => {
        const x: Record<string, PipelineInfo["columns"][0]["tasks"]> = {};
        origColumns.forEach((c) => {
            x[c.name] = c.tasks;
        });
        setColumns(x);
        setLastColumns(x);
    }, []);
    const dispatch = useAppDispatch();
    console.log("origColumns", origColumns);
    console.log("Done", columns.Done);
    return (
        <Kanban
            value={columns}
            onMove={async (e) => {
                console.log("ppppppp", e);
                const prevColumn = origColumns.find(
                    (c) => c.name === e.activeContainer,
                );
                const newColumn = origColumns.find(
                    (c) => c.name === e.overContainer,
                );

                const activeTask = columns[e.activeContainer][e.activeIndex];
                const overTask = columns[e.overContainer][e.overIndex];

                const ok = await dispatch(
                    fetchMoveTask({
                        newColumnId: newColumn!.id,
                        columnId: prevColumn!.id,
                        order: overTask ? overTask.order - 1 : 1,
                        projectId: activeTask.project_id,
                        taskId: activeTask.id,
                    }),
                );
                if (!ok.payload) {
                    if (lastColumns) {
                        setColumns(lastColumns);
                        setLastColumns(null);
                    }
                }
            }}
            onValueChange={(v) => {
                console.log("ssdsdafqweWEGRFw", v);
                setLastColumns(columns);
                setColumns(v);
            }}
            getItemValue={(item) => {
                return String(item.id);
            }}
        >
            <KanbanBoard className="grid auto-rows-fr grid-cols-3">
                {Object.entries(columns).map(([columnValue, tasks]) => (
                    <TaskColumn
                        onDelete={async (task) => {
                            const ok = await dispatch(
                                fetchRemoveTask({
                                    taskId: task.id,
                                    projectId: task.project_id,
                                    columnId: task.column_id,
                                }),
                            );
                            if (ok.payload) {
                                dispatch(
                                    removeTask({
                                        taskId: task.id,
                                        columnId: task.column_id,
                                    }),
                                );
                            }
                        }}
                        key={columnValue}
                        value={columnValue}
                        name={columnValue}
                        tasks={tasks}
                    />
                ))}
            </KanbanBoard>
            <KanbanOverlay className="bg-muted/10 rounded-md border-2 border-dashed" />
        </Kanban>
    );
}
