import { CONSTS } from "@/shared/lib/consts";
import { User } from "./User";

export type Project = {
    id: number;
    name: string;
    description: string;
    created_at: string;
};

class ProjectService {
    private ROUTES = {};
    async getProjectList() {}
    async createProject() {}
    async getProjectHandler(id: Project["id"]) {}
    async updateProjectHandler(id: Project["id"]) {}
    async deleteProjectHandler(id: Project["id"]) {}

    async getMembersList(id: Project["id"]) {}
    async createMemberHandler(id: Project["id"]) {}
    async updateMemberHandler(id: Project["id"], userId: User["id"]) {}
    async removeMemberHandler(id: Project["id"], userId: User["id"]) {}
}
const projectService = new ProjectService();
export default projectService;
