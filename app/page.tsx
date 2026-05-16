"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { KanbanBoard } from "@/components/KanbanBoard";
import { ListView } from "@/components/ListView";
import { SummaryView } from "@/components/SummaryView";
import { TaskModal } from "@/components/TaskModal";
import { CreateTaskModal } from "@/components/CreateTaskModal";
import { INITIAL_TASKS, COLUMNS as INITIAL_COLUMNS, Task } from "@/lib/data";
import { Settings, Search } from "lucide-react";

type ViewMode = 'summary' | 'list' | 'board';

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [columns, setColumns] = useState(INITIAL_COLUMNS);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [view, setView] = useState<ViewMode>('board');
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Header onCreateClick={() => setCreateModalOpen(true)} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        <main className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
          <div className="px-8 pt-6 pb-0 shrink-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <span>Проекты</span> / <span>VictoryGroup</span>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-yellow-500 rounded flex items-center justify-center text-xl font-bold text-black shadow-sm">V</div>
              <h1 className="text-2xl font-semibold text-foreground">VictoryGroup</h1>
            </div>
            
            {/* Навигация проекта */}
            <div className="flex gap-6 text-sm font-medium border-b border-border/50">
              <button onClick={() => setView('summary')} className={`pb-3 border-b-2 ${view === 'summary' ? 'border-blue-600 text-blue-600' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>Сводка</button>
              <button onClick={() => setView('list')} className={`pb-3 border-b-2 ${view === 'list' ? 'border-blue-600 text-blue-600' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>Список</button>
              <button onClick={() => setView('board')} className={`pb-3 border-b-2 ${view === 'board' ? 'border-blue-600 text-blue-600' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>Доска</button>
              <button className="pb-3 text-muted-foreground hover:text-foreground flex items-center gap-1 border-b-2 border-transparent"><Settings className="w-4 h-4"/> Настройки проекта</button>
            </div>
          </div>

          {/* Строка поиска для Доски и Списка */}
          {view !== 'summary' && (
            <div className="px-8 py-4 flex items-center gap-3 shrink-0">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
                <input 
                  placeholder={view === 'board' ? "Поиск на доске" : "Поиск по задачам"} 
                  className="w-full bg-muted/30 border text-sm rounded-md pl-8 h-8 outline-none focus:border-blue-500 text-foreground transition-colors" 
                />
              </div>
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-background flex items-center justify-center text-xs text-white font-bold z-10">DK</div>
              </div>
            </div>
          )}

          <div className={`flex-1 overflow-hidden ${view === 'summary' ? 'p-8 pt-4' : 'px-8 pb-4'}`}>
            {view === 'summary' && <SummaryView />}
            {view === 'list' && <ListView tasks={tasks} onTaskClick={setSelectedTask} />}
            {view === 'board' && <KanbanBoard tasks={tasks} setTasks={setTasks} columns={columns} setColumns={setColumns} onTaskClick={setSelectedTask} />}
          </div>
        </main>
      </div>

      <TaskModal task={selectedTask} isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} />
      <CreateTaskModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} />
    </div>
  );
}