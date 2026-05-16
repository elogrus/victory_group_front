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

export interface ProjectAssignment {
    userId: string;
    roleId: string;
}

export interface Project {
    id: string;
    name: string;
    boards: Board[];
    assignments?: ProjectAssignment[];
}

// --- ОБНОВЛЕННАЯ МОДЕЛЬ ПОЛЬЗОВАТЕЛЯ ---
export interface User {
    id: string;
    name: string;
    login: string;
    is_active: boolean;
    is_superuser: boolean;
    tg_id: number;
    password?: string; // Только для создания
}

export const MOCK_USERS: User[] = [
    { id: "1", name: "Diniar Karimov", login: "diniar", is_active: true, is_superuser: true, tg_id: 123456 },
    { id: "2", name: "Пётр Петров", login: "petrov", is_active: true, is_superuser: false, tg_id: 0 },
    { id: "3", name: "Alex Middle", login: "alex_m", is_active: false, is_superuser: false, tg_id: 0 },
];

export interface Role {
    id: string;
    name: string;
    can_create_task: boolean;
    can_update_task: boolean;
    can_delete_task: boolean;
    can_manage_members: boolean;
    can_manage_pipelines: boolean;
    can_update_project: boolean;
    can_delete_project: boolean;
    can_manage_tags: boolean;
    can_manage_automation: boolean;
    can_view_analytics: boolean;
    can_assign_task: boolean;
}

export const MOCK_ROLES: Role[] = [
    { 
        id: "role-admin", name: "admin", 
        can_create_task: true, can_update_task: true, can_delete_task: true,
        can_manage_members: true, can_manage_pipelines: true, can_update_project: true,
        can_delete_project: true, can_manage_tags: true, can_manage_automation: true,
        can_view_analytics: true, can_assign_task: true 
    },
    { 
        id: "role-viewer", name: "viewer", 
        can_create_task: false, can_update_task: false, can_delete_task: false,
        can_manage_members: false, can_manage_pipelines: false, can_update_project: false,
        can_delete_project: false, can_manage_tags: false, can_manage_automation: false,
        can_view_analytics: true, can_assign_task: false 
    },
];

export const INITIAL_PROJECTS: Project[] = [
    {
        id: "proj-1",
        name: "VictoryGroup",
        assignments: [
            { userId: "1", roleId: "role-admin" },
            { userId: "2", roleId: "role-viewer" }
        ],
        boards: [
            {
                id: "board-1",
                name: "Основная доска",
                columns: [
                    { id: "todo", title: "TO DO", color: "#ebecf0" },
                    { id: "in-progress", title: "IN PROGRESS", color: "#0052cc" },
                    { id: "done", title: "DONE", color: "#36b37e" },
                ],
                tasks: []
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