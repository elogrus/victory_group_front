"use client";

import { useState } from "react";
import { Header } from "@/widgets/Header/Header";
import { Sidebar } from "@/widgets/Sidebar/Sidebar";
import { KanbanBoard } from "@/widgets/KanbanBoard/KanbanBoard";
import { ListView } from "@/entity/Task/ui/ListView";
import { SummaryView } from "@/entity/Project/ui/SummaryView";
import { TaskModal } from "@/entity/Task/ui/TaskModal";
import { CreateTaskModal } from "@/features/Task/CreateTaskModal";
import { CreateProjectModal } from "@/features/Project/CreateProjectModal";
import { CreateBoardModal } from "@/features/Board/CreateBoardModal";
import { INITIAL_PROJECTS, Project, Task } from "@/shared/lib/data";
import { Settings, Search, Layout, Plus, MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";

// DND imports для вкладок
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, horizontalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type ViewMode = "summary" | "list" | "board";

// Компонент перетаскиваемой вкладки доски
function SortableBoardTab({ board, isActive, onClick, onRename, onDelete }: any) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: board.id });
    
    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div 
            ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={onClick}
            className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors whitespace-nowrap cursor-pointer ${isActive ? 'bg-muted border-border text-foreground shadow-sm' : 'border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
        >
            <Layout className="w-4 h-4" />
            <span>{board.name}</span>
            <div onClick={e => e.stopPropagation()}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-5 h-5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity p-0 data-[state=open]:opacity-100">
                            <MoreHorizontal className="w-3 h-3" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => {
                            const newName = prompt("Новое название доски:", board.name);
                            if (newName && newName.trim()) onRename(board.id, newName.trim());
                        }}>
                            <Edit2 className="w-4 h-4 mr-2" /> Переименовать
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(board.id)} className="text-red-500 focus:text-red-500">
                            <Trash2 className="w-4 h-4 mr-2" /> Удалить
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
    
    const [activeProjId, setActiveProjId] = useState(INITIAL_PROJECTS[0].id);
    const [activeBoardId, setActiveBoardId] = useState(INITIAL_PROJECTS[0].boards[0].id);
    const [view, setView] = useState<ViewMode>("board");

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isCreateTaskOpen, setCreateTaskOpen] = useState(false);
    const [isProjectModalOpen, setProjectModalOpen] = useState(false);
    const [isBoardModalOpen, setBoardModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const activeProject = projects.find(p => p.id === activeProjId) || projects[0];
    const activeBoard = activeProject.boards.find(b => b.id === activeBoardId) || activeProject.boards[0];

    // Сенсор для вкладок досок (чтобы клик не конфликтовал с перетаскиванием)
    const boardSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    // --- Обработчики Проектов ---
    const handleCreateProject = (name: string) => {
        const newProjId = `proj-${Date.now()}`;
        const newBoardId = `board-${Date.now()}`;
        const newProj: Project = {
            id: newProjId, name,
            boards: [{ id: newBoardId, name: "Основная доска", columns: [{ id: "todo", title: "TO DO", color: "#ebecf0" }], tasks: [] }]
        };
        setProjects([...projects, newProj]);
        setActiveProjId(newProjId);
        setActiveBoardId(newBoardId);
    };

    // --- Обработчики Досок ---
    const handleCreateBoard = (name: string) => {
        const newBoardId = `board-${Date.now()}`;
        const newBoard = { id: newBoardId, name, columns: [{ id: "todo", title: "TO DO", color: "#ebecf0" }], tasks: [] };
        setProjects(prev => prev.map(p => p.id === activeProjId ? { ...p, boards: [...p.boards, newBoard] } : p));
        setActiveBoardId(newBoardId);
    };

    const handleRenameBoard = (boardId: string, newName: string) => {
        setProjects(prev => prev.map(p => p.id === activeProjId ? {
            ...p, boards: p.boards.map(b => b.id === boardId ? { ...b, name: newName } : b)
        } : p));
    };

    const handleDeleteBoard = (boardId: string) => {
        if (activeProject.boards.length <= 1) {
            alert("Нельзя удалить последнюю доску в проекте!");
            return;
        }
        if (confirm("Вы уверены? Все задачи на этой доске будут безвозвратно удалены.")) {
            setProjects(prev => prev.map(p => p.id === activeProjId ? {
                ...p, boards: p.boards.filter(b => b.id !== boardId)
            } : p));
            if (activeBoardId === boardId) {
                const remainingBoards = activeProject.boards.filter(b => b.id !== boardId);
                setActiveBoardId(remainingBoards[0].id);
            }
        }
    };

    const handleBoardDragEnd = (e: any) => {
        const { active, over } = e;
        if (!over || active.id === over.id) return;
        
        setProjects(prev => prev.map(p => {
            if (p.id !== activeProjId) return p;
            const oldIndex = p.boards.findIndex(b => b.id === active.id);
            const newIndex = p.boards.findIndex(b => b.id === over.id);
            return { ...p, boards: arrayMove(p.boards, oldIndex, newIndex) };
        }));
    };

    // --- Обработчики Задач и Колонок ---
    const handleCreateTask = (data: { title: string, tags: string[] }) => {
        const newTask: Task = {
            id: `KAN-${Date.now().toString().slice(-4)}`, title: data.title, description: "",
            status: activeBoard.columns[0]?.id || "todo", priority: "Medium", author: "Diniar Karimov",
            assignee: null, tags: data.tags, createdAt: new Date().toLocaleDateString(), updatedAt: "Только что"
        };
        setBoardTasks([...activeBoard.tasks, newTask]);
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
            <Header onCreateClick={() => setCreateTaskOpen(true)} />

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
                            <h1 className="text-2xl font-semibold text-foreground">{activeProject.name}</h1>
                            <Button variant="ghost" size="sm" className="ml-auto text-muted-foreground hover:text-foreground">
                                <Settings className="w-4 h-4 mr-2" /> Настройки проекта
                            </Button>
                        </div>

                        {/* Навигация по доскам (С поддержкой Drag and Drop) */}
                        <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar py-1">
                            <DndContext sensors={boardSensors} collisionDetection={closestCenter} onDragEnd={handleBoardDragEnd}>
                                <SortableContext items={activeProject.boards.map(b => b.id)} strategy={horizontalListSortingStrategy}>
                                    {activeProject.boards.map(board => (
                                        <SortableBoardTab 
                                            key={board.id} 
                                            board={board} 
                                            isActive={board.id === activeBoardId}
                                            onClick={() => setActiveBoardId(board.id)}
                                            onRename={handleRenameBoard}
                                            onDelete={handleDeleteBoard}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                            
                            <Button onClick={() => setBoardModalOpen(true)} variant="ghost" size="sm" className="h-8 rounded-md text-blue-600 hover:text-blue-700 hover:bg-blue-50 ml-1">
                                <Plus className="w-4 h-4 mr-1"/> Добавить доску
                            </Button>
                        </div>

                        <div className="flex gap-6 text-sm font-medium border-b border-border/50">
                            <button onClick={() => setView("summary")} className={`pb-3 border-b-2 transition-colors ${view === "summary" ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground"}`}>Сводка</button>
                            <button onClick={() => setView("list")} className={`pb-3 border-b-2 transition-colors ${view === "list" ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground"}`}>Список</button>
                            <button onClick={() => setView("board")} className={`pb-3 border-b-2 transition-colors ${view === "board" ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground"}`}>Доска</button>
                        </div>
                    </div>

                    {view !== "summary" && (
                        <div className="px-8 py-4 flex items-center gap-3 shrink-0">
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
                                <input placeholder={view === "board" ? "Поиск на доске" : "Поиск по задачам"} className="w-full bg-muted/30 border text-sm rounded-md pl-8 h-8 outline-none focus:border-blue-500 text-foreground transition-colors" />
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
            <CreateTaskModal isOpen={isCreateTaskOpen} onClose={() => setCreateTaskOpen(false)} onCreate={handleCreateTask} />
            <CreateProjectModal isOpen={isProjectModalOpen} onClose={() => setProjectModalOpen(false)} onCreate={handleCreateProject} />
            <CreateBoardModal isOpen={isBoardModalOpen} onClose={() => setBoardModalOpen(false)} onCreate={handleCreateBoard} />
        </div>
    );
}