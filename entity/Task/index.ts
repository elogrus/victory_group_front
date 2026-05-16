import { myFetch } from "@/shared/lib/myFetch";
import { Pipeline } from "../Pipeline";
import { Project } from "../Project";
import { User } from "../User";
import { CONSTS } from "@/shared/lib/consts";

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
    private ROUTES = {
        default: (projectId: Project["id"]) =>
            CONSTS.API_URL + `/projects/${projectId}/tasks`,
    };
    async getAll(projectId: Project["id"]) {}
    async getAllPipeline(projectId: Project["id"], pipelineId: Pipeline["id"]) {
        return await myFetch<Task[]>(this.ROUTES.default(projectId), {
            method: "GET",
        });
    }
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
