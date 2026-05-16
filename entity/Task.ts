import { Project } from "./Project";
import { User } from "./User";

export type Task = {
    id: number;
    project_id: number;
    column_id: number;
    parent_id: number;
    title: string;
    description: string;
    deadline: string;
    priority: number;
    order: number;
    tags: string[];
    version: number;
    is_done: boolean;
    created_at: string;
    updated_at: string;
};

class TaskService {
    private ROUTES = {};
    async getList(projectId: Project["id"]) {}
    async create(projectId: Project["id"]) {}
    async get(projectId: Project["id"], taskId: Task["id"]) {}
    async update(projectId: Project["id"], taskId: Task["id"]) {}
    async delete(projectId: Project["id"], taskId: Task["id"]) {}
    async move(projectId: Project["id"], taskId: Task["id"]) {}
    async addAssigne(
        projectId: Project["id"],
        taskId: Task["id"],
        userId: User["id"],
    ) {}
    async removeAssigne(
        projectId: Project["id"],
        taskId: Task["id"],
        userId: User["id"],
    ) {}
}
const taskService = new TaskService();
export default taskService;
