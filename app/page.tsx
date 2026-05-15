"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { KanbanBoard } from "@/components/KanbanBoard";
import { ListView } from "@/components/ListView";
import { SummaryView } from "@/components/SummaryView";
import { TaskModal } from "@/components/TaskModal";
import { INITIAL_TASKS, Task } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { CreateTaskModal } from "@/components/CreateTaskModal";

type ViewMode = 'summary' | 'list' | 'board';

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [view, setView] = useState<ViewMode>('board');
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Header onCreateClick={() => setCreateModalOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Верхняя панель проекта */}
          <div className="px-8 pt-6 pb-2 border-b border-border/50 shrink-0">
            <div className="text-xs text-muted-foreground mb-4">Разделы / VictoryGroup</div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-yellow-500 rounded flex items-center justify-center text-xl font-bold text-black">V</div>
              <h1 className="text-2xl font-semibold text-foreground">VictoryGroup</h1>
            </div>

            {/* Табы переключения страниц */}
            <div className="flex gap-6 text-sm font-medium">
              <button onClick={() => setView('summary')} className={`pb-3 border-b-2 ${view === 'summary' ? 'border-blue-500 text-blue-500' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>Сводка</button>
              <button onClick={() => setView('list')} className={`pb-3 border-b-2 ${view === 'list' ? 'border-blue-500 text-blue-500' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>Список</button>
              <button onClick={() => setView('board')} className={`pb-3 border-b-2 ${view === 'board' ? 'border-blue-500 text-blue-500' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>Доска</button>
            </div>
          </div>

          {/* Фильтры (только для доски и списка) */}
          {view !== 'summary' && (
            <div className="px-8 py-4 flex items-center gap-3 shrink-0">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input placeholder="Поиск на доске" className="w-full bg-muted/30 border border-border/50 text-sm rounded-md pl-8 h-9 outline-none focus:border-blue-500 text-foreground transition-colors" />
              </div>
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-background flex items-center justify-center text-xs font-bold z-10">DK</div>
                <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs z-0">+</div>
              </div>
              <Button variant="secondary" size="sm" className="bg-muted/30">Фильтр</Button>
            </div>
          )}

          {/* Контентная часть */}
          <div className={`flex-1 overflow-hidden ${view === 'summary' ? 'p-8' : 'px-8 pb-4'}`}>
            {view === 'summary' && <SummaryView />}
            {view === 'list' && <ListView tasks={tasks} onTaskClick={setSelectedTask} />}
            {view === 'board' && <KanbanBoard tasks={tasks} setTasks={setTasks} onTaskClick={setSelectedTask} />}
          </div>
        </main>
      </div>

      <TaskModal task={selectedTask} isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} />
      <CreateTaskModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} />
    </div>
  );
}