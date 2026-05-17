"use client";

import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { X, Paperclip, Link, ChevronDown, User, Plus } from "lucide-react";
import { useState, useEffect } from "react";

const PRIORITY_MAP: Record<string, number> = { "Highest": 1, "High": 1, "Medium": 2, "Low": 3 };

export function CreateTaskModal({ isOpen, onClose, onCreate, columns, defaultColumnId }: any) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [deadline, setDeadline] = useState("");
    const [status, setStatus] = useState("");

    // Устанавливаем дефолтную колонку при открытии
    useEffect(() => {
        if (isOpen && columns?.length > 0) {
            setStatus(String(defaultColumnId || columns[0].id));
        }
    }, [isOpen, columns, defaultColumnId]);

    const handleCreate = () => {
        if (!title.trim() || !columns?.length) return;

        const targetColId = status || String(columns[0].id);

        // Отдаем данные в BoardPage, а он уже закинет их в Redux Thunk
        onCreate({
            column_id: Number(targetColId),
            title,
            description,
            priority: PRIORITY_MAP[priority] || 2,
            ...(deadline ? { deadline: new Date(deadline).toISOString() } : {})
        });
        
        // Сброс полей
        setTitle(""); setDescription(""); setPriority("Medium"); setDeadline("");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent 
                className="!max-w-[80vw] w-[80vw] h-[90vh] flex flex-col p-0 bg-background border-border shadow-2xl rounded-xl [&>button]:hidden overflow-hidden"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <div className="flex items-center justify-between px-8 py-5 border-b shrink-0">
                    <h2 className="text-xl font-semibold text-foreground">Создание задачи</h2>
                    <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={onClose}><X className="w-5 h-5" /></Button>
                </div>
                
                <div className="flex flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-8 pt-6 pr-12 flex flex-col gap-8">
                        <div>
                            <input 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="text-[28px] font-semibold text-foreground mb-6 w-full bg-transparent border-2 border-transparent hover:border-border hover:bg-muted/10 focus:border-blue-500 focus:bg-background rounded outline-none px-2 -ml-2 transition-all"
                                placeholder="Название задачи (обязательно)"
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <Button variant="secondary" className="bg-muted/50 font-medium"><Paperclip className="w-4 h-4 mr-2"/> Вложить</Button>
                                <Button variant="secondary" className="bg-muted/50 font-medium"><Link className="w-4 h-4 mr-2"/> Связать</Button>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-[15px] mb-3">Описание</h3>
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Подробное описание задачи..."
                                className="text-[15px] text-foreground w-full min-h-[150px] bg-transparent border-2 border-transparent hover:border-border hover:bg-muted/10 focus:border-blue-500 focus:bg-background rounded outline-none p-3 -ml-3 transition-all resize-none"
                            />
                        </div>
                    </div>

                    <div className="w-[420px] shrink-0 p-8 pt-6 border-l flex flex-col gap-6 overflow-y-auto bg-muted/10">
                        <div className="relative w-fit">
                            <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Колонка</label>
                            <select 
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="appearance-none bg-muted text-foreground font-semibold border shadow-sm px-4 py-2 pr-8 rounded-md outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer uppercase"
                            >
                                {columns?.map((c: any) => <option key={c.id} value={c.id}>{c.name || c.title}</option>)}
                            </select>
                            <ChevronDown className="w-4 h-4 absolute right-2.5 top-9 pointer-events-none text-muted-foreground" />
                        </div>

                        <div className="border rounded-lg bg-card shadow-sm p-4 space-y-6 mt-4">
                            <h4 className="font-semibold text-[15px]">Детали</h4>
                            <div className="space-y-4">
                                <div className="grid grid-cols-[110px_1fr] items-center text-sm">
                                    <span className="text-muted-foreground">Исполнитель</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center"><User className="w-4 h-4"/></div>
                                        <span className="text-blue-500 cursor-pointer hover:underline">Назначить</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-[110px_1fr] items-center text-sm">
                                    <span className="text-muted-foreground">Приоритет</span>
                                    <select 
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="bg-transparent border-transparent hover:border-border rounded p-1 outline-none font-medium cursor-pointer"
                                    >
                                        <option value="Highest">Highest</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-[110px_1fr] items-center text-sm">
                                    <span className="text-muted-foreground">Дедлайн</span>
                                    <Input 
                                        type="date" 
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                        className="h-9 bg-background border-border text-xs w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-4 border-t flex items-center justify-end bg-background shrink-0 gap-3">
                    <Button variant="ghost" onClick={onClose}>Отмена</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6" onClick={handleCreate}>Создать задачу</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}