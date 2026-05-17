"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks";
import { fetchAutomationRules, fetchCreateRule, fetchUpdateRule, fetchDeleteRule } from "../../slice";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Settings2, Plus, Trash2, Edit2, Zap, ZapOff } from "lucide-react";
import { AutomationModal } from "./AutomationModal";
import { Badge } from "@/shared/ui/badge";

export function AutomationRules({ projectId, project }: any) {
    const dispatch = useAppDispatch();
    const rules = useAppSelector(state => state.admin.automationRules);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRule, setSelectedRule] = useState<any>(null);

    useEffect(() => {
        if (projectId) dispatch(fetchAutomationRules(projectId));
    }, [projectId, dispatch]);

    const handleSave = (data: any) => {
        if (selectedRule) {
            dispatch(fetchUpdateRule({ projectId, ruleId: selectedRule.id, data }));
        } else {
            dispatch(fetchCreateRule({ projectId, data }));
        }
        setIsModalOpen(false);
    };

    const toggleRule = (rule: any) => {
        dispatch(fetchUpdateRule({ projectId, ruleId: rule.id, data: { enabled: !rule.enabled } }));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Zap className="text-yellow-500" /> Автоматизация: {project?.name}
                    </h1>
                    <p className="text-sm text-muted-foreground">Настраивайте правила поведения задач при событиях</p>
                </div>
                <Button onClick={() => { setSelectedRule(null); setIsModalOpen(true); }} className="bg-blue-600 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Новое правило
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {(!rules || rules.length === 0) ? (
                    <div className="py-20 text-center border-2 border-dashed rounded-2xl text-muted-foreground">
                        Правил пока нет. Создайте первое, чтобы автоматизировать рутину.
                    </div>
                ) : rules.map(rule => (
                    <Card key={rule.id} className={`transition-all ${rule.enabled ? 'border-l-4 border-l-green-500' : 'opacity-60 border-l-4 border-l-muted-foreground'}`}>
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-lg">{rule.name}</span>
                                    {rule.enabled ? <Badge className="bg-green-100 text-green-700 shadow-none">Включено</Badge> : <Badge variant="secondary">Выключено</Badge>}
                                </div>
                                <div className="text-xs text-muted-foreground flex gap-4">
                                    <span><strong>КОГДА:</strong> {rule.trigger}</span>
                                    <span><strong>УСЛОВИЙ:</strong> {rule.conditions.length}</span>
                                    <span><strong>ДЕЙСТВИЙ:</strong> {rule.actions.length}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => toggleRule(rule)}>
                                    {rule.enabled ? <ZapOff className="w-4 h-4 mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
                                    {rule.enabled ? "Выключить" : "Включить"}
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => { setSelectedRule(rule); setIsModalOpen(true); }}>
                                    <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => { if(confirm("Удалить?")) dispatch(fetchDeleteRule({projectId, ruleId: rule.id})) }}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <AutomationModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSave}
                editingRule={selectedRule}
                project={project}
            />
        </div>
    );
}