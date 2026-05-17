"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks";
import {
    fetchCreateTask,
    fetchModifyTask,
    fetchRemoveTask,
    fetchModifyColumn,
    fetchRemoveColumn,
    selectPipelineInfo,
} from "@/features/Dashboard/providers/Pipeline/slice";
import projectService from "@/entity/Project";
import { KanbanBoard } from "@/widgets/KanbanBoard/KanbanBoard";
import { TaskModal } from "@/entity/Task/ui/TaskModal";
import { CreateTaskModal } from "@/features/Dashboard/ui/CreateTaskModal";

export default function BoardPage() {
    const dispatch = useAppDispatch();
    const params = useParams();
    const pipelineInfo = useAppSelector(selectPipelineInfo);
    const columns = pipelineInfo?.columns || [];

    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [isCreateTaskOpen, setCreateTaskOpen] = useState(false);
    const [members, setMembers] = useState([]);

    const projectId = Number(params.projectId);
    const pipelineId = Number(params.pipelineId);

    // Загрузка участников проекта
    useEffect(() => {
        if (projectId) {
            projectService.getMembersList(projectId).then(res => {
                // Добавлена проверка res?, чтобы не было ошибки "reading ok of undefined"
                if (res?.ok && res.body) {
                    setMembers(res.body);
                }
            }).catch(err => console.error("Failed to load members:", err));
        }
    }, [projectId]);

    const handleUpdateTask = async (task: any) => {
        await dispatch(
            fetchModifyTask({
                projectId,
                columnId: task.column_id,
                taskId: task.id,
                taskFields: task
            })
        );
    };

    const handleTaskMove = async (taskId: number, sourceColId: number, targetColId: number) => {
        await dispatch(
            fetchModifyTask({
                projectId,
                columnId: sourceColId,
                taskId: taskId,
                taskFields: { column_id: targetColId }
            })
        );
    };

    const handleDeleteTask = async (taskId: number, columnId: number) => {
        if (confirm("Удалить задачу?")) {
            await dispatch(fetchRemoveTask({ projectId, columnId, taskId }));
            setSelectedTask(null);
        }
    };

    if (!pipelineInfo) return <div className="flex h-full items-center justify-center text-muted-foreground">Загрузка...</div>;

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <KanbanBoard
                columns={columns}
                onTaskClick={(t: any) => setSelectedTask(t)}
                onTaskMove={handleTaskMove}
                updateColumn={(id: any, fields: any) => dispatch(fetchModifyColumn({ pipelineId, columnId: id, columnFields: fields }))}
                deleteColumn={(id: any) => dispatch(fetchRemoveColumn({ pipelineId, columnId: id }))}
                onCreateColumn={(name: string) => dispatch(fetchModifyColumn({ pipelineId, columnId: 0, columnFields: { name } as any }))}
            />

            <TaskModal
                task={selectedTask}
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                onSave={handleUpdateTask}
                onDelete={() => handleDeleteTask(selectedTask.id, selectedTask.column_id)}
                columns={columns}
                members={members}
            />

            <CreateTaskModal
                isOpen={isCreateTaskOpen}
                onClose={() => setCreateTaskOpen(false)}
                onCreate={(data: any) => dispatch(fetchCreateTask({ projectId, pipelineId, columnId: data.column_id, taskFields: data }))}
                columns={columns}
                members={members}
            />
        </div>
    );
}