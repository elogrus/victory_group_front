import { myFetch } from "@/shared/lib/myFetch";
import { Project } from "./Project";
import { Tag } from "./Tag";

export type Pipeline = {
    id: number;
    project_id: number;
    name: string;
};

export type PipelineInfo = {
    pipeline: {
        id: number;
        project_id: number;
        name: string;
    };
    columns: {
        id: number;
        pipeline_id: number;
        name: string;
        order: number;
        tasks: {
            id: number;
            project_id: number;
            column_id: number;
            parent_id: number | null;
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
        }[];
    }[];
};

class PipelineService {
    private ROUTES = {
        default: (projectId: Project["id"]) =>
            this.ROUTES + `/projects/${projectId}/pipelines`,
        id: (projectId: Project["id"], pipelineId: Pipeline["id"]) =>
            this.ROUTES + `/projects/${projectId}/pipelines/${pipelineId}`,
        board: (pipelineId: Pipeline["id"]) =>
            this.ROUTES + `/projects/${pipelineId}/board`,
    };
    async getList(projectId: Project["id"]) {
        return await myFetch<Pipeline[]>(this.ROUTES.default(projectId), {
            method: "GET",
        });
    }
    async getInfo(pipelineId: Pipeline["id"]) {
        return await myFetch<PipelineInfo>(this.ROUTES.board(pipelineId), {
            method: "GET",
        });
    }
    async create(projectId: Project["id"]) {}
    async delete(projectId: Project["id"], pipelineId: Pipeline["id"]) {}
}
const pipelineService = new PipelineService();
export default pipelineService;
