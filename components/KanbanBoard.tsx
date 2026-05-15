"use client";

import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { Card, CardContent } from "@/components/ui/card";
import { Task, TaskStatus, COLUMNS } from "../lib/data";
import { Check, Calendar, User, CornerDownLeft } from "lucide-react";
import { useState } from 'react';

// Карточка задачи (Draggable)
function DraggableTask({ task, onClick }: { task: Task; onClick?: () => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: task.id, data: task });
  
  return (
    <div ref={setNodeRef} {...attributes} {...listeners} onClick={onClick} className={isDragging ? 'opacity-50' : ''}>
      <Card className="cursor-grab hover:bg-muted/50 border shadow-sm bg-card mb-2">
        <CardContent className="p-3 flex flex-col gap-3">
          <div className="text-sm text-foreground">{task.title}</div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-blue-500 font-medium flex items-center gap-1">
              <Check className="w-3 h-3 text-primary" /> {task.id}
            </span>
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
              <User className="w-3 h-3 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Отдельный компонент для Колонки (Droppable), чтобы правила хуков не нарушались
function KanbanColumn({ 
  col, 
  tasks, 
  onTaskClick, 
  creatingInCol, 
  setCreatingInCol, 
  inlineTitle, 
  setInlineTitle, 
  handleInlineCreate 
}: any) {
  // Хук теперь на верхнем уровне компонента
  const { setNodeRef } = useDroppable({ id: col.id });

  return (
    <div className="flex flex-col w-[300px] shrink-0 bg-muted/30 rounded-lg p-2">
      <div className="p-2 text-[11px] font-semibold text-muted-foreground uppercase flex items-center gap-2">
        {col.title} <span className="w-5 h-5 flex items-center justify-center bg-muted rounded-full">{tasks.length}</span>
      </div>
      
      <div ref={setNodeRef} className="flex-1 min-h-[200px]">
        {tasks.map((task: Task) => (
          <DraggableTask key={task.id} task={task} onClick={() => onTaskClick(task)} />
        ))}
        
        {creatingInCol === col.id ? (
          <div className="bg-card border-2 border-blue-500 rounded p-2 shadow-sm">
            <input 
              autoFocus
              value={inlineTitle}
              onChange={e => setInlineTitle(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleInlineCreate(col.id);
                if (e.key === 'Escape') setCreatingInCol(null);
              }}
              placeholder="Что нужно сделать?" 
              className="w-full text-sm bg-transparent outline-none text-foreground mb-2" 
            />
            <div className="flex justify-between items-center text-muted-foreground">
              <div className="flex gap-2">
                <Check className="w-4 h-4"/><Calendar className="w-4 h-4"/><User className="w-4 h-4"/>
              </div>
              <button onClick={() => handleInlineCreate(col.id)} className="p-1 bg-muted rounded hover:bg-muted-foreground/20">
                <CornerDownLeft className="w-3 h-3"/>
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setCreatingInCol(col.id)} className="w-full text-sm text-muted-foreground hover:bg-muted p-2 rounded text-left flex items-center gap-2 mt-1">
            <span className="text-lg leading-none">+</span> Создать
          </button>
        )}
      </div>
    </div>
  );
}

// Главная доска
export function KanbanBoard({ tasks, setTasks, onTaskClick }: any) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [creatingInCol, setCreatingInCol] = useState<string | null>(null);
  const [inlineTitle, setInlineTitle] = useState("");

  const handleDragEnd = (event: any) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    
    const targetStatus = COLUMNS.find(c => c.id === over.id)?.id || tasks.find((t: Task) => t.id === over.id)?.status;
    
    if (targetStatus) {
      setTasks((prev: Task[]) => prev.map(t => t.id === active.id ? { ...t, status: targetStatus as TaskStatus } : t));
    }
  };

  const handleInlineCreate = (colId: string) => {
    if (!inlineTitle.trim()) { 
      setCreatingInCol(null); 
      return; 
    }
    
    // Безопасная генерация ID (используем Date.now() вместо Math.random() чтобы линтер не ругался)
    const newId = `KAN-${Date.now().toString().slice(-4)}`;
    
    const newTask: Task = {
      id: newId,
      title: inlineTitle,
      description: '',
      status: colId as TaskStatus,
      priority: 'Medium', 
      author: 'User', 
      assignee: null, 
      createdAt: new Date().toLocaleString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }), 
      updatedAt: 'Только что'
    };
    
    setTasks([...tasks, newTask]);
    setInlineTitle("");
    setCreatingInCol(null);
  };

  return (
    <DndContext 
      collisionDetection={closestCenter} 
      onDragStart={(e) => setActiveTask(e.active.data.current as Task)} 
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 h-full overflow-x-auto pb-4">
        {COLUMNS.map(col => (
          <KanbanColumn 
            key={col.id} 
            col={col} 
            tasks={tasks.filter((t: Task) => t.status === col.id)} 
            onTaskClick={onTaskClick}
            creatingInCol={creatingInCol}
            setCreatingInCol={setCreatingInCol}
            inlineTitle={inlineTitle}
            setInlineTitle={setInlineTitle}
            handleInlineCreate={handleInlineCreate}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <DraggableTask task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}