"use client";

import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    horizontalListSortingStrategy,
    arrayMove,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/shared/ui/card";
import {
    Task,
    TaskStatus,
    COLUMNS as INITIAL_COLUMNS,
} from "../shared/lib/data";
import {
    Check,
    User,
    GripHorizontal,
    Plus,
    CornerDownLeft,
} from "lucide-react";
import { useState, useMemo } from "react";

// --- КОМПОНЕНТ ЗАДАЧИ ---
function DraggableTask({ task, onClick, isOverlay }: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: { type: "Task", task },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging && !isOverlay ? 0.3 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onClick}
        >
            <Card
                className={`cursor-grab active:cursor-grabbing border bg-card mb-2 ${isOverlay ? "shadow-xl rotate-2 scale-105 border-blue-500/50" : "hover:border-blue-500/50 shadow-sm transition-colors"}`}
            >
                <CardContent className="p-3 flex flex-col gap-2">
                    <div className="text-sm text-foreground leading-snug">
                        {task.title}
                    </div>
                    <div className="flex justify-between items-center mt-1">
                        <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1 uppercase tracking-wider">
                            <Check className="w-3 h-3" /> {task.id}
                        </span>
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center border text-[10px] font-bold">
                            DK
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// --- КОМПОНЕНТ КОЛОНКИ ---
function Column({
    col,
    tasks,
    onTaskClick,
    updateColumnName,
    isOverlay,
    creatingInCol,
    setCreatingInCol,
    inlineTitle,
    setInlineTitle,
    handleInlineCreate,
}: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: col.id,
        data: { type: "Column", col },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    // Если колонку тащат, на её месте рисуем "призрак"
    if (isDragging && !isOverlay) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="w-[300px] h-[500px] shrink-0 bg-blue-500/5 border-2 border-dashed border-blue-500/20 rounded-lg"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex flex-col w-[300px] shrink-0 bg-muted/30 rounded-lg p-2 h-max transition-shadow ${isOverlay ? "shadow-2xl ring-1 ring-black/5 rotate-1" : ""}`}
        >
            {/* Шапка - ручка для перетаскивания */}
            <div
                {...attributes}
                {...listeners}
                className="p-2 flex items-center justify-between group cursor-grab active:cursor-grabbing"
            >
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">
                        {col.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full font-bold">
                        {tasks.length}
                    </span>
                </div>
                <GripHorizontal className="w-4 h-4 text-muted-foreground/50 group-hover:text-muted-foreground" />
            </div>

            <div className="flex-1 mt-2 min-h-[100px]">
                <SortableContext
                    items={tasks.map((t: any) => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {tasks.map((task: any) => (
                        <DraggableTask
                            key={task.id}
                            task={task}
                            onClick={() => onTaskClick(task)}
                        />
                    ))}
                </SortableContext>

                {creatingInCol === col.id ? (
                    <div className="bg-card border-2 border-blue-500 rounded p-2 shadow-sm mt-1">
                        <input
                            autoFocus
                            value={inlineTitle}
                            onChange={(e) => setInlineTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter")
                                    handleInlineCreate(col.id);
                                if (e.key === "Escape") setCreatingInCol(null);
                            }}
                            placeholder="Что нужно сделать?"
                            className="w-full text-sm bg-transparent outline-none text-foreground mb-2"
                        />
                        <div className="flex justify-between items-center text-muted-foreground">
                            <div className="flex gap-2">
                                <Check className="w-4 h-4" />
                                <User className="w-4 h-4" />
                            </div>
                            <button
                                onClick={() => handleInlineCreate(col.id)}
                                className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                <CornerDownLeft className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setCreatingInCol(col.id)}
                        className="w-full text-sm text-muted-foreground hover:bg-muted p-2 rounded text-left flex items-center gap-2 mt-1 font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Создать задачу
                    </button>
                )}
            </div>
        </div>
    );
}

// --- ОСНОВНАЯ ДОСКА ---
export function KanbanBoard({
    tasks,
    setTasks,
    columns,
    setColumns,
    onTaskClick,
}: any) {
    const [activeItem, setActiveItem] = useState<any>(null);
    const [activeType, setActiveType] = useState<"Column" | "Task" | null>(
        null,
    );

    const [creatingInCol, setCreatingInCol] = useState<string | null>(null);
    const [inlineTitle, setInlineTitle] = useState("");

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    );

    const onDragStart = (e: any) => {
        const type = e.active.data.current?.type;
        setActiveType(type);
        setActiveItem(
            type === "Column"
                ? e.active.data.current.col
                : e.active.data.current.task,
        );
    };

    const onDragEnd = (e: any) => {
        const { active, over } = e;
        setActiveItem(null);
        setActiveType(null);
        if (!over) return;

        if (activeType === "Column") {
            if (active.id !== over.id) {
                const oldIndex = columns.findIndex(
                    (c: any) => c.id === active.id,
                );
                const newIndex = columns.findIndex(
                    (c: any) => c.id === over.id,
                );
                setColumns(arrayMove(columns, oldIndex, newIndex));
            }
        } else if (activeType === "Task") {
            const overColId =
                columns.find((c: any) => c.id === over.id)?.id ||
                tasks.find((t: any) => t.id === over.id)?.status;
            if (overColId) {
                setTasks((prev: any) =>
                    prev.map((t: any) =>
                        t.id === active.id ? { ...t, status: overColId } : t,
                    ),
                );
            }
        }
    };

    const handleInlineCreate = (colId: string) => {
        if (!inlineTitle.trim()) {
            setCreatingInCol(null);
            return;
        }
        const newTask: Task = {
            id: `KAN-${Date.now().toString().slice(-4)}`,
            title: inlineTitle,
            description: "",
            status: colId as TaskStatus,
            priority: "Medium",
            author: "Diniar Karimov",
            assignee: null,
            createdAt: new Date().toLocaleDateString(),
            updatedAt: "Только что",
        };
        setTasks([...tasks, newTask]);
        setInlineTitle("");
        setCreatingInCol(null);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
        >
            <div className="flex gap-4 h-full overflow-x-auto pb-4 items-start scrollbar-hide">
                <SortableContext
                    items={columns.map((c: any) => c.id)}
                    strategy={horizontalListSortingStrategy}
                >
                    {columns.map((col: any) => (
                        <Column
                            key={col.id}
                            col={col}
                            tasks={tasks.filter(
                                (t: any) => t.status === col.id,
                            )}
                            onTaskClick={onTaskClick}
                            creatingInCol={creatingInCol}
                            setCreatingInCol={setCreatingInCol}
                            inlineTitle={inlineTitle}
                            setInlineTitle={setInlineTitle}
                            handleInlineCreate={handleInlineCreate}
                        />
                    ))}
                </SortableContext>

                <button
                    onClick={() =>
                        setColumns([
                            ...columns,
                            { id: `col-${Date.now()}`, title: "Новая колонка" },
                        ])
                    }
                    className="shrink-0 w-[300px] h-12 rounded-lg bg-muted/20 border-2 border-dashed border-border flex items-center justify-center text-sm font-medium text-muted-foreground hover:bg-muted hover:border-blue-500/30 transition-all"
                >
                    <Plus className="w-4 h-4 mr-2" /> Добавить колонку
                </button>
            </div>

            <DragOverlay
                dropAnimation={{
                    sideEffects: defaultDropAnimationSideEffects({
                        styles: { active: { opacity: "0.5" } },
                    }),
                }}
            >
                {activeType === "Task" ? (
                    <DraggableTask task={activeItem} isOverlay />
                ) : activeType === "Column" ? (
                    <Column
                        col={activeItem}
                        tasks={tasks.filter(
                            (t: any) => t.status === activeItem.id,
                        )}
                        isOverlay
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
