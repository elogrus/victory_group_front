"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { BrainCircuit, CheckCircle2, AlertTriangle, Clock, BarChart2, Zap } from "lucide-react";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
    PieChart, Pie, Cell 
} from "recharts";

interface AiAnalyticsProps {
    data: any; // Сюда приходит JSON
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function AiAnalyticsDashboard({ data }: AiAnalyticsProps) {
    if (!data) return <div className="p-8 text-center text-muted-foreground">Нет данных для аналитики</div>;

    const { stats, columns, priorities, activity, risks, aiSummary, aiError } = data;

    // --- Подготовка данных для графиков ---
    const columnsChartData = columns.map((col: any) => ({
        name: col.columnName,
        tasks: col.tasksCount
    }));

    const priorityChartData = Object.keys(priorities.priorityDistribution).map((key, index) => ({
        name: priorities.priorityLabels[key] || `Priority ${key}`,
        value: priorities.priorityDistribution[key]
    }));

    const activityChartData = [
        { name: "24 часа", Создано: activity.createdLast24Hours, Обновлено: activity.updatedLast24Hours },
        { name: "7 дней", Создано: activity.createdLast7Days, Обновлено: activity.updatedLast7Days },
        { name: "30 дней", Создано: activity.createdLast30Days, Обновлено: activity.updatedLast30Days },
    ];

    // Форматирование даты
    const generatedDate = new Date(data.generatedAt).toLocaleString("ru-RU", { 
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* ШАПКА АНАЛИТИКИ И ВЫВОД AI */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BrainCircuit className="w-6 h-6 text-purple-500" />
                        <h2 className="text-xl font-bold text-foreground">AI Аналитика проекта</h2>
                    </div>
                    <span className="text-xs text-muted-foreground">Сгенерировано: {generatedDate}</span>
                </div>

                {/* Блок вывода текста от ИИ или ошибки */}
                {aiError ? (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 rounded-lg flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                            <div className="font-semibold text-sm">Ошибка генерации AI Summary ({data.aiProvider})</div>
                            <div className="text-xs mt-1">{aiError}</div>
                        </div>
                    </div>
                ) : aiSummary ? (
                    <div className="bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 p-4 rounded-lg flex items-start gap-3">
                        <Zap className="w-5 h-5 shrink-0 mt-0.5" />
                        <div className="text-sm leading-relaxed">{aiSummary}</div>
                    </div>
                ) : null}
            </div>

            {/* KPI КАРТОЧКИ */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-card">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Всего задач</CardTitle>
                        <BarChart2 className="w-4 h-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.totalTasks}</div>
                    </CardContent>
                </Card>
                <Card className="bg-card">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Прогресс</CardTitle>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-500">{stats.completionPercent}%</div>
                        <div className="text-xs text-muted-foreground mt-1">{stats.completedTasks} из {stats.totalTasks} завершено</div>
                    </CardContent>
                </Card>
                <Card className="bg-card">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Просрочено</CardTitle>
                        <Clock className="w-4 h-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-500">{stats.overdueTasks}</div>
                    </CardContent>
                </Card>
                <Card className="bg-card">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Высокий приоритет</CardTitle>
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-500">{stats.highPriorityTasks}</div>
                    </CardContent>
                </Card>
            </div>

            {/* РИСКИ (Из массива risks) */}
            {risks && risks.length > 0 && (
                <div className="flex flex-wrap gap-3">
                    {risks.map((risk: any, idx: number) => (
                        <div key={idx} className="bg-orange-500/10 border border-orange-500/20 text-orange-600 px-3 py-2 rounded-md text-xs font-medium flex items-center gap-2">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {risk.type === 'unassigned_tasks' ? 'Задачи без исполнителя: ' : 
                             risk.type === 'tasks_without_deadline' ? 'Задачи без дедлайна: ' : risk.type} 
                            <span className="font-bold">{risk.value}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* ГРАФИКИ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Распределение по колонкам */}
                <Card className="bg-card">
                    <CardHeader><CardTitle className="text-sm">Задачи по колонкам</CardTitle></CardHeader>
                    <CardContent className="h-[250px]">
                        <ResponsiveContainer w="100%" h="100%">
                            <BarChart data={columnsChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#88888840" vertical={false} />
                                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#888'}} axisLine={false} tickLine={false} />
                                <YAxis allowDecimals={false} tick={{fontSize: 12, fill: '#888'}} axisLine={false} tickLine={false} />
                                <RechartsTooltip cursor={{fill: '#88888810'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Bar dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Распределение по приоритетам (Pie) */}
                <Card className="bg-card">
                    <CardHeader><CardTitle className="text-sm">Распределение приоритетов</CardTitle></CardHeader>
                    <CardContent className="h-[250px] flex items-center justify-center">
                        <ResponsiveContainer w="100%" h="100%">
                            <PieChart>
                                <Pie data={priorityChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {priorityChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Легенда сбоку */}
                        <div className="flex flex-col gap-2 ml-4">
                            {priorityChartData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}} />
                                    {entry.name}: <span className="font-bold text-foreground">{entry.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Активность за период */}
                <Card className="bg-card lg:col-span-2">
                    <CardHeader><CardTitle className="text-sm">Активность (Создано / Обновлено)</CardTitle></CardHeader>
                    <CardContent className="h-[250px]">
                        <ResponsiveContainer w="100%" h="100%">
                            <BarChart data={activityChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#88888840" vertical={false} />
                                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#888'}} axisLine={false} tickLine={false} />
                                <YAxis allowDecimals={false} tick={{fontSize: 12, fill: '#888'}} axisLine={false} tickLine={false} />
                                <RechartsTooltip cursor={{fill: '#88888810'}} contentStyle={{borderRadius: '8px', border: 'none'}} />
                                <Bar dataKey="Создано" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Обновлено" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}