"use client";

import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useState } from "react";
import { X } from "lucide-react";

export function CreateProjectModal({ isOpen, onClose, onCreate }: any) {
    const [name, setName] = useState("");

    const handleCreate = () => {
        if (!name.trim()) return;
        onCreate(name);
        setName("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="!max-w-[500px] w-full p-0 overflow-hidden [&>button]:hidden">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-foreground">Создать проект</h2>
                        <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground"><X className="w-5 h-5" /></Button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold mb-2 block text-foreground">Название проекта</label>
                            <Input 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                placeholder="Напр. Новый сервис"
                                className="bg-muted/30 focus:border-blue-500"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="ghost" onClick={onClose}>Отмена</Button>
                            <Button onClick={handleCreate} className="bg-blue-600 text-white hover:bg-blue-700">Создать</Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}