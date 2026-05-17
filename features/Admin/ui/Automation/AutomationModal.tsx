"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { X, Plus, Trash2, Zap, PlayCircle, Filter } from "lucide-react";
import { TRIGGERS, CONDITION_FIELDS, ACTION_TYPES } from "./constants";

export function AutomationModal({ isOpen, onClose, onSave, editingRule, project }: any) {
    const [name, setName] = useState("");
    const [trigger, setTrigger] = useState("task_created");
    const [conditions, setConditions] = useState<any[]>([]);
    const [actions, setActions] = useState<any[]>([]);
    const [enabled, setEnabled] = useState(true);

    useEffect(() => {
        if (editingRule) {
            setName(editingRule.name);
            setTrigger(editingRule.trigger);
            setConditions(editingRule.conditions || []);
            setActions(editingRule.actions || []);
            setEnabled(editingRule.enabled);
        } else {
            setName(""); setTrigger("task_created"); setConditions([]); setActions([]); setEnabled(true);
        }
    }, [editingRule, isOpen]);

    const addCondition = () => setConditions([...conditions, { field: "priority", op: "eq", value: 1 }]);
    const addAction = () => setActions([...actions, { type: "send_notification", message: "", target: "all" }]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="!max-w-[900px] w-[90vw] h-[85vh] flex flex-col p-0 overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center bg-background shrink-0">
                    <h2 className="text-xl font-bold">{editingRule ? "Редактировать правило" : "Новое правило автоматизации"}</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5"/></Button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-muted/5">
                    {/* Базовая информация */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold">Название правила</label>
                            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Напр. Авто-перенос срочных задач" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold">Когда это происходит (Триггер)</label>
                            <Select value={trigger} onValueChange={setTrigger} disabled={!!editingRule}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {TRIGGERS.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {editingRule && <p className="text-[10px] text-muted-foreground italic">* Триггер нельзя изменить после создания</p>}
                        </div>
                    </div>

                    {/* Условия */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Filter className="w-4 h-4" /> И ЕСЛИ (Условия)
                            </h3>
                            <Button variant="outline" size="sm" onClick={addCondition}><Plus className="w-3 h-3 mr-1"/> Добавить условие</Button>
                        </div>
                        {conditions.map((c, idx) => (
                            <div key={idx} className="flex items-end gap-3 p-4 bg-background border rounded-xl shadow-sm relative group">
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Поле</label>
                                    <Select value={c.field} onValueChange={(val) => {
                                        const newConds = [...conditions];
                                        newConds[idx] = { ...c, field: val, value: "" };
                                        setConditions(newConds);
                                    }}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {CONDITION_FIELDS.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-32 space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Оператор</label>
                                    <Select value={c.op} onValueChange={(val) => {
                                        const newConds = [...conditions];
                                        newConds[idx].op = val;
                                        setConditions(newConds);
                                    }}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {CONDITION_FIELDS.find(f => f.value === c.field)?.ops.map(o => (
                                                <SelectItem key={o} value={o}>{o}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex-[1.5] space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Значение</label>
                                    <Input value={c.value} onChange={e => {
                                        const newConds = [...conditions];
                                        newConds[idx].value = e.target.value;
                                        setConditions(newConds);
                                    }} placeholder="Введите значение..." />
                                </div>
                                <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-500" onClick={() => setConditions(conditions.filter((_, i) => i !== idx))}>
                                    <Trash2 className="w-4 h-4"/>
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* Действия */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <PlayCircle className="w-4 h-4" /> ТОГДА ВЫПОЛНИТЬ (Действия)
                            </h3>
                            <Button variant="outline" size="sm" onClick={addAction}><Plus className="w-3 h-3 mr-1"/> Добавить действие</Button>
                        </div>
                        {actions.map((a, idx) => (
                            <div key={idx} className="p-4 bg-background border border-blue-500/20 rounded-xl shadow-sm relative space-y-4">
                                <div className="flex items-center justify-between border-b pb-2 mb-2">
                                    <Select value={a.type} onValueChange={(val) => {
                                        const newActions = [...actions];
                                        newActions[idx] = { type: val };
                                        setActions(newActions);
                                    }}>
                                        <SelectTrigger className="w-64 border-none font-bold text-blue-600 bg-blue-50 h-8"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {ACTION_TYPES.map(at => <SelectItem key={at.value} value={at.value}>{at.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <Button variant="ghost" size="icon" onClick={() => setActions(actions.filter((_, i) => i !== idx))}><X className="w-4 h-4"/></Button>
                                </div>
                                
                                {/* Динамические поля действий */}
                                {a.type === 'send_notification' && (
                                    <div className="grid grid-cols-1 gap-4">
                                        <Input placeholder="Текст уведомления" value={a.message} onChange={e => {
                                            const na = [...actions]; na[idx].message = e.target.value; setActions(na);
                                        }} />
                                    </div>
                                )}
                                {a.type === 'move_to_column' && (
                                    <Input type="number" placeholder="ID Колонки" value={a.column_id} onChange={e => {
                                        const na = [...actions]; na[idx].column_id = Number(e.target.value); setActions(na);
                                    }} />
                                )}
                                {a.type === 'add_tag' && (
                                    <Input placeholder="Имя тега" value={a.tag} onChange={e => {
                                        const na = [...actions]; na[idx].tag = e.target.value; setActions(na);
                                    }} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 border-t bg-background flex items-center justify-between shrink-0">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} className="w-4 h-4" />
                        <span className="text-sm font-medium">Правило включено</span>
                    </label>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={onClose}>Отмена</Button>
                        <Button onClick={() => onSave({ name, trigger, conditions, actions, enabled })} className="bg-blue-600 text-white px-8">Сохранить</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}