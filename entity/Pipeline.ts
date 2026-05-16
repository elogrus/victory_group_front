import { Project } from "./Project";

export type Pipeline = {
    id: number;
    project_id: number;
    name: string;
};

class PipelineService {
    async getList(projectId: Project["id"]) {}
    async create(projectId: Project["id"]) {}
    async delete(projectId: Project["id"], pipelineId: Pipeline["id"]) {}
}
const pipelineService = new PipelineService();
export default pipelineService;
