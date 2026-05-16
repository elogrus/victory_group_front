import { myFetch } from "@/shared/lib/myFetch";
import { Project } from "../Project";

export type Pipeline = {
    id: number;
    project_id: number;
    name: string;
};

class PipelineService {
    private ROUTES = {
        default: (projectId: Project["id"]) =>
            this.ROUTES + `/projects/${projectId}/pipelines`,
        id: (projectId: Project["id"], pipelineId: Pipeline["id"]) =>
            this.ROUTES + `/projects/${projectId}/pipelines/${pipelineId}`,
    };
    async getList(projectId: Project["id"]) {
        return await myFetch<Pipeline[]>(this.ROUTES.default(projectId), {
            method: "GET",
        });
    }
    async create(projectId: Project["id"]) {}
    async delete(projectId: Project["id"], pipelineId: Pipeline["id"]) {}
}
const pipelineService = new PipelineService();
export default pipelineService;
