import { myFetch } from "@/shared/lib/myFetch";
import { Pipeline } from "../Pipeline";
import { Project } from "../Project";
import { User } from "../User";
import { CONSTS } from "@/shared/lib/consts";
import { Tag } from "../Tag";

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
    tags: Tag[];
    version: number;
    is_done: boolean;
    created_at: string;
    updated_at: string;
};

class TaskService {
    private ROUTES = {
        default: (projectId: Project["id"]) =>
            CONSTS.API_URL + `/projects/${projectId}/tasks`,
        task_id: (projectId: Project["id"], taskId: Task["id"]) =>
            CONSTS.API_URL + `/projects/${projectId}/tasks/${taskId}`,
        user_id: (
            projectId: Project["id"],
            taskId: Task["id"],
            userId: User["id"],
        ) =>
            CONSTS.API_URL +
            `/projects/${projectId}/tasks/${taskId}/assignees/${userId}`,
    };
    async getAll(projectId: Project["id"]) {}
    async getAllPipeline(projectId: Project["id"], pipelineId: Pipeline["id"]) {
        return await myFetch<Task[]>(this.ROUTES.default(projectId), {
            method: "GET",
        });
    }
    async create(
        projectId: Project["id"],
        taskFields: {
            external_id: string;
            title: string;
            column_id: number;
            pipeline_id: number;
        } & Partial<Task>,
        //external_id title column_id pipeline_id
    ) {
        return await myFetch<string>(this.ROUTES.default(projectId), {
            method: "POST",
            body: JSON.stringify(taskFields),
        });
    }
    async get(projectId: Project["id"], taskId: Task["id"]) {}
    async update(
        projectId: Project["id"],
        taskId: Task["id"],
        taskFields: Partial<Task>,
    ) {
        return await myFetch<{ detail: string; task: Task }>(
            this.ROUTES.task_id(projectId, taskId),
            {
                method: "PATCH",
                body: JSON.stringify(taskFields),
            },
        );
    }
    async delete(projectId: Project["id"], taskId: Task["id"]) {
        return await myFetch<{ detail: string }>(
            this.ROUTES.task_id(projectId, taskId),
            {
                method: "DELETE",
            },
        );
    }
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
