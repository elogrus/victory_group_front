"use client";

import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { 
    Eye, 
    ThumbsUp, 
    Share2, 
    MoreHorizontal, 
    X, 
    Paperclip, 
    Link, 
    User as UserIcon, 
    Zap, 
    ChevronDown, 
    CheckSquare,
    Trash2 // ДОБАВЛЕН ЭТОТ ИМПОРТ
} from "lucide-react";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Input } from "@/shared/ui/input";

export function TaskModal({ task, isOpen, onClose, onSave, onDelete, columns, members = [] }: any) {
    const [localTask, setLocalTask] = useState<any>(null);

    useEffect(() => {
        if (task) setLocalTask({ ...task });
    }, [task]);

    if (!task || !localTask) return null;

    const updateField = (field: string, value: any) => {
        const updated = { ...localTask, [field]: value };
        setLocalTask(updated);
        onSave(updated); 
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent 
                className="!max-w-[80vw] w-[80vw] h-[90vh] flex flex-col p-0 bg-background border-border shadow-2xl overflow-hidden rounded-xl [&>button]:hidden"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <div className="flex items-center justify-between px-8 py-5 border-b shrink-0">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <CheckSquare className="w-4 h-4 text-blue-500" />
                        <span>KAN-{task.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={onDelete}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onClose} className="ml-2 text-muted-foreground">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-8 pt-6 pr-12 flex flex-col gap-8">
                        <input 
                            value={localTask.title}
                            onChange={(e) => setLocalTask({...localTask, title: e.target.value})}
                            onBlur={() => updateField("title", localTask.title)}
                            className="text-[28px] font-semibold text-foreground w-full bg-transparent border-none focus:ring-0 outline-none px-0"
                            placeholder="Заголовок задачи"
                        />

                        <div>
                            <h3 className="font-semibold text-[15px] mb-3 text-muted-foreground">Описание</h3>
                            <textarea 
                                value={localTask.description}
                                onChange={(e) => setLocalTask({...localTask, description: e.target.value})}
                                onBlur={() => updateField("description", localTask.description)}
                                placeholder="Добавьте описание..."
                                className="text-[15px] text-foreground w-full min-h-[150px] bg-transparent border border-transparent hover:border-border focus:border-blue-500 rounded p-3 -ml-3 transition-all outline-none resize-none"
                            />
                        </div>
                    </div>

                    <div className="w-[380px] shrink-0 p-8 pt-6 border-l flex flex-col gap-6 overflow-y-auto bg-muted/10">
                        <div className="space-y-4">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Статус</label>
                            <Select value={String(localTask.column_id)} onValueChange={(val) => updateField("column_id", Number(val))}>
                                <SelectTrigger className="w-full bg-background border-border h-10 uppercase text-xs font-bold">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {columns.map((c: any) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="border rounded-lg bg-card shadow-sm p-4 space-y-6">
                            <h4 className="font-semibold text-[15px]">Детали</h4>
                            <div className="space-y-5">
                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground font-medium">Исполнитель</span>
                                    <Select value={String(localTask.assignee_id || "0")} onValueChange={(val) => updateField("assignee_id", val === "0" ? null : Number(val))}>
                                        <SelectTrigger className="h-9 border-none bg-transparent hover:bg-muted/50 -ml-2">
                                            <div className="flex items-center gap-2">
                                                <UserIcon className="w-4 h-4 text-muted-foreground" />
                                                <SelectValue placeholder="Назначить..." />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">Не назначено</SelectItem>
                                            {members.map((m: any) => <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground font-medium">Приоритет</span>
                                    <Select value={String(localTask.priority)} onValueChange={(val) => updateField("priority", Number(val))}>
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

                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground font-medium">Дедлайн</span>
                                    <Input 
                                        type="date" 
                                        value={localTask.deadline?.split('T')[0] || ""}
                                        onChange={(e) => updateField("deadline", e.target.value ? new Date(e.target.value).toISOString() : null)}
                                        className="h-9 border-none bg-transparent hover:bg-muted/50 -ml-2 text-xs"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}