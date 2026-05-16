"use client";

import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Eye, X } from "lucide-react";
import { useState } from "react";

export function CreateTaskModal({ isOpen, onClose, onCreate }: any) {
    const [title, setTitle] = useState("");
    const [tagsInput, setTagsInput] = useState("");

    const handleCreate = () => {
        const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
        onCreate({ title, tags });
        setTitle("");
        setTagsInput("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="!max-w-[80vw] w-[80vw] h-[85vh] flex flex-col p-0 bg-background border-border shadow-2xl rounded-xl [&>button]:hidden">
                <div className="flex items-center justify-between px-8 py-4 border-b shrink-0">
                    <h2 className="text-xl font-semibold text-foreground">Создание задачи</h2>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={onClose}><X className="w-5 h-5" /></Button>
                    </div>
                </div>
                
                <div className="flex flex-1 overflow-hidden">
                    <div className="flex-[2] overflow-y-auto p-8 flex flex-col gap-6">
                        <div>
                            <label className="text-sm font-semibold text-foreground flex items-center gap-1">Резюме <span className="text-red-500">*</span></label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2 bg-muted/10 focus:border-blue-500 h-10" placeholder="Краткое описание" />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-foreground mb-2 block">Описание</label>
                            <div className="border rounded-md overflow-hidden bg-muted/10 focus-within:border-blue-500">
                                <textarea className="w-full p-4 text-sm min-h-[150px] outline-none bg-transparent" placeholder="Добавьте подробное описание задачи..."></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="flex-[1] bg-muted/10 border-l p-8 overflow-y-auto flex flex-col gap-6">
                        <div>
                            <label className="text-sm font-semibold text-foreground">Теги (через запятую)</label>
                            <Input value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="bug, frontend, urgent" className="mt-2 bg-background" />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-foreground flex justify-between">Исполнитель <a href="#" className="text-blue-600 font-normal hover:underline">Назначить себе</a></label>
                            <select className="w-full mt-2 bg-background border rounded-md p-2.5 text-sm outline-none">
                                <option>👤 Автоматически</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-4 border-t flex items-center justify-end bg-background shrink-0 gap-3">
                    <Button variant="ghost" onClick={onClose}>Отмена</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleCreate}>Создать</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}