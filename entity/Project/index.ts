import { myFetch } from "@/shared/lib/myFetch";
import { CONSTS } from "@/shared/lib/consts";
import { User } from "../User";

export type Project = {
    id: number;
    name: string;
    description: string;
    created_at: string;
};

class ProjectService {
    private ROUTES = {
        default: CONSTS.API_URL + "/projects",
        id: (id: Project["id"]) => CONSTS.API_URL + `/projects/${id}`,
        id_members: (id: Project["id"]) =>
            CONSTS.API_URL + `/projects/${id}/members`,
        id_members_user: (id: Project["id"], user_id: User["id"]) =>
            CONSTS.API_URL + `/projects/${id}/member/${user_id}`,
    };
    async getProjectList() {
        return await myFetch<Project[]>(this.ROUTES.default, {
            method: "GET",
        });
    }
    async createProject() {}
    async getProject(id: Project["id"]) {
        return await myFetch<Project[]>(this.ROUTES.id(id), {
            method: "GET",
        });
    }
    async updateProject(id: Project["id"]) {}
    async deleteProject(id: Project["id"]) {}

    async getMembersList(id: Project["id"]) {}
    async createMember(id: Project["id"]) {}
    async updateMember(id: Project["id"], userId: User["id"]) {}
    async removeMember(id: Project["id"], userId: User["id"]) {}
}
const projectService = new ProjectService();
export default projectService;
