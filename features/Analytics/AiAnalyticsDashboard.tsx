"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { BrainCircuit, CheckCircle2, AlertTriangle, Clock, BarChart2, Zap } from "lucide-react";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell 
} from "recharts";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function AiAnalyticsDashboard({ data }: { data: any }) {
    if (!data) return null;

    const { stats, columns, priorities, activity, aiError, aiProvider } = data;

    // Данные для графика колонок
    const columnsChartData = columns.map((col: any) => ({
        name: col.columnName,
        tasks: col.tasksCount,
        completed: col.completedTasks
    }));

    // Данные для графика приоритетов
    const priorityData = Object.keys(priorities.priorityDistribution).map((key, index) => ({
        name: priorities.priorityLabels[key] || `Приоритет ${key}`,
        value: priorities.priorityDistribution[key]
    }));

    return (
        <div className="space-y-8 pb-10">
            {/* Ошибка AI если есть */}
            {aiError && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-center gap-3 text-red-700">
                    <AlertTriangle className="w-5 h-5" />
                    <div className="text-sm">
                        <span className="font-bold">Ошибка AI ({aiProvider}):</span> {aiError}
                    </div>
                </div>
            )}

            {/* Карточки KPI */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card><CardHeader className="p-4 pb-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">Всего задач</CardHeader>
                    <CardContent className="p-4 pt-0 text-3xl font-bold">{stats.totalTasks}</CardContent></Card>
                <Card><CardHeader className="p-4 pb-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">Завершено</CardHeader>
                    <CardContent className="p-4 pt-0 text-3xl font-bold text-green-600">{stats.completionPercent}%</CardContent></Card>
                <Card><CardHeader className="p-4 pb-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">Без дедлайна</CardHeader>
                    <CardContent className="p-4 pt-0 text-3xl font-bold text-orange-500">{stats.tasksWithoutDeadline}</CardContent></Card>
                <Card><CardHeader className="p-4 pb-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">Без исполнителя</CardHeader>
                    <CardContent className="p-4 pt-0 text-3xl font-bold text-red-500">{stats.unassignedTasks}</CardContent></Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Распределение по колонкам */}
                <Card className="p-4">
                    <CardTitle className="text-sm font-bold mb-6 flex items-center gap-2"><BarChart2 className="w-4 h-4"/> Задачи по этапам</CardTitle>
                    <div className="h-[300px]">
                        <ResponsiveContainer w="100%" h="100%">
                            <BarChart data={columnsChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{fill: '#88888810'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                                <Bar dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Всего" />
                                <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Готово" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Пирог приоритетов */}
                <Card className="p-4">
                    <CardTitle className="text-sm font-bold mb-6 flex items-center gap-2"><Zap className="w-4 h-4"/> Приоритеты</CardTitle>
                    <div className="h-[300px]">
                        <ResponsiveContainer w="100%" h="100%">
                            <PieChart>
                                <Pie data={priorityData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {priorityData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-4 mt-4">
                            {priorityData.map((entry, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-xs">
                                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}} />
                                    {entry.name}: {entry.value}
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}