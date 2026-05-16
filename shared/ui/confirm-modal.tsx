"use client";

import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    confirmText?: string;
}

export function ConfirmModal({ 
    isOpen, onClose, onConfirm, 
    title = "Подтвердите действие", 
    description = "Вы уверены, что хотите выполнить это действие? Оно необратимо.", 
    confirmText = "Удалить" 
}: ConfirmModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent 
                className="!max-w-[400px] w-full p-0 overflow-hidden [&>button]:hidden"
            >
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-bold text-foreground mb-2">{title}</h2>
                            <p className="text-sm text-muted-foreground">{description}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground shrink-0 -mt-2 -mr-2">
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                    
                    <div className="flex justify-end gap-3 mt-8">
                        <Button variant="outline" onClick={onClose}>Отмена</Button>
                        <Button variant="destructive" onClick={() => { onConfirm(); onClose(); }}>{confirmText}</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}