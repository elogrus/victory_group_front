"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks";
import {
    fetchCreateTask,
    fetchModifyTask,
    fetchRemoveTask,
    fetchCreateColumn,
    fetchModifyColumn,
    fetchRemoveColumn,
    selectPipelineInfo,
} from "@/features/Dashboard/providers/Pipeline/slice";

import { KanbanBoard } from "@/widgets/KanbanBoard/KanbanBoard";
import { TaskModal } from "@/entity/Task/ui/TaskModal";
import { CreateTaskModal } from "@/features/Dashboard/ui/CreateTaskModal";
import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";

export default function BoardPage() {
    const dispatch = useAppDispatch();
    const params = useParams();

    // Берем информацию о пайплайне из твоего селектора
    const pipelineInfo = useAppSelector(selectPipelineInfo);
    const columns = pipelineInfo?.columns || [];

    // Локальные стейты для UI модалок
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [isCreateTaskOpen, setCreateTaskOpen] = useState(false);
    const [defaultColumnId, setDefaultColumnId] = useState<number | null>(null);

    const projectId = Number(params.projectId);
    const pipelineId = Number(params.pipelineId);

    // --- ОБРАБОТЧИКИ ЗАДАЧ ---
    const handleCreateTask = async (taskData: any) => {
        if (!projectId || !pipelineId) return;

        const targetColId = taskData.column_id || defaultColumnId || columns[0]?.id;

        await dispatch(
            fetchCreateTask({
                projectId,
                pipelineId,
                columnId: targetColId,
                taskFields: {
                    external_id: `ext-${Date.now()}`,
                    title: taskData.title,
                    description: taskData.description || "",
                    column_id: targetColId,
                    pipeline_id: pipelineId,
                    priority: taskData.priority || 2,
                    order: 0,
                    ...(taskData.deadline ? { deadline: taskData.deadline } : {})
                },
            })
        );
        setCreateTaskOpen(false);
        setDefaultColumnId(null);
    };

    const handleUpdateTask = async (updatedFields: any) => {
        if (!projectId || !selectedTask) return;

        await dispatch(
            fetchModifyTask({
                projectId,
                columnId: selectedTask.column_id,
                taskId: selectedTask.id,
                taskFields: {
                    title: updatedFields.title,
                    description: updatedFields.description,
                    priority: updatedFields.priority,
                    column_id: updatedFields.status, // Статус в UI — это column_id
                    deadline: updatedFields.deadline
                },
            })
        );
        setSelectedTask(null);
    };

    const handleDeleteTask = async (taskId: number, columnId: number) => {
        if (!projectId) return;

        if (confirm("Вы уверены, что хотите удалить эту задачу?")) {
            await dispatch(fetchRemoveTask({ projectId, columnId, taskId }));
            setSelectedTask(null);
        }
    };

    const handleTaskMove = async (taskId: number, sourceColId: number, targetColId: number) => {
        if (!projectId) return;

        await dispatch(
            fetchModifyTask({
                projectId,
                columnId: sourceColId,
                taskId,
                taskFields: {
                    column_id: targetColId,
                },
            })
        );
    };

    // --- ОБРАБОТЧИКИ КОЛОНОК ---
    const handleCreateColumn = async (name: string) => {
        if (!pipelineId) return;
        await dispatch(
            fetchCreateColumn({
                pipelineId,
                columnFields: { 
                    name, 
                    order: columns.length,
                    pipeline_id: pipelineId,
                    tasks: []
                } as any,
            })
        );
    };

    const handleUpdateColumn = async (columnId: number, columnFields: any) => {
        if (!pipelineId) return;
        await dispatch(fetchModifyColumn({ pipelineId, columnId, columnFields }));
    };

    const handleDeleteColumn = async (columnId: number) => {
        if (!pipelineId) return;
        if (confirm("Удалить колонку и все её задачи?")) {
            await dispatch(fetchRemoveColumn({ pipelineId, columnId }));
        }
    };

    const openCreateModalForColumn = (columnId: number) => {
        setDefaultColumnId(columnId);
        setCreateTaskOpen(true);
    };

    if (!pipelineInfo) {
        return <div className="flex h-full items-center justify-center text-muted-foreground">Загрузка доски...</div>;
    }

    return (
        <div className="flex flex-col h-full overflow-hidden animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-4 shrink-0 px-1">
                <h2 className="text-lg font-semibold text-foreground">
                    {pipelineInfo.name || "Доска задач"}
                </h2>
                {columns.length > 0 && (
                    <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                        onClick={() => openCreateModalForColumn(columns[0].id)}
                    >
                        <Plus className="w-4 h-4 mr-2" /> Создать задачу
                    </Button>
                )}
            </div>

            <div className="flex-1 overflow-hidden">
                <KanbanBoard
                    columns={columns}
                    onTaskClick={(task: any) => setSelectedTask(task)}
                    onTaskMove={handleTaskMove}
                    onCreateColumn={handleCreateColumn}
                    updateColumn={handleUpdateColumn}
                    deleteColumn={handleDeleteColumn}
                    handleInlineCreate={(columnId: number, title: string) => {
                        // Быстрое создание из-под колонки
                        handleCreateTask({ column_id: columnId, title, priority: 2 });
                    }}
                />
            </div>

            <TaskModal
                task={selectedTask}
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                onSave={handleUpdateTask}
                onDelete={() => handleDeleteTask(selectedTask.id, selectedTask.column_id)}
                columns={columns}
            />

            <CreateTaskModal
                isOpen={isCreateTaskOpen}
                onClose={() => { setCreateTaskOpen(false); setDefaultColumnId(null); }}
                onCreate={handleCreateTask}
                columns={columns}
                defaultColumnId={defaultColumnId}
            />
        </div>
    );
}