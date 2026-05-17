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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

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
                            <Check className="w-3 h-3" /> KAN-{task.id}
                        </span>
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center border text-[10px] font-bold uppercase">
                            {task.author ? task.author.charAt(0) : "U"}
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

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(col.name || col.title);

    const style = { transform: CSS.Translate.toString(transform), transition };

    if (isDragging && !isOverlay) {
        return <div ref={setNodeRef} style={style} className="w-[300px] h-[500px] shrink-0 bg-blue-500/5 border-2 border-dashed border-blue-500/20 rounded-lg" />;
    }

    return (
        <div ref={setNodeRef} style={style} className={`flex flex-col w-[300px] shrink-0 bg-muted/30 rounded-lg overflow-hidden h-max transition-shadow ${isOverlay ? "shadow-2xl ring-1 ring-black/5 rotate-1" : ""}`}>
            <div style={{ backgroundColor: col.color || '#ebecf0' }} className="h-1.5 w-full" />

            <div className="p-3 pb-2 flex items-center justify-between group">
                <div {...attributes} {...listeners} className="flex items-center gap-2 flex-1 cursor-grab active:cursor-grabbing">
                    {isEditing ? (
                        <input
                            autoFocus
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={() => { setIsEditing(false); updateColumn && updateColumn(col.id, { name: title }); }}
                            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
                            className="text-[11px] font-bold uppercase bg-background border border-blue-500 px-1 rounded w-[150px] outline-none text-foreground"
                        />
                    ) : (
                        <span onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight hover:text-foreground cursor-text">
                            {col.name || col.title}
                        </span>
                    )}
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full font-bold">
                        {tasks.length}
                    </span>
                </div>
                
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center justify-center w-6 h-6 rounded hover:bg-muted-foreground/20 text-muted-foreground/50 group-hover:text-foreground outline-none transition-colors data-[state=open]:text-foreground">
                            <MoreVertical className="w-3 h-3" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => setIsEditing(true)}><Edit2 className="w-4 h-4 mr-2" /> Переименовать</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteColumn && deleteColumn(col.id)} className="text-red-500"><Trash2 className="w-4 h-4 mr-2" /> Удалить</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <GripHorizontal className="w-4 h-4 text-muted-foreground/50 group-hover:text-muted-foreground cursor-grab active:cursor-grabbing" />
                </div>
            </div>

            <div className="flex-1 mt-1 px-2 pb-2 min-h-[100px]">
                <SortableContext items={tasks.map((t: any) => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task: any) => (
                        <DraggableTask key={task.id} task={task} onClick={() => onTaskClick(task)} />
                    ))}
                </SortableContext>

                {creatingInCol === col.id ? (
                    <div className="bg-card border-2 border-blue-500 rounded p-2 shadow-sm mt-1 flex flex-col gap-2">
                        <input
                            autoFocus
                            value={inlineTitle}
                            onChange={(e) => setInlineTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleInlineCreate(col.id, inlineTitle);
                                if (e.key === "Escape") setCreatingInCol(null);
                            }}
                            placeholder="Что нужно сделать?"
                            className="w-full text-sm bg-transparent outline-none text-foreground"
                        />
                        <button onClick={() => handleInlineCreate(col.id, inlineTitle)} className="self-end p-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                            <CornerDownLeft className="w-3 h-3" />
                        </button>
                    </div>
                ) : (
                    <button onClick={() => setCreatingInCol(col.id)} className="w-full text-sm text-muted-foreground hover:bg-muted p-2 rounded text-left flex items-center gap-2 mt-1 font-medium transition-colors">
                        <Plus className="w-4 h-4" /> Создать задачу
                    </button>
                )}
            </div>
        </div>
    );
}

export function KanbanBoard({ columns = [], onTaskClick, updateColumn, deleteColumn, onTaskMove, handleInlineCreate, onCreateColumn }: any) {
    const [activeItem, setActiveItem] = useState<any>(null);
    const [activeType, setActiveType] = useState<"Column" | "Task" | null>(null);

    const [creatingInCol, setCreatingInCol] = useState<number | null>(null);
    const [inlineTitle, setInlineTitle] = useState("");

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    const onDragStart = (e: any) => {
        const type = e.active.data.current?.type;
        setActiveType(type);
        setActiveItem(type === "Column" ? e.active.data.current.col : e.active.data.current.task);
    };

    const onDragEnd = (e: any) => {
        const { active, over } = e;
        setActiveItem(null);
        setActiveType(null);
        if (!over) return;

        if (activeType === "Task") {
            const taskId = active.id;
            const sourceColId = active.data.current.task.column_id;
            const targetColId = columns.find((c: any) => c.id === over.id)?.id || 
                                columns.find((c: any) => c.tasks?.some((t: any) => t.id === over.id))?.id;
            
            if (targetColId && sourceColId !== targetColId && onTaskMove) {
                onTaskMove(taskId, sourceColId, targetColId);
            }
        }
    };

    const submitInlineCreate = (colId: number, title: string) => {
        if (!title.trim()) { setCreatingInCol(null); return; }
        if (handleInlineCreate) handleInlineCreate(colId, title);
        setInlineTitle("");
        setCreatingInCol(null);
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onDragStart} onDragEnd={onDragEnd}>
            <div className="flex gap-4 h-full overflow-x-auto pb-4 items-start scrollbar-hide">
                <SortableContext items={columns.map((c: any) => c.id)} strategy={horizontalListSortingStrategy}>
                    {columns.map((col: any) => (
                        <Column
                            key={col.id} col={col} tasks={col.tasks || []} 
                            onTaskClick={onTaskClick} updateColumn={updateColumn} deleteColumn={deleteColumn}
                            creatingInCol={creatingInCol} setCreatingInCol={setCreatingInCol}
                            inlineTitle={inlineTitle} setInlineTitle={setInlineTitle} handleInlineCreate={submitInlineCreate}
                        />
                    ))}
                </SortableContext>
                
                <button
                    onClick={() => {
                        const title = prompt("Введите название новой колонки:");
                        if (title && title.trim() && onCreateColumn) onCreateColumn(title.trim());
                    }}
                    className="shrink-0 w-[300px] h-12 rounded-lg bg-muted/20 border-2 border-dashed border-border flex items-center justify-center text-sm font-medium text-muted-foreground hover:bg-muted hover:border-blue-500/30 transition-all"
                >
                    <Plus className="w-4 h-4 mr-2" /> Добавить колонку
                </button>
            </div>

            <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: "0.5" } } }) }}>
                {activeType === "Task" ? <DraggableTask task={activeItem} isOverlay /> : activeType === "Column" ? <Column col={activeItem} tasks={activeItem.tasks || []} isOverlay /> : null}
            </DragOverlay>
        </DndContext>
    );
}