export type TaskStatus = string;

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: string;
    author: string;
    assignee: string | null;
    tags: string[];
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
                    { id: "KAN-1", title: "Задача 1", description: "Описание", status: "done", priority: "Low", author: "Diniar Karimov", assignee: null, tags: ["frontend", "bug"], createdAt: "15 мая", updatedAt: "15 мая" },
                    { id: "KAN-4", title: "Настроить FastAPI", description: "Тест", status: "todo", priority: "Medium", author: "Diniar Karimov", assignee: null, tags: ["backend"], createdAt: "15 мая", updatedAt: "15 мая" }
                ]
            }
        ]
    }
];

export const PROJECT_HIERARCHY: any = {
    "proj-1": {
        id: "proj-1",
        name: "VictoryGroup",
        type: "project",
        children: [
            {
                id: "role-admin-1",
                name: "Admins",
                type: "role",
                children: [
                    { id: "user-1", name: "Diniar Karimov", email: "mr.dinyar@gmail.com", type: "user" },
                    { id: "user-2", name: "Sergey I.", email: "sergey@example.com", type: "user" }
                ]
            },
            {
                id: "role-member-1",
                name: "Members",
                type: "role",
                children: [
                    { id: "user-3", name: "Alex Mid", email: "alex@example.com", type: "user" },
                    { id: "user-4", name: "Ivan Jun", email: "ivan@example.com", type: "user" },
                    { id: "user-5", name: "Anna Py", email: "anna@example.com", type: "user" }
                ]
            }
        ]
    },
    "proj-2": {
        id: "proj-2",
        name: "Landing Page",
        type: "project",
        children: [
            {
                id: "role-admin-2",
                name: "Admins",
                type: "role",
                children: [
                    { id: "user-6", name: "Maria Lead", email: "maria@example.com", type: "user" }
                ]
            },
            {
                id: "role-viewer-1",
                name: "Viewers",
                type: "role",
                children: [
                    { id: "user-7", name: "Oleg Design", email: "oleg@example.com", type: "user" },
                    { id: "user-8", name: "Client QA", email: "client@example.com", type: "user" }
                ]
            }
        ]
    }
};

// --- ДАННЫЕ ПРОФИЛЯ ПОЛЬЗОВАТЕЛЯ ---
export const MOCK_USER_PROFILE = {
    name: "Diniar Karimov",
    email: "mr.dinyar@gmail.com",
    initials: "DK",
    avatarUrl: null // если null, показываем initials
};

export const MOCK_USER_PROJECTS = [
    { id: "proj-1", name: "VictoryGroup", role: "Admin", roleColor: "bg-blue-100 text-blue-700" },
    { id: "proj-2", name: "Landing Page", role: "Member", roleColor: "bg-green-100 text-green-700" },
    { id: "proj-3", name: "Mobile App MVP", role: "Viewer", roleColor: "bg-yellow-100 text-yellow-700" },
];

export const MOCK_NOTIFICATIONS = [
    { id: "notif-1", type: "mention", text: "Sam Lee упомянул вас в задаче KAN-4", date: "10 минут назад", isRead: false },
    { id: "notif-2", type: "system", text: "Вы были добавлены в проект Mobile App MVP", date: "2 часа назад", isRead: false },
    { id: "notif-3", type: "task", text: "Задача KAN-1 переведена в статус DONE", date: "Вчера", isRead: true },
    { id: "notif-4", type: "mention", text: "Anna Py ответила на ваш комментарий", date: "Вчера", isRead: true },
];