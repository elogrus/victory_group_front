import { CONSTS } from "@/shared/lib/consts";

export type Role = {
    id: number;
    name: string;
    can_create_task: boolean;
    can_update_task: boolean;
    can_delete_task: boolean;
    can_manage_members: boolean;
    can_manage_pipelines: boolean;
    can_update_project: boolean;
    can_delete_project: boolean;
};

class RoleService {
    private ROUTES = {
        roles: CONSTS.API_URL + "/roles",
    };
    async getRoles(login: string, password: string) {
        return true;
    }
    async createRole(login: string, name: string, password: string) {
        return true;
    }
}
const roleService = new RoleService();
export default roleService;
