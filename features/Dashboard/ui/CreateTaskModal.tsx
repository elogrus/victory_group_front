"use client";

import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { X, Paperclip, Link, ChevronDown, User as UserIcon, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

export function CreateTaskModal({ isOpen, onClose, onCreate, columns, defaultColumnId, members = [] }: any) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("2"); // По умолчанию Medium (2)
    const [deadline, setDeadline] = useState("");
    const [assigneeId, setAssigneeId] = useState<string>("0");
    const [status, setStatus] = useState("");

    useEffect(() => {
        if (isOpen && columns?.length > 0) {
            setStatus(String(defaultColumnId || columns[0].id));
        }
    }, [isOpen, columns, defaultColumnId]);

    const handleCreate = () => {
        if (!title.trim() || !columns?.length) return;

        onCreate({
            column_id: Number(status),
            title,
            description,
            priority: Number(priority),
            deadline: deadline ? new Date(deadline).toISOString() : null,
            assignee_id: assigneeId !== "0" ? Number(assigneeId) : null,
            order: 0
        });
        
        // Сброс
        setTitle(""); setDescription(""); setPriority("2"); setDeadline(""); setAssigneeId("0");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="!max-w-[1000px] w-[90vw] h-[85vh] flex flex-col p-0 bg-background border-border shadow-2xl rounded-xl [&>button]:hidden overflow-hidden">
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
                                className="text-[28px] font-semibold text-foreground mb-6 w-full bg-transparent border-2 border-transparent hover:border-border focus:border-blue-500 rounded outline-none px-2 -ml-2"
                                placeholder="Заголовок задачи"
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <Button variant="secondary" size="sm" className="bg-muted/50"><Paperclip className="w-4 h-4 mr-2"/> Вложить</Button>
                                <Button variant="secondary" size="sm" className="bg-muted/50"><Link className="w-4 h-4 mr-2"/> Связать</Button>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-[15px] mb-3">Описание</h3>
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Добавьте описание..."
                                className="text-[15px] text-foreground w-full min-h-[200px] bg-transparent border-2 border-transparent hover:border-border focus:border-blue-500 rounded outline-none p-3 -ml-3 resize-none"
                            />
                        </div>
                    </div>

                    <div className="w-[380px] shrink-0 p-8 pt-6 border-l flex flex-col gap-6 overflow-y-auto bg-muted/10">
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Колонка</label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="w-full bg-background"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {columns?.map((c: any) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="border rounded-lg bg-card shadow-sm p-4 space-y-6">
                                <h4 className="font-semibold text-[15px]">Детали</h4>
                                
                                <div className="space-y-4">
                                    {/* ИСПОЛНИТЕЛЬ */}
                                    <div className="space-y-1">
                                        <span className="text-xs text-muted-foreground font-medium">Исполнитель</span>
                                        <Select value={assigneeId} onValueChange={setAssigneeId}>
                                            <SelectTrigger className="h-9 border-none bg-transparent hover:bg-muted/50 -ml-2">
                                                <div className="flex items-center gap-2">
                                                    <UserIcon className="w-4 h-4 text-muted-foreground" />
                                                    <SelectValue placeholder="Назначить..." />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="0">Не назначено</SelectItem>
                                                {members.map((m: any) => (
                                                    <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* ПРИОРИТЕТ */}
                                    <div className="space-y-1">
                                        <span className="text-xs text-muted-foreground font-medium">Приоритет</span>
                                        <Select value={priority} onValueChange={setPriority}>
                                            <SelectTrigger className="h-9 border-none bg-transparent hover:bg-muted/50 -ml-2 text-foreground font-medium">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">Highest (1)</SelectItem>
                                                <SelectItem value="2">Medium (2)</SelectItem>
                                                <SelectItem value="3">Low (3)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* ДЕДЛАЙН */}
                                    <div className="space-y-1">
                                        <span className="text-xs text-muted-foreground font-medium">Срок исполнения</span>
                                        <Input 
                                            type="date" 
                                            value={deadline}
                                            onChange={(e) => setDeadline(e.target.value)}
                                            className="h-9 border-none bg-transparent hover:bg-muted/50 -ml-2 text-xs cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-4 border-t flex items-center justify-end bg-background shrink-0 gap-3">
                    <Button variant="ghost" onClick={onClose}>Отмена</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 font-semibold" onClick={handleCreate}>Создать</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}