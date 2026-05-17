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
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/shared/ui/card";
import { Check, GripHorizontal, Plus, CornerDownLeft, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";
import { Button } from "@/shared/ui/button";

function DraggableTask({ task, onClick, isOverlay }: any) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: { type: "Task", task },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging && !isOverlay ? 0.3 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={onClick}>
            <Card className={`cursor-grab active:cursor-grabbing border bg-card mb-2 ${isOverlay ? "shadow-xl rotate-2 scale-105 border-blue-500/50" : "hover:border-blue-500/50 shadow-sm transition-colors"}`}>
                <CardContent className="p-3 flex flex-col gap-2">
                    <div className="text-sm text-foreground leading-snug">{task.title}</div>
                    <div className="flex justify-between items-center mt-1">
                        <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1 uppercase tracking-wider">
                            <Check className="w-3 h-3 text-primary" /> KAN-{task.id}
                        </span>
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center border text-[10px] font-bold uppercase">
                            {task.author?.charAt(0) || "U"}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function Column({ col, tasks = [], onTaskClick, updateColumn, deleteColumn, isOverlay, creatingInCol, setCreatingInCol, inlineTitle, setInlineTitle, handleInlineCreate }: any) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: col.id,
        data: { type: "Column", col },
    });

    const style = { transform: CSS.Translate.toString(transform), transition };

    if (isDragging && !isOverlay) {
        return <div ref={setNodeRef} style={style} className="w-[300px] h-[500px] shrink-0 bg-blue-500/5 border-2 border-dashed border-blue-500/20 rounded-lg" />;
    }

    return (
        <div ref={setNodeRef} style={style} className={`flex flex-col w-[300px] shrink-0 bg-muted/30 rounded-lg overflow-hidden h-max transition-shadow ${isOverlay ? "shadow-2xl ring-1 ring-black/5 rotate-1" : ""}`}>
            <div style={{ backgroundColor: col.color || '#ebecf0' }} className="h-1.5 w-full" />
            <div className="p-3 pb-2 flex items-center justify-between group">
                <div {...attributes} {...listeners} className="flex items-center gap-2 flex-1 cursor-grab active:cursor-grabbing">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">{col.name}</span>
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full font-bold">{tasks.length}</span>
                </div>
                <div className="flex items-center gap-1">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="w-6 h-6"><MoreVertical className="w-3 h-3" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => updateColumn(col.id, { name: prompt("Новое имя", col.name) })}><Edit2 className="w-4 h-4 mr-2" /> Переименовать</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteColumn(col.id)} className="text-red-500"><Trash2 className="w-4 h-4 mr-2" /> Удалить</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <GripHorizontal className="w-4 h-4 text-muted-foreground/50 cursor-grab" />
                </div>
            </div>
            <div className="flex-1 mt-1 px-2 pb-2 min-h-[100px]">
                <SortableContext items={tasks.map((t: any) => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task: any) => <DraggableTask key={task.id} task={task} onClick={() => onTaskClick(task)} />)}
                </SortableContext>
                <button onClick={() => setCreatingInCol(col.id)} className="w-full text-sm text-muted-foreground hover:bg-muted p-2 rounded text-left flex items-center gap-2 mt-1 font-medium transition-colors">
                    <Plus className="w-4 h-4" /> Создать задачу
                </button>
            </div>
        </div>
    );
}

export function KanbanBoard({ columns = [], onTaskClick, updateColumn, deleteColumn, onTaskMove }: any) {
    const [activeItem, setActiveItem] = useState<any>(null);
    const [activeType, setActiveType] = useState<any>(null);
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    const onDragStart = (e: any) => {
        const data = e.active.data.current;
        setActiveType(data.type);
        setActiveItem(data.type === "Column" ? data.col : data.task);
    };

    const onDragEnd = (e: any) => {
        const { active, over } = e;
        setActiveItem(null); setActiveType(null);
        if (!over) return;

        if (activeType === "Task") {
            const task = active.data.current.task;
            // Ищем ID колонки: либо это ID самого over, либо это ID колонки, в которой лежит задача over
            const targetColId = columns.find((c: any) => c.id === over.id)?.id || 
                                columns.find((c: any) => c.tasks?.some((t: any) => t.id === over.id))?.id;
            
            if (targetColId && task.column_id !== targetColId && onTaskMove) {
                onTaskMove(task.id, task.column_id, targetColId);
            }
        }
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onDragStart} onDragEnd={onDragEnd}>
            <div className="flex gap-4 h-full overflow-x-auto pb-4 items-start scrollbar-hide">
                <SortableContext items={columns.map((c: any) => c.id)} strategy={horizontalListSortingStrategy}>
                    {columns.map((col: any) => (
                        <Column key={col.id} col={col} tasks={col.tasks || []} onTaskClick={onTaskClick} updateColumn={updateColumn} deleteColumn={deleteColumn} />
                    ))}
                </SortableContext>
            </div>
            <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: "0.5" } } }) }}>
                {activeType === "Task" ? <DraggableTask task={activeItem} isOverlay /> : activeType === "Column" ? <Column col={activeItem} tasks={activeItem.tasks} isOverlay /> : null}
            </DragOverlay>
        </DndContext>
    );
}