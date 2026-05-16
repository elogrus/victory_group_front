"use client";

import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { X, Paperclip, Link, Zap, ChevronDown, CheckSquare, User, Plus } from "lucide-react";
import { useState } from "react";

export function CreateTaskModal({ isOpen, onClose, onCreate }: any) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [status, setStatus] = useState("todo");
    const [tagsInput, setTagsInput] = useState("");
    const [subtasks, setSubtasks] = useState<string[]>([]);
    
    // Стейт для вложенной модалки подзадачи
    const [isSubtaskModalOpen, setSubtaskModalOpen] = useState(false);
    const [subtaskTitle, setSubtaskTitle] = useState("");

    const handleCreate = () => {
        if (!title.trim()) return;
        const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
        onCreate({ title, description, priority, status, tags, subtasks });
        
        // Сброс полей
        setTitle(""); setDescription(""); setPriority("Medium"); setStatus("todo"); setTagsInput(""); setSubtasks([]);
        onClose();
    };

    const handleAddSubtask = () => {
        if (subtaskTitle.trim()) {
            setSubtasks([...subtasks, subtaskTitle.trim()]);
            setSubtaskTitle("");
            setSubtaskModalOpen(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="!max-w-[80vw] w-[80vw] h-[90vh] flex flex-col p-0 bg-background border-border shadow-2xl rounded-xl [&>button]:hidden overflow-hidden">
                
                {/* Шапка */}
                <div className="flex items-center justify-between px-8 py-5 border-b shrink-0">
                    <h2 className="text-xl font-semibold text-foreground">Создание задачи</h2>
                    <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={onClose}><X className="w-5 h-5" /></Button>
                </div>
                
                <div className="flex flex-1 overflow-hidden">
                    {/* ЛЕВАЯ ЧАСТЬ (Контент) */}
                    <div className="flex-1 overflow-y-auto p-8 pt-6 pr-12 flex flex-col gap-8">
                        
                        <div className="flex gap-6 mb-2">
                            <div className="w-1/2">
                                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Проект</label>
                                <select className="w-full bg-muted/20 border rounded-md p-2 text-sm outline-none focus:border-blue-500">
                                    <option>VictoryGroup (KAN)</option>
                                </select>
                            </div>
                            <div className="w-1/2">
                                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Тип задачи</label>
                                <select className="w-full bg-muted/20 border rounded-md p-2 text-sm outline-none focus:border-blue-500">
                                    <option>✓ Задача</option>
                                    <option>⚡ Epic</option>
                                    <option>🐛 Bug</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <input 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="text-[28px] font-semibold text-foreground mb-6 w-full bg-transparent border-2 border-transparent hover:border-border hover:bg-muted/10 focus:border-blue-500 focus:bg-background rounded outline-none px-2 -ml-2 transition-all placeholder:text-muted-foreground/50"
                                placeholder="Название задачи (обязательно)"
                                autoFocus
                            />

                            <div className="flex gap-2">
                                <Button variant="secondary" className="bg-muted/50 font-medium"><Paperclip className="w-4 h-4 mr-2"/> Вложить</Button>
                                <Button variant="secondary" className="bg-muted/50 font-medium"><Link className="w-4 h-4 mr-2"/> Связать задачу <ChevronDown className="w-4 h-4 ml-1"/></Button>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-[15px] mb-3">Описание</h3>
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Добавьте подробное описание задачи..."
                                className="text-[15px] text-foreground w-full min-h-[120px] bg-transparent border-2 border-transparent hover:border-border hover:bg-muted/10 focus:border-blue-500 focus:bg-background rounded outline-none p-3 -ml-3 transition-all resize-none"
                            />
                        </div>

                        {/* Подзадачи */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-[15px]">Подзадачи</h3>
                                <Button variant="secondary" size="sm" onClick={() => setSubtaskModalOpen(true)} className="h-8 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 border-none">
                                    <Plus className="w-4 h-4 mr-1"/> Создать подзадачу
                                </Button>
                            </div>
                            
                            {subtasks.length === 0 ? (
                                <div className="text-sm text-muted-foreground text-center p-4 border border-dashed rounded-lg">Нет подзадач</div>
                            ) : (
                                <div className="border rounded-lg border-border/50 divide-y divide-border/50 bg-card">
                                    {subtasks.map((st, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3">
                                            <div className="flex items-center gap-3">
                                                <CheckSquare className="w-4 h-4 text-blue-500"/>
                                                <span className="text-sm">{st}</span>
                                            </div>
                                            <span className="text-[11px] font-bold bg-muted px-2 py-1 rounded">TO DO</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ПРАВАЯ ЧАСТЬ (Детали) */}
                    <div className="w-[420px] shrink-0 p-8 pt-6 border-l flex flex-col gap-6 overflow-y-auto bg-muted/10">
                        
                        <div className="relative w-fit">
                            <select 
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="appearance-none bg-muted text-foreground hover:bg-muted/80 font-semibold border shadow-sm px-4 py-2 pr-8 rounded-md outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer uppercase"
                            >
                                <option value="todo">К выполнению</option>
                                <option value="in-progress">В работе</option>
                                <option value="done">Готово</option>
                            </select>
                            <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        <div className="border rounded-lg bg-card shadow-sm p-4">
                            <h4 className="font-semibold text-[15px] mb-4">Детали</h4>
                            <div className="grid grid-cols-[130px_1fr] items-center gap-y-5 text-sm">
                                
                                <div className="text-muted-foreground">Исполнитель</div>
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center"><User className="w-4 h-4"/></div> 
                                    <select className="w-full bg-transparent border border-transparent hover:border-border focus:border-blue-500 rounded p-1 outline-none cursor-pointer">
                                        <option value="unassigned">Не назначено</option>
                                        <option value="dk">DK Diniar Karimov</option>
                                    </select>
                                </div>

                                <div className="text-muted-foreground">Приоритет</div>
                                <div className="flex items-center gap-2 px-1">
                                    <span className="text-lg leading-none text-red-500 font-bold">^</span>
                                    <select 
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="w-full bg-transparent border border-transparent hover:border-border focus:border-blue-500 rounded p-1 outline-none cursor-pointer"
                                    >
                                        <option value="Highest">Highest</option>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>

                                <div className="text-muted-foreground">Теги</div>
                                <Input 
                                    value={tagsInput} 
                                    onChange={e => setTagsInput(e.target.value)} 
                                    placeholder="bug, frontend" 
                                    className="bg-background focus:border-blue-500 h-8 text-xs" 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* НИЖНЯЯ ПАНЕЛЬ С КНОПКАМИ */}
                <div className="px-8 py-4 border-t flex items-center justify-between bg-background shrink-0">
                    <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                        <input type="checkbox" className="rounded border-border w-4 h-4" /> Создать еще одну
                    </label>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={onClose}>Отмена</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleCreate}>Создать</Button>
                    </div>
                </div>
            </DialogContent>

            {/* ВЛОЖЕННАЯ МОДАЛКА ПОДЗАДАЧИ */}
            {isSubtaskModalOpen && (
                <Dialog open={isSubtaskModalOpen} onOpenChange={setSubtaskModalOpen}>
                    <DialogContent className="max-w-md p-6 bg-background border-border shadow-xl rounded-xl z-[100] [&>button]:hidden">
                        <h3 className="text-lg font-semibold mb-4">Новая подзадача</h3>
                        <Input 
                            value={subtaskTitle} 
                            onChange={(e) => setSubtaskTitle(e.target.value)} 
                            placeholder="Название подзадачи..." 
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                        />
                        <div className="flex justify-end gap-2 mt-6">
                            <Button variant="ghost" onClick={() => setSubtaskModalOpen(false)}>Отмена</Button>
                            <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={handleAddSubtask}>Добавить</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </Dialog>
    );
}