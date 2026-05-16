"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { KanbanBoard } from "@/components/KanbanBoard";
import { ListView } from "@/components/ListView";
import { SummaryView } from "@/components/SummaryView";
import { TaskModal } from "@/components/TaskModal";
import { CreateTaskModal } from "@/components/CreateTaskModal";
import { CreateProjectModal } from "@/components/CreateProjectModal";
import { INITIAL_PROJECTS, Project, Task } from "@/shared/lib/data";
import { Settings, Search, Layout, Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";

type ViewMode = "summary" | "list" | "board";

export default function Dashboard() {
    const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
    
    const [activeProjId, setActiveProjId] = useState(INITIAL_PROJECTS[0].id);
    const [activeBoardId, setActiveBoardId] = useState(INITIAL_PROJECTS[0].boards[0].id);
    const [view, setView] = useState<ViewMode>("board");

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isProjectModalOpen, setProjectModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const activeProject = projects.find(p => p.id === activeProjId) || projects[0];
    const activeBoard = activeProject.boards.find(b => b.id === activeBoardId) || activeProject.boards[0];

    const handleCreateProject = (name: string) => {
        const newProjId = `proj-${Date.now()}`;
        const newBoardId = `board-${Date.now()}`;
        const newProj: Project = {
            id: newProjId,
            name,
            boards: [{ id: newBoardId, name: "Основная доска", columns: [{ id: "todo", title: "TO DO", color: "#ebecf0" }], tasks: [] }]
        };
        setProjects([...projects, newProj]);
        setActiveProjId(newProjId);
        setActiveBoardId(newBoardId);
    };

    const handleCreateBoard = () => {
        const name = prompt("Введите название новой доски:");
        if (!name?.trim()) return;
        
        const newBoardId = `board-${Date.now()}`;
        const newBoard = {
            id: newBoardId, name,
            columns: [{ id: "todo", title: "TO DO", color: "#ebecf0" }],
            tasks: []
        };
        
        setProjects(prev => prev.map(p => p.id === activeProjId ? { ...p, boards: [...p.boards, newBoard] } : p));
        setActiveBoardId(newBoardId);
    };

    const setBoardTasks = (newTasks: any) => {
        setProjects(prev => prev.map(p => p.id === activeProjId ? {
            ...p, boards: p.boards.map(b => b.id === activeBoardId ? { ...b, tasks: typeof newTasks === 'function' ? newTasks(b.tasks) : newTasks } : b)
        } : p));
    };

    const setBoardColumns = (newCols: any) => {
        setProjects(prev => prev.map(p => p.id === activeProjId ? {
            ...p, boards: p.boards.map(b => b.id === activeBoardId ? { ...b, columns: typeof newCols === 'function' ? newCols(b.columns) : newCols } : b)
        } : p));
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">
            <Header onCreateClick={() => setCreateModalOpen(true)} />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar 
                    isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} 
                    projects={projects} activeProjId={activeProjId}
                    onSelect={(id: string) => {
                        setActiveProjId(id);
                        const proj = projects.find(p => p.id === id);
                        if(proj && proj.boards.length > 0) setActiveBoardId(proj.boards[0].id);
                    }}
                    onNewProject={() => setProjectModalOpen(true)}
                />

                <main className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
                    <div className="px-8 pt-6 pb-0 shrink-0">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                            <span>Проекты</span> / <span>{activeProject.name}</span>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-blue-600/10 rounded flex items-center justify-center text-xl font-bold text-blue-600 border border-blue-600/20">
                                {activeProject.name.charAt(0).toUpperCase()}
                            </div>
                            <h1 className="text-2xl font-semibold text-foreground">
                                {activeProject.name}
                            </h1>
                            <Button variant="ghost" size="sm" className="ml-auto text-muted-foreground hover:text-foreground">
                                <Settings className="w-4 h-4 mr-2" /> Настройки проекта
                            </Button>
                        </div>

                        <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar py-1">
                            {activeProject.boards.map(board => (
                                <button
                                    key={board.id}
                                    onClick={() => setActiveBoardId(board.id)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors whitespace-nowrap ${board.id === activeBoardId ? 'bg-muted border-border text-foreground shadow-sm' : 'border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
                                >
                                    <Layout className="w-4 h-4" /> {board.name}
                                </button>
                            ))}
                            <Button onClick={handleCreateBoard} variant="ghost" size="sm" className="h-8 rounded-md text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                <Plus className="w-4 h-4 mr-1"/> Добавить доску
                            </Button>
                        </div>

                        <div className="flex gap-6 text-sm font-medium border-b border-border/50">
                            <button onClick={() => setView("summary")} className={`pb-3 border-b-2 transition-colors ${view === "summary" ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground hover:text-foreground"}`}>Сводка</button>
                            <button onClick={() => setView("list")} className={`pb-3 border-b-2 transition-colors ${view === "list" ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground hover:text-foreground"}`}>Список</button>
                            <button onClick={() => setView("board")} className={`pb-3 border-b-2 transition-colors ${view === "board" ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground hover:text-foreground"}`}>Доска</button>
                        </div>
                    </div>

                    {view !== "summary" && (
                        <div className="px-8 py-4 flex items-center gap-3 shrink-0">
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
                                <input placeholder={view === "board" ? "Поиск на доске" : "Поиск по задачам"} className="w-full bg-muted/30 border text-sm rounded-md pl-8 h-8 outline-none focus:border-blue-500 text-foreground transition-colors" />
                            </div>
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-background flex items-center justify-center text-xs text-white font-bold z-10">DK</div>
                            </div>
                        </div>
                    )}

                    <div className={`flex-1 overflow-hidden ${view === "summary" ? "p-8 pt-4" : "px-8 pb-4"}`}>
                        {view === "summary" && <SummaryView />}
                        {view === "list" && <ListView tasks={activeBoard.tasks} onTaskClick={setSelectedTask} />}
                        {view === "board" && <KanbanBoard tasks={activeBoard.tasks} setTasks={setBoardTasks} columns={activeBoard.columns} setColumns={setBoardColumns} onTaskClick={setSelectedTask} />}
                    </div>
                </main>
            </div>

            <TaskModal task={selectedTask} isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} />
            <CreateTaskModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} />
            <CreateProjectModal isOpen={isProjectModalOpen} onClose={() => setProjectModalOpen(false)} onCreate={handleCreateProject} />
        </div>
    );
}