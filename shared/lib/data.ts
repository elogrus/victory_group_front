export type TaskStatus = string;

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: string;
    author: string;
    assignee: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ColumnType {
    id: string;
    title: string;
    color?: string;
}

export interface Board {
    id: string;
    name: string;
    columns: ColumnType[];
    tasks: Task[];
}

export interface Project {
    id: string;
    name: string;
    boards: Board[];
}

// Начальные данные для первой загрузки
export const INITIAL_PROJECTS: Project[] = [
    {
        id: "proj-1",
        name: "VictoryGroup",
        boards: [
            {
                id: "board-1",
                name: "Основная доска",
                columns: [
                    { id: "todo", title: "TO DO", color: "#ebecf0" },
                    { id: "in-progress", title: "IN PROGRESS", color: "#0052cc" },
                    { id: "done", title: "DONE", color: "#36b37e" },
                ],
                tasks: [
                    { id: "KAN-1", title: "Задача 1", description: "Описание первой задачи", status: "done", priority: "Low", author: "Diniar Karimov", assignee: null, createdAt: "15 мая 2026 г., 21:24", updatedAt: "15 мая 2026 г., 22:21" },
                    { id: "KAN-4", title: "Настроить FastAPI", description: "Тестовая задача", status: "todo", priority: "Medium", author: "Diniar Karimov", assignee: null, createdAt: "15 мая 2026 г., 22:25", updatedAt: "15 мая 2026 г., 22:25" },
                    { id: "KAN-5", title: "Добавить авторизацию", description: "Еще одна", status: "todo", priority: "Medium", author: "Diniar Karimov", assignee: null, createdAt: "15 мая 2026 г., 22:25", updatedAt: "15 мая 2026 г., 22:25" },
                    { id: "KAN-2", title: "Задача 2", description: "В процессе выполнения", status: "in-progress", priority: "High", author: "Diniar Karimov", assignee: null, createdAt: "15 мая 2026 г., 21:25", updatedAt: "15 мая 2026 г., 21:25" },
                ]
            }
        ]
    }
];